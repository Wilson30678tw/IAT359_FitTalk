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
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
  
    try {
      setLoading(true);
  
      // 🔹 創建 Firebase 用戶（Firebase 會自動登入）
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // 🔹 在 Firestore 創建用戶數據
      await setDoc(doc(db, "users", user.uid), {
        username: name,
        email: email,
        profileImage: "https://i.imgur.com/ha1TKss.png",
        createdAt: serverTimestamp(),
      });
  
      console.log("✅ 註冊成功！");
  
      Alert.alert("Sign up successful", `Welcome to FitTalk, ${name}!`, [
        { text: "OK", onPress: () => navigation.replace("Main") }, // ✅ 按 OK 才跳轉
      ]);
    } catch (error) {
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