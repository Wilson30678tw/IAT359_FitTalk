import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import HomePage from './homepage';
import CameraScreen from '../screens/CameraScreen';
import MapScreen from '../screens/MapScreen';
import MomentsScreen from '../screens/ShareMomentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ExerciseNavigator from '../screens/ExerciseNavigator';
import TaskListScreen from '../screens/TaskListScreen';
import SettingScreen from './SettingScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 🔥 這是主要的 Bottom Tab Navigation
const BottomTabs = ({ navigation }) => {
  return (
    <>
      <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
        <Tab.Screen name="Home" component={HomePage} />
        <Tab.Screen name="Fitness" component={ExerciseNavigator} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Moments" component={MomentsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>


      {/* 🔥 全局 Camera 按鈕 */}
      <TouchableOpacity 
        style={styles.cameraButton} 
        onPress={() => navigation.navigate('CameraScreen')}
      >
        <Image source={require("../assets/camera-icon.png")} style={styles.cameraIcon} />
      </TouchableOpacity>
    </>
  );
};

// 🔥 這是主要的 Stack Navigation
const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="TaskListScreen" component={TaskListScreen} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
    </Stack.Navigator>
  );
};

const CustomTabBar = ({ state, navigation }) => {
  const tabImages = {
    Home: require("../assets/Navbar_Home.png"),
    Fitness: require("../assets/Navbar_Fitness.png"),
    Map: require("../assets/Navbar_Map.png"),
    Moments: require("../assets/Navbar_Moments.png"),
    Profile: require("../assets/Navbar_Profile.png"),
  };

  return (
    <View style={styles.navBarContainer}>
      <View style={styles.navBar}>
        <Image source={tabImages[state.routes[state.index].name]} style={styles.navImage} />
      </View>

      {state.routes.map((route, index) => {
        const positions = {
          Home: { left: "7%" },
          Fitness: { left: "28%" },
          Map: { left: "45%" },
          Moments: { left: "65%" },
          Profile: { left: "80%" },
        };

        return (
          <TouchableOpacity
            key={route.name}
            style={[styles.navButton, { left: positions[route.name]?.left }]}
            onPress={() => navigation.navigate(route.name)}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navBarContainer: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  navBar: {
    width: '100%',
    height: 84,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  navButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
  },
  // Camera 按鈕樣式，讓它懸浮在右上角
  cameraButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)', // 半透明背景，避免被 UI 蓋住
    padding: 10,
    borderRadius: 30,
    zIndex: 10, // 確保按鈕在最上層
  },
  cameraIcon: {
    width: 30,
    height: 30,
    tintColor: 'white',
    resizeMode: 'contain',
  },
});

export default MainNavigator;
