import React, { useState } from "react";
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground, 
  StyleSheet, 
  Text, 
  Alert 
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("⚠️ Error", "Please enter your Email and Password!");
      return;
    }

    setLoading(true); // 開啟加載狀態
    try {
      // 🔹 Firebase 驗證
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // 取得已登入的用戶資訊
  
      console.log("✅ Sign-in successful!", user.email);
  
      // ✅ 確保 `Alert` 只顯示一次
      setLoading(false);
      Alert.alert("✅ Sign-in Successful", `Welcome back, ${user.email}!`, [
        { text: "OK", onPress: () => navigation.replace("Main") },
      ]);
    } catch (error) {
      console.log("❌ Sign-in failed:", error.message);
      
      setLoading(false);
      Alert.alert("❌ Sign-in Failed", getErrorMessage(error.code));
    }
  };

  // 🔹 轉換 Firebase 錯誤碼為人類可讀的訊息
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Invalid email format!";
      case "auth/user-not-found":
        return "This account does not exist. Please sign up first!";
      case "auth/wrong-password":
        return "Incorrect password. Please try again!";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later!";
      default:
        return "Sign-in failed. Please check your account details!";
    }
  };

  return (
    <ImageBackground source={require("../assets/Sign_in.png")} style={styles.background}>
      <View style={styles.container}>
        {/* Email Input Field */}
        <TextInput
          style={[styles.input, styles.emailInput]}
          placeholder="Email/Phone Number"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#aaa"
        />

        {/* Password Input Field */}
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true} // 隱藏密碼
          placeholderTextColor="#aaa"
        />

        {/* Sign In Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Text style={styles.signUpText} onPress={() => navigation.navigate("SignUp")}>
            Sign Up
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
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25, // 讓邊角更圓潤
    paddingHorizontal: 15,
    backgroundColor: "#543F2E",
  },
  emailInput: {
    marginBottom: 15,
    marginTop: -190, // 把 Email 欄往上移
  },
  passwordInput: {
    marginBottom: 25,
    marginTop: 26, // 把 Password 欄往上移
  },
  button: {
    position: "absolute",
    bottom: -280, // 對齊背景圖中的 Sign In 按鈕
    width: "110%",
    backgroundColor: "transparent", // 背景透明，讓背景圖顯示按鈕樣式
    paddingVertical: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "transparent",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    position: "absolute",
    top: 394, // 🎯 調整 Footer Text 的位置
    color: "#fff",
  },
  signUpText: {
    color: "#E87E27",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});

export default SignInScreen;
