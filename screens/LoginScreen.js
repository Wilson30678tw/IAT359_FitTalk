import React from 'react';
import { View, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../assets/Main.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Sign In 按鈕 */}
        <TouchableOpacity
          style={[styles.button, styles.signInButton]}
          onPress={() => navigation.navigate('SignIn')} // 確保名稱與 AppNavigator.js 一致
        />

        {/* Sign Up 按鈕 */}
        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          onPress={() => navigation.navigate('SignUp')} // 確保名稱與 AppNavigator.js 一致
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 80,
  },
  button: {
    width: 250,
    height: 50,
    marginVertical: 10,
    borderRadius: 25,
    position: 'absolute',
  },
  signInButton: {
    backgroundColor: 'rgba(255, 165, 0, 0.5)',
    bottom: 140,
  },
  signUpButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    bottom: 60,
  },
});

export default LoginScreen;
