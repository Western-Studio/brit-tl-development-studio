import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase web config is public by design - it identifies the project and is
// protected by Firestore security rules, not by secrecy. Safe to commit.
const firebaseConfig = {
  apiKey: "AIzaSyDOq2BLr_2oKgJpm9bZwUuYixLch1hWcRY",
  authDomain: "brit-tl-studio.firebaseapp.com",
  projectId: "brit-tl-studio",
  storageBucket: "brit-tl-studio.firebasestorage.app",
  messagingSenderId: "349187932749",
  appId: "1:349187932749:web:5d54840b3b757e6dd2d204",
};

// Only school accounts may use the Studio. Enforced server-side by the
// Firestore rules; the domain here just steers the Google chooser.
export const SCHOOL_DOMAIN = "brit.croydon.sch.uk";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ hd: SCHOOL_DOMAIN, prompt: "select_account" });
