import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { DeleteById, UpdateBillById } from "../../Api/billCrud/BillCrud";
import ProductModal from "../ProductsScreen/ProductSaleModal";
import { showToast } from "../../constants/showToast";

const UpdateSaleBill = () => {
  const route = useRoute();
  const { saleBillData } = route.params as { saleBillData: any };
  const navigation = useNavigation();
  const [billNumber, setBillNumber] = useState(1);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<{ name: string; quantity: number; price: number; productId?: string }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [modalVisible, setModalVisible] = useState(false);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>("");
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (saleBillData && Object.keys(saleBillData).length > 0) {
      setBillNumber(saleBillData.BillNumber || "1");
      setDate(saleBillData.Date ? new Date(saleBillData.Date) : new Date());
      setSelectedProducts(
        Array.isArray(saleBillData.items)
          ? saleBillData.items.map((item) => ({
              name: item.productName || item.productId?.name || "Unnamed Product",
              quantity: item.quantity || 1,
              price: item.price || 0,
              productId: item.productId?._id || "",
            }))
          : []
      );
      setPaymentMethod(saleBillData.paymentStatus || "Cash");
      setSelectedCustomer(saleBillData.customerId || "");
    }
  }, [saleBillData]);

  const totalAmount = selectedProducts.reduce((total, item) => total + item.quantity * item.price, 0);
  const billId = saleBillData._id;

 const updateBill = async () => {
  setIsSaving(true);

  if (!billId) {
    showToast("error","Error", "Invalid Bill ID. Unable to update.");
    setIsSaving(false);
    return;
  }

  if (!selectedCustomer || !selectedCustomer._id) {
    showToast("error","Error", "Please select a customer.");
    setIsSaving(false);
    return;
  }

  if (selectedProducts.length === 0) {
    showToast("error","Error", "Please select at least one product.");
    setIsSaving(false);
    return;
  }

  // Format date before sending
  const formattedDate = date.toISOString().split("T")[0]; // Converts to "YYYY-MM-DD"

  const billData = {
    billNumber,
    date: formattedDate, 
    saleBillAmount:totalAmount,
    items: selectedProducts.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
    paymentStatus:paymentMethod,
  };

  try {
    await UpdateBillById(billData, billId);
    showToast("success","Success", "Bill updated successfully!");
    navigation.navigate("Sale Invoice", {
      billId,
      billNumber,
      date: formattedDate, // Use formatted date here too
      selectedCustomer,
      selectedProducts,
      totalAmount,
      paymentMethod,
    });
  } catch (error) {
    showToast("error","Error", "Failed to update the bill. Please try again.");
  } finally {
    setIsSaving(false);
  }
};



  return (
    <>
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
          <View>
            <Text style={{ fontSize: 14 }}>Sale Bill No:    </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", borderWidth: 1, padding: 8,borderColor:"#D0DDD0" }}>{billNumber}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 14 }}>Select Date:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, padding: 8 ,borderColor:"#D0DDD0"}}>
              <Text style={{ fontSize: 12, marginLeft: 5 }}>{date.toDateString()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker value={date} mode="date" display="default" onChange={(event, selectedDate) => {
            setShowDatePicker(false); 
            if (selectedDate) setDate(selectedDate);
          }} />
        )}

        <Text style={{ fontSize: 14, marginTop: 10 }}>Bill To:</Text>
        <TouchableOpacity onPress={() => setCustomerModalVisible(true)} style={{ borderWidth: 1, padding: 10, marginTop: 5, borderRadius: 5,borderColor:"#D0DDD0" }}>
          <Text style={{ fontSize: 14 }}>{selectedCustomer?.name || "Select a Customer"}</Text>
          <Text style={{ fontSize: 12 }}>{selectedCustomer?.phone || "Select a Customer"}</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 14, marginTop: 10 }}>Items:</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}
          >
          {selectedProducts.length > 0 ? (
            selectedProducts.map((item, index) => (
              <View key={index} style={styles.selectedProductBox}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productDetails}>{item.quantity} x ₹{item.price}</Text>
                </View>
                <View>
                  <Text style={styles.productPrice}>₹{item.quantity * item.price}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ fontSize: 16, color: "#777" }}>Select a Product</Text>
          )}
        </TouchableOpacity>

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Sale Bill Amount:</Text>
          <Text style={styles.totalAmount}>₹{totalAmount}</Text>
        </View>
      </View>
      <View style={styles.bottomButtonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, isSaving && { backgroundColor: "#999" }]}
                onPress={updateBill}
                disabled={isSaving} // Disable when saving
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ color: "white", fontSize: 12 }}>Updated Bill    </Text>
                )}
              </TouchableOpacity>
            </View>
      <ProductModal visible={modalVisible} onClose={() => setModalVisible(false)}
       selectedProducts={selectedProducts} 
       onSelect={(products) => setSelectedProducts(products)}
       />
    </>
  );
};

const styles = StyleSheet.create({
  selectedProductBox: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#f8f9fa", padding: 10, marginVertical: 5, borderRadius: 5 },
  productName: { fontSize: 12, fontWeight: "bold", color: "#333" },
  productDetails: { fontSize: 12, color: "#555" },
  productPrice: { fontSize: 14, fontWeight: "bold", color: "#007AFF" },
  totalContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 30, padding: 10,borderColor: "#D0DDD0", borderWidth: 1 },
  totalText: { fontSize: 14, fontWeight: "bold" },
  totalAmount: { fontSize: 14, fontWeight: "bold", color: "green" },
  actionButton: { backgroundColor: "#007AFF", padding: 8, borderRadius: 5, alignItems: "center",fontSize:12 },
  bottomButtonContainer: {
    marginHorizontal:20,
    bottom: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
});

export default UpdateSaleBill;
