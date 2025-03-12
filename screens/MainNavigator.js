import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import HomeScreen from '../screens/homepage';
import FitnessTaskScreen from '../screens/FitnessTaskScreen';
import CameraScreen from '../screens/CameraScreen';
import MomentsScreen from '../screens/ShareMomentsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, navigation }) => {
  return (
    <View style={styles.navBar}>
      {state.routes.map((route, index) => (
        <TouchableOpacity
          key={route.name}
          style={styles.navButton}
          onPress={() => {
            if (route.name === 'Camera') {
              navigation.navigate('Camera'); // 確保 Camera 正確開啟
            } else {
              navigation.navigate(route.name);
            }
          }}
        />
      ))}
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
  navBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  navButton: {
    width: 60,
    height: 60,
    backgroundColor: 'transparent',
  },
});

export default MainNavigator;
