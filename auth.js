// auth.js
import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

export async function login(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert("فشل تسجيل الدخول: " + error.message);
  }
}

export async function signup(email, password) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert("فشل إنشاء الحساب: " + error.message);
  }
}

export function logout() {
  signOut(auth).then(() => {
    alert("تم تسجيل الخروج");
    window.location.href = 'index.html';
  });
}
