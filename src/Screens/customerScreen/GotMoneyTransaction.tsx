import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { showToast } from "../../constants/showToast";
import { addTransaction } from "../../Api/customer/customerCrud";

const GotMoneyTansaction = () => {
  const [amount, setAmount] = useState("");
  const route = useRoute();
   const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { userId, name } = route.params as { userId: string; name: string };
  console.log("user",userId)
  const handleSave = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      showToast("error","Invalid Amount", "Please enter a valid amount.");
      return;
    }
    setLoading(true);
    try {
      await addTransaction(userId, "credit", Number(amount));
      showToast("success","Success", `₹${amount} given to ${name} successfully!`);
      navigation.goBack();
    } catch (error) {
      showToast("error","Error", "Failed to add transaction.");
    }finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.header}> You Got ₹ {amount || "0"} from {name}</Text>
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
      disabled={loading}
      >
        <Text style={styles.saveText}>{loading ? "Saving..." : "SAVE"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GotMoneyTansaction;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
  header: { fontSize: 18, fontWeight: "bold", color: "green", marginBottom: 20 },
  input: { fontSize: 16, borderWidth: 1, padding: 15, borderRadius: 5, backgroundColor: "#fff" },
  keyboard: { flexDirection: "row", flexWrap: "wrap", marginTop: 20 },
  key: { width: "22%", margin: "1%", padding: 20, backgroundColor: "#E0E0E0", alignItems: "center", borderRadius: 5 },
  keyText: { fontSize: 20, fontWeight: "bold" },
  saveButton: { padding: 15, borderRadius: 5, marginTop: 20 },
  activeSave: { backgroundColor: "#D32F2F" },
  disabledSave: { backgroundColor: "#F8BBD0" },
  saveText: { textAlign: "center", color: "#fff", fontSize: 18 },
});
