import { useState } from "react";
import { API_URL } from "../../constants/API_URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

const useServiceForm = () => {
   const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const submitProduct = async ({
    serviceName,
    servicePrice,
    gstIncluded,
    serviceImage,
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
      formData.append("serviceName", serviceName);
      formData.append("servicePrice", String(servicePrice));
      formData.append("gstPercentage", String(gstIn));
      formData.append("unit", String(unit));
      formData.append("gstIncluded", gstIncluded ? "true" : "false");

      if (serviceImage) {
        formData.append("serviceImage", {
          uri: serviceImage,
          name: "product.jpg",
          type: "image/jpeg",
        } as any);
      }
      

      const response = await fetch(`${API_URL}/service/add`, {
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

        if (response.ok) {
         Alert.alert("Service added successfully!");
          navigation.goBack();
        } else {
         Alert.alert(result.message || "Failed to add service!");
        }
      } else {
        const text = await response.text();
        console.error("Unexpected response:", text);
        Alert.alert("Unexpected response from server. Check console for details.");
      }
    } catch (error) {
      console.error("Error submitting service:", error);
      Alert.alert("An error occurred while adding the service.");
    } finally {
      setLoading(false);
    }
  };

  return { submitProduct, loading };
};

export default useServiceForm;
