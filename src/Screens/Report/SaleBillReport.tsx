import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchSaleBillReport } from '../../Api/ReportApis/report';

const SaleBillReport = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(today);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [reportData, setReportData] = useState({
        netSaleValue: 0,
        unpaidBalance: 0,
        noOfTransactions: 0,
        saleBills: [],
    });

    const [loading, setLoading] = useState(true);
    console.log("reportData", reportData)
    useEffect(() => {
        const fetchInitialReports = async () => {
            setLoading(true);
            const formattedStartDate = firstDayOfMonth.toISOString().split("T")[0];
            const formattedEndDate = today.toISOString().split("T")[0];
            const data = await fetchSaleBillReport(formattedStartDate, formattedEndDate);
            setReportData(data);
            setLoading(false);
        };
        fetchInitialReports();
    }, []);

    const onSearchPress = async () => {
        setLoading(true);
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];
        const data = await fetchSaleBillReport(formattedStartDate, formattedEndDate);
        setReportData(data);
        setLoading(false);
    };



    const handleStartDateChange = (event: any, selectedDate?: Date) => {
        setShowStartPicker(false);
        if (selectedDate) setStartDate(selectedDate);
    };

    const handleEndDateChange = (event: any, selectedDate?: Date) => {
        setShowEndPicker(false);
        if (selectedDate) setEndDate(selectedDate);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sale Bill Report</Text>

            {/* Start and End Date Fields */}
            <View style={styles.content}>
                <View style={styles.date}>
                    <Text style={styles.label}>Start Date</Text>
                    <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                        <TextInput
                            style={styles.input}
                            value={startDate.toDateString()}
                            editable={false}
                            placeholder="Select Start Date"
                        />
                    </TouchableOpacity>
                    {showStartPicker && (
                        <DateTimePicker value={startDate} mode="date" display="default"
                            onChange={handleStartDateChange}
                        />
                    )}
                </View>

                <View style={styles.date}>
                    <Text style={styles.label}>End Date</Text>
                    <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                        <TextInput
                            style={styles.input}
                            value={endDate.toDateString()}
                            editable={false}
                            placeholder="Select End Date"
                        />
                    </TouchableOpacity>
                    {showEndPicker && (
                        <DateTimePicker value={endDate} mode="date" display="default"
                            onChange={handleEndDateChange} />
                    )}
                </View>

                <View style={styles.date}>
                    <TouchableOpacity onPress={onSearchPress} style={styles.searchButton}>
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Data Section */}
            <View style={styles.dataSection}>
                <View style={styles.dataBox}>
                    <Text style={styles.dataLabel}>TRANSACTIONS</Text>
                    <Text style={styles.dataValue}>{reportData.noOfTransactions}</Text>
                </View>
                <View style={styles.dataBox}>
                    <Text style={styles.dataLabel}>NET SALE</Text>
                    <Text style={[styles.dataValue, styles.green]}>₹ {reportData.netSaleValue}</Text>
                </View>
                <View style={styles.dataBox}>
                    <Text style={styles.dataLabel}>UNPAID BALANCE</Text>
                    <Text style={[styles.dataValue, styles.green]}>₹ {reportData.unpaidBalance}</Text>
                </View>
            </View>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#007BFF" />
                </View>
            ) : reportData.length === 0 ? (
                <Text style={styles.emptyText}>No bill found.</Text>
            ) : (
                <FlatList
                    data={reportData.saleBills}
                    keyExtractor={(item, index) => item?._id?.toString() || index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.customerCard}>
                            <View>
                                <Text style={styles.customerName}>Sale Bill</Text>
                                <Text style={styles.Invoice}>Sale Bill: #{item.BillNumber}</Text>
                                <Text style={styles.customerphone}>  {new Date(item.Date).toLocaleDateString('en-GB')}</Text>
                            </View>
                            <View>
                                <Text style={styles.customerName}>₹ {item.saleBillAmount}</Text>
                                <Text
                                    style={[
                                        styles.customerName,
                                        { color: item.paymentStatus === "unpaid" ? "red" : "green" }
                                    ]}
                                >
                                    {item.paymentStatus}
                                </Text>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
};


export default SaleBillReport;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    content: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'left',
    },
    date: {
        width: "32%",
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 12,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
    },
    searchButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },

    // Data Section Styles
    dataSection: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    dataBox: {
        flex: 1,
        alignItems: 'center',
    },
    dataLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    dataValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    green: {
        color: 'green',
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
    customerCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: 8,
        marginBottom: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    customerName: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },
    customerphone: {
        fontSize: 10,
        fontWeight: "500",
        color: "gray",
    },
    Invoice: {
        marginBottom: 5,
        marginTop: 5,
        fontSize: 12,
        fontWeight: "500",
        color: "gray",
        padding: 2,
        borderWidth: 2,
        borderColor: "gray",
        borderRadius: 5
    }
});
