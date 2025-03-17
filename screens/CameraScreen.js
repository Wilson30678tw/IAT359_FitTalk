import React, { useState, useEffect } from "react";
import { View, Text, Button, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Crypto from "expo-crypto"; // ✅ 正確導入
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const CameraScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("需要相機權限才能使用此功能");
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

  // ✅ 確保 generateUniqueFileName 被定義
  const generateUniqueFileName = async () => {
    return Crypto.randomUUID();
  };

  const uploadImageToFirebase = async () => {
    if (!image) {
      Alert.alert("❌ 錯誤", "請先拍攝照片！");
      return;
    }

    setUploading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("❌ 請先登入");
        return;
      }

      const response = await fetch(image);
      const blob = await response.blob();
      
      // 🔥 確保 generateUniqueFileName 以 `await` 方式獲取 ID
      const uniqueFileName = await generateUniqueFileName();
      const fileName = `moments/${user.uid}/${uniqueFileName}.jpg`;
      const storageRef = ref(storage, fileName);

      console.log("🔄 上傳中...");
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("✅ 圖片已上傳:", downloadURL);

      await saveImageToFirestore(user, downloadURL);
    } catch (error) {
      console.error("❌ 上傳圖片失敗:", error);
      Alert.alert("❌ 上傳失敗", "請稍後再試");
    }
    setUploading(false);
  };

  const saveImageToFirestore = async (user, imageUrl) => {
    try {
      await addDoc(collection(db, "moments"), {
        userId: user.uid,
        userName: user.email,
        imageUrl: imageUrl,
        timestamp: serverTimestamp(),
      });
      console.log("✅ 圖片資訊已儲存到 Firestore");
      Alert.alert("✅ 成功", "圖片已成功上傳到 Moments!");
      navigation.goBack(); // 上傳後自動返回 Moments 頁面
    } catch (error) {
      console.error("❌ 儲存到 Firestore 失敗:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>📷 Camera Screen</Text>
      <Button title="拍照" onPress={takePicture} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button title="上傳照片" onPress={uploadImageToFirebase} disabled={uploading} />
      <Button title="返回" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default CameraScreen;
