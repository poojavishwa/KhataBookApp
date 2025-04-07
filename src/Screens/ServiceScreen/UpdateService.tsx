import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Switch, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { showToast } from "../../constants/showToast";
import { fetchProductUnits } from "../../Api/Product/productCrud";
import { fetchServiceById, submitProduct } from "../../Api/service/serviceCrud";

const UpdateService = ({ route }) => {
    const [loading, setLoading] = useState(false);
    const { service } = route.params;
    const navigation = useNavigation();
    const [serviceName, setServiceName] = useState("");
    const [price, setPrice] = useState("");
    const [taxIncluded, setTaxIncluded] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [selectedUnit, setSelectedUnit] = useState("kg");
    const [gstIn, setGstIn] = useState("");
    const [units, setunits] = useState<any[]>([]);

    useEffect(() => {
        if (service) {
            setServiceName(service.serviceName || "");
            setPrice(service.servicePrice ? service.servicePrice.toString() : "");
            setTaxIncluded(!!service.gstIncluded);
            setSelectedUnit(service.unit || "kg");
            setGstIn(service.gstPercentage ? service.gstPercentage.toString() : "");
            if (service.serviceImage) {
                setImageUri(`${service.serviceImage}`);
            }
        }
    }, [service]);


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

            formData.append("serviceId", String(service._id));
            formData.append("serviceName", serviceName);
            formData.append("servicePrice", price ? price.toString() : "0");
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
            showToast("success", "Success", "Service updated successfully!");
            fetchServiceById(service._id);
            navigation.goBack();
        } catch (error) {
            showToast("error", "Error", "Failed to update service.");
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
                    <Text style={styles.label}>Service Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter service name"
                        value={serviceName}
                        onChangeText={setServiceName}
                    />

                    <TouchableOpacity style={styles.photoButton} onPress={selectImage}>
                        <Text style={styles.photoText}>📷 Select Photo</Text>
                    </TouchableOpacity>

                    {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

                    <Text style={styles.label}>Service Price</Text>
                    <View style={styles.row}>
                        <View style={[styles.inputContainer, styles.flexItem]}>
                            <TextInput
                                placeholder="₹ Enter Price"
                                keyboardType="numeric"
                                value={price}
                                onChangeText={setPrice}
                            />
                        </View>

                        <View style={[styles.pickerContainer]}>
                            <Picker
                                selectedValue={selectedUnit}
                                onValueChange={setSelectedUnit}
                                mode="dropdown"
                            >
                                {units.map((unit) => (
                                    <Picker.Item key={unit.unitName} label={unit.unitName} value={unit.unitName} />
                                ))}
                            </Picker>
                        </View>
                    </View>


                    <View style={styles.switchRow}>
                        <Text>Tax included</Text>
                        <Switch value={taxIncluded} onValueChange={setTaxIncluded} />
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
                    <Text style={styles.saveButtonText}>{loading ? "Updating..." : "Update Service"}</Text>
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
        flex: 1,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        justifyContent: "center",
        height: 45,
    },
    picker: { height: 45, width: "100%" },
    gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 10 },
    gridItem: { width: "48%" },
    label: { fontSize: 14, fontWeight: "bold", marginBottom: 5, color: "#333" },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 6, borderRadius: 5, backgroundColor: "#fff", marginBottom: 10, fontSize: 12, },
    buttonBox: { margin: 10 },
    deleteButtonActive: { backgroundColor: "#DC3545" },
    row: {
        flexDirection: "row", alignItems: "center", gap: 10
    },
    inputContainer: {
        flex: 1,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        justifyContent: "center",
        height: 45,
    },
    flexItem: {
        flex: 1,
        marginHorizontal: 5, // Adds spacing between items
    },
});

export default UpdateService;
