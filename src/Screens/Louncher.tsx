import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image, Animated } from "react-native";

const launcher = require("../assets/DMblack.png"); // Ensure correct import

const Launcher: React.FC = () => {
  const scale = useRef(new Animated.Value(1)).current; // Initial scale value is 1

  useEffect(() => {
    // Zoom-in and Zoom-out animation
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.5, // Scale up to 1.5 times (zoom-in)
        duration: 1000, // Duration of 1 second
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1, // Scale back to original size (zoom-out)
        duration: 1000, // Duration of 1 second
        useNativeDriver: true,
      }),
    ]).start(); // Start the animation
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={launcher}
        style={[styles.image, { transform: [{ scale }] }]} // Apply scale transformation
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFE0",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 15,
    resizeMode: "cover",
  },
});

export default Launcher;
