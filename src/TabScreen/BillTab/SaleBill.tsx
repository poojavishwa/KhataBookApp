import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AddSaleButton from "../../Components/AddSaleFab";
import { fetchSaleBill } from "../../Api/billCrud/BillCrud";

const SaleBill = () => {
  const navigation = useNavigation();
  const [bill, setBill] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  console.log("sake bill",bill)
  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await fetchSaleBill();
      setBill(data);
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
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : bill.length === 0 ? (
        <Text style={styles.emptyText}>No bill found.</Text>
      ) : (
        <FlatList
          data={bill}
          keyExtractor={(item, index) => item?._id?.toString() || index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
            onPress={() => navigation.navigate("Sale Bill Details", { billData: item })}
            >
              <View style={styles.customerCard}>
                <View>
                  <Text style={styles.customerName}>{item.customerId.name}</Text>
                  <Text style={styles.Invoice}>Sale Bill: #{item.BillNumber}</Text>
                  <Text style={styles.customerphone}>{item.customerId.phone}</Text>
                </View>
                <View>
                  <Text style={styles.customerName}>₹ {item.saleBillAmount}</Text>
                  <Text
                    style={[
                      styles.customerName,
                      { color: item.paymentStatus === "unpaid" ? "red" : "green" }
                    ]}
                  >
                    {item.paymentStatus}
                  </Text>

                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <AddSaleButton />
    </View>
  );
};

export default SaleBill;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 8,
    paddingTop: 8,
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
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 8,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  customerName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
  customerphone: {
    fontSize: 8,
    fontWeight: "500",
    color: "gray",
  },
  Invoice: {
    marginBottom: 5,
    marginTop: 5,
    fontSize: 10,
    fontWeight: "500",
    color: "gray",
    padding: 2,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 5
  }
});
