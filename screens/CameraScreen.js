import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Camera, useCameraPermissions } from 'expo-camera';

const CameraScreen = () => {
  const [cameraRef, setCameraRef] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission || permission.status !== 'granted') {
      requestPermission();
    }
  }, [permission]);

  if (!permission || permission.status !== 'granted') {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={(ref) => setCameraRef(ref)} />
      <TouchableOpacity
        style={styles.captureButton}
        onPress={() => console.log('Capture Photo')}
      >
        <Text style={styles.text}></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  captureButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 50,
  },
  text: { fontSize: 24 },
});

export default CameraScreen;
