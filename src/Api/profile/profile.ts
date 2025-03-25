import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../constants/API_URL";

export const fetchCustomerGetById = async (userId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/get-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.user;
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      return [];
    }
  };

  export const UpdateProfileById = async (customerData: any) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
  
      const response = await axios.put(
        `${API_URL}/update/user/`,
        customerData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error.message);
      throw error;
    }
  };