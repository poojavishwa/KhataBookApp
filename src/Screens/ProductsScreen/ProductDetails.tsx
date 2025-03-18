import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { IMAGE_URL } from "../../constants/API_URL";
import { DeleteById, fetchProductById } from "../../Api/Product/productCrud";
import ProductHeader from "../../Components/ProductHeader";

const ProductDetails = () => {
  const route = useRoute();
  const { productId } = route.params;
    const navigation = useNavigation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await fetchProductById(productId);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadProduct();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  const handleDelete = async () => {
    Alert.alert("Confirm", "Are you sure you want to delete this product?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const result = await DeleteById(productId);
            Alert.alert("Success", "Product deleted successfully!");
            navigation.goBack()
          } catch (error) {
            Alert.alert("Error", "Failed to delete product.");
          }
        },
      },
    ]);

  }

  return (
    <>
      <ScrollView>
        <ProductHeader title="Product Details" product={product} />

        {/* Product Details */}
        <View style={styles.infoContainer}>
          <View style={styles.imageContainer}>
            <Text style={styles.productName}>{product.name}</Text>
            {product.productImage ? (
              <Image
                source={{ uri: `${IMAGE_URL}${product.productImage}` }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>No Image   </Text>
              </View>
            )}
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Sale Price:</Text>
            <Text style={styles.value}>₹{product.sellingPrice}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Purchase Price:</Text>
            <Text style={styles.value}>₹{product.costPrice} </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Stock Quantity:</Text>
            <Text style={styles.value}>{product.stock}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>GST Included:</Text>
            <Text style={styles.value}>{product.gstIncluded ? "Yes" : "No"} </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>GST %:</Text>
            <Text style={styles.value}>{product.gstPercentage} % </Text>
          </View>
        </View>

        {/* Bottom Buttons */}

      </ScrollView>
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.stockInButton}>
          <Text style={styles.buttonText}>STOCK IN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stockOutButton}>
          <Text style={styles.buttonText}>STOCK OUT</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.delelteBox}>
      <TouchableOpacity
        style={[styles.saveButton, loading ? styles.saveButtonDisabled : styles.deleteButtonActive]}
        disabled={loading}
        onPress={handleDelete}
      >
        <Text style={styles.deleteButtonText}>{loading ? "Deleting..." : "DELETE ITEM"}</Text>
      </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0056b3",
    padding: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  editText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "#6C757D",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007BFF",
    textAlign: "center",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal:10
  },
  stockInButton: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  stockOutButton: {
    backgroundColor: "#DC3545",
    padding: 15,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: { padding: 15, borderRadius: 5, alignItems: "center", marginTop: 10 },
  saveButtonActive: { backgroundColor: "#007bff" },
  saveButtonDisabled: { backgroundColor: "#ccc" },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
  deleteButtonText: { color: "#DC3545", fontWeight: "bold" },
  deleteButtonActive: { borderWidth:2,borderColor:"#DC3545" },
  delelteBox:{marginHorizontal:10,marginBottom:10}
});

export default ProductDetails;