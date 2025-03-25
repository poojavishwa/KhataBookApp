import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../constants/API_URL";
import axios from "axios";

export const addStock = async (stockData: any,productId:string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.put(`${API_URL}/product/stock-movement/${productId}`, stockData, {
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