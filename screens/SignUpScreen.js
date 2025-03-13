import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Text } from "react-native";

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

        <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate("SignIn") }>
          
        </TouchableOpacity>

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
