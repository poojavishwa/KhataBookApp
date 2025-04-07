import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AddProductButton from "../Components/AddProductFab";
import ProductStockModal from "../Screens/ProductsScreen/ProductStockModal";
import ProductTotalHead from "../Screens/ProductsScreen/ProductTotalHead";
import { fetchServices } from "../Api/service/serviceCrud";
import AddServiceButton from "../Components/AddServicesFab";

const ProductsTab = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchServices();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  return (
    <>
      <View style={styles.container}>
        {/* <ProductTotalHead/> */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007BFF" />
          </View>
        ) : products.length === 0 ? (
          <Text style={styles.emptyText}>No products found.</Text>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item, index) => item?._id?.toString() || index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Service Details", { serviceId: item._id })}
              >
                <View style={styles.productCard}>
                  <Image
                    source={{ uri: `${item.serviceImage}` }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>{item.serviceName}</Text>
                    <Text style={styles.productPrice}>Service Price: ₹{item.servicePrice}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <AddServiceButton />
      </View>
    </>

  );
};

export default ProductsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007BFF",
    textAlign: "center",
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6C757D",
    marginTop: 20,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 8,
    marginBottom: 10,
    borderRadius: 10,
    // elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  productPrice: {
    fontSize: 12,
    color: "#007BFF",
    marginTop: 5,
  },
  productStock: {
    fontSize: 12,
    color: "#28A745",
    marginTop: 5,
  },
  stockButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inButton: {
    backgroundColor: "#28A745",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  outButton: {
    backgroundColor: "#DC3545",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize:12,
  },
  
});
