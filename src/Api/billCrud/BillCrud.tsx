import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
import { API_URL } from "../../constants/API_URL";

export const saveBillToServer = async (
    billNumber: number,
    date: Date,
    selectedCustomer: any,
    selectedProducts: { productId: string; quantity: number; price: number }[],
    paymentMethod: string
  ) => {
    if (!selectedCustomer || selectedProducts.length === 0) {
      Alert.alert("Error", "Please select a customer and at least one product.");
      return;
    }
  
    try {
      // Fetch userId properly
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("userId");
      
      if (!token || !userId) {
        Alert.alert("Error", "User authentication failed. Please log in again.");
        return;
      }
  
      const saleBillAmount = selectedProducts.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );
  
      const requestBody = {
        customerId: selectedCustomer._id, // Send correct customerId
        BillNumber: `${billNumber}`,
        Date: date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
        saleBillAmount,
        userId: userId, // Include userId
        paymentStatus: paymentMethod.toLowerCase(),
        items: selectedProducts.map((item) => ({
          productId: item.productId, // Ensure productId is sent
          quantity: item.quantity,
          price: item.price,
        })),
      };
  
      const response = await axios.post(`${API_URL}/create/sale-bill`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 201 || response.status === 200) {
        await AsyncStorage.setItem("lastBillNumber", billNumber.toString());
        Alert.alert("Success", "Bill saved successfully!");
      } else {
        Alert.alert("Error", "Failed to save bill.");
      }
    } catch (error) {
      console.error("Error saving bill:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
};
   
export const savePurcheseBill = async (
      billNumber: number,
      date: Date,
      selectedCustomer: any,
      selectedProducts: { productId: string; quantity: number; price: number }[],
      paymentMethod: string
    ) => {
      if (!selectedCustomer || selectedProducts.length === 0) {
        Alert.alert("Error", "Please select a customer and at least one product.");
        return;
      }
    
      try {
        // Fetch userId properly
        const token = await AsyncStorage.getItem("authToken");
        const userId = await AsyncStorage.getItem("userId");
        if (!token || !userId) {
          Alert.alert("Error", "User authentication failed. Please log in again.");
          return;
        }
    
        const purchaseBillAmount = selectedProducts.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        );
    
        const requestBody = {
          supplierId: selectedCustomer._id, // Send correct customerId
          BillNumber: `${billNumber}`,
          Date: date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
          purchaseBillAmount,
          userId: userId, // Include userId
          paymentStatus: paymentMethod.toLowerCase(),
          items: selectedProducts.map((item) => ({
            productId: item.productId, // Ensure productId is sent
            quantity: item.quantity,
            price: item.price,
          })),
        };
    
        console.log("Sending data to server:", requestBody);
    
        const response = await axios.post(`${API_URL}/create-purchase/bill`, requestBody, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (response.status === 201 || response.status === 200) {
          await AsyncStorage.setItem("lastBillNumber", billNumber.toString());
          Alert.alert("Success", "Bill saved successfully!");
        } else {
          Alert.alert("Error", "Failed to save bill.");
        }
      } catch (error) {
        console.error("Error saving bill:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
};

export const fetchSaleBill = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.get(
      `${API_URL}/get/sale-bill-by-user`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", 
        },
      }
    );
    return response.data.saleBill;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return [];
  }
};

export const fetchPurcheseBill = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.get(
      `${API_URL}/get/purchase-bill-by-user`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", 
        },
      }
    );
    return response.data.purchaseBill;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return [];
  }
};

export const fetchSaleBillGetById = async (billId: string) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/get/sale-bill/${billId}`, {
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
    