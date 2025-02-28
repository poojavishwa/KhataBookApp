import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import AddProductButton from '../Components/AddProductFab'

const ProductsTab = () => {
  return (
    <View style={styles.container}>
    <Text style={styles.text}>Product List</Text>
    <AddProductButton/>
  </View>
  )
}

export default ProductsTab

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    marginTop: 50,
    alignSelf: "center",
    fontSize: 18,
  },
});
