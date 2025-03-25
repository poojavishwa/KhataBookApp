import { View, Text, StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'
import { fetchSupplierTotal } from '../../Api/supplier/supplierCrud';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SupplierTotalHead = () => {
     const [supplier, setSupplier] = useState<any[]>([]);
            console.log("supplier",supplier)
          const loadCustomers = async () => {
            try {
              
              const data = await fetchSupplierTotal();
              setSupplier(data);
            } catch (error) {
              console.error("Error fetching customers:", error);
            }
          };
        
          useFocusEffect(
            useCallback(() => {
              loadCustomers();
            }, [])
          );
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text>You Will Give    </Text>
                <Text style={styles.total}>{supplier?.totals?.youWillGive}     </Text>
            </View>
            <View style={styles.box1}>
                <Text>You Will Get     </Text>
                <Text style={styles.total}>{supplier?.totals?.youWillGet}     </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius:20,
        backgroundColor: "#EFEFEF",
        height: 85,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        marginBottom:10,
    },
    box: {
        borderRadius:15,
        width: "50%",
        padding: 10,
        backgroundColor: "#FF8A8A",
        alignItems: "center"
    },
    box1: {
        borderRadius:15,
        width: "50%",
        padding: 10,
        backgroundColor: "#A0D683",
        alignItems: "center",
        marginLeft: 10,
    },
    total:{
      marginTop:5
    }

});

export default SupplierTotalHead