import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../constants/API_URL";
import axios from "axios";

export const fetchSaleBillReport = async (startDate?: string, endDate?: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const userId = await AsyncStorage.getItem("userId");

    if (!userId || !token) {
      console.warn("Missing userId or token");
      return [];
    }

    let url = `${API_URL}/get/sale-reports?userId=${userId}`;

    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }

    console.log("Final URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching sale reports:", error?.response?.data || error.message);
    return [];
  }
};

export const fetchPurchaseBillReport = async (startDate?: string, endDate?: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const userId = await AsyncStorage.getItem("userId");

    if (!userId || !token) {
      console.warn("Missing userId or token");
      return [];
    }

    let url = `${API_URL}/get/purchase-reports?userId=${userId}`;

    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }

    console.log("Final URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching sale reports:", error?.response?.data || error.message);
    return [];
  }
};

export const fetchProductReport = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const userId = await AsyncStorage.getItem("userId");

    if (!userId || !token) {
      console.warn("Missing userId or token");
      return [];
    }

    // let url = `${API_URL}/product/low-product/reports?userId=${userId}`;
    console.log("url", `${API_URL}/product/low-product/reports?userId=${userId}`)
    const response = await axios.get(`${API_URL}/product/low-product/reports?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.lowStockProducts;
  } catch (error: any) {
    console.error("Error fetching sale reports:", error?.response?.data || error.message);
    return [];
  }
};