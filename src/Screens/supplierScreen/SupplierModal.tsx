import React, { useCallback, useState } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, Image, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { IMAGE_URL } from "../../constants/API_URL";
import { fetchSupplier } from "../../Api/supplier/supplierCrud";

interface ProductSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (product: string, quantity: number) => void;
}

const SupplierModal: React.FC<ProductSelectionModalProps> = ({ visible, onClose, onSelect }) => {
    const navigation = useNavigation();
    const [supplier, setSupplier] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await fetchSupplier();
            setSupplier(data);
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
                    {supplier.length > 0 ? (<FlatList
                        data={supplier}
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
                    />) : (
                        <View style={[styles.emptyContainer]}>
                            <View style={styles.centerContent}>
                                <Text style={styles.emptyText}>No supplier found   </Text>
                                <TouchableOpacity onPress={() => navigation.navigate("Add Supplier")}>
                                    <Text style={{ color: "blue", marginTop: 6, fontSize: 14, textAlign: "center" }}>
                                        + ADD NEW PARTY   </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
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
    icon: {
        width: 30,
        height: 30,
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
        fontSize: 14,
        // fontWeight: "bold",
    },
    productPrice: {
        fontSize: 12,
        // color: "#007AFF",
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
    emptyContainer: {
        flex: 1,
    justifyContent: "center",
    alignItems: "center",  
    },
    emptyText: {
        fontSize: 16,
        color: "gray",
        textAlign: "center",
        marginBottom:10,
    },
    addCustomerButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    addCustomerText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    centerContent: {
        alignItems: "center",
      },
});


export default SupplierModal;
