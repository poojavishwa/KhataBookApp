import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import SaleBillHeader from "../../Components/SaleBillHeader";

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A"; // Handle empty or undefined date

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};


const SaleBillDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { billData } = route.params as { billData: any };
  console.log("billData", billData)

  // const isProductBill = billData.items.some((item) => item.productId);   
  const isProductBill = billData.items && billData.items.length > 0;
  const isServiceBill = billData.services && billData.services.length > 0;


  return (
    <>
      <SaleBillHeader title="Sale Bill Details" billData={billData} />
      <View style={styles.container}>
        <View style={styles.customerCard}>
          <View>
            <Text style={styles.customerName}>{billData.customerId.name}</Text>
            <Text style={styles.customerphone}>{formatDate(billData.Date)}</Text>

          </View>
          <View>
            <Text style={styles.customerName}>₹ {billData.saleBillAmount}</Text>
            <Text
              style={[
                styles.customerName,
                { color: billData.paymentStatus === "unpaid" ? "red" : "green" }
              ]}
            >
              {billData.paymentStatus}
            </Text>

          </View>
        </View>
        <View style={styles.productCard}>
          {isProductBill && (
            <>
              <Text style={styles.sectionTitle}>Products</Text>
              {billData.items.map(
                (item, index) =>
                  item.productId && (
                    <View key={index} style={styles.selectedProductBox}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.boldText}>{item.productId.name}</Text>
                        <Text style={styles.subText}>
                          {item.quantity} x ₹{item.price}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.priceText}>₹{item.quantity * item.price}</Text>
                      </View>
                    </View>
                  )
              )}
            </>
          )}

          {isServiceBill && (
            <>
              <Text style={styles.sectionTitle}>Services</Text>
              {billData.services.map(
                (item, index) =>
                  item.serviceId && (
                    <View key={index} style={styles.selectedProductBox}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.boldText}>{item.serviceId.serviceName}</Text>
                        <Text style={styles.subText}>
                          Price: ₹{item.price}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.priceText}>₹{item.price}</Text>
                      </View>
                    </View>
                  )
              )}
            </>
          )}


          <View style={styles.totalAmountRow}>
            <Text style={{ fontSize: 16 }}>Total Amount</Text>
            <Text style={{ fontSize: 16 }}>₹{billData.saleBillAmount}</Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 10,
  },
  customerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  customerName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  customerphone: {
    fontSize: 12,
    color: "gray",
  },
  productCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "white",
    borderRadius: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  selectedProductBox: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  boldText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  subText: {
    fontSize: 12,
    color: "#555",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
  },
  totalAmountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  actionButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});


export default SaleBillDetails;
