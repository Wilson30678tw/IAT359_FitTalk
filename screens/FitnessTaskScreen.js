import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, FlatList, TouchableOpacity, Image, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProgressChart } from 'react-native-chart-kit';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bodyParts } from '../constants';

const FitnessTaskScreen = () => {
  const navigation = useNavigation();

  // 步數計數狀態
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const stepGoal = 12000; // 目標步數
  const calorieGoal = 600; // 目標卡路里
  const [lastStepCount, setLastStepCount] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  useEffect(() => {
    async function checkPedometerAvailability() {
      try {
        const available = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(available);
        if (!available) {
          Alert.alert("Error", "This device does not support a pedometer.");
        }
      } catch (error) {
        Alert.alert("Error", "Unable to retrieve pedometer status.");
      }
    }

    async function loadStepData() {
      try {
        const storedSteps = await AsyncStorage.getItem('dailyStepCount');
        if (storedSteps) {
          setStepCount(JSON.parse(storedSteps));
        }
      } catch (error) {
        console.error('Failed to load step count:', error);
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

          // 存儲步數到 AsyncStorage
          try {
            await AsyncStorage.setItem('dailyStepCount', JSON.stringify(newStepCount));
          } catch (error) {
            console.error('Failed to save step count:', error);
          }
        }
      });

      return () => subscription.remove();
    }
  }, [isPedometerAvailable, stepCount]);

  // 步數 & 卡路里進度
  const stepProgress = Math.min(stepCount / stepGoal, 1);
  const calorieProgress = Math.min((stepCount / stepGoal) * calorieGoal, calorieGoal) / calorieGoal;

  // 重置步數
  const resetStepCount = async () => {
    setStepCount(0);
    await AsyncStorage.removeItem('dailyStepCount');
  };

  // 用真實步數替代 `mock data`
  const data = {
    labels: ["Task Complete", "Calorie Burn"],
    data: [stepProgress, calorieProgress]
  };

  return (

    <ImageBackground 
      source={require('../assets/FitTaskBlankBG.png')} // Background image
      style={styles.background}
    >

    <View style={styles.logoContainer}>
      <Image source={require("../assets/FitTalk_Logo.png")} style={styles.logo} />
    </View>

      <ScrollView contentContainerStyle={styles.container}>
        
       {/* 圓形進度圖 (步數 & 卡路里) */}
        <View style={styles.progressContainer}>
          <ProgressChart
            data={data}
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

        {/* 步數統計資訊 */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>{stepCount}{"\n"}Steps</Text>
          <Text style={styles.statsText}>{(stepCount * 0.0008).toFixed(2)} km{"\n"}Distance</Text>
        </View>

        {/* 重置步數按鈕 */}
        <Button title="Reset Steps" onPress={resetStepCount} color="orange" />

        {/* Task List */}
        <Text style={styles.taskListHeader}>Task List</Text>
        <View style={styles.taskContainer}>
          <Text style={styles.taskStatus}>Complete</Text>
          <View style={styles.taskItem}><Text style={styles.taskTitle}>Abdominal training</Text></View>
          <View style={styles.taskItem}><Text style={styles.taskTitle}>Upper limb training</Text></View>
          <View style={styles.taskItem}><Text style={styles.taskTitle}>Total Body Fat Burning</Text></View>
        </View>


        {/* Citation: The exercises and how to setup the API was learned from https://www.youtube.com/watch?v=_MttMnZ3CeI */}
        {/* API Used: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb */}
        
        {/* Exercise List with Images */}
        <Text style={styles.taskListHeader}>Exercises</Text>
        <FlatList
          style={styles.exerciseContainer}
          data={bodyParts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.exerciseItem}
              onPress={() => navigation.navigate('ExerciseScreen', { bodyPart: item.name.toLowerCase() })}
            >
              <Image source={item.image} style={styles.exerciseImage} />
              <View style={styles.exerciseTextContainer}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                {/* <Text style={styles.exerciseInfo}>{item.duration} | {item.calories}</Text> */}
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingTop: 80, 
  },
  logoContainer: {
    position: 'absolute',
    top: 40, // Adjust the distance from the top
    left: 20, // Adjust the distance from the left
    zIndex: 10, // Ensures it stays above the map
  },
  logo: {
    width: 100, // Adjust size as needed
    height: 50, // Adjust size as needed
    resizeMode: 'contain',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
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
    marginTop: 20,
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
    marginTop: 20,
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
  exerciseContainer: {
    width: '90%'
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    width: '100%',
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
  exerciseInfo: {
    color: '#ddd',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  statsText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default FitnessTaskScreen;
