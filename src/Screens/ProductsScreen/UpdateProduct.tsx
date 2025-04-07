import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Switch, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Picker } from "@react-native-picker/picker";
import { DeleteById, fetchProductById, fetchProductUnits, submitProduct } from "../../Api/Product/productCrud";
import { useNavigation } from "@react-navigation/native";
import { showToast } from "../../constants/showToast";

const UpdateProduct = ({ route }) => {
  // const { loading } = useProductForm();
  const [loading, setLoading] = useState(false);
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
  const [units, setunits] = useState<any[]>([]);
  console.log("product",product)

  useEffect(() => {
    if (product) {
      setItemName(product.name || "");
      setSalePrice(product.sellingPrice ? product.sellingPrice.toString() : "");
      setPurchasePrice(product.costPrice ? product.costPrice.toString() : "");
      setOpeningStock(product.stock ? product.stock.toString() : "");
      setLowStockAlert(product.LowstockAlert ? product.LowstockAlert.toString() : "");
      setTaxIncluded(!!product.gstIncluded); // Ensure boolean value
      setSelectedUnit(product.unit || "kg");
      setGstIn(product.gstPercentage ? product.gstPercentage.toString() : "");
      if (product.productImage) {
        setImageUri(`${product.productImage}`);
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
    try {
      setLoading(true);
      let formData = new FormData();

      formData.append("productId", String(product._id));
      formData.append("name", itemName);
      formData.append("sellingPrice", salePrice ? salePrice.toString() : "0");
      formData.append("costPrice", purchasePrice ? purchasePrice.toString() : "0");
      formData.append("stock", openingStock ? openingStock.toString() : "0");
      formData.append("LowstockAlert", lowStockAlert ? lowStockAlert.toString() : "0");
      formData.append("gstPercentage", gstIn ? gstIn.toString() : "0");
      formData.append("gstIncluded", taxIncluded ? "true" : "false");
      formData.append("unit", selectedUnit);

      if (imageUri) {
        formData.append("file", {
          uri: imageUri,
          name: "product.jpg",
          type: "image/jpeg",
        } as any);
      }
      const result = await submitProduct(formData);

      console.log("✅ Update Successful", result);
      showToast("success", "Success", "Product updated successfully!");

      fetchProductById(product._id);
      navigation.goBack();
    } catch (error) {
      showToast("error", "Error", "Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductUnits();
        setunits(data);
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };
    loadProducts();
  }, []);



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
                {units.map((unit) => (
                  <Picker.Item key={unit.unitName} label={unit.unitName} value={unit.unitName} />
                ))}
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
          <Text style={styles.saveButtonText}>{loading ? "Updating..." : "Update Item"}</Text>
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
  dropdownLabel: { fontSize: 14, marginBottom: 4, fontWeight: "500" },
  saveButton: { padding: 10, borderRadius: 5, alignItems: "center", marginTop: 10 },
  saveButtonActive: { backgroundColor: "#007bff" },
  saveButtonDisabled: { backgroundColor: "#ccc" },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  pickerContainer: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 6, height: 30, // Reduced height
    overflow: "hidden",
    justifyContent: "center",
  },
  picker: { height: 45, width: "100%" },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 10 },
  gridItem: { width: "48%" },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 5, color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 6, borderRadius: 5, backgroundColor: "#fff", marginBottom: 10, fontSize: 12, },
  buttonBox: { margin: 10 },
  deleteButtonActive: { backgroundColor: "#DC3545" },
});

export default UpdateProduct;
