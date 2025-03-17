import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence, 
  getReactNativePersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔹 Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyAsifoMA7MJn8SOoZRbG4B9na5bA1MFjtg",
  authDomain: "fittalk-1ffe4.firebaseapp.com",
  projectId: "fittalk-1ffe4",
  storageBucket: "fittalk-1ffe4.appspot.com",
  messagingSenderId: "813631852863",
  appId: "1:813631852863:web:774485e60e7d813a31838a",
  measurementId: "G-G1579E9WV3"
};

// 🔹 檢查是否已初始化 Firebase，避免 `app/duplicate-app` 錯誤
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 🔹 設置 Firebase Auth 並啟用持久化
const auth = getAuth(app);
setPersistence(auth, getReactNativePersistence(AsyncStorage))
  .then(() => console.log("✅ Firebase 持久化已啟用"))
  .catch((error) => console.error("❌ Firebase 持久化設定失敗", error.message));

// 🔹 初始化 Firestore 和 Storage
const db = getFirestore(app);
const storage = getStorage(app);

console.log("✅ Firebase Auth & Firestore 已成功初始化！");

export { auth, db, storage };