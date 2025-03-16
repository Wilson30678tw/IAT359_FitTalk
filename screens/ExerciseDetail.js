import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ExerciseDetail = ({ route, navigation }) => {
  const { exercise } = route.params;

  return (
    <View style={styles.container}>
      <Image source={exercise.image} style={styles.image} />
      <Text style={styles.title}>{exercise.name}</Text>
      <Text style={styles.info}>Duration: {exercise.duration}</Text>
      <Text style={styles.info}>Calories Burned: {exercise.calories}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'orange',
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'orange',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExerciseDetail;
