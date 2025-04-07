import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native";

interface EditSaleBillModalProps {
    isVisible: boolean;
    onClose: () => void;
    billNumber: string;
    prefix: string;
    setBillDetails: (billNumber: string, prefix: string) => void;
}

const EditPurcheseBillNumberModal: React.FC<EditSaleBillModalProps> = ({  isVisible,
    onClose,
    billNumber,
    prefix,
    setBillDetails, }) => {
        const [localPrefix, setLocalPrefix] = useState(prefix || "");
        const [usePrefix, setUsePrefix] = useState(!!prefix);
        const [localBillNumber, setLocalBillNumber] = useState(billNumber || "");

        useEffect(() => {
            setLocalBillNumber(billNumber?.toString() || "");
            setLocalPrefix(prefix?.toString() || "");
            setUsePrefix(!!prefix);
        }, [billNumber, prefix]);
    
        const handleSave = () => {
            setBillDetails(localBillNumber, usePrefix ? localPrefix : ""); 
            onClose();
        };
    return (
        <Modal visible={isVisible} transparent animationType="slide">
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Edit Sale Bill Number</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>✖</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Sale Bill Number Prefix</Text>
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            onPress={() => setUsePrefix(false)}
                            style={[styles.toggleButton, !usePrefix && styles.activeButton]}
                        >
                            <Text style={[styles.toggleText, !usePrefix && styles.activeText]}>None</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setUsePrefix(true)}
                            style={[styles.toggleButton, usePrefix && styles.activeButton]}
                        >
                            <Text style={[styles.toggleText, usePrefix && styles.activeText]}>Add Prefix</Text>
                        </TouchableOpacity>
                    </View>

                    {usePrefix && (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Prefix"
                            value={localPrefix}
                            onChangeText={setLocalPrefix}
                        />
                    )}

                    <Text style={styles.label}>Sale Bill Number</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={localBillNumber}
                        onChangeText={setLocalBillNumber}
                    />

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: "35%",
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
        fontSize: 20,
        color: "#555",
    },
    label: {
        alignSelf: "flex-start",
        fontSize: 16,
        fontWeight: "bold",
        color: "#555",
        marginBottom: 5,
    },
    toggleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 15,
        marginTop: 15,
    },
    toggleButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#007AFF",
        alignItems: "center",
        marginHorizontal: 5,
    },
    activeButton: {
        backgroundColor: "#007AFF",
    },
    toggleText: {
        color: "#007AFF",
        fontWeight: "bold",
    },
    activeText: {
        color: "white",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
    },
    saveButton: {
        width: "100%",
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    saveButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default EditPurcheseBillNumberModal;
