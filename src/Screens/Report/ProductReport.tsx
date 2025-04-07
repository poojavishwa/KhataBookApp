import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchProductReport } from '../../Api/ReportApis/report';

const ProductReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
console.log("reportData",reportData)
  useEffect(() => {
    const fetchInitialReports = async () => {
      setLoading(true);
      const data = await fetchProductReport(); // Make sure this returns an array
      setReportData(data);  
      setLoading(false);
    };
    fetchInitialReports();
  }, []);

  // const getOutOfStockItemsCount = () => {
  //   return reportData.filter(item => item.currentStock <= 0).length;
  // };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Low Stock Summary Report</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.label}>Out of stock Items</Text>
          </View>

          {Array.isArray(reportData) && reportData.map((item, index) => (
            <View key={index} style={styles.stockCard}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.stockRow}>
                <View style={styles.stockCol}>
                  <Text style={styles.subLabel}>Current Stock</Text>
                  <Text style={styles.subValue}>{item.stock}</Text>
                </View>
                <View style={styles.stockCol}>
                  <Text style={styles.subLabel}>Low Stock level</Text>
                  <Text style={styles.subValue}>{item.LowstockAlert}</Text>
                </View>
              </View>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f6f8',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a3d62',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    // elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  stockCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stockCol: {
    flex: 1,
  },
  subLabel: {
    color: '#888',
    fontSize: 12,
  },
  subValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default ProductReport;
