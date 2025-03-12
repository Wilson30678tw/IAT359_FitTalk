import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Text } from "react-native";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ImageBackground source={require("../assets/Sign_in.png")} style={styles.background}>
      <View style={styles.container}>
        {/* Email 輸入框 */}
        <TextInput
          style={[styles.input, styles.emailInput]}
          placeholder="Email/Phone Number"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#aaa"
        />

        {/* 密碼輸入框 */}
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true} // 隱藏密碼
          placeholderTextColor="#aaa"
        />

        {/* Sign In 按鈕 */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace("homepage")}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
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
    backgroundColor: "#fff",
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
    width: "80%",
    backgroundColor: "transparent", // 背景透明，讓背景圖顯示按鈕樣式
    paddingVertical: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "transparent",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SignInScreen;
