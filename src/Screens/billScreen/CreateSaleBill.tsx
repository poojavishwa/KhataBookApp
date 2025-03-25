import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import CustomerModal from "../customerScreen/CustomerModal";
import { saveBillToServer } from "../../Api/billCrud/BillCrud";
import ProductModal from "../ProductsScreen/ProductSaleModal";
import { AdEventType, InterstitialAd, TestIds } from "react-native-google-mobile-ads";
import { showToast } from "../../constants/showToast";
import { ScrollView } from "react-native-gesture-handler";

const { height } = Dimensions.get('window');
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-9070914924630643/6032809894';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const SaleBillScreen = () => {
  const navigation = useNavigation();
  const [billNumber, setBillNumber] = useState(1);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<{ name: string; quantity: number; price: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [modalVisible, setModalVisible] = useState(false);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    const getLastBillNumber = async () => {
      const lastBill = await AsyncStorage.getItem("lastBillNumber");
      setBillNumber(lastBill ? parseInt(lastBill) + 1 : 1);
    };
    getLastBillNumber();
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setIsAdLoaded(true);
    });

    interstitial.load(); // Start loading the ad

    return () => {
      unsubscribe(); // Cleanup event listener
    };
  }, []);

  const totalAmount = selectedProducts.reduce((total, item) => total + item.quantity * item.price, 0);

  const saveBill = async () => {
    setIsSaving(true);

    if (!selectedCustomer || !selectedCustomer._id) {
      showToast("error", "Error", "Please select a customer.");
      return;
    }

    if (selectedProducts.length === 0) {
      showToast("error", "Error", "Please select at least one product.");
      return;
    }

    try {
      await saveBillToServer(
        billNumber,
        date,
        selectedCustomer,
        selectedProducts.map((item) => ({
          productId: item.productId, // Use correct productId
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod
      );

      // Show Interstitial Ad if loaded
      if (isAdLoaded) {
        interstitial.show();
        interstitial.addAdEventListener(AdEventType.CLOSED, () => {
          // Navigate to the Sale Invoice screen after ad is closed
          navigation.navigate("Sale Invoice", {
            billNumber,
            date: new Date().toISOString(),
            selectedCustomer,
            selectedProducts,
            totalAmount,
            paymentMethod,
          });
          interstitial.load(); // Load next ad for future use
        });
      } else {
        // If ad isn't ready, just navigate immediately
        navigation.navigate("Sale Invoice", {
          billNumber,
          date: new Date().toISOString(),
          selectedCustomer,
          selectedProducts,
          totalAmount,
          paymentMethod,
        });
      }
    } catch (error) {
      showToast("error", "Error", "Failed to save the bill. Please try again.");
    } finally {
      setIsSaving(false); // Ensure loading state is reset
    }
  };


  return (
    <>
    <ScrollView>
      <View style={{ padding:20 }}>
        {/* Sale Bill Number and Date in One Row */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop:5 }}>
          {/* Sale Bill Number */}
          <View>
            <Text style={{ fontSize: 14 }}>Sale Bill Number:     </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", borderWidth: 1,borderColor:"#D0DDD0", padding: 8}}>{billNumber}</Text>
          </View>

          {/* Date Picker */}
          <View>
            <Text style={{ fontSize: 14 }}>Select Date:     </Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ flexDirection: "row", alignItems: "center", borderWidth: 1,borderColor:"#D0DDD0", padding: 8 }}>
              <Text style={{ fontSize: 12 }}>📅</Text>
              <Text style={{ fontSize: 12, marginLeft: 5 }}>{date.toDateString()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Bill To (Search Party) */}
        <Text style={{ fontSize: 14, marginTop: 10 }}>Bill To:</Text>
        <TouchableOpacity
          onPress={() => setCustomerModalVisible(true)}
          style={{ borderWidth: 1, padding: 10, marginTop: 5, borderRadius: 5,borderColor:"#D0DDD0" }}
        >
          <Text>{selectedCustomer.name || "Select a Customer"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Add Customer")}>
          <Text style={{ color: "blue", marginTop: 6 ,fontSize:12 }}>+ ADD NEW PARTY</Text>
        </TouchableOpacity>

        {/* Items Section */}
        <Text style={{ fontSize: 14, marginTop: 10 }}>Items:</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            borderWidth: 1,
            borderColor: "#D0DDD0",
            padding: 10,
            marginTop: 5,
            borderRadius: 5,
          }}
        >
          {selectedProducts.length > 0 ? (
            selectedProducts.map((item, index) => (
              <View key={index} style={styles.selectedProductBox}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 10, fontWeight: "bold", color: "#333" }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 10, color: "#555" }}>
                    {item.quantity} x ₹{item.price}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 10, fontWeight: "bold", color: "#007AFF" }}>
                    ₹{item.quantity * item.price}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ fontSize: 12, color: "#777" }}>Select a Product</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Add Product")}>
          <Text style={{ color: "blue", marginTop: 6 ,fontSize:12 }}>+ ADD NEW ITEM</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 10,
            borderWidth: 1,
            padding: 10,
            borderColor: "#D0DDD0"
          }}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>Sale Bill Amount:</Text>
          <Text style={{ fontSize: 14, fontWeight: "bold", color: "green" }}>
            ₹{selectedProducts.reduce((total, item) => total + item.quantity * item.price, 0)}
          </Text>
        </View>
        {/* Payment Method Selection */}
        <Text style={{ fontSize: 14 ,fontWeight: "bold", marginTop: 10 }}>Payment Method:</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
          {["Cash", "Unpaid", "Online"].map((method) => (
            <TouchableOpacity
              key={method}
              onPress={() => setPaymentMethod(method)}
              style={[
                styles.radioButton,
                paymentMethod === method && styles.radioButtonSelected,
              ]}
            >
              <Text style={{ color: paymentMethod === method ? "#fff" : "#000" }}>{method}   </Text>
            </TouchableOpacity>
          ))}
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
            <Text style={{ color: "white", fontSize: 14 }}>Save Bill</Text>
          )}
        </TouchableOpacity>
      </View>
      </ScrollView>
      <ProductModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={(products) => setSelectedProducts(products)}
      />
      <CustomerModal
        visible={customerModalVisible}
        onClose={() => setCustomerModalVisible(false)}
        onSelect={(customer) => setSelectedCustomer(customer)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  selectedProductBox: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa", // Light gray background
    padding: 6,
    borderRadius:5,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Adds shadow for Android
  },
  radioButton: {
    padding: 6,
    borderWidth: 1,
    borderRadius: 2,
    alignItems: "center",
    width: 80,
    backgroundColor: "#f0f0f0",
  },
  radioButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  bottomButtonContainer: {
    marginHorizontal:20,
    bottom: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  actionButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },




});

export default SaleBillScreen;
