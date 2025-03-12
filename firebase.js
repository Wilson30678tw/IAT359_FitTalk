import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

// 🔹 替換為你的 Firebase 設定值
const firebaseConfig = {
  apiKey: "你的API_KEY",
  authDomain: "你的AUTH_DOMAIN",
  projectId: "你的PROJECT_ID",
  storageBucket: "你的STORAGE_BUCKET",
  messagingSenderId: "你的MESSAGING_SENDER_ID",
  appId: "你的APP_ID"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink };
