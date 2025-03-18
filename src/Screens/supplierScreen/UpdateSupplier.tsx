import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { DeleteById, fetchSupplierGetById, UpdateCustomerById } from "../../Api/supplier/supplierCrud";

const UpdateSupplier = () => {
  const route = useRoute();
  const { supplierById } = route.params;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gstin, setGstin] = useState("");
  const [address, setAddress] = useState({
    building: "",
    locality: "",
    pincode: "",
    city: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (supplierById) {
      setName(supplierById.name || "");
      setPhone(supplierById.phone || "");
      setEmail(supplierById.email || "");
      setGstin(supplierById.GSTIN || "");

      // Ensure billingAddressId exists before setting state
      if (supplierById.billingAddressId) {
        setAddress({
          building: supplierById.billingAddressId.flatOrBuildingNo || "",
          locality: supplierById.billingAddressId.areaOrLocality || "",
          city: supplierById.billingAddressId.city || "",
          pincode: supplierById.billingAddressId.pincode || "",
          state: supplierById.billingAddressId.state || "",
        });
      }
    }
  }, [supplierById]);

  const handleUpdate = async () => {
    const updatedCustomer = {
      supplierId: supplierById._id,
      name,
      phone,
      email,
      GSTIN: gstin,
      billingAddress: {
        flatOrBuildingNo: address.building,
        areaOrLocality: address.locality,
        pincode: address.pincode,
        city: address.city,
        state: address.state,
      },
    };

    setLoading(true);
    try {
      await UpdateCustomerById(updatedCustomer);
      Alert.alert("Success", "Supplier updated successfully!");
      await fetchSupplierGetById(supplierById._id);
      navigation.goBack();
    } catch (error) {
      console.error("Error updating supplier:", error);
      Alert.alert("Error", "Failed to update supplier.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Confirm", "Are you sure you want to delete this supplier?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const result = await DeleteById(supplierById._id);
            Alert.alert("Success", "supplier deleted successfully!");
            navigation.navigate("BottomNavigation", { screen: "Parties" })
          } catch (error) {
            Alert.alert("Error", "Failed to delete supplier.");
          }
        },
      },
    ]);

  }

  return (
    <>
      <ScrollView style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="numeric"
          value={phone}
          onChangeText={setPhone}
        />

        {!showAdditionalFields ? (
          <TouchableOpacity
            onPress={() => setShowAdditionalFields(true)}
            style={styles.optionalTextContainer}
          >
            <Text style={styles.optionalText}>+ Add GSTIN and Address (Optional)</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setShowAdditionalFields(false)}
            style={styles.optionalTextContainer}
          >
            <Text style={styles.closeText}>- Hide GSTIN and Address</Text>
          </TouchableOpacity>
        )}

        {showAdditionalFields && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="GSTIN (Optional)"
              value={gstin}
              onChangeText={setGstin}
            />
            <Text style={styles.subHeading}>Billing Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Flat / Building Number"
              value={address.building}
              onChangeText={(text) => setAddress({ ...address, building: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Area / Locality"
              value={address.locality}
              onChangeText={(text) => setAddress({ ...address, locality: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              keyboardType="numeric"
              value={address.pincode}
              onChangeText={(text) => setAddress({ ...address, pincode: text })}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="City"
                value={address.city}
                onChangeText={(text) => setAddress({ ...address, city: text })}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="State"
                value={address.state}
                onChangeText={(text) => setAddress({ ...address, state: text })}
              />
            </View>
          </>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText} onPress={handleUpdate}>Update Customer</Text>
        )}
      </TouchableOpacity>
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

export default UpdateSupplier;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  optionalTextContainer: {
    marginBottom: 12,
  },
  optionalText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
  },
  closeText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal:10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButtonText: { color: "#DC3545", fontWeight: "bold" },
  deleteButtonActive: { borderWidth:2,borderColor:"#DC3545" },
  delelteBox:{marginHorizontal:10,marginBottom:10},
  saveButtonDisabled: { backgroundColor: "#ccc" },
  saveButton: { padding: 15, borderRadius: 5, alignItems: "center", marginTop: 10 },
});
