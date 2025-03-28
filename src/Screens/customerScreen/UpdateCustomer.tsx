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
import { DeleteById, fetchCustomerGetById, UpdateCustomerById } from "../../Api/customer/customerCrud";
import { showToast } from "../../constants/showToast";

const UpdateCustomer = () => {
  const route = useRoute();
  const { CustomrerById } = route.params;
  console.log("CustomrerById update", CustomrerById)
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
    if (CustomrerById) {
      setName(CustomrerById.name || "");
      setPhone(CustomrerById.phone || "");
      setEmail(CustomrerById.email || "");
      setGstin(CustomrerById.GSTIN || "");

      // Ensure billingAddressId exists before setting state
      if (CustomrerById.billingAddressId) {
        setAddress({
          building: CustomrerById.billingAddressId.flatOrBuildingNo || "",
          locality: CustomrerById.billingAddressId.areaOrLocality || "",
          city: CustomrerById.billingAddressId.city || "",
          pincode: CustomrerById.billingAddressId.pincode || "",
          state: CustomrerById.billingAddressId.state || "", // Add state if available
        });
      }
    }
  }, [CustomrerById]);

  const handleUpdate = async () => {
    const updatedCustomer: any = {
      customerId: CustomrerById._id,
      name,
      phone,
      email,
      GSTIN: gstin,
    };
  
    // Check if address exists and if any field has changed before adding billingAddress
    if (address && Object.values(address).some((value) => value !== "" && value !== null && value !== undefined)) {
      updatedCustomer.billingAddress = {
        ...(address.building && { flatOrBuildingNo: address.building }),
        ...(address.locality && { areaOrLocality: address.locality }),
        ...(address.pincode && { pincode: address.pincode }),
        ...(address.city && { city: address.city }),
        ...(address.state && { state: address.state }),
      };
    }
  
    setLoading(true);
  
    try {
      await UpdateCustomerById(updatedCustomer);
      showToast("success", "Success", "Customer updated successfully!");
      await fetchCustomerGetById(CustomrerById._id);
      navigation.goBack();
    } catch (error) {
      showToast("error", "Error", "Failed to update customer.");
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleDelete = async () => {
    Alert.alert("Confirm", "Are you sure you want to delete this customer?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const result = await DeleteById(CustomrerById._id);
            showToast("success","Success", "Customer deleted successfully!");
            navigation.navigate("BottomNavigation", { screen: "Parties" })
          } catch (error) {
            showToast("error","Error", "Failed to delete customer.");
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

export default UpdateCustomer;

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
    padding: 8,
    marginBottom: 12,
    fontSize: 14,
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
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "bold",
  },
  closeText: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 4,
    marginHorizontal:10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  deleteButtonText: { color: "#DC3545", fontWeight: "bold",fontSize:12 },
  deleteButtonActive: { borderWidth:2,borderColor:"#DC3545" },
  delelteBox:{marginHorizontal:10,marginBottom:10},
  saveButtonDisabled: { backgroundColor: "#ccc" },
  saveButton: { padding: 10, borderRadius: 5, alignItems: "center", marginTop: 10 },
});
