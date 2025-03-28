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
import ProductStockModal from "./ProductStockModal";
import { showToast } from "../../constants/showToast";

const ProductDetails = () => {
  const route = useRoute();
  const { productId } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [product, setProduct] = useState(null);
  const [logs, setLogs] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await fetchProductById(productId);
      setProduct(data.product);
      setLogs(data.logs);
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
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loader}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  const handleStockAction = (type) => {
    setSelectedProduct({ ...product, type });
    setModalVisible(true);
  };

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
            showToast("success","Success", "Product deleted successfully!");
            navigation.goBack()
          } catch (error) {
            showToast("error","Error", "Failed to delete product.");
          }
        },
      },
    ]);

  }
  const filteredLogs = logs.filter(log => log.action !== "created");

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
                source={{ uri: `${product.productImage}` }}
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
            <Text style={[styles.value, { flex: 1, textAlign: "right" }]}>₹{product.sellingPrice}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Purchase Price:</Text>
            <Text style={[styles.value, { flex: 1, textAlign: "right" }]}>₹{product.costPrice}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Stock Quantity:</Text>
            <Text style={[styles.value, { flex: 1, textAlign: "right" }]}>{product.stock}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>GST Included:</Text>
            <Text style={[styles.value, { flex: 1, textAlign: "right" }]}>{product.gstIncluded ? "Yes" : "No"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>GST %:</Text>
            <Text style={[styles.value, { flex: 1, textAlign: "right" }]}>{product.gstPercentage} % </Text>
          </View>
        </View>
        <View style={styles.logs}>
          {loading ? (
            <View style={styles.loader}>
            <ActivityIndicator size="large" color="#D32F2F" />
          </View>
          ) : filteredLogs.length === 0 ? (
            <Text >No transactions found.</Text>
          ) : (
            filteredLogs.map((log) => (
              <View
                key={log._id}
                style={[
                  styles.transactionItem,
                  log.action === "stock_in" ? styles.stock_in : styles.stock_out
                ]}
              >
                <View style={styles.box}>
                  <View>
                    <Text style={styles.transactionDate}>
                      {new Date(log.movementDate).toLocaleDateString()}
                    </Text>
                    <Text style={styles.transactionValue}>Previous Balance {log.changes.previousStock}      </Text>
                  </View>
                  <View>
                    <Text style={styles.transactionValue}>
                      {log.action === "stock_in" ? "⬇️In Stock" : "⬆️Out Stock"} {log.stockChange}     </Text>
                    <Text style={styles.transactionValue}>₹{log.priceAtTime}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>


      </ScrollView>
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.stockInButton} onPress={() => handleStockAction("IN")}>
          <Text style={styles.buttonText}>STOCK IN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stockOutButton} onPress={() => handleStockAction("OUT")}>
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
      <ProductStockModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedProduct={selectedProduct}
        refreshProducts={loadProduct}
      />
    </>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
    width:85,
    height: 85,
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
    padding: 8,
    borderRadius: 10,
    elevation: 5,
    margin:10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
    textAlign: "center",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingHorizontal:10
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    fontSize: 14,
    color: "#333",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 10
  },
  stockInButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
    fontSize:12,
  },
  stockOutButton: {
    backgroundColor: "#DC3545",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
    fontSize:12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  saveButton: { padding: 10, borderRadius: 5, alignItems: "center", marginTop: 10 },
  saveButtonActive: { backgroundColor: "#007bff" },
  saveButtonDisabled: { backgroundColor: "#ccc" },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
  deleteButtonText: { color: "#DC3545", fontWeight: "bold" ,fontSize:12},
  deleteButtonActive: { borderWidth: 2, borderColor: "#DC3545" },
  delelteBox: { marginHorizontal: 10, marginBottom: 10 },
  transactionItem: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  stock_in: {
    backgroundColor: "#E7F4E4", // Light green for stock in
    borderLeftWidth: 5,
    borderLeftColor: "#28A745", // Green border
  },
  stock_out: {
    backgroundColor: "#FDECEA", // Light red for stock out
    borderLeftWidth: 5,
    borderLeftColor: "#DC3545", // Red border
  },
  transactionLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  transactionValue: {
    fontSize: 14,
    color: "#555",
  },
  transactionDate: {
    fontSize: 12,
    color: "#6c757d",
  },
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center"
  },
  logs: {
    margin: 10,
  }
});

export default ProductDetails;