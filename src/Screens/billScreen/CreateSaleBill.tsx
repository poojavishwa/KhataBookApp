import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

const SaleBillScreen = () => {
  const navigation = useNavigation();
  const [billNumber, setBillNumber] = useState(1);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch last bill number from AsyncStorage
  useEffect(() => {
    const getLastBillNumber = async () => {
      const lastBill = await AsyncStorage.getItem("lastBillNumber");
      setBillNumber(lastBill ? parseInt(lastBill) + 1 : 1);
    };
    getLastBillNumber();
  }, []);

  // Save the new bill number when creating a new bill
  const saveBill = async () => {
    await AsyncStorage.setItem("lastBillNumber", billNumber.toString());
    Alert.alert("Bill Saved Successfully!");
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Sale Bill Number and Date in One Row */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
        {/* Sale Bill Number */}
        <View>
          <Text style={{ fontSize: 16 }}>Sale Bill Number:     </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", borderWidth: 1, padding: 10 }}>{billNumber}</Text>
        </View>

        {/* Date Picker */}
        <View>
        <Text style={{ fontSize: 16 }}>Select Date:     </Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, padding: 10 }}>
          <Text style={{ fontSize: 16 }}>📅</Text>
          <Text style={{ fontSize: 16, marginLeft: 5 }}>{date.toDateString()}</Text>
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
      <Text style={{ fontSize: 16, marginTop: 20 }}>Bill To:</Text>
      <TextInput placeholder="Search from your parties" style={{ borderWidth: 1, padding: 10, marginTop: 5, borderRadius: 5 }} />

      {/* Add New Party Button (Navigates to AddNewPartyScreen) */}
      <TouchableOpacity onPress={() => navigation.navigate("Add Customer")}>
        <Text style={{ color: "blue", marginTop: 10 }}>+ ADD NEW PARTY</Text>
      </TouchableOpacity>

      {/* Items Section */}
      <Text style={{ fontSize: 16, marginTop: 20 }}>Items:</Text>
      <TextInput placeholder="Enter items from inventory" style={{ borderWidth: 1, padding: 10, marginTop: 5, borderRadius: 5 }} />

      {/* Add New Item Button (Navigates to AddProductScreen) */}
      <TouchableOpacity onPress={() => navigation.navigate("Add Product")}>
        <Text style={{ color: "blue", marginTop: 10 }}>+ ADD NEW ITEM</Text>
      </TouchableOpacity>

      {/* Sale Bill Amount */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 30, marginBottom: 30 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Sale Bill Amount:</Text>
        <TextInput placeholder="Enter Amount" style={{ borderWidth: 1, padding: 10, marginTop: 5, borderRadius: 5 }} />
      </View>

      {/* Save Button */}
      <Button title="Save Bill" onPress={saveBill} />
    </View>
  );
};

export default SaleBillScreen;
