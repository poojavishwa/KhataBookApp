import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import AddServiceButton from '../Components/AddServicesFab';

const Servicestab = () => {
  return (
    <View style={styles.container}>
     <Text style={styles.text}>Services List</Text>
     <AddServiceButton/>
   </View>
  )
}

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

export default Servicestab