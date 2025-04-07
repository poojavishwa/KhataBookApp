import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ProductModal from "../ProductsScreen/ProductSaleModal";
import ServiceModal from "../ServiceScreen/ServiceModal";

const ProductServiceModal = ({ visible, onClose, onSelect, isService, selectedProducts }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'product', title: 'Product' },
    { key: 'service', title: 'Service' },
  ]);

  const ProductRoute = () => (
    <View style={styles.tabContent}>
      <ProductModal onSelect={onSelect} onClose={onClose} isService={isService} selectedProducts={selectedProducts} />
    </View>
  );

  const ServiceRoute = () => (
    <View style={styles.tabContent}>
      <ServiceModal onSelect={onSelect} onClose={onClose} isService={isService} selectedProducts={selectedProducts} />
    </View>
  );

  const renderScene = SceneMap({
    product: ProductRoute,
    service: ServiceRoute,
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: 400 }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: 'black', height: 3 }} // Black tab indicator
              style={{ backgroundColor: 'white' }}  // White tab bar background
              labelStyle={{ fontWeight: 'bold' }}  // Bold tab labels
              activeColor="black"  // Active tab text color
              inactiveColor="gray"  // Inactive tab text color
            />
          )}
          style={styles.tabView}
        />
      </View>
    </View>
  </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Modal appears from the bottom
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '100%',
    height: '80%', // Modal height (adjust as needed)
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // padding: 20,
  },
  tabView: {
    width: '100%',
  },
  tabContent: {
    flex: 1,
    padding: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign:"right"
  },
});

export default ProductServiceModal;
