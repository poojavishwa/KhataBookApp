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
  
      // console.log("Response:", response.data); // Log full response
  
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

  export const fetchUserTransactions = async (userId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/supplier-transaction/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // // console.log("data ",response.data.transactions)
      return response.data.transactions;
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      return [];
    }
  };

  export const fetchSupplierGetById = async (userId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/supplier/getbyId/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.supplier;
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      return [];
    }
  };

  export const addTransaction = async (supplierId: string, type: "credit" | "debit", amount: number) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/supplier-transaction/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ supplierId, type, amount }),
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  };

  export const UpdateCustomerById = async (supplierData: any) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
  
      const response = await axios.put(
        `${API_URL}/supplier/update/`,
        supplierData,
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
  
  export const DeleteById = async (supplierId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.delete(`${API_URL}/supplier/delete/${supplierId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.supplier;
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      return [];
    }
  };