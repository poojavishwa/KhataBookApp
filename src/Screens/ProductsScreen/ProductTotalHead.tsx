import { View, Text, StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { fetchProductTotal } from '../../Api/Product/productCrud';

const ProductTotalHead = () => {
     const [products, setProducts] = useState<any[]>([]);

          const loadCustomers = async () => {
            try {
              const data = await fetchProductTotal();
              setProducts(data);
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
                <Text>Total Stock Value   </Text>
                <Text style={styles.total}>{products?.totals?.totalProductValue}     </Text>
            </View>
            <View style={styles.box1}>
                <Text>Total Product    </Text>
                <Text style={styles.total}>{products?.totals?.totalProducts}     </Text>
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

export default ProductTotalHead