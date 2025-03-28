import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, PermissionsAndroid, Platform, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Share from "react-native-share";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generatePDF } from "../../Components/GeneratePdf";
import FileViewer from 'react-native-file-viewer';
import { PurchesePdfGenerate } from "../../Components/PuchesePdfGenerate";
import { showToast } from "../../constants/showToast";
import { fetchCustomerGetById } from "../../Api/profile/profile";



const PurcheseInvoice = () => {
  const route = useRoute();
  const { billNumber, date, selectedCustomer, selectedProducts, totalAmount, paymentMethod } = route.params;
  const navigation = useNavigation();
  const userName = AsyncStorage.getItem("userName");
  const phone = AsyncStorage.getItem("phone");

  const [userId, setUserId] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<any>({});
  console.log("customerData", customerData)
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
          const data = await fetchCustomerGetById(storedUserId);
          setCustomerData(data);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchCustomer();
  }, []);
  const totalGSTAmount = selectedProducts.reduce((acc, item) => {
    const basePrice = (item.costPrice * 100) / (100 + item.gstPercentage); // Price excluding GST
    const gstAmount = item.costPrice - basePrice;
    return acc + gstAmount * item.quantity; // Sum total GST
  }, 0);

  const totalBasePrice = selectedProducts.reduce((acc, item) => {
    const basePrice = (item.costPrice * 100) / (100 + item.gstPercentage); // Price excluding GST
    return acc + basePrice * item.quantity;
  }, 0);


  const gstAmount = selectedProducts.reduce(
    (acc, item) => acc + (item.costPrice * item.quantity * item.gstPercentage) / 100,
    0
  );

  const subtotalAmount = selectedProducts.reduce((acc, item) => acc + item.costPrice * item.quantity, 0) - gstAmount;
  const totalprice = subtotalAmount + gstAmount;

  const gstItems = selectedProducts.filter((item) => item.gstPercentage > 0); // Exclude non-GST items

  // if (gstItems.length === 0) return null; // If no GST items, don't render the table

  let totalBasePrice1 = 0;
  let totalGSTAmount1 = 0;
  let totalGSTPercentage = 0;

  // Calculate total base price and total GST amount for GST items
  gstItems.forEach((item) => {
    const basePrice = (item.costPrice * 100) / (100 + item.gstPercentage); // Extract base price
    const gstAmount = item.costPrice - basePrice; // GST amount
    totalBasePrice1 += basePrice;
    totalGSTAmount1 += gstAmount;
    totalGSTPercentage += (item.gstPercentage);
  });

  // const avgGSTPercentage = totalBasePrice > 0 ? totalGSTPercentage / totalBasePrice : 0;
  const halfGSTPercentage = totalGSTPercentage / 2;
  const halfGstAmount = totalGSTAmount / 2;

  const paidImageUri = require("../../assets/paid.png");
  const unpaidImageUri =require("../../assets/unpaid.png");

  const shareInvoice = async () => {
    try {
      const filePath = await PurchesePdfGenerate(
        billNumber, date, selectedCustomer, selectedProducts,
        totalBasePrice, totalGSTAmount, totalAmount, paymentMethod,
        halfGSTPercentage, halfGstAmount, totalprice,customerData
      );

      if (filePath) {
        await Share.open({
          url: `file://${filePath}`,
          type: "application/pdf",
          title: "Invoice",
          message: `Invoice #${billNumber} - Total: ₹${totalAmount}`,
        });
      } else {
        showToast("error", "Error", "Failed to share invoice.");
      }
    } catch (error) {
      console.error("Error sharing invoice:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.invoiceContainer}>
          <View>
            <Text style={styles.header}>{selectedCustomer.name}</Text>
            {selectedCustomer.billingAddressId && (
              <View>
                <Text style={styles.addressText}>Address: {selectedCustomer.billingAddressId?.flatOrBuildingNo}</Text>
                <Text style={styles.addressText}>
                  {selectedCustomer.billingAddressId?.areaOrLocality}, {selectedCustomer.billingAddressId?.city}
                </Text>
                <Text style={styles.addressText}>
                  {selectedCustomer.billingAddressId?.state}, {selectedCustomer.billingAddressId?.pincode}
                </Text>
              </View>
            )}
            {selectedCustomer.GSTIN && <Text style={styles.addressText}>GST IN :{selectedCustomer?.GSTIN}</Text>}
          </View>
          <Text style={styles.invoiceNumber}>Invoice No. {billNumber}</Text>
          <Text style={styles.invoiceDate}>Invoice Date: {new Date(date).toLocaleDateString('en-GB')}</Text>

          <View style={[styles.box, styles.customerContainer]}>
            <View>
              <Text style={styles.customerTitle}>Bill To</Text>
              <Text style={styles.customerName}>Name: {customerData?.username}    </Text>
              {customerData.businessAddressId && (
                <View>
                  <Text style={styles.customerInfo}>Address: {customerData?.businessAddressId?.flatOrBuildingNo}</Text>
                  <Text style={styles.customerInfo}>
                    {customerData?.businessAddressId?.areaOrLocality}, {customerData?.businessAddressId?.city}
                  </Text>
                  <Text style={styles.customerInfo}>
                    {customerData?.businessAddressId?.state} - {customerData?.businessAddressId?.pincode}
                  </Text>
                </View>
              )}
              {customerData.GSTIN && <Text style={styles.customerInfo}>GST IN :{customerData?.GSTIN}</Text>}
            </View>
            <View>
              <View>
              <Image source={paymentMethod === "Cash" || paymentMethod === "Online" ? paidImageUri : unpaidImageUri} style={styles.imageStyle} />
              </View>
            </View>
          </View>

          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>S.No</Text>
            <Text style={styles.tableHeaderText}>Item</Text>
            <Text style={styles.tableHeaderText}>Qty</Text>
            <Text style={styles.tableHeaderText}>Price</Text>
            <Text style={styles.tableHeaderText}>GST%</Text>
            <Text style={styles.tableHeaderText}>Total</Text>
          </View>

          {selectedProducts.map((item, index) => {
            const basePrice = (item.costPrice * 100) / (100 + item.gstPercentage); // Price excluding GST
            return (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableText}>{index + 1}</Text>
                <Text style={styles.tableText}>{item.name}</Text>
                <Text style={styles.tableText}>{item.quantity}</Text>
                <Text style={styles.tableText}>{basePrice.toFixed(2)}</Text>
                <Text style={styles.tableText}>{((item.costPrice - basePrice) * item.quantity).toFixed(2)}</Text>
                <Text style={styles.tableText}>{(item.costPrice * item.quantity).toFixed(2)}</Text>
              </View>
            );
          })}


          <View style={[styles.tableRow, styles.subtotalRow]}>
            <Text style={[styles.tableText, styles.boldText]}>Subtotal</Text>
            <Text style={styles.tableText}></Text>
            <Text style={[styles.tableText, styles.boldText]}>
              {selectedProducts.reduce((acc, item) => acc + item.quantity, 0)}
            </Text>
            <Text style={[styles.tableText, styles.boldText]}>{(totalBasePrice).toFixed(2)}</Text>
            <Text style={[styles.tableText, styles.boldText]}>{(totalGSTAmount).toFixed(2)}</Text>
            <Text style={[styles.tableText, styles.boldText]}>{totalprice.toFixed(2)}</Text>
          </View>

          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Tax Slab</Text>
            <Text style={styles.tableHeaderText}>Taxable Amount</Text>
            <Text style={styles.tableHeaderText}>Tax</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableText}>CGST {(halfGSTPercentage).toFixed(0)}%</Text>
            <Text style={styles.tableText}>{totalBasePrice.toFixed(2)}</Text>
            <Text style={styles.tableText}>{halfGstAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableText}>SGST {(halfGSTPercentage).toFixed(0)}%</Text>
            <Text style={styles.tableText}>{totalBasePrice.toFixed(2)}</Text>
            <Text style={styles.tableText}>{halfGstAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>total Amount:  </Text>
            <Text style={styles.summaryValue}>₹{totalprice.toFixed(2)} </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.buttonText}>Download Invoice (PDF)</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#25D366" }]} onPress={shareInvoice}>
          <Text style={styles.buttonText}>Share PDF on WhatsApp    </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate("Add Purchase")}>
          <Text style={styles.bottomButtonText}>Create New</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomButton, { backgroundColor: "#007bff" }]}
          onPress={() => navigation.navigate("BottomNavigation", { screen: "Bills" })}>
          <Text style={styles.bottomButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollView: { flex: 1 },
  invoiceContainer: { padding: 10, backgroundColor: "#fff", borderWidth: 1, borderColor: "#D32F2F", margin: 10, borderRadius: 8 },
  header: { fontSize: 18, fontWeight: "bold", textAlign: "right", color: "#D32F2F" },
  invoiceNumber: { fontSize: 12, fontWeight: "bold" },
  addressText: { fontSize: 10, textAlign: "right", color: "black" },
  invoiceDate: { fontSize: 12, color: "#333", marginTop: 5 },
  customerContainer: { marginTop: 15, padding: 10, backgroundColor: "#FFEDEE", borderRadius: 5 },
  customerTitle: { fontSize: 12, fontWeight: "bold", color: "#D32F2F" },
  customerName: { fontSize: 12, color: "#555" },
  customerInfo: { fontSize: 10, color: "#555" },
  totalAmount: { fontSize: 18, fontWeight: "bold", textAlign: "right", marginTop: 20 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 15 },
  actionButton: { backgroundColor: "#007bff", padding: 8, borderRadius: 5 },
  buttonText: { color: "#fff", fontSize: 10 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f0f0f0", padding: 5, marginTop: 15 },
  tableHeaderText: { flex: 1, fontSize: 8, fontWeight: "bold", textAlign: "center" },
  tableRow: { flexDirection: "row", padding: 5, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  tableText: { flex: 1, fontSize: 6, textAlign: "center" },
  bottomButtons: { flexDirection: "row", justifyContent: "space-between", padding: 8 },
  bottomButton: { backgroundColor: "#ccc", padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 5 },
  bottomButtonText: { color: "#fff", fontSize: 10, textAlign: "center" },
  subtotalRow: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 8,
  },
  summaryTable: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  summaryValue: {
    fontSize: 14,
    color: "#000",
  },
  payment: {
    fontSize: 24,
    textAlign: "right",
    color: "blue"
  },
  imageStyle: {
    width: 60,
    height: 60,
  },
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
  }


});

export default PurcheseInvoice;