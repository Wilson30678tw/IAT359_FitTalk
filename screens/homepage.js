import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from "react-native";

const HomeScreen = () => {
  return (
    <ImageBackground source={require("../assets/Home.png")} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Whats New</Text>
        <View style={styles.card}>
          <Image source={require("../assets/Workout.png")} style={styles.image} />
          <TouchableOpacity style={styles.exploreButton}>
            <Text style={styles.exploreText}>Explore More</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Best Fit For You</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Home Fitness</Text>
          <View style={styles.row}>
            <Text style={styles.info}>⏳ 30 min</Text>
            <Text style={styles.info}>🔥 180 Kcal</Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    padding: 20,
    marginTop: 500,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#5a3e2b",
    padding: 40,
    borderRadius: 10,
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  exploreButton: {
    backgroundColor: "#f28c28",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  exploreText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  info: {
    color: "#fff",
  },
});

export default HomeScreen;
