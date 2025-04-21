import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

type DiscountType = 'percentage' | 'rupee';

interface EditPriceModalProps {
    visible: boolean;
    onClose: () => void;
    item: any;
    onSave: (updated: {
        sellingPrice: number;
        servicePrice:number;
        discount: number;
        discountType: DiscountType
    }) => void;
}

const EditPriceModal: React.FC<EditPriceModalProps> = ({ visible, onClose, item, onSave }) => {
    const [price, setPrice] = useState(item.sellingPrice|| item.servicePrice);
    const [discount, setDiscount] = useState(item.discount || 0);
    const [discountType, setDiscountType] = useState<DiscountType>(item.discountType || 'rupee');

    useEffect(() => {
        setPrice(item.sellingPrice||item.servicePrice);
        setDiscount(0);
    }, [item]);



    const finalPrice = discountType === 'percentage'
        ? price - (price * discount) / 100
        : price - discount;

        const handleSave = () => {
            const isService = !!item.servicePrice;
            onSave({
                sellingPrice: isService ? 0 : price,
                servicePrice: isService ? price : 0,
                discount,
                discountType,
            });
            onClose();
        };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>{item.name}</Text>

                    <Text>Sale Price</Text>
                    <TextInput
                        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginVertical: 8 }}
                        keyboardType="numeric"
                        value={String(price)}
                        onChangeText={(val) => setPrice(Number(val))}
                    />
                    <View style={styles.container2}>
                        <Text style={styles.label}>Item Discount</Text>

                        <View style={styles.row}>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={String(discount)}
                                onChangeText={(val) => setDiscount(Number(val))}
                            />

                            <View style={styles.toggleContainer}>
                                <TouchableOpacity
                                    style={[styles.toggle, discountType === 'rupee' && styles.activeToggle]}
                                    onPress={() => setDiscountType('rupee')}
                                >
                                    <Text style={[discountType === 'rupee' && styles.activeToggleText]}>₹</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.toggle, discountType === 'percentage' && styles.activeToggle]}
                                    onPress={() => setDiscountType('percentage')}
                                >
                                    <Text style={[discountType === 'percentage' && styles.activeToggleText]}>%</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>



                    <View style={styles.table}>
                        <View style={styles.row}>
                            <Text style={styles.cellLabel}>Rate  </Text>
                            <Text style={styles.cellValue}>₹{finalPrice.toFixed(2)}  </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={[styles.cellLabel, { fontWeight: 'bold' }]}>Total</Text>
                            <Text style={[styles.cellValue, { fontWeight: 'bold' }]}>₹{finalPrice.toFixed(2)}  </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={[styles.cellLabel, { color: 'green' }]}>Discount  </Text>
                            <Text style={[styles.cellValue, { color: 'green' }]}>
                                {discountType === 'percentage'
                                    ? `${discount}% (₹${((price * discount) / 100).toFixed(2)})`
                                    : `₹${discount.toFixed(2)}`}
                            </Text>
                        </View>
                    </View>


                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Text style={{ color: 'white' }}>SAVE  </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Text style={{ fontSize: 18 }}>X</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default EditPriceModal;

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
    container: { backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    saveBtn: { backgroundColor: '#007AFF', padding: 12, alignItems: 'center', borderRadius: 8, marginTop: 10 },
    closeBtn: { position: 'absolute', right: 15, top: 15 },
    table: {
        borderTopWidth: 1,
        borderColor: '#ccc',
        marginTop: 15,
        paddingTop: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10, // optional spacing
    },
    cellLabel: {
        fontSize: 16,
        color: '#555',
    },
    cellValue: {
        fontSize: 16,
        color: '#111',
    },
    container2: {
        marginVertical: 10,
    },

    label: {
        fontSize: 16,
        marginBottom: 8,
    },

    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },

    toggleContainer: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        overflow: 'hidden',
    },

    toggle: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
    },

    activeToggle: {
        backgroundColor: '#2196F3',
    },
    activeToggleText: {
        color: 'white',
        fontWeight: 'bold',
    },


});
