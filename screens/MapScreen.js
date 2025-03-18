import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ImageBackground, TouchableOpacity, Text, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';


const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
      (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Location access is required for tracking.');
              return;
          }
  
          // Get initial location
          let currentLocation = await Location.getCurrentPositionAsync({});
          setLocation({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
          });
      })();
  }, []);

  const startTracking = async () => {
      setTracking(true);
  
      await Location.watchPositionAsync(
          {
              accuracy: Location.Accuracy.High,
              timeInterval: 1000,
              distanceInterval: 3,
          },
          (newLocation) => {
              const { latitude, longitude } = newLocation.coords;
              setLocation({ latitude, longitude });
  
              setRoute((prevRoute) => [...prevRoute, { latitude, longitude }]);
          }
      );
  };

  const stopTracking = () => {
      setTracking(false);
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground 
        source={require("../assets/FitTaskBlankBG.png")} 
        style={styles.background}
      />

      <View style={styles.logoContainer}>
        <Image source={require("../assets/FitTalk_Logo.png")} style={styles.logo} />
      </View>

      {/* Map Container*/}
      <View style={styles.mapContainer}>
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: 49.2827, 
                longitude: -123.1207, 
                latitudeDelta: 0.01, 
                longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
        >
            {route.length > 0 && (
                <>
                    <Polyline coordinates={route} strokeWidth={4} strokeColor="blue" />
                    <Marker coordinate={route[0]} title="Start" pinColor="green" />
                    <Marker coordinate={route[route.length - 1]} title="Current" pinColor="red" />
                </>
            )}
        </MapView>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={startTracking} disabled={tracking}>
            <Text style={styles.buttonText}>Start Tracking</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={stopTracking} disabled={!tracking}>
            <Text style={styles.buttonText}>Stop Tracking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute", // Ensure the background is behind everything
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    marginTop: 100,
    marginBottom: 110,
  },
  map: {
    flex: 1,
  },
  buttons: {
      position: 'absolute',
      bottom: 150,
      alignSelf: 'center',
      flexDirection: 'row',
      gap: 10,
  },
  button: {
      backgroundColor: '#000000',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
  },
  buttonText: {
      color: 'white',
      fontWeight: 'bold',
  },
});

export default MapScreen;
