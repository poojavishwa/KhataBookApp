import axios from "axios";
import { API_URL } from "../../constants/API_URL";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const addCustomer = async (customerData: any) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.post(`${API_URL}/customer/add`, customerData, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add customer.");
  }
};

export const fetchCustomers = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/customer/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.customers; // Ensure the key is correct
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return [];
  }
};

export const fetchCustomerGetById = async (userId: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/customer/getbyId/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.customer;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return [];
  }
};

export const addTransaction = async (customerId: string, type: "credit" | "debit", amount: number) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/transaction/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ customerId, type, amount }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

export const fetchUserTransactions = async (userId: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/transaction/${userId}`, {
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

export const UpdateCustomerById = async (customerData: any) => {
  try {
    const token = await AsyncStorage.getItem("authToken");

    const response = await axios.put(
      `${API_URL}/customer/update/`,
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

export const DeleteById = async (customerId: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.delete(`${API_URL}/customer/deletebyId/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.customer;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return [];
  }
};

export const fetchCustomerTotal = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/customer/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return [];
  }
};



