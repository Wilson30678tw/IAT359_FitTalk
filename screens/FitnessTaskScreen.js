import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, FlatList, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProgressChart } from 'react-native-chart-kit';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bodyParts } from '../constants';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const FitnessTaskScreen = () => {
  const navigation = useNavigation();
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [lastStepCount, setLastStepCount] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [dailyTasks, setDailyTasks] = useState([]);

  const stepGoal = 12000;
  const calorieGoal = 600;
  const bodyParts = [
    { id: "welcome", name: "welcome", image: require("../assets/fitness-app-assets/welcome.png") },
    { id: "back", name: "Back", image: require("../assets/fitness-app-assets/back.png") },
    { id: "cardio", name: "Cardio", image: require("../assets/fitness-app-assets/cardio.png") },
    { id: "chest", name: "Chest", image: require("../assets/fitness-app-assets/chest.png") },
    { id: "lower-arms", name: "Lower arms", image: require("../assets/fitness-app-assets/lowerArms.png") },
    { id: "lower-legs", name: "Lower legs", image: require("../assets/fitness-app-assets/lowerLegs.png") },
    { id: "neck", name: "Neck", image: require("../assets/fitness-app-assets/neck.png") },
    { id: "shoulders", name: "Shoulders", image: require("../assets/fitness-app-assets/shoulders.png") },
    { id: "upper-arms", name: "Upper arms", image: require("../assets/fitness-app-assets/upperArms.png") },
    { id: "upper-legs", name: "Upper legs", image: require("../assets/fitness-app-assets/upperLegs.png") },
    { id: "waist", name: "Waist", image: require("../assets/fitness-app-assets/waist.png") },
  ];

  {/*useEffect(() => {
    console.log("📦 bodyParts:", bodyParts);
    console.log("📦 dailyTasks from AsyncStorage:", dailyTasks);
  }, [dailyTasks]);*/}

  useEffect(() => {
    const loadDailyTasks = async () => {
      try {
        const today = new Date().toDateString();
        const stored = await AsyncStorage.getItem('daily-tasks');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.date === today) {
            setDailyTasks(parsed.tasks);
          }
        }
      } catch (err) {
        console.error("❌ Failed to load daily-tasks in FitnessTaskScreen:", err);
      }
    };
  
    const unsubscribe = navigation.addListener('focus', () => {
      loadDailyTasks();
    });
  
    loadDailyTasks(); // 頁面初次進來就讀一次
  
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    async function checkPedometerAvailability() {
      const available = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(available);
      if (!available) Alert.alert("Error", "This device does not support a pedometer.");
    }

    async function loadStepData() {
      const storedSteps = await AsyncStorage.getItem('dailyStepCount');
      if (storedSteps) setStepCount(JSON.parse(storedSteps));
    }

    checkPedometerAvailability();
    loadStepData();
  }, []);

  useEffect(() => {
    if (isPedometerAvailable) {
      const subscription = Pedometer.watchStepCount(async (result) => {
        const now = Date.now();
        const stepDifference = result.steps - lastStepCount;

        if (stepDifference >= 3 && now - lastUpdateTime > 500) {
          const newStepCount = stepCount + stepDifference;
          setStepCount(newStepCount);
          setLastStepCount(result.steps);
          setLastUpdateTime(now);
          await AsyncStorage.setItem('dailyStepCount', JSON.stringify(newStepCount));
        }
      });

      return () => subscription.remove();
    }
  }, [isPedometerAvailable, stepCount]);

  const stepProgress = Math.min(stepCount / stepGoal, 1);
  const calorieProgress = Math.min((stepCount / stepGoal) * calorieGoal, calorieGoal) / calorieGoal;

  const resetStepCount = async () => {
    setStepCount(0);
    await AsyncStorage.removeItem('dailyStepCount');
  };

  const progressData = {
    labels: ["Task Complete", "Calorie Burn"],
    data: [stepProgress, calorieProgress]
  };

  // Header Component for FlatList
  const renderHeader = () => (
    <>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/FitTalk_Logo.png")} style={styles.logo} />
      </View>

      <View style={styles.progressContainer}>
        <ProgressChart
          data={progressData}
          width={200}
          height={120}
          strokeWidth={8}
          radius={30}
          chartConfig={{
            backgroundColor: "transparent",
            backgroundGradientFrom: "transparent",
            backgroundGradientTo: "transparent",
            color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          hideLegend={true}
        />
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>Steps{"\n"}<Text style={styles.percentage}>{(stepProgress * 100).toFixed(0)}%</Text></Text>
          <Text style={styles.progressText}>Calories{"\n"}<Text style={styles.percentage}>{(calorieProgress * 100).toFixed(0)}%</Text></Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>{stepCount}{"\n"}Steps</Text>
        <Text style={styles.statsText}>{(stepCount * 0.0008).toFixed(2)} km{"\n"}Distance</Text>
      </View>

      <Button title="Reset Steps" onPress={resetStepCount} color="orange" />

      <TouchableOpacity onPress={() => navigation.navigate('TaskListScreen')}>
      <Text style={[styles.taskListHeader, { textDecorationLine: 'underline' }]}>Go to Task List →</Text>
      </TouchableOpacity>
       
       {/* ✅ 顯示任務清單（含圖示） */}
       <View style={styles.taskContainer}>
      <Text style={styles.taskStatus}>Today's Tasks</Text>
      <FlatList
        data={dailyTasks}
       keyExtractor={(item) => item.id}
       scrollEnabled={false} // ⚠️ 不要跟外部 FlatList 衝突
        renderItem={({ item }) => (
        <View
        style={[
          styles.taskItem,
          item.completed && { backgroundColor: '#94683C' },
        ]}
      >
        <View style={styles.taskRow}>
          <Image
            source={
              item.completed
                ? require('../assets/checked.png')
                : require('../assets/uncheck.png')
            }
            style={styles.icon}
          />
          <Text style={styles.taskTitle}>{item.title}</Text>
        </View>
      </View>
    )}
  />
</View>

      <Text style={styles.taskListHeader}>Exercises</Text>
    </>
  );
        {/* Citation: The exercises and how to setup the API was learned from https://www.youtube.com/watch?v=_MttMnZ3CeI */}
        {/* API Used: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb */}
  return (
    <ImageBackground source={require('../assets/FitTaskBlankBG.png')} style={styles.background}>
      <FlatList
        data={bodyParts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.exerciseItem}
            onPress={() => navigation.navigate('ExerciseScreen', { bodyPart: item.name.toLowerCase() })}
          >
            <Image source={item.image} style={styles.exerciseImage} />
            <View style={styles.exerciseTextContainer}>
              <Text style={styles.exerciseName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  logoContainer: {
    marginTop: 60,
    marginBottom: 20,
    marginLeft: 20,
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  progressTextContainer: {
    marginLeft: 10,
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'left',
  },
  percentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'orange',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  statsText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  taskListHeader: {
    fontSize: hp(2),
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 10,
    marginTop: 20,
  },
  taskContainer: {
    width: '90%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  taskStatus: {
    fontSize: 16,
    color: 'orange',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  taskTitle: {
    color: 'white',
    fontSize: 14,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
  },
  exerciseImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 20,
  },
  exerciseTextContainer: {
    flex: 1,
  },
  exerciseName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default FitnessTaskScreen;
