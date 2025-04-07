import React, { useCallback, useState } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, Image, StyleSheet, Alert } from "react-native";
import { fetchProducts } from "../../Api/Product/productCrud";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { IMAGE_URL } from "../../constants/API_URL";
import { fetchServices } from "../../Api/service/serviceCrud";

interface ProductSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (product: string, quantity: number) => void;
    selectedProducts?: { serviceId: string; quantity: number }[];
}

const ServiceModal: React.FC<ProductSelectionModalProps> = ({ visible, onClose, onSelect, selectedProducts }) => {
    const navigation = useNavigation();
    const [service, setService] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<{ [key: string]: number }>({});
    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await fetchServices();
            setService(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadProducts();
            if (selectedProducts) {
                const initialCart = selectedProducts.reduce((acc, service) => {
                    acc[service.serviceId] = service.quantity;
                    return acc;
                }, {} as { [key: string]: number });
                setCart(initialCart);
            }
        }, [selectedProducts])
    );


    return (
                <View style={styles.modalContainer}>
                    {service.length > 0 ? (
                        <>
                            <FlatList
                                data={service}
                                keyExtractor={(item) => item._id}
                                style={{ marginTop: 10 }}
                                renderItem={({ item }) => {
                                    const quantity = cart[item._id] || 0;

                                    return (
                                        <View style={styles.productRow}>
                                            <Image source={{ uri: `${item.serviceImage}` }} style={styles.productImage} />

                                            <View style={styles.productDetails}>
                                                <Text style={styles.productName}>{item.serviceName}</Text>
                                                <Text style={styles.productPrice}>Service Price: ₹{item.servicePrice}</Text>
                                            </View>

                                            {/* Quantity Selector */}
                                            {quantity > 0 ? (
                                                <View style={styles.quantityContainer}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            const newQuantity = quantity - 1;
                                                            if (newQuantity === 0) {
                                                                const newCart = { ...cart };
                                                                delete newCart[item._id];
                                                                setCart(newCart);
                                                            } else {
                                                                setCart({ ...cart, [item._id]: newQuantity });
                                                            }
                                                        }}
                                                        style={styles.quantityButton}
                                                    >
                                                        <Text style={styles.quantityText}>−</Text>
                                                    </TouchableOpacity>

                                                    <Text style={styles.quantityValue}>{quantity}</Text>

                                                    <TouchableOpacity
                                                        onPress={() => setCart({ ...cart, [item._id]: quantity + 1 })}
                                                        style={styles.quantityButton}
                                                    >
                                                        <Text style={styles.quantityText}>+</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    onPress={() => setCart({ ...cart, [item._id]: 1 })}
                                                    style={styles.addButton}
                                                >
                                                    <Text style={styles.addButtonText}>ADD +</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    );
                                }}
                            />
                            <View style={styles.buttonBox}>
                                <View style={styles.totalText}>
                                    <Text>Total  </Text>
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "#007AFF" }}>
                                        ₹{Object.keys(cart).reduce((total, serviceId) => {
                                            const product = service.find((p) => p._id === serviceId);
                                            return total + (cart[serviceId] * (product ? product.servicePrice : 0));
                                        }, 0)}
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.continueButton}
                                    onPress={() => {
                                        const selectedItems = Object.keys(cart).map((serviceId) => {
                                            const product = service.find((p) => p._id === serviceId);
                                            return {
                                                serviceId: serviceId,
                                                name: product.serviceName,
                                                quantity: cart[serviceId],
                                                price: product.servicePrice,
                                                gstPercentage: product.gstPercentage,
                                            };
                                        });
                                        onSelect(selectedItems); // Send selected items to SaleBillScreen
                                        onClose();
                                    }}
                                >
                                    <Text style={styles.continueButtonText}>Continue  </Text>
                                </TouchableOpacity>


                            </View>
                        </>
                    ) : (
                        <View style={[styles.emptyContainer]}>
                            <View style={styles.centerContent}>
                                <Text style={styles.emptyText}>No Product found.</Text>
                                <TouchableOpacity onPress={() => navigation.navigate("Add Product")}>
                                    <Text style={{ color: "blue", marginTop: 6, fontSize: 14, textAlign: "center" }}>
                                        ADD NEW ITEMS   </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            
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
    continueButton: {
        margin: 8,
        marginTop:20,
        alignItems: "center",
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 20,

    },
    continueButtonText: {
        color: "white",
    },
    buttonBox: {
        marginBottom:10,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center"
    },
    totalText: {
        marginTop: 10,
        color: "black",
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

export default ServiceModal;
