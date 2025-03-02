import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { addCustomer } from "../../Api/customer/customerCrud";

const CreateCustomer = () => {
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

  const handleSubmit = async () => {
    if (!name || !phone) {
      Alert.alert("Error", "Name and Phone Number are required!");
      return;
    }

    let customerData: any = {
      name,
      phone,
      email,
      GSTIN: gstin,
    };

    // Only add billingAddress if fields are filled
    if (showAdditionalFields) {
      customerData.billingAddress = {
        flatOrBuildingNo: address.building,
        areaOrLocality: address.locality,
        pincode: address.pincode,
        city: address.city,
      };
    }

    setLoading(true);
    try {
      await addCustomer(customerData);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
      console.log("error.message", error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Customer</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateCustomer;

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
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
