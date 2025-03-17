import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ExerciseScreen = ({ route, navigation }) => {
  const bodyPart = route.params?.bodyPart || 'back';
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, [bodyPart]); // Fetch exercises when bodyPart changes

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=10&offset=0`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
            'x-rapidapi-key': '988b02093cmsh6ef5dc0b74ab88bp153164jsn64904617bce7'
          }
        }
      );
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ImageBackground source={require('../assets/FitTaskBlankBG.png')} style={styles.background}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="orange" />
          <Text style={styles.loadingText}>Loading {bodyPart} exercises...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('../assets/FitTaskBlankBG.png')} style={styles.background}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>{bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1)} Exercises</Text>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
            >
              <Image source={{ uri: item.gifUrl }} style={styles.image} />
              <View style={styles.overlay}>
                <Text style={styles.exerciseName}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  loadingText: {
    color: 'orange',
    fontSize: 18,
    marginTop: 10,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'orange',
    marginBottom: 20,
    marginTop: 80,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 12,
    margin: 10,
    width: '45%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
});

export default ExerciseScreen;
