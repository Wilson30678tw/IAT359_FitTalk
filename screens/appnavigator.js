import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import homepage from '../screens/homepage.js';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FitnessTaskScreen from '../screens/FitnessTaskScreen';
import ShareMomentsScreen from '../screens/ShareMomentsScreen';

const Stack = createStackNavigator();

const appnavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={homepage} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="FitnessTask" component={FitnessTaskScreen} />
        <Stack.Screen name="ShareMoments" component={ShareMomentsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default appnavigator;