import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Text } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // ✅ 連接 Firebase
import { Alert } from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    console.log("🔥 按下 SignUp 按鈕！"); // 確保按鈕被點擊
    console.log(`🔍 name=${name}, email=${email}, password=${password}, confirmPassword=${confirmPassword}`);

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("错误", "请填写所有字段！");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("错误", "两次输入的密码不一致！");
      return;
    }

    setLoading(true);

    try {
      console.log("🚀 嘗試 Firebase 註冊...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("✅ 註冊成功！", user.email);

      Alert.alert("注册成功", `欢迎 ${name}！请登录`, [
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
      Alert.alert("注册失败", getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  // 🔹 轉換 Firebase 錯誤碼為可讀訊息
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "這個 Email 已經被註冊過了！";
      case "auth/invalid-email":
        return "請輸入有效的 Email！";
      case "auth/weak-password":
        return "密碼太簡單，請至少 6 個字！";
      default:
        return "註冊失敗，請稍後再試！";
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
    top: -170,  // 🎯 調整 Name 輸入框的位置
  },
  emailInput: {
    top: -72,   // 🎯 調整 Email 輸入框的位置
  },
  passwordInput: {
    top: 22,   // 🎯 調整 Password 輸入框的位置
  },
  confirmPasswordInput: {
    top: 116,   // 🎯 調整 Confirm Password 輸入框的位置
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
    top: 252,  // 🎯 調整 Sign Up 按鈕的位置
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  footerText: {
    position: "absolute",
    top: 394, // 🎯 調整 Footer Text 的位置
    color: "#fff",
  },
  signInText: {
    color: "#E87E27",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});

export default SignUpScreen;
