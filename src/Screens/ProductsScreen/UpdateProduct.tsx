import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Switch, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Picker } from "@react-native-picker/picker";
import useProductForm from "../../Api/Product/useProductForm";
import { IMAGE_URL } from "../../constants/API_URL";
import { DeleteById, fetchProductById, submitProduct } from "../../Api/Product/productCrud";
import { useNavigation } from "@react-navigation/native";
import { showToast } from "../../constants/showToast";

const UpdateProduct = ({ route }) => {
  const { loading } = useProductForm();
  const { product } = route.params; 
  const navigation = useNavigation();
  const [itemName, setItemName] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [openingStock, setOpeningStock] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState("");
  const [taxIncluded, setTaxIncluded] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState("kg");
  const [gstIn, setGstIn] = useState("");

  useEffect(() => {
    if (product) {
      setItemName(product.name || "");
      setSalePrice(product.sellingPrice ? product.sellingPrice.toString() : "");
      setPurchasePrice(product.costPrice ? product.costPrice.toString() : "");
      setOpeningStock(product.stock ? product.stock.toString() : "");
      setLowStockAlert(product.lowStockAlert ? product.lowStockAlert.toString() : "");
      setTaxIncluded(!!product.gstIncluded); // Ensure boolean value
      setSelectedUnit(product.unit || "kg");
      setGstIn(product.gstPercentage ? product.gstPercentage.toString() : "");
      if (product.productImage) {
        setImageUri(`${IMAGE_URL}${product.productImage}`);
      }
    }
  }, [product]);
  

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

  const handleUpdate = async () => {
    const updatedProduct = {
      productId: product._id,
      name: itemName,
      sellingPrice: Number(salePrice) || 0,  
      costPrice: Number(purchasePrice) || 0,
      stock: Number(openingStock) || 0,
      lowStockAlert: Number(lowStockAlert) || 0,
      gstPercentage: Number(gstIn) || 0,
      selectedUnit,
      gstIncluded: taxIncluded,
      unit: selectedUnit,
    };
  
    try {
      const result = await submitProduct(updatedProduct);
      showToast("success","Success", "Product updated successfully!");
      fetchProductById(product._id)
      navigation.goBack()
    } catch (error) { 
      showToast("error","Error", "Failed to update product.");
    }
  };


  

  return (
    <>
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter item name"
          value={itemName}
          onChangeText={setItemName}
        />

        <TouchableOpacity style={styles.photoButton} onPress={selectImage}>
          <Text style={styles.photoText}>📷 Select Photo</Text>
        </TouchableOpacity>

        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Select Unit:</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={selectedUnit} onValueChange={setSelectedUnit} mode="dropdown">
              <Picker.Item label="Kilogram (kg)" value="kg" />
              <Picker.Item label="Gram (g)" value="g" />
              <Picker.Item label="Liter (li)" value="li" />
              <Picker.Item label="Pieces" value="pieces" />
              <Picker.Item label="Units" value="units" />
              <Picker.Item label="Milliliter (ml)" value="ml" />
            </Picker>
          </View>
        </View>

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

        <View style={styles.switchRow}>
          <Text>Tax included</Text>
          <Switch value={taxIncluded} onValueChange={setTaxIncluded} />
        </View>

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
            keyboardType="numeric"
            value={gstIn}
            onChangeText={setGstIn}
          />
        </View>
      </View>
    </ScrollView>
    <View style={styles.buttonBox}>
    <TouchableOpacity
          style={[styles.saveButton, loading ? styles.saveButtonDisabled : styles.saveButtonActive]}
          disabled={loading}
          onPress={handleUpdate}
        >
          <Text style={styles.saveButtonText}>{loading ? "Updating..." : "UPDATE ITEM"}</Text>
        </TouchableOpacity>
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  photoButton: { alignItems: "center", padding: 10, backgroundColor: "#e0e0e0", borderRadius: 5, marginBottom: 10 },
  photoText: { color: "black" },
  image: { width: 70, height: 70, borderRadius: 5, alignSelf: "center", marginTop: 10 },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
  dropdownContainer: { marginBottom: 10 },
  dropdownLabel: { fontSize: 12, marginBottom: 4, fontWeight: "500" },
  saveButton: { padding: 10, borderRadius: 5, alignItems: "center", marginTop: 10 },
  saveButtonActive: { backgroundColor: "#007bff" },
  saveButtonDisabled: { backgroundColor: "#ccc" },
  saveButtonText: { color: "#fff", fontWeight: "bold",fontSize:12  },
  pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6,  height: 30, // Reduced height
    overflow: "hidden",
    justifyContent: "center", },
  picker: { height: 45, width: "100%" },
  gridContainer: { flexDirection: "row",flexWrap: "wrap", justifyContent: "space-between", marginBottom: 10 },
  gridItem: { width: "48%" },
  label: { fontSize: 12, fontWeight: "bold", marginBottom: 5, color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 6, borderRadius: 5, backgroundColor: "#fff", marginBottom: 10, fontSize:10, },
  buttonBox:{margin:10},
  deleteButtonActive: { backgroundColor: "#DC3545" },
});

export default UpdateProduct;
