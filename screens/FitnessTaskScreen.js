import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FitnessTaskScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Task Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default FitnessTaskScreen;