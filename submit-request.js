// submit-request.js
import { db, auth } from './firebase-config.js';
import {
  addDoc, collection, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return alert("سجل الدخول أولاً");

  const type = document.getElementById('service').value;
  const details = document.getElementById('details').value;

  try {
    await addDoc(collection(db, 'requests'), {
      userId: user.uid,
      serviceType: type,
      details: details,
      status: 'قيد المراجعة',
      createdAt: serverTimestamp()
    });
    alert("تم إرسال الطلب بنجاح");
    window.location.href = 'dashboard.html';
  } catch (err) {
    alert("حدث خطأ: " + err.message);
  }
});
