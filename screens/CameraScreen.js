import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Crypto from "expo-crypto";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const CameraScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Camera access is required.");
      }
    })();
  }, []);

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const generateUniqueFileName = async () => {
    return Crypto.randomUUID();
  };

  const uploadImageToFirebase = async () => {
    if (!image) {
      Alert.alert("❌ Error", "Please take a photo first!");
      return;
    }

    setUploading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("❌ Please log in first");
        return;
      }

      const response = await fetch(image);
      const blob = await response.blob();

      const uniqueFileName = await generateUniqueFileName();
      const fileName = `moments/${user.uid}/${uniqueFileName}.jpg`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "moments"), {
        userId: user.uid,
        userName: user.email,
        imageUrl: downloadURL,
        timestamp: serverTimestamp(),
      });

      Alert.alert("✅ Uploaded", "Photo uploaded to Moments!");
      setImage(null);
      navigation.goBack();
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("❌ Failed", "Please try again.");
    }
    setUploading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📷 Take a Photo</Text>

      <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
        <Ionicons name="camera-outline" size={28} color="#fff" />
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.previewImage} />
      )}

      {image && (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={uploadImageToFirebase}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={22} color="#fff" />
              <Text style={styles.buttonText}>Upload to Moments</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.returnButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={20} color="#E87E27" />
        <Text style={[styles.buttonText, { color: "#E87E27" }]}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A120B",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  cameraButton: {
    flexDirection: "row",
    backgroundColor: "#E87E27",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  uploadButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  returnButton: {
    flexDirection: "row",
    marginTop: 30,
    borderColor: "#E87E27",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
  },
  previewImage: {
    width: 280,
    height: 280,
    borderRadius: 12,
    marginTop: 15,
    resizeMode: "cover",
  },
});

export default CameraScreen;
