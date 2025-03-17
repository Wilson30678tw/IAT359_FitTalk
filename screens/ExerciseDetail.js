import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ExerciseDetailScreen = ({ route, navigation }) => {
  const { exercise } = route.params; 

  return (
    <ImageBackground
      source={require('../assets/FitTaskBlankBG.png')} // 
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Exercise Image */}
          <Image source={{ uri: exercise.gifUrl }} style={styles.image} />

          {/* Exercise Name */}
          <Text style={styles.title}>{exercise.name}</Text>

          {/* Exercise Info */}
          <Text style={styles.section}>
            <Text style={styles.label}>Equipment: </Text>
            {exercise.equipment}
          </Text>

          <Text style={styles.section}>
            <Text style={styles.label}>Secondary Muscles: </Text>
            {exercise.secondaryMuscles.join(', ')}
          </Text>

          <Text style={styles.section}>
            <Text style={styles.label}>Target: </Text>
            {exercise.target}
          </Text>

          {/* Instructions */}
          <Text style={styles.section}>
            <Text style={styles.label}>Instructions: </Text>
            {exercise.instructions}
          </Text>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
  },
  content: {
    alignItems: 'center',
    paddingTop: 80, // 
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: 'white', // 
    marginBottom: 10,
  },
  section: {
    fontSize: 16,
    color: 'white', // 
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: 'orange', // 
  },
});

export default ExerciseDetailScreen;
