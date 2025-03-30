import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
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

  const getFitnessSuggestion = () => {
    if (!weather || !weather.current) return "Loading...";
    const condition = weather.current.condition.text.toLowerCase();
    if (condition.includes("rain")) return "🌧 Try indoor yoga or stretching.";
    if (condition.includes("clear") || condition.includes("sunny"))
      return "☀️ Perfect day for outdoor running or cycling.";
    if (condition.includes("cloud")) return "⛅ Great for a walk or home workout.";
    return "🏋️ Customize your own workout today!";
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
      <View style={styles.wrapper}>
        {/* Fixed Top Section */}
        <View style={styles.logoContainer}>
          <Image source={require("../assets/FitTalk_Logo.png")} style={styles.logo} />
        </View>

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

        {/* Scrollable Card Section */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* What's New */}
          <View style={styles.whatsNewSection}>
            <Text style={styles.subTitle}>What's New</Text>
            <Image
              source={require("../assets/Workout.png")}
              style={styles.newsImage}
            />
            <TouchableOpacity style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Explore More</Text>
            </TouchableOpacity>
          </View>

          {/* Fitness Suggestion */}
          <Text style={styles.sectionTitle}>Best Fit For You</Text>
          <View style={styles.fitnessCard}>
            <View style={styles.fitnessHeader}>
              <Text style={styles.fitnessTitle}>Home Fitness</Text>
              <Text style={styles.fitnessMeta}>🕒 30 min   🔥 180 Kcal</Text>
            </View>
            <Image
              source={require("../assets/homefitness.png")}
              style={styles.fitnessImage}
            />
            <Text style={styles.fitnessDescription}>
              {getFitnessSuggestion()}
            </Text>
          </View>

          {/* Padding to avoid bottom tab overlap */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  wrapper: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  logoContainer: {
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: "contain",
  },
  timeWeatherContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  timeContainer: {
    flexDirection: "column",
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
  whatsNewSection: {
    marginTop: 30,
    marginBottom: 30,
  },
  subTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  newsImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    resizeMode: "cover",
  },
  exploreButton: {
    backgroundColor: "#E87E27",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
  },
  exploreButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  fitnessCard: {
    backgroundColor: "#29231B",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  fitnessHeader: {
    marginBottom: 10,
  },
  fitnessTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  fitnessMeta: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 4,
  },
  fitnessImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    resizeMode: "cover",
    marginTop: 10,
  },
  fitnessDescription: {
    marginTop: 12,
    fontSize: 15,
    color: "#fff",
    lineHeight: 22,
  },
});

export default HomeScreen;
