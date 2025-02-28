import React, { useState } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const CreateProduct = () => {
  const [itemName, setItemName] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [openingStock, setOpeningStock] = useState('');
  const [lowStockAlert, setLowStockAlert] = useState('');
  const [taxIncluded, setTaxIncluded] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const selectImage = () => {
    Alert.alert('Select Image', 'Choose an option', [
      {
        text: 'Camera',
        onPress: () => openCamera(),
      },
      {
        text: 'Gallery',
        onPress: () => openGallery(),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Open Camera
  const openCamera = () => {
    launchCamera({ mediaType: 'photo', cameraType: 'back' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  // Open Gallery
  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Item</Text>

      {/* Item Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter item name here"
        value={itemName}
        onChangeText={setItemName}
      />

      {/* Photo Button */}
      <TouchableOpacity style={styles.photoButton} onPress={selectImage}>
        <Text style={styles.photoText}>📷 Photo</Text>
      </TouchableOpacity>

      {/* Display Selected Image */}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {/* Sale & Purchase Price */}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="₹ Enter price"
          keyboardType="numeric"
          value={salePrice}
          onChangeText={setSalePrice}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="₹ Enter price"
          keyboardType="numeric"
          value={purchasePrice}
          onChangeText={setPurchasePrice}
        />
      </View>

      {/* Tax Included Switch */}
      <View style={styles.switchRow}>
        <Text>Tax included</Text>
        <Switch value={taxIncluded} onValueChange={setTaxIncluded} />
      </View>

      {/* Stock Inputs */}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Enter count"
          keyboardType="numeric"
          value={openingStock}
          onChangeText={setOpeningStock}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Enter count"
          keyboardType="numeric"
          value={lowStockAlert}
          onChangeText={setLowStockAlert}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, itemName ? styles.saveButtonActive : styles.saveButtonDisabled]}
        disabled={!itemName}
      >
        <Text style={styles.saveButtonText}>SAVE ITEM</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },
  photoButton: { alignItems: 'center', padding: 10, backgroundColor: '#e0e0e0', borderRadius: 5, marginBottom: 10 },
  photoText: { color: '#007bff' },
  image: { width: 100, height: 100, borderRadius: 5, alignSelf: 'center', marginTop: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  saveButton: { padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  saveButtonActive: { backgroundColor: '#007bff' },
  saveButtonDisabled: { backgroundColor: '#ccc' },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default CreateProduct;
