import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from "react-native";
import * as Location from "expo-location";
import { weatherApiKey } from "../constants";


const HomeScreen = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);

  // Function to get current time
  const updateTime = () => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  // Function to get weather data
  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}`
      );
      const data = await response.json();
      console.log("Weather API Response:", data); // Debugging output
      if (data.main) {
        setWeather(data);
      } else {
        console.error("Error: Weather data structure missing `main` key", data);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };
  

  // Function to get user's location
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
  
    let location = await Location.getCurrentPositionAsync({});
    fetchWeather(location.coords.latitude, location.coords.longitude);
  };
  

  // Run these functions when the component mounts
  useEffect(() => {
    updateTime();
    getLocation();
    const interval = setInterval(updateTime, 60000); // Update time every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground source={require("../assets/Home.png")} style={styles.background}>
      <TouchableOpacity style={styles.cameraButton} onPress={() => navigation.navigate("CameraScreen")}>
        <Text style={styles.cameraIcon}>📷</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Time and Weather Section */}
        <View style={styles.timeWeatherContainer}>
          <Text style={styles.time}>{currentTime}</Text>
          
          {weather && weather.current && (
            <Text style={styles.weather}>
              {weather.location.name} • {Math.round(weather.current.temp_c)}°C {weather.current.condition.text}
            </Text>
          )}

        </View>

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
  timeWeatherContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  time: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  weather: {
    fontSize: 20,
    color: "#fff",
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
