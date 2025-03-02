import React, { useState } from "react";
import { View, Text, TextInput, Switch, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native-gesture-handler";
import useProductForm from "../../Api/Product/useProductForm";

const CreateProduct = () => {
  const { submitProduct, loading } = useProductForm();
  const [itemName, setItemName] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [openingStock, setOpeningStock] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState("");
  const [taxIncluded, setTaxIncluded] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState("kg"); // Default Unit
  const [gstIn, setGstIn] = useState("");

  const selectImage = () => {
    Alert.alert("Select Image", "Choose an option", [
      { text: "Camera", onPress: () => openCamera() },
      { text: "Gallery", onPress: () => openGallery() },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const openCamera = () => {
    launchCamera({ mediaType: "photo", cameraType: "back" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = () => {
    if (!itemName || !salePrice || !purchasePrice || !imageUri) {
      Alert.alert("Please fill all required fields.");
      return;
    }

    submitProduct({
      name: itemName,
      sellingPrice: Number(salePrice) || 0,  // Ensure number type
      costPrice: Number(purchasePrice) || 0,
      openingStock: Number(openingStock) || 0,
      lowStockAlert: Number(lowStockAlert) || 0,
      gstIn: Number(gstIn) || 0,
      selectedUnit,
      productImage: imageUri,
      gstIncluded: taxIncluded,
      unit: selectedUnit,
    });
  };



  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Item Name Input */}
        <View>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item name here"
            value={itemName}
            onChangeText={setItemName} />
        </View>

        {/* Photo Button */}
        <TouchableOpacity style={styles.photoButton} onPress={selectImage}>
          <Text style={styles.photoText}>📷 Select Photo       </Text>
        </TouchableOpacity>

        {/* Display Selected Image */}
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

        {/* Unit Selection Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Select Unit:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedUnit}
              onValueChange={(itemValue) => setSelectedUnit(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Kilogram (kg)" value="kg" />
              <Picker.Item label="Gram (g)" value="g" />
              <Picker.Item label="Liter (li)" value="li" />
              <Picker.Item label="Pieces" value="pieces" />
              <Picker.Item label="Units" value="units" />
              <Picker.Item label="Mililiter(ml)" value="ml" />
            </Picker>
          </View>
        </View>

        {/* Sale & Purchase Price */}
        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Sale Price</Text>
            <TextInput
              style={styles.input}
              placeholder="₹ Enter Sale Price"
              keyboardType="numeric"
              value={salePrice}
              onChangeText={setSalePrice}
            />
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.label}>Purchase Price</Text>
            <TextInput
              style={styles.input}
              placeholder="₹ Enter Purchase Price"
              keyboardType="numeric"
              value={purchasePrice}
              onChangeText={setPurchasePrice}
            />
          </View>
        </View>

        {/* Tax Included Switch */}
        <View style={styles.switchRow}>
          <Text>Tax included</Text>
          <Switch value={taxIncluded} onValueChange={setTaxIncluded} />
        </View>

        {/* Stock Inputs */}
        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Opening Stock</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Opening Stock"
              keyboardType="numeric"
              value={openingStock}
              onChangeText={setOpeningStock}
            />
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.label}>Low Stock Alert</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Low Stock Alert"
              keyboardType="numeric"
              value={lowStockAlert}
              onChangeText={setLowStockAlert}
            />
          </View>
        </View>

        <View>
          <Text style={styles.label}>GST%</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter GST%"
            value={gstIn}
            onChangeText={setGstIn}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading ? styles.saveButtonDisabled : styles.saveButtonActive]}
          onPress={handleSubmit} disabled={loading}
        >
          <Text style={styles.saveButtonText}>{loading ? "Saving..." : "SAVE ITEM"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  // input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 },
  photoButton: { alignItems: "center", padding: 10, backgroundColor: "#e0e0e0", borderRadius: 5, marginBottom: 10 },
  photoText: { color: "black" },
  image: { width: 100, height: 100, borderRadius: 5, alignSelf: "center", marginTop: 10 },
  row: { flexDirection: "row" },
  halfInput: { width: "48%" },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
  dropdownContainer: { marginBottom: 10 },
  dropdownLabel: { fontSize: 16, marginBottom: 5, fontWeight: "500" },
  saveButton: { padding: 15, borderRadius: 5, alignItems: "center", marginTop: 10 },
  saveButtonActive: { backgroundColor: "#007bff" },
  saveButtonDisabled: { backgroundColor: "#ccc" },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    overflow: "hidden", // Ensures the border applies correctly
  },
  picker: {
    height: 50,
    width: "100%",
  },
  inputContainer: {
    width: "48%", // Ensure proper spacing in the row
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  gridItem: {
    width: "48%", // Ensures two items per row
  },
  gstContainer: {

  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginBottom: 10
  },
});

export default CreateProduct;
