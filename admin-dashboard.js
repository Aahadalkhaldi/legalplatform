import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const requestsContainer = document.getElementById("requests-container");

// التحقق من حالة تسجيل دخول المستخدم
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // إعادة التوجيه في حال عدم تسجيل الدخول
    requestsContainer.innerHTML = "<p>يجب تسجيل الدخول أولاً.</p>";
    window.location.href = "login.html";
  } else {
    // المستخدم مسجّل الدخول, جلب الطلبات من Firestore
    try {
      const querySnapshot = await getDocs(collection(db, "requests"));
      if (querySnapshot.empty) {
        requestsContainer.innerHTML = "<p>لا توجد طلبات متاحة.</p>";
        return;
      }

      let htmlContent = "";
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const docId = docSnap.id;
        htmlContent += `
          <div class="request">
            <div class="title">نوع الخدمة: ${data.serviceType || "غير محدد"}</div>
            <div>الحالة: <span class="badge">${data.status || "غير محدد"}</span></div>
            <button class="update-btn" onclick="updateStatus('${docId}')">تحديث الحالة</button>
          </div>
        `;
      });

      requestsContainer.innerHTML = htmlContent;
    } catch (error) {
      requestsContainer.innerHTML = "<p>حدث خطأ أثناء جلب الطلبات.</p>";
      console.error(error);
    }
  }
});

// دالة لتحديث الحالة
window.updateStatus = async function (requestId) {
  const newStatus = prompt("أدخل الحالة الجديدة (مثل: قيد الإنجاز/مكتملة):");
  if (!newStatus) return;
  try {
    await updateDoc(doc(db, "requests", requestId), {
      status: newStatus
    });
    alert("تم تحديث الحالة بنجاح!");
    location.reload();
  } catch (error) {
    alert("حدث خطأ أثناء التحديث: " + error.message);
  }
};