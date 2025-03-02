import { useState } from "react";
import { API_URL } from "../../constants/API_URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

const useProductForm = () => {
   const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const submitProduct = async ({
    name,
    sellingPrice,
    costPrice,
    openingStock,
    lowStockAlert,
    gstIncluded,
    productImage,
    unit,
    gstIn,
  }: any) => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("Authentication error: No token found. Please log in again.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("sellingPrice", String(sellingPrice));
      formData.append("costPrice", String(costPrice));
      formData.append("stock", String(openingStock));
      formData.append("lowStockAlert", String(lowStockAlert));
      formData.append("gstPercentage", String(gstIn));
      formData.append("unit", String(unit));
      formData.append("gstIncluded", gstIncluded ? "true" : "false");

      if (productImage) {
        formData.append("productImage", {
          uri: productImage,
          name: "product.jpg",
          type: "image/jpeg",
        } as any);
      }

      const response = await fetch(`${API_URL}/product/add`, {
        method: "POST",
        body: formData,
        headers: {
          authorization: `Bearer ${token}`, 
        },
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        console.error("Response status:", response.status, response.statusText);
      }

      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        console.log("Product added:", result);

        if (response.ok) {
         Alert.alert("Product added successfully!");
          navigation.goBack();
        } else {
         Alert.alert(result.message || "Failed to add product!");
        }
      } else {
        const text = await response.text();
        console.error("Unexpected response:", text);
        Alert.alert("Unexpected response from server. Check console for details.");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      Alert.alert("An error occurred while adding the product.");
    } finally {
      setLoading(false);
    }
  };

  return { submitProduct, loading };
};

export default useProductForm;
