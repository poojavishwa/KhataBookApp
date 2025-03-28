import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import PurcheseBillHeader from "../../Components/PurcheseBillHeader";

const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"; // Handle empty or undefined date
  
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  

const PurcheseBillDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { billData } = route.params as { billData: any };

    return (
        <>
        <PurcheseBillHeader title="Purchese Bill Details" billData={billData}/>
        <View style={styles.container}>
            <View style={styles.customerCard}>
                <View>
                    <Text style={styles.customerName}>{billData.supplierId.name}</Text>
                    <Text style={styles.customerphone}>{formatDate(billData.Date)}</Text>

                </View>
                <View>
                    <Text style={styles.customerName}>₹ {billData.purchaseBillAmount}</Text>
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
             {billData.items.length > 0 ? (
                        billData.items.map((item, index) => (
                          <View key={index} style={styles.selectedProductBox}>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>
                                {item.productId.name}
                              </Text>
                              <Text style={{ fontSize: 12, color: "#555" }}>
                                {item.quantity} x ₹{item.price}
                              </Text>
                            </View>
                            <View>
                              <Text style={{ fontSize: 14, fontWeight: "bold", color: "#007AFF" }}>
                                ₹{item.quantity * item.price}
                              </Text>
                            </View>
                          </View>
                        ))
                      ) : (
                        <Text style={{ fontSize: 16, color: "#777" }}>Select a Product</Text>
                      )}
                      <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%",marginTop:"20"}}>
                        <Text style={{fontSize:16}}>Total Amount   </Text>
                        <Text style={{fontSize:16}}>₹{billData.purchaseBillAmount}  </Text>
                      </View>
            </View>
        </View>
        </>
    );
};


const styles = StyleSheet.create({
  selectedProductBox: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#F5F5F5", 
      padding: 10,
      borderWidth: 1,
      borderColor: "#ddd",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3, // Adds shadow for Android
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
      fontSize: 14,
      fontWeight: "500",
      color: "#333",
    },
    customerphone: {
      fontSize: 12,
      fontWeight: "500",
      color: "gray",
    },
  container: {
      flex: 1,
      backgroundColor: "#F8F9FA",
      padding: 10,
  },
  backButton: {
      fontSize: 18,
      color: "#007BFF",
      marginBottom: 10,
  },
  title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
  },
  card: {
      backgroundColor: "white",
      padding: 15,
      borderRadius: 8,
      elevation: 3,
  },
  productCard:{
      padding:8,
      borderWidth:2,
      borderColor:"#E8E8E8",
      backgroundColor:"white"
  },
  bottomButtonContainer: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      paddingVertical: 10,
      borderRadius: 10,
    },
    actionButton: {
      backgroundColor: "#007AFF",
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
    },
});

export default PurcheseBillDetails;
