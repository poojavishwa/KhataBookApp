import axios from "axios";
import { API_URL } from "../../constants/API_URL";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const sendOTP = async (email: string, phoneNumber: string) => {
  try {
    console.log("API_URL",API_URL)
    const response = await axios.post(`${API_URL}/user/send-Otp`, { email, phoneNumber });

    if (response.status === 200) {
      return { success: true, message: "OTP Sent Successfully!" };
    } else {
      return { success: false, message: response.data.message || "Failed to send OTP." };
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, message: error.response?.data?.message || "Network request failed." };
  }
};

export const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await axios.post(`${API_URL}/user/verify-Otp`, {
        email,
        otp,
      },
    );

      if (response.status === 200) {
      const token = response.data.token; // Assuming token comes in response.data.token
      console.log("token",token)
      if (token) {
        await AsyncStorage.setItem("authToken", token); // Save token in storage
      }
      return { success: true, message: "OTP Verified Successfully!" };
      } else {
        return { success: false, message: response.data.message || "OTP Verification Failed." };
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return { success: false, message: error.response?.data?.message || "Network request failed." };
    }
  };