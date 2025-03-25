import { View, Text, StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'
import { fetchCustomerTotal } from '../../Api/customer/customerCrud';
import { useFocusEffect } from '@react-navigation/native';

const CustomerTotalHead = () => {
        const [customers, setCustomers] = useState<any[]>([]);
        console.log("customers",customers)
      const loadCustomers = async () => {
        try {
          const data = await fetchCustomerTotal();
          setCustomers(data);
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
                <Text style={styles.total}>{customers?.totals?.youWillGive}    </Text>
            </View>
            <View style={styles.box1}>
                <Text>You Will Get     </Text>
                <Text style={styles.total}>{customers?.totals?.youWillGet}     </Text>
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

export default CustomerTotalHead