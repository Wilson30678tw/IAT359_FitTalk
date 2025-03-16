import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FitnessTaskScreen from "../screens/FitnessTaskScreen";
import ExerciseDetail from "../screens/ExerciseDetail";

const Stack = createStackNavigator();

const ExerciseNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FitnessTask" component={FitnessTaskScreen} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetail} />
    </Stack.Navigator>
  );
};

export default ExerciseNavigator;
