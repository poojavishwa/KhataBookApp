import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { addTransaction } from "../../Api/customer/customerCrud";
import { showToast } from "../../constants/showToast";

const AddTransaction = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const { userId, name } = route.params as { userId: string; name: string };

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      showToast("error","Invalid Amount", "Please enter a valid amount.");
      return;
    }
    setLoading(true);
    try {
      await addTransaction(userId, "debit", Number(amount));
      showToast("success","Success", `₹${amount} given to ${name} successfully!`);
      // console.log("pooja")
      navigation.goBack(); // Navigate back after adding transaction
    } catch (error) {
      showToast("error","Error", "Failed to add transaction.");
    }finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.header}> You gave ₹ {amount || "0"} to {name}</Text>
      </TouchableOpacity>

      <TextInput 
        style={styles.input} 
        placeholder="Enter amount" 
        keyboardType="numeric" 
        value={amount}
        onChangeText={setAmount} 

      />

      <TouchableOpacity style={[styles.saveButton, amount ? styles.activeSave : styles.disabledSave]}
      onPress={handleSave}
      // disabled={!amount}
      disabled={loading}
      >
        <Text style={styles.saveText}>{loading ? "Saving..." : "SAVE"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTransaction;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
  header: { fontSize: 18, fontWeight: "bold", color: "#D32F2F", marginBottom: 20 },
  input: { fontSize: 16, borderWidth: 1, padding: 15, borderRadius: 5, backgroundColor: "#fff" },
  keyboard: { flexDirection: "row", flexWrap: "wrap", marginTop: 20 },
  key: { width: "22%", margin: "1%", padding: 20, backgroundColor: "#E0E0E0", alignItems: "center", borderRadius: 5 },
  saveButton: { padding: 15, borderRadius: 5, marginTop: 20 },
  activeSave: { backgroundColor: "#D32F2F" },
  disabledSave: { backgroundColor: "#F8BBD0" },
  saveText: { textAlign: "center", color: "#fff", fontSize: 14 },
});
