import React, { useCallback, useState } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, Image, StyleSheet, Alert } from "react-native";
import { fetchProducts } from "../../Api/Product/productCrud";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { IMAGE_URL } from "../../constants/API_URL";
import EditPriceModal from "../billScreen/EditPriceModal";
import EditPurchasePrice from "../billScreen/EditPurchasePrice";

interface ProductSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (product: string, quantity: number) => void;
    selectedProducts?: { productId: string; quantity: number }[];
}

const ProductPurcheseModal: React.FC<ProductSelectionModalProps> = ({ visible, onClose, onSelect, selectedProducts }) => {
    const navigation = useNavigation();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<{ [key: string]: number }>({});
    const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadProducts();
            if (selectedProducts) {
                const initialCart = selectedProducts.reduce((acc, product) => {
                    acc[product.productId] = product.quantity;
                    return acc;
                }, {} as { [key: string]: number });
                setCart(initialCart);
            }
        }, [selectedProducts])
    );

    return (
        <>
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Add Items to your Invoice</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>✖</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Product List */}
                    {products.length > 0 ?
                        (<>
                            <FlatList
                                data={products}
                                keyExtractor={(item) => item._id}
                                style={{ marginTop: 10 }}
                                renderItem={({ item }) => {
                                    const quantity = cart[item._id] || 0;

                                    return (
                                        <>
                                            <View style={styles.productRow}>
                                                <Image source={{ uri: `${IMAGE_URL}${item.productImage}` }} style={styles.productImage} />

                                                <View style={styles.productDetails}>
                                                    <Text style={styles.productName}>{item.name}</Text>
                                                    <Text style={styles.productPrice}>Purchase Price: ₹{item.costPrice}</Text>
                                                    <Text style={styles.productStock}>Stock: {item.stock}</Text>
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
                                                                    setExpandedProductId(null);
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
                                                        onPress={() => { setCart({ ...cart, [item._id]: 1 }), setExpandedProductId(item._id) }}
                                                        style={styles.addButton}
                                                    >
                                                        <Text style={styles.addButtonText}>ADD +</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                            {expandedProductId === item._id && (
                                                <View style={{
                                                    marginTop: 10,
                                                    backgroundColor: '#F1F3F5',
                                                    borderRadius: 10,
                                                    padding: 12,
                                                    width: '96%',
                                                }}>
                                                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#555' }}>Sales Price (₹)</Text>
                                                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>₹ {item.costPrice}</Text>
                                                    </View>
                                                    <View style={{ height: 1, backgroundColor: '#FFF', marginVertical: 8 }} />
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', color: '#777' }}>Item Discount</Text>
                                                        {item.discount ? (
                                                            <Text style={{ fontSize: 14, color: '#D9534F' }}>
                                                                {item.discountType === "percentage"
                                                                    ? `${item.discount}% (₹${((item.costPrice * item.discount) / 100).toFixed(2)})`
                                                                    : `₹${item.discount.toFixed(2)}`}
                                                            </Text>
                                                        ) : null}
                                                        <Text style={{ fontWeight: 'bold', color: '#777' }}>Final Price</Text>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>₹ {item.costPrice}</Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        style={{
                                                            position: 'absolute',
                                                            top: -15,
                                                            right: -10,
                                                            backgroundColor: 'white',
                                                            borderRadius: 20,
                                                            borderWidth: 2,
                                                            borderColor: '#007AFF',
                                                            padding: 4,
                                                        }}
                                                        onPress={() => {
                                                            setSelectedItem(item);
                                                            setModalVisible(true);
                                                        }}
                                                    >
                                                        <Text style={{ color: '#007AFF', fontWeight: 'bold' }}
                                                        >✏️</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </>
                                    );
                                }}
                            />
                            <View style={styles.buttonBox}>
                                <View style={styles.totalText}>
                                    <Text>Total</Text>
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "#007AFF" }}>
                                        ₹{Object.keys(cart).reduce((total, productId) => {
                                            const product = products.find((p) => p._id === productId);
                                            return total + (cart[productId] * (product ? product.costPrice : 0));
                                        }, 0)}
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.continueButton}
                                    onPress={() => {
                                        const selectedItems = Object.keys(cart).map((productId) => {
                                            const product = products.find((p) => p._id === productId);
                                            return {
                                                productId: productId,
                                                name: product.name,
                                                quantity: cart[productId],
                                                price: product.costPrice,
                                                discount: product.discount || 0,
                                                discountType: product.discountType || 'rupee',
                                                gstPercentage: product.gstPercentage,
                                                costPrice: product.costPrice,
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
                                            ADD NEW ITEMS    </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }
                </View>
            </View>
        </Modal>
        {selectedItem && (
                <EditPurchasePrice
                    visible={isModalVisible}
                    item={selectedItem}
                    onClose={() => setModalVisible(false)}
                    onSave={(updated) => {
                        setProducts(products.map((p) =>
                            p._id === selectedItem._id
                                ? {
                                    ...p,
                                    costPrice: updated.costPrice,
                                    discount: updated.discount,
                                    discountType: updated.discountType
                                }
                                : p
                        ));
                    }}
                />
            )}
        </>
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
        alignItems: "center",
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 20,

    },
    continueButtonText: {
        color: "white",
    },
    buttonBox: {
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
        marginBottom: 10,
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

export default ProductPurcheseModal;
