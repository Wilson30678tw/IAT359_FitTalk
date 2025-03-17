import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";

const MapScreen = () => {
  return (
    <ImageBackground 
      source={require("../assets/Map_BG.png")} // 確保你的圖片在 `assets` 資料夾
      style={styles.background}
    >
      <View style={styles.overlayContainer}>
        {/* 未來可在這裡加入 Google Maps 或其他 UI */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: "rgba(0, 0, 0, 0.2)", // 可調整透明度
    borderRadius: 20,
  },
});

export default MapScreen;
