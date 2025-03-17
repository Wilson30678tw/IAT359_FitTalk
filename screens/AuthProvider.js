import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../firebaseConfig"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser)); // 解析存儲的用戶數據
        }
      } catch (error) {
        console.error("讀取本地存儲錯誤", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 監聽 Firebase 用戶狀態變化
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        console.log("✅ Firebase 檢測到用戶登入:", authUser.email);

        // 從 Firestore 讀取最新的用戶數據
        const userDoc = await getDoc(doc(db, "users", authUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({ uid: authUser.uid, ...userData });
          await AsyncStorage.setItem("user", JSON.stringify({ uid: authUser.uid, ...userData })); // 更新本地存儲
        }
      } else {
        console.log("🔴 Firebase 檢測到用戶登出");
        setUser(null);
        await AsyncStorage.removeItem("user"); // 登出時清除存儲
      }
    });

    return () => {
      console.log("🚀 停止監聽 Firebase Auth 狀態");
      unsubscribe(); // 確保組件卸載時移除監聽
    };
  }, []);

  // ✅ 登出方法
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("✅ 用戶已登出");
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.error("登出失敗", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};