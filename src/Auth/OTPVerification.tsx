import { CommonActions, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Animated, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { verifyOTP } from "../Api/auth/sendOtp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CookieManager from "@react-native-cookies/cookies";
import { API_URL } from "../constants/API_URL";

const OTPVerification = () => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window"); // Get screen width dynamically
  const { control, handleSubmit, setValue, watch } = useForm();
  const otpValues = watch("otp", ["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const route = useRoute();
const { email } = route.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleOTPChange = (text: string, index: number) => {
    if (text.length > 1) return;
    setValue(`otp.${index}`, text);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && index > 0 && otpValues[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: any) => {
    const otpCode = data.otp.join(""); // Convert OTP array to a single string
    // console.log("OTP Entered:", otpCode);
  
    if (!email) {
      Alert.alert("Error", "Missing email.");
      return;
    }
  
    const response = await verifyOTP(email, otpCode);
    if (response.success) {
      Alert.alert("Success", response.message);
  
      // ✅ Save login state in AsyncStorage
      await AsyncStorage.setItem("isLoggedIn", "true");

      const cookies = await CookieManager.get(API_URL);
      // console.log('Cookies after login:', cookies);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "BottomNavigation" }],
        })
      );
    } else {
      Alert.alert("Error", response.message);
    }
  };
  

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flexContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image source={require("../assets/logoImage.png")} style={styles.logo} />
          <Animated.View style={[styles.card, { opacity: fadeAnim, width: width * 0.9, maxWidth: 400 }]}>
            <Text style={styles.title}>Enter OTP</Text>
            <View style={styles.otpContainer}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Controller
                  key={index}
                  control={control}
                  name={`otp.${index}`}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      style={styles.otpBox}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={value}
                      onChangeText={(text) => handleOTPChange(text, index)}
                      onKeyPress={(event) => handleKeyPress(event, index)}
                    />
                  )}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  otpBox: {
    width: 50,
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    textAlignVertical: "center",
    marginHorizontal:1,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    maxWidth: 300,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
});

export default OTPVerification;
