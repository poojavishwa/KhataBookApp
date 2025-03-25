import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../constants/API_URL";

export const fetchProducts = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/product/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.products; // Ensure the key is correct
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return [];
  }
};

export const fetchProductById = async (productId: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/product/getById/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response.data",response.data)
    return  response.data ;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return [];
  }
};

export const submitProduct = async (productData: any) => {
  try {
    const token = await AsyncStorage.getItem("authToken");

    const response = await axios.put(
      `${API_URL}/product/update`,  
      productData,  
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

export const DeleteById = async (productId: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.delete(`${API_URL}/product/soft-delete/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.product;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return [];
  }
};

export const fetchProductTotal = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/product/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Ensure the key is correct
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return [];
  }
};

