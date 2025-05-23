import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
document.querySelectorAll(".upload-btn").forEach(button => {
  button.addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx";
    fileInput.click();
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const userId = user.uid;
          const storageRef = ref(storage, `uploads/${userId}/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on('state_changed',
            (snapshot) => {
              console.log("جارٍ رفع الملف...");
            },
            (error) => {
              alert("حدث خطأ أثناء الرفع: " + error.message);
            },
            () => {
              alert("✅ تم رفع الملف بنجاح!");
            }
          );
        } else {
          alert("يجب تسجيل الدخول أولاً لرفع الملفات");
        }
      });
    };
  });
});
