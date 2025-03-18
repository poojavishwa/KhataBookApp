import React from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from "react-native";

const ProductStockModal = ({ modalVisible, setModalVisible, selectedProduct }) => {
    return (
        <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            Stock {selectedProduct?.type}
                        </Text>
                        <Text style={styles.modalSubtitle}>
                            Enter quantity for {selectedProduct?.name}
                        </Text>
                        <TextInput
                            style={styles.quantityInput}
                            keyboardType="numeric"
                            placeholder="Enter quantity"
                        />
                        <Text style={styles.modalText}>
                            Sale Price: ₹ {selectedProduct?.sellingPrice}
                        </Text>

                        <TouchableOpacity
                            style={styles.stockOutButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>STOCK {selectedProduct?.type}</Text>
                        </TouchableOpacity>
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
        height: "30%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 10,
    },
    quantityInput: {
        fontSize: 24,
        fontWeight: "bold",
        borderBottomWidth: 2,
        borderBottomColor: "#000",
        width: "50%",
        textAlign: "center",
        marginBottom: 20,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    stockOutButton: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default ProductStockModal;
