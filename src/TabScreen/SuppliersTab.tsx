import React, { useCallback, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator 
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AddSupplierButton from "../Components/AddSupplierFab";
import { fetchSupplier } from "../Api/supplier/supplierCrud";

const SupplierTab = () => {
  const [supplier, setsupplier] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await fetchSupplier();
      setsupplier(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadCustomers();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Supplier List</Text>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : supplier.length === 0 ? (
        <Text style={styles.emptyText}>No supplier found.</Text>
      ) : (
        <FlatList
          data={supplier}
          keyExtractor={(item, index) => item?._id?.toString() || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.customerCard}>
              <Text style={styles.customerName}>{item.name}</Text>
            </View>
          )}
        />
      )}

      <AddSupplierButton />
    </View>
  );
};

export default SupplierTab;

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
  customerCard: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
});
