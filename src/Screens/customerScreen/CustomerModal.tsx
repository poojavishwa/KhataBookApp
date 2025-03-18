import React, { useCallback, useState } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, Image, StyleSheet } from "react-native";
import { fetchProducts } from "../../Api/Product/productCrud";
import { useFocusEffect } from "@react-navigation/native";
import { IMAGE_URL } from "../../constants/API_URL";
import { fetchCustomers } from "../../Api/customer/customerCrud";

interface ProductSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (product: string, quantity: number) => void;
}

const CustomerModal: React.FC<ProductSelectionModalProps> = ({ visible, onClose, onSelect }) => {
    const [customer, setCustomer] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await fetchCustomers();
            setCustomer(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadProducts();
        }, [])
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Add Party to your Invoice</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>✖</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Product List */}
                    <FlatList
                        data={customer}
                        keyExtractor={(item) => item._id}
                        style={{ marginTop: 10 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                            onPress={() => {
                              onSelect(item);  // Pass the selected customer object
                              onClose();       // Close the modal
                            }}
                            style={styles.productRow}
                          >
                            <Image source={require("../../assets/user.png")} style={styles.icon} />
                            <View style={styles.productDetails}>
                              <Text style={styles.productName}>{item.name}</Text>
                              <Text style={styles.productName}>{item.phone}</Text>
                            </View>
                          </TouchableOpacity>
    )}
                    />
                </View>
            </View>
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
        height: "80%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    closeButton: {
        fontSize: 18,
    },
    tabContainer: {
        flexDirection: "row",
        marginTop: 15,
    },
    tab: {
        flex: 1,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#007AFF",
        alignItems: "center",
    },
    activeTab: {
        backgroundColor: "#007AFF",
    },
    icon:{
        width:30,
        height:30,
    },
    tabText: {
        color: "#007AFF",
    },
    activeTabText: {
        color: "white",
    },
    createNewItemButton: {
        marginTop: 15,
    },
    createNewItemText: {
        color: "#007AFF",
        fontSize: 16,
    },
    productRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    productDetails: {
        flex: 1,
        marginLeft: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    productPrice: {
        fontSize: 14,
        color: "#007AFF",
    },
    productStock: {
        fontSize: 14,
        color: "#28A745",
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantityButton: {
        padding: 5,
        borderWidth: 1,
        borderColor: "#007AFF",
        borderRadius: 5,
        marginHorizontal: 5,
    },
    quantityText: {
        color: "#007AFF",
        fontSize: 20,
    },
    quantityValue: {
        fontSize: 16,
        fontWeight: "bold",
    },
    addButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#007AFF",
        borderRadius: 5,
    },
    addButtonText: {
        color: "#007AFF",
    },
});

export default CustomerModal;
