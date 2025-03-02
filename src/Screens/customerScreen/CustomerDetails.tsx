import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { fetchUserTransactions } from "../../Api/customer/customerCrud";
const CustomerDetails = () => {
    const route = useRoute();
    const { userId } = route.params as { userId: string };
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const data = await fetchUserTransactions(userId);
                setTransactions(data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
            setLoading(false);
        };

        loadTransactions();
    }, [userId]);

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#007BFF" />
                </View>
            ) : transactions.length === 0 ? (
                <Text style={styles.emptyText}>No transactions found.</Text>
            ) : (
                <View style={styles.transactionCard}>
                <Text style={styles.transactionText}>Name: {transactions.name}</Text>
                <Text style={styles.transactionText}>Phone: {transactions.phone}</Text>
                <Text style={styles.transactionText}>Amount: ₹ {transactions.balance}</Text>
            </View>
            )}
        </View>
    );
};

export default CustomerDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#007BFF",
        textAlign: "center",
        marginBottom: 10,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        textAlign: "center",
        fontSize: 16,
        color: "#6C757D",
        marginTop: 20,
    },
    transactionCard: {
        backgroundColor: "white",
        padding: 15,
        marginBottom: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    transactionText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    customerCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: 15,
        marginBottom: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    customerName: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    customerphone: {
        fontSize: 12,
        fontWeight: "500",
        color: "gray",
    }
});
