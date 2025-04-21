import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
import { API_URL } from "../../constants/API_URL";

export const createQuotation = async (
    billNumber: number,
    date: Date,
    selectedCustomer: any,
    selectedProducts: { productId: string; 
      serviceId: string; 
      quantity: number; 
      price: number;
      discount?: number;
      discountType?: 'percentage' | 'rupee'; 
    }[],
    paymentMethod: string,
    prefix: string,
    isService: boolean
  ) => {
    if (!selectedCustomer || (selectedProducts.length === 0 && !isService)) {
      Alert.alert("Error", "Please select a customer and at least one product.");
      return;
    }
  
    try {
      // Fetch userId properly
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("userId");
  console.log("token",token)
      if (!token || !userId) {
        Alert.alert("Error", "User authentication failed. Please log in again.");
        return;
      }
  
      const quotationAmount = selectedProducts.reduce((total, item) => {
        const itemTotal = item.quantity * item.price;
        const discountAmount = item.discount 
          ? (item.discountType === 'percentage' 
            ? itemTotal * (item.discount / 100) 
            : item.discount * item.quantity)
          : 0;
        return total + itemTotal - discountAmount;
      }, 0);
  
      const requestBody = {
        customerId: selectedCustomer._id, // Send correct customerId
        QuotationNumber: `${billNumber}`,
        Date: date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
        quotationAmount,
        userId: userId, // Include userId
        paymentStatus: paymentMethod.toLowerCase(),
          items: selectedProducts
          .filter((p) => p.productId) // Only products
          .map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
            price: p.price,
            discount: p.discount || 0,
            discountType: p.discountType || 'rupee',
          })),
        services: selectedProducts
          .filter((s) => s.serviceId) // Only services
          .map((s) => ({
            serviceId: s.serviceId,
            quantity: s.quantity,
            price: s.price,
            discount: s.discount || 0,
            discountType: s.discountType || 'rupee',
          })),
  
        prefix: prefix
      };
  console.log("requestBody",requestBody)
      const response = await axios.post(`${API_URL}/create/quotation`, requestBody, {
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

  export const fetchQuotationNo = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/get/quotationNo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      return [];
    }
  };

  export const fetchQuotation = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/get/quotation-by-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.saleQuotation;
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      return [];
    }
  };