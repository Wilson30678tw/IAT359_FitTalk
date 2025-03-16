import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProgressChart } from 'react-native-chart-kit';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const FitnessTaskScreen = () => {
  // Mock data for the chart
  const data = {
    labels: ["Task Complete", "Calorie Burn"],
    data: [0.65, 0.48] // 65% and 48%
  };

  const navigation = useNavigation();

  // Exercise list with images
  const exercises = [
    { id: '1', name: 'Back', duration: '10 min', calories: '120 kcal', image: require('../assets/fitness-app-assets/back.png') },
    { id: '2', name: 'Cardio', duration: '30 min', calories: '90 kcal', image: require('../assets/fitness-app-assets/cardio.png') },
    { id: '3', name: 'Chest', duration: '10 min', calories: '110 kcal', image: require('../assets/fitness-app-assets/chest.png') },
    { id: '4', name: 'Lower Arms', duration: '15 min', calories: '80 kcal', image: require('../assets/fitness-app-assets/lowerArms.png') },
    { id: '5', name: 'Lower Legs', duration: '15 min', calories: '80 kcal', image: require('../assets/fitness-app-assets/lowerLegs.png') },
    { id: '6', name: 'Neck', duration: '10 min', calories: '80 kcal', image: require('../assets/fitness-app-assets/neck.png') },
    { id: '7', name: 'Shoulders', duration: '10 min', calories: '80 kcal', image: require('../assets/fitness-app-assets/shoulders.png') },
    { id: '8', name: 'Upper Arms', duration: '15 min', calories: '80 kcal', image: require('../assets/fitness-app-assets/upperArms.png') },
    { id: '9', name: 'Upper Legs', duration: '15 min', calories: '80 kcal', image: require('../assets/fitness-app-assets/upperLegs.png') },
    { id: '10', name: 'Waist', duration: '10 min', calories: '80 kcal', image: require('../assets/fitness-app-assets/waist.png') },
  ];

  return (
    <ImageBackground 
      source={require('../assets/FitTaskBG.png')} // Background image
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Circular Progress Chart */}
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
            <Text style={styles.progressText}>Task Complete{"\n"}<Text style={styles.percentage}>65%</Text></Text>
            <Text style={styles.progressText}>Calorie Burn{"\n"}<Text style={styles.percentage}>48%</Text></Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>42 mins{"\n"}Time</Text>
          <Text style={styles.statsText}>2920{"\n"}Steps</Text>
          <Text style={styles.statsText}>2.7 km{"\n"}Distance</Text>
        </View>

        {/* Task List */}
        <Text style={styles.taskListHeader}>Task List</Text>
        <View style={styles.taskContainer}>
          <Text style={styles.taskStatus}>Complete</Text>
          <View style={styles.taskItem}><Text style={styles.taskTitle}>Abdominal training</Text></View>
          <View style={styles.taskItem}><Text style={styles.taskTitle}>Upper limb training</Text></View>
          <View style={styles.taskItem}><Text style={styles.taskTitle}>Total Body Fat Burning</Text></View>
        </View>
        
        {/* Exercise List with Images */}
        <Text style={styles.taskListHeader}>Exercises</Text>
        <FlatList
          style={styles.exerciseContainer}
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.exerciseItem}
              onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
            >
              <Image source={item.image} style={styles.exerciseImage} />
              <View style={styles.exerciseTextContainer}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Text style={styles.exerciseInfo}>{item.duration} | {item.calories}</Text>
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
});

export default FitnessTaskScreen;
