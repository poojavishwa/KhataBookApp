import axios from "axios";
import { API_URL } from "../../constants/API_URL";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const addSupplier = async (supplierData: any) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.post(`${API_URL}/supplier/add`, supplierData, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Return API response data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add customer.");
  }
};

export const fetchSupplier = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/supplier/get`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
  
      console.log("Response:", response.data); // Log full response
  
      return response.data.suppliers; // Ensure the key is correct
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected Error:", error);
      }
      return [];
    }
  };