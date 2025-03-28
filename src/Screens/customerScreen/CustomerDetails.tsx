import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { fetchCustomerGetById, fetchUserTransactions } from "../../Api/customer/customerCrud";
import CustomerHeader from "../../Components/CustomerHeader";

const CustomerDetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { customerId, name, phone } = route.params as { customerId: string, name: string, phone: number };
    const [transactions, setTransactions] = useState<any[]>([]);
    const [getCustomrerById, setGetCustomerById] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const data = await fetchCustomerGetById(customerId);
                setGetCustomerById(data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        if (customerId) {
            fetchCustomer();
        }
    }, [customerId]); 

    const loadTransactions = async () => {
        try {
            const data = await fetchUserTransactions(customerId);
            setTransactions(data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadTransactions();
        }, [])
    );


    return (
        <View style={styles.container}>
            <CustomerHeader title="Customer Details" name={name} phone={phone} getCustomrerById={getCustomrerById}/>
            <ScrollView contentContainerStyle={styles.content}>
                {loading ? (
                    <ActivityIndicator size="large" color="#D32F2F" />
                ) : transactions.length === 0 ? (
                    <Text style={styles.noTransactions}>No transactions found.</Text>
                ) : (
                    transactions.map((transaction) => (
                        <View key={transaction._id} style={[styles.transactionItem,
                        transaction.type === "debit" ? styles.debit : styles.credit]}>
                            <View style={styles.box}>
                                <View>
                                    <Text style={styles.transactionText}>
                                        {transaction.type === "debit" ? "You Gave" : "You Got"}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.amount}>₹{transaction.amount}   </Text>
                                </View>
                            </View>

                            <Text style={styles.transactionDate}>
                                {new Date(transaction.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>
            <View style={styles.bottomButtons}>
                <TouchableOpacity style={styles.stockInButton}
                    onPress={() => navigation.navigate("Debit Transaction", { name:name, userId: customerId })}>
                    <Text style={styles.buttonText}>You Gave ₹</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.stockOutButton}
                    onPress={() => navigation.navigate("Credit Transaction", { name:name, userId: customerId })}
                >
                    <Text style={styles.buttonText}>You Got ₹</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CustomerDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    noTransactions: {
        textAlign: "center",
        fontSize: 18,
        color: "#6c757d",
        marginTop: 20,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 80, // Ensure content doesn't overlap with buttons
    },
    transactionItem: {
        padding: 15,
        borderRadius: 8,
        marginVertical: 5,
    },
    debit: {
        backgroundColor: "#FDECEA", // Light red
    },
    credit: {
        backgroundColor: "#E7F4E4", // Light green
    },
    transactionText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    transactionDate: {
        fontSize: 12,
        color: "#6c757d",
    },
    bottomButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#F8F9FA",
        padding: 10,
    },
    stockInButton: {
        backgroundColor: "#28A745",
        padding: 10,
        borderRadius: 10,
        width: "48%",
        alignItems: "center",
    },
    stockOutButton: {
        backgroundColor: "#DC3545",
        padding: 10,
        borderRadius: 10,
        width: "48%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    box: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",  // Corrects alignment issue
    },
    amount:{
        fontSize:14
    }


});
