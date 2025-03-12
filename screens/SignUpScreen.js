import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Text } from "react-native";

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <ImageBackground source={require("../assets/Sign_Up.png")} style={styles.background}>
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

        <TouchableOpacity style={styles.button} onPress={() => console.log("Sign Up Pressed")}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text style={styles.signInText} onPress={() => navigation.navigate("SignInScreen")}>
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
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: "#543F2E", // 深棕色背景
  },
  nameInput: {
    marginBottom: 15,
    marginTop: -100, // 調整位置貼合背景
  },
  emailInput: {
    marginBottom: 15,
  },
  passwordInput: {
    marginBottom: 15,
  },
  confirmPasswordInput: {
    marginBottom: 25,
  },
  button: {
    width: "100%",
    backgroundColor: "#E87E27",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  footerText: {
    marginTop: 20,
    color: "#fff",
  },
  signInText: {
    color: "#E87E27",
    fontWeight: "bold",
  },
});

export default SignUpScreen;
