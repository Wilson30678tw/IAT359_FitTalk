import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from "react-native";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { weatherApiKey } from "../constants";

const HomeScreen = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();

  // Function to get current time
  const updateTime = () => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  // Format Date
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "2-digit",
  });

  // Function to get weather data
  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${latitude},${longitude}&aqi=no`
      );
      const data = await response.json();
      console.log("Weather API Response:", data);

      if (data.current) {
        setWeather(data);
      } else {
        console.error("Error: Unexpected weather data format", data);
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
    setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
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
    <ImageBackground source={require("../assets/FitTaskBlankBG.png")} style={styles.background}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/FitTalk_Logo.png")} style={styles.logo} />
      </View>

      <TouchableOpacity style={styles.cameraButton} onPress={() => navigation.navigate("CameraScreen")}>
        <Text style={styles.cameraIcon}>📷</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Time and Weather Section */}
        <View style={styles.timeWeatherContainer}>
          {/* Left Side: Time & Date */}
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{currentTime}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>

          {/* Right Side: Weather Info */}
          {weather && weather.current && (
            <View style={styles.weatherContainer}>
              <View style={styles.weatherLocationRow}>
                <Image source={require("../assets/location_icon.png")} style={styles.locationIcon} />
                <Text style={styles.weatherLocation}>{weather.location.name}</Text>
              </View>
              <View style={styles.weatherInfo}>
                <Text style={styles.weatherText}>{Math.round(weather.current.temp_c)}°C</Text>
                <Image source={{ uri: `https:${weather.current.condition.icon}` }} style={styles.weatherIcon} />
              </View>
            </View>
          )}
        </View>

        <Text style={styles.title}>What's New</Text>
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

// Fixed & Optimized Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    padding: 20,
    marginTop: 100,
  },
  logoContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: "contain",
  },

  // Time & Weather Section
  timeWeatherContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Time on left, weather on right
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  // Left Side (Time & Date)
  timeContainer: {
    flexDirection: "column",
    marginTop: -20,
    marginLeft: -20,
  },
  time: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  date: {
    fontSize: 18,
    color: "#ccc",
  },

  // Right Side (Weather & Location)
  weatherContainer: {
    alignItems: "flex-end",
  },
  weatherLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  weatherLocation: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 5, 
  },
  locationIcon: {
    width: 20,  
    height: 20, 
    resizeMode: "contain",
    tintColor: "#fff",
    marginVertical: 2,
  },
  weatherInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherText: {
    fontSize: 24,
    color: "#fff",
    marginRight: 5,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },

  // Other styles remain unchanged
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
});

export default HomeScreen;
