import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomerModal from "../customerScreen/CustomerModal";
import { saveBillToServer } from "../../Api/billCrud/BillCrud";
import ProductModal from "../ProductsScreen/ProductSaleModal";

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

  const saveBill = async () => {
    setIsSaving(true);
    if (!selectedCustomer || !selectedCustomer._id) {
      Alert.alert("Error", "Please select a customer.");
      setIsSaving(false);
      return;
    }

    if (selectedProducts.length === 0) {
      Alert.alert("Error", "Please select at least one product.");
      setIsSaving(false);
      return;
    }

    try {
      await saveBillToServer(
        billNumber,
        date,
        selectedCustomer,
        selectedProducts.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod
      );

      navigation.navigate("Sale Invoice", {
        billNumber,
        date,
        selectedCustomer,
        selectedProducts,
        totalAmount,
        paymentMethod,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to save the bill. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <View>
            <Text style={{ fontSize: 16 }}>Sale Bill Number:</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold", borderWidth: 1, padding: 10 }}>{billNumber}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 16 }}>Select Date:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, padding: 10 }}>
              <Text style={{ fontSize: 16 }}>📅</Text>
              <Text style={{ fontSize: 16, marginLeft: 5 }}>{date.toDateString()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker value={date} mode="date" display="default" onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }} />
        )}

        <Text style={{ fontSize: 16, marginTop: 20 }}>Bill To:</Text>
        <TouchableOpacity onPress={() => setCustomerModalVisible(true)} style={{ borderWidth: 1, padding: 10, marginTop: 5, borderRadius: 5 }}>
          <Text>{selectedCustomer?.name || "Select a Customer"}</Text>
          <Text>{selectedCustomer?.phone || "Select a Customer"}</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 16, marginTop: 20 }}>Items:</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.productContainer}>
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
                onPress={saveBill}
                disabled={isSaving} // Disable when saving
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ color: "white", fontSize: 16 }}>Updated Bill    </Text>
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
  selectedProductBox: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#f8f9fa", padding: 10, marginVertical: 5, borderRadius: 8 },
  productName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  productDetails: { fontSize: 14, color: "#555" },
  productPrice: { fontSize: 16, fontWeight: "bold", color: "#007AFF" },
  totalContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 30, padding: 10, borderColor: "gray", borderWidth: 1 },
  totalText: { fontSize: 20, fontWeight: "bold" },
  totalAmount: { fontSize: 20, fontWeight: "bold", color: "green" },
  actionButton: { backgroundColor: "#007AFF", padding: 15, borderRadius: 8, alignItems: "center" },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
});

export default UpdateSaleBill;
