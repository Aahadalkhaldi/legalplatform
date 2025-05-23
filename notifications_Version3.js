import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const notificationList = document.getElementById("notification-list");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    notificationList.innerHTML = "<p>يرجى تسجيل الدخول لعرض التنبيهات.</p>";
    return;
  }
  const userId = user.uid;
  const notifRef = collection(db, "notifications", userId, "userNotifications");
  const q = query(notifRef, orderBy("timestamp", "desc"));

  onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      notificationList.innerHTML = "<p>لا توجد تنبيهات حاليًا.</p>";
      return;
    }
    let htmlContent = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const time = data.timestamp?.toDate ? data.timestamp.toDate() : null;
      const dateStr = time ? time.toLocaleString("ar-SA") : "غير متوفر";

      htmlContent += `
        <div class="notification">
          <p><strong>${data.title || "تنبيه"}</strong></p>
          <p>${data.body || ""}</p>
          <small>التوقيت: ${dateStr}</small>
        </div>
      `;
    });
    notificationList.innerHTML = htmlContent;
  }, (error) => {
    notificationList.innerHTML = `<p>حدث خطأ أثناء جلب التنبيهات: ${error.message}</p>`;
  });
});