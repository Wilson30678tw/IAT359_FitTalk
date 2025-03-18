import React, { useState } from "react";
import { 
  View, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Text, Alert 
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig"; // ✅ 確保 firebaseConfig 設置了 Firestore
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // ✅ Firestore 相關操作

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    console.log("🔥 按下 SignUp 按鈕！");
    console.log(`🔍 name=${name}, email=${email}, password=${password}, confirmPassword=${confirmPassword}`);

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "The passwords entered twice do not match!");
      return;
    }

    setLoading(true);

    try {
      console.log("🚀 嘗試 Firebase 註冊...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      console.log("✅ 註冊成功！", user.email);

      // 🔹 Firestore 自動創建用戶文檔
      await setDoc(doc(db, "users", uid), {
        username: name, 
        email: email,
        profileImage: "https://example.com/default-avatar.png", // 預設頭像
        createdAt: serverTimestamp(), // 記錄創建時間
      });

      console.log("📄 Firestore 文檔創建成功！");

      Alert.alert("Sign up successful", `Welcome ${name}！Please log in`, [
        {
          text: "OK",
          onPress: () => {
            console.log("🔄 正在跳转到登录页面...");
            setTimeout(() => navigation.replace("SignIn"), 500);
          },
        },
      ]);
    } catch (error) {
      console.log("❌ 注册失败：", error.message);
      Alert.alert("Sign up failed", getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  // 🔹 轉換 Firebase 錯誤碼為可讀訊息
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email has already been registered!";
      case "auth/invalid-email":
        return "Please enter a valid Email!";
      case "auth/weak-password":
        return "The password is too easy. Please use at least 6 characters!";
      default:
        return "Sign up failed, please try again later!";
    }
  };

  return (
    <ImageBackground source={require("../assets/Sign_Up1.png")} style={styles.background}>
      <View style={styles.container}>
        <TextInput
          style={[styles.input, styles.nameInput]}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#aaa"
        />

        <TextInput
          style={[styles.input, styles.emailInput]}
          placeholder="Email/Phone Number"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#aaa"
        />

        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholderTextColor="#aaa"
        />

        <TextInput
          style={[styles.input, styles.confirmPasswordInput]}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          placeholderTextColor="#aaa"
        />

        {/* 註冊按鈕（連接 Firebase 註冊功能） */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={loading}/>

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text style={styles.signInText} onPress={() => navigation.navigate("SignIn")}>
            Sign in
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    alignItems: "center",
    position: "absolute",
  },
  input: {
    width: "105%",
    height: 44,
    borderRadius: 25,
    paddingHorizontal: 15,
    position: "absolute",
    backgroundColor: "#543F2E",
  },
  nameInput: {
    top: -170,  
  },
  emailInput: {
    top: -72,  
  },
  passwordInput: {
    top: 22,   
  },
  confirmPasswordInput: {
    top: 116,   
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    position: "absolute",
  },
  signUpButton: {
    backgroundColor: "transparent",
    width:'105%',
    height: 40,
    top: 252,  
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  footerText: {
    position: "absolute",
    top: 394, 
    color: "#fff",
  },
  signInText: {
    color: "#E87E27",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});

export default SignUpScreen;