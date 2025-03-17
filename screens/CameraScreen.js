import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, Alert } from "react-native";
import { Camera } from "expo-camera";  // ✅ 確保正確導入
import { storage, db, auth } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [type, setType] = useState(null);  // ✅ 防止 Type 為 undefined
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      setType(Camera.Constants ? Camera.Constants.Type.back : null);  // ✅ 確保 Camera Constants 可用
    })();
  }, []);

  if (hasPermission === null || type === null) {
    return <Text>Loading Camera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} type={type} />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.captureButton}>
          <Text style={styles.buttonText}>📸</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 0.7 },
  controls: { flex: 0.3, alignItems: "center", justifyContent: "center" },
  captureButton: {
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default CameraScreen;
