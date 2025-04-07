import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../constants/API_URL";

export const fetchServices = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/service/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data.services; // Ensure the key is correct
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected Error:", error);
      }
      return [];
    }
  };

  export const fetchServiceById = async (serviceId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/service/getById/${serviceId}`, {
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

  export const submitProduct = async (serviceData: any) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
  
      const response = await axios.put(
        `${API_URL}/service/update`,  
        serviceData,  
        {
          headers: {
            "content-type":"multipart/form-data",
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

  export const DeleteById = async (serviceId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.delete(`${API_URL}/service/soft-delete/${serviceId}`, {
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
  