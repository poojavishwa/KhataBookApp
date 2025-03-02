import React, { useState } from "react";
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const CreateService = () => {
    const [serviceName, setServiceName] = useState("");
    const [price, setPrice] = useState("");
    const [unit, setUnit] = useState("NOS");
    const [isTaxIncluded, setIsTaxIncluded] = useState(false);
    const [sacCode, setSacCode] = useState("");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [gst, setGst] = useState("");

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

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Service Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Service name here"
                value={serviceName}
                onChangeText={setServiceName}
            />

            {/* Photo Button */}
            <TouchableOpacity style={styles.photoButton} onPress={selectImage}>
                <Text style={styles.photoText}>📷 Select Photo       </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Service Price</Text>
            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="₹"
                        keyboardType="numeric"
                        value={price}
                        onChangeText={setPrice}
                    />
                </View>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={unit}
                        style={styles.picker}
                        onValueChange={(itemValue) => setUnit(itemValue)}
                        dropdownIconColor="#000"
                    >
                        <Picker.Item label="Kilogram (kg)" value="kg" />
                        <Picker.Item label="Gram (g)" value="g" />
                        <Picker.Item label="Liter (li)" value="li" />
                        <Picker.Item label="Pieces" value="pieces" />
                        <Picker.Item label="Units" value="units" />
                        <Picker.Item label="Milliliter (ml)" value="ml" />
                    </Picker>
                </View>
            </View>


            <View style={styles.switchContainer}>
                <Text style={styles.label}>Tax included in price</Text>
                <Switch value={isTaxIncluded} onValueChange={setIsTaxIncluded} />
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.label}>GST %</Text>
                <TextInput style={styles.input} placeholder="Enter GST %" keyboardType="numeric" value={gst} onChangeText={setGst} />
            </View>

            <TouchableOpacity style={[styles.button, !(serviceName && price) && styles.disabledButton]}>
                <Text style={styles.buttonText}>ADD SERVICE</Text>
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
});

export default CreateService;
