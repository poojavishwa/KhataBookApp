import React, { useState, useEffect, useRef } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    Alert
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addStock } from "../../Api/Stock/stockCrud";
import { useNavigation } from "@react-navigation/native";
import { fetchProducts } from "../../Api/Product/productCrud";
import { showToast } from "../../constants/showToast";
import { formatDate } from "../../constants/dateUtils";

const ProductStockModal = ({ modalVisible, setModalVisible, selectedProduct,refreshProducts }) => {
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [notes, setNotes] = useState("");
    const quantityInputRef = useRef(null);
    console.log("selectedProduct", selectedProduct);
    const navigation = useNavigation();

    useEffect(() => {
        if (selectedProduct) {
            setPrice(selectedProduct.type === "IN" ? selectedProduct.costPrice?.toString() || "" : selectedProduct.sellingPrice?.toString() || "");
        }
    }, [selectedProduct]);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) setDate(selectedDate);
    };

    const isActionDisabled = quantity === "" || parseInt(quantity) <= 0;

    const handleSubmit = async () => {
        if (!quantity || parseInt(quantity) <= 0) {
            showToast("error","Error", "Quantity must be greater than 0!");
            return;
        }
        const adjustedQuantity = selectedProduct?.type === "OUT" ? -Math.abs(Number(quantity)) : Number(quantity);
    
        let stockData = {
            stockChange:adjustedQuantity,
            priceAtTime: Number(price),
            movementDate: date.toISOString(), // Ensure date is sent in correct format
            note: notes
        };
    
        try {
            await addStock(stockData,selectedProduct._id);
            setQuantity("");
            setPrice("");
            setDate(new Date()); 
            setNotes("");
            setModalVisible(false);
            navigation.navigate("BottomNavigation", { screen: "Items" });
            refreshProducts();
        } catch (error) {
            showToast("error","Error", error.message);
        }
    };
    
    


    return (
        <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            {/* <TouchableWithoutFeedback> */}
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        {selectedProduct?.type === "IN" ? "Stock In" : "Stock Out"}
                    </Text>
                    <Text style={styles.modalSubtitle}>
                        {selectedProduct?.type === "IN"
                            ? "Enter quantity of purchased items"
                            : "Enter quantity of sold items"
                        }
                    </Text>

                    {/* Quantity Input */}
                    <TouchableOpacity
                        onPress={() => quantityInputRef.current?.focus()} // Focus on hidden input
                        activeOpacity={1}
                    >
                        <View style={styles.quantityContainer}>
                            <Text style={styles.quantityText}>{quantity || "0"}</Text>
                            <Text style={styles.unitText}>NOS</Text>
                        </View>
                    </TouchableOpacity>

                    <TextInput
                        ref={quantityInputRef} // Attach ref
                        style={styles.hiddenInput}
                        keyboardType="numeric"
                        placeholder="0"
                        value={quantity}
                        onChangeText={setQuantity}
                    />

                    {/* Price & Date Input */}
                    <View style={styles.row}>
                        {/* Purchase/Sale Price */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>
                                {selectedProduct?.type === "IN" ? "Purchase Price" : "Sale Price"}
                            </Text>
                            <TextInput
                                style={styles.inputBox}
                                keyboardType="numeric"
                                placeholder="Enter price"
                                value={price}
                                onChangeText={setPrice}
                            />
                        </View>

                        {/* Date */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>
                                {selectedProduct?.type === "IN" ? "Stock In Date" : "Stock Out Date"}
                            </Text>
                            <TouchableOpacity
                                style={styles.inputBox}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.inputText}>{formatDate(date)}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}

                    {/* Add Notes */}
                    <View style={styles.box}>
                        <Text style={styles.label}>Add Note (optional)</Text>
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Enter note"
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity
                        style={[styles.stockActionButton, isActionDisabled && styles.disabledButton]}
                        disabled={isActionDisabled}
                        onPress={() => {
                            handleSubmit(); // Execute function correctly
                            setModalVisible(false);
                        }}
                    >
                        <Text style={styles.buttonText}>
                            {selectedProduct?.type === "IN" ? "STOCK IN" : "STOCK OUT"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* </TouchableWithoutFeedback> */}
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 30,
        alignItems: "center",
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    modalSubtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 15,
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },
    quantityText: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#333",
    },
    unitText: {
        fontSize: 16,
        color: "#666",
        marginLeft: 5,
    },
    hiddenInput: {
        position: "absolute",
        top: -100,
        left: -100,
        width: 0,
        height: 0,
        opacity: 0,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 20,
    },
    inputWrapper: {
        flex: 1,
        marginHorizontal: 5,
    },
    label: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
    },
    inputBox: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 8,
        fontSize: 12,
        backgroundColor: "#f8f8f8",
        textAlign: "center",
    },
    inputText: {
        fontSize: 12,
        color: "#333",
    },
    box: {
        width: "100%",
        marginBottom: 20,
    },
    stockActionButton: {
        backgroundColor: "#007BFF",
        paddingVertical: 15,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default ProductStockModal;
