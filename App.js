import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "./screens/SignInScreen";
import MainNavigator from "./screens/MainNavigator"; // 這個管理 Home

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="MainNavigator" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}