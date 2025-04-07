import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import useServiceForm from "../../Api/service/useServiceForm";
import { showToast } from "../../constants/showToast";
import { fetchProductUnits } from "../../Api/Product/productCrud";

const CreateService = () => {
    const { submitProduct, loading } = useServiceForm();
    const [serviceName, setServiceName] = useState('');
    const [servicePrice, setServicePrice] = useState('');
    const [taxIncluded, setTaxIncluded] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [selectedUnit, setSelectedUnit] = useState("kg");
    const [gstIn, setGstIn] = useState("");
    const [units, setunits] = useState<any[]>([]);

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
        if (!serviceName || !servicePrice) {
            showToast("error", "Error", "Please fill all required fields.");
            return;
        }

        submitProduct({
            serviceName: serviceName,
            servicePrice: Number(servicePrice) || 0,
            gstIn: Number(gstIn) || 0,
            serviceImage: imageUri,
            gstIncluded: taxIncluded,
            unit: selectedUnit,
        });
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
        <View style={styles.container}>
            <Text style={styles.label}>Service Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Service name"
                value={serviceName}
                onChangeText={setServiceName}
            />

            {/* Photo Button */}
            <TouchableOpacity style={styles.photoButton} onPress={selectImage}>
                <Text style={styles.photoText}>📷 Select Photo       </Text>
            </TouchableOpacity>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

            <Text style={styles.label}>Service Price</Text>
            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="₹Enter Price"
                        keyboardType="numeric"
                        value={servicePrice}
                        onChangeText={setServicePrice}
                    />
                </View>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedUnit}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedUnit(itemValue)}
                        dropdownIconColor="#000"
                    >
                        {units.map((unit) => (
                            <Picker.Item key={unit.unitName} label={unit.unitName} value={unit.unitName} />
                        ))}
                    </Picker>
                </View>
            </View>


            <View style={styles.switchContainer}>
                <Text>Tax included</Text>
                <Switch value={taxIncluded} onValueChange={setTaxIncluded} />
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

            <TouchableOpacity style={[styles.button, !(serviceName && servicePrice) && styles.disabledButton]}
                onPress={handleSubmit} disabled={loading}
            >
                <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Add Service"}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#F8F8F8" },
    label: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
    input: { backgroundColor: "#fff", padding: 10, borderRadius: 5, marginBottom: 10, borderWidth: 1, borderColor: "#ccc" },
    row: {
        flexDirection: "row", alignItems: "center", gap: 10
    },
    photoButton: { alignItems: "center", padding: 10, backgroundColor: "#e0e0e0", borderRadius: 5, marginBottom: 10 },
    photoText: { color: "black" },
    picker: { width: 120 },
    switchContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
    button: { backgroundColor: "#0055A4", padding: 15, borderRadius: 5, alignItems: "center", marginTop: 20 },
    disabledButton: { backgroundColor: "#ccc" },
    buttonText: { color: "#fff", fontWeight: "bold" },
    image: { width: 100, height: 100, borderRadius: 5, alignSelf: "center", marginTop: 10 },
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
    pickerContainer: {
        flex: 1,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        justifyContent: "center",
        height: 45,
    },
    saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});

export default CreateService;
