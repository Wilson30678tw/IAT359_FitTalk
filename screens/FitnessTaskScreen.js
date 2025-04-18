import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Svg, { Circle } from 'react-native-svg';
import { Dimensions } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const FitnessTaskScreen = () => {
  const navigation = useNavigation();
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [lastStepCount, setLastStepCount] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [dailyTasks, setDailyTasks] = useState([]);
  const [userWeight, setUserWeight] = useState(null);

  const stepGoal = 12000;
  const calorieGoal = 600;

  const bodyParts = [
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

  useEffect(() => {
    const fetchWeightFromFirestore = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.weight) {
            setUserWeight(parseFloat(data.weight));
          }
        }
      } catch (err) {
        console.error("🔥 Failed to fetch user weight:", err);
      }
    };

    fetchWeightFromFirestore();
  }, []);

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

    loadDailyTasks();
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
      const storedDate = await AsyncStorage.getItem('stepDate');
      const today = new Date().toDateString();

      if (storedDate !== today) {
        await AsyncStorage.setItem('stepDate', today);
        await AsyncStorage.setItem('dailyStepCount', JSON.stringify(0));
        setStepCount(0);
      } else if (storedSteps) {
        setStepCount(JSON.parse(storedSteps));
      }
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
          await AsyncStorage.setItem('stepDate', new Date().toDateString());
        }
      });

      return () => subscription.remove();
    }
  }, [isPedometerAvailable, stepCount]);

  const stepProgress = Math.min(stepCount / stepGoal, 1);
  const calorieBurn = userWeight ? stepCount * 0.0005 * userWeight : 0;
  const calorieTarget = userWeight ? userWeight * 10 : calorieGoal;
  const calorieProgress = Math.min(calorieBurn / calorieTarget, 1);

  const renderHeader = () => (
    <>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/FitTalk_Logo.png")} style={styles.logo} />
      </View>

      <View style={styles.svgRow}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <Circle cx="60" cy="60" r="50" stroke="#555" strokeWidth="6" fill="none" />
          <Circle cx="60" cy="60" r="40" stroke="#555" strokeWidth="6" fill="none" />
          <Circle
            cx="60"
            cy="60"
            r="50"
            stroke="orange"
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={2 * Math.PI * 50 - (stepProgress * 2 * Math.PI * 50)}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
          <Circle
            cx="60"
            cy="60"
            r="40"
            stroke="#AC3C32"
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={2 * Math.PI * 40 - (calorieProgress * 2 * Math.PI * 40)}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </Svg>

        <View style={styles.svgTextBox}>
          <Text style={styles.progressText}>Steps</Text>
          <Text style={styles.percentage}>{stepCount} / {stepGoal}</Text>
          <Text style={styles.progressText}>Calories</Text>
          <Text style={[styles.percentage, { color: 'white' }]}>
            {calorieBurn.toFixed(0)} / {calorieTarget}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>{stepCount}{"\n"}Steps</Text>
        <Text style={styles.statsText}>{(stepCount * 0.0008).toFixed(2)} km{"\n"}Distance</Text>
      </View>

      {/* 🔁 NEW TASK HEADER ROW */}
      <View style={styles.taskHeaderRow}>
        <Text style={styles.taskStatus}>Today's Tasks</Text>
        <TouchableOpacity onPress={() => navigation.navigate('TaskListScreen')}>
          <Text style={styles.taskListLink} adjustsFontSizeToFit={false}>Go to Task List →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.taskContainer}>
        <FlatList
          data={dailyTasks}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
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
  progressText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'left',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'orange',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  statsText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  taskHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: '8%',
    marginTop: 20,
    marginBottom: 5,
  },
  taskListLink: {
    fontSize: hp(1.75),
    color: 'white',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  taskListHeader: {
    fontSize: hp(2),
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: '8%',
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
  },
  svgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  svgTextBox: {
    marginLeft: 20,
  },
});

export default FitnessTaskScreen;
