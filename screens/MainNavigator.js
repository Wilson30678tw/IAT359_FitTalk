import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import HomeScreen from '../screens/homepage';
import FitnessTaskScreen from '../screens/FitnessTaskScreen';
import CameraScreen from '../screens/CameraScreen';
import MomentsScreen from '../screens/ShareMomentsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, navigation }) => {
  const tabImages = {
    Home: require("../assets/Navbar_Home.png"),
    Fitness: require("../assets/Navbar_Fitness.png"),
    Camera: require("../assets/Navbar_Camera.png"),
    Moments: require("../assets/Navbar_Moments.png"),
    Profile: require("../assets/Navbar_Profile.png"),
  };

  return (
    <View style={styles.navBarContainer}>
      {/* 這個 View 可以手動調整 Navbar 的大小 */}
      <View style={styles.navBar}>
        <Image source={tabImages[state.routes[state.index].name]} style={styles.navImage} />
      </View>

      {state.routes.map((route, index) => {
        const positions = {
          Home: { left: "5%" },
          Fitness: { left: "25%" },
          Camera: { left: "45%" },
          Moments: { left: "65%" },
          Profile: { left: "85%" },
        };

        return (
          <TouchableOpacity
            key={route.name}
            style={[styles.navButton, { left: positions[route.name].left }]}
            onPress={() => navigation.navigate(route.name)}
          />
        );
      })}
    </View>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Fitness" component={FitnessTaskScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Moments" component={MomentsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  navBarContainer: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    alignItems: 'center', // 讓內容居中
  },
  navBar: {
    width: '100%',
    height: 84, // 這裡你可以手動調整 Navbar 的高度
    justifyContent: 'center',
    alignItems: 'center',
  },
  navImage: {
    width: '100%',
    height: '100%', // 讓圖片適應 `navBar` 大小
    resizeMode: 'contain', // 避免圖片變形
  },
  navButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
  },
});


export default MainNavigator;
