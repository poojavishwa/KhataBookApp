import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  ReportPage: undefined;
  ProductReport: undefined;
  SaleBillReport: undefined;
  PurchaseBillReport: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const reportOptions = [
  { id: '1', title: 'Product Report', image: require('../../assets/AddProduct.png'), screen: 'Product Report' },
  { id: '2', title: 'Sale Bill Report', image: require('../../assets/receipt.png'), screen: 'Sale Bill Report' },
  { id: '3', title: 'Purchase Bill Report', image: require('../../assets/receipt.png'), screen: 'Purchase Bill Report' },
];

const ReportPage = () => {
  const navigation = useNavigation<NavigationProp>();

  const renderItem = ({ item }: { item: (typeof reportOptions)[0] }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(item.screen)}>
      <Image source={item.image} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList 
        data={reportOptions} 
        keyExtractor={item => item.id} 
        renderItem={renderItem} 
      />
    </View>
  );
};

export default ReportPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 15,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
