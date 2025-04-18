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
import { showToast } from "../../constants/showToast";
import { DeleteById, fetchServiceById } from "../../Api/service/serviceCrud";
import ServiceHeader from "../../Components/ServiceHeader";

const ServiceDetails = () => {
  const route = useRoute();
  const { serviceId } = route.params;
  const navigation = useNavigation();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await fetchServiceById(serviceId);
      setService(data.service);
      // setLogs(data.logs);
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

  if (!service) {
    return (
      <View style={styles.loader}>
        <Text>Service not found.</Text>
      </View>
    );
  }

  const handleDelete = async () => {
    Alert.alert("Confirm", "Are you sure you want to delete this service?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const result = await DeleteById(serviceId);
            showToast("success","Success", "Service deleted successfully!");
            navigation.goBack()
          } catch (error) {
            showToast("error","Error", "Failed to delete service.");
          }
        },
      },
    ]);

  }

  return (
    <>
      <ScrollView>
        <ServiceHeader title="Service Details" service={service} />

        {/* Product Details */}
        <View style={styles.infoContainer}>
          <View style={styles.imageContainer}>
            <Text style={styles.productName}>{service.serviceName}</Text>
            {service.serviceImage ? (
              <Image
                source={{ uri: `${service.serviceImage}` }}
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
            <Text style={styles.label}>Service Price:</Text>
            <Text style={[styles.value, { flex: 1, textAlign: "right" }]}>₹{service.servicePrice}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>GST Included:</Text>
            <Text style={[styles.value, { flex: 1, textAlign: "right" }]}>{service.gstIncluded ? "Yes" : "No"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>GST %:</Text>
            <Text style={[styles.value, { flex: 1, textAlign: "right" }]}>{service.gstPercentage} % </Text>
          </View>
        </View>
        {/* <View style={styles.logs}>
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
        </View> */}
      </ScrollView>
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

export default ServiceDetails;