import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Button } from 'react-native';
import { fetchCustomerGetById, UpdateProfileById } from '../Api/profile/profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions, useNavigation } from '@react-navigation/native';
import { showToast } from '../constants/showToast';

const SettingPage = () => {
  const [customerData, setCustomerData] = useState<any>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingGst, setIsEditingGst] = useState(false);
  const [gstNumber, setGstNumber] = useState(customerData?.gstIn || "");
  const [address, setAddress] = useState({
    building: '',
    locality: '',
    pincode: '',
  });
  const navigation = useNavigation();


  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.dispatch(StackActions.replace('EmailVerification'));
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };


  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
          const data = await fetchCustomerGetById(storedUserId);
          setCustomerData(data);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchCustomer();
  }, []);

  useEffect(() => {
    if (customerData) {
      setGstNumber(customerData.gstIn || "");
      setAddress({
        building: customerData.address?.building || "",
        locality: customerData.address?.locality || "",
        pincode: customerData.address?.pincode || "",
      });
    }
  }, [customerData]);


  const handleEdit = (field: string, value: string) => {
    setEditField(field);
    setTempValue(value);
  };


  const handleSaveGst = async () => {

    try {
      await UpdateProfileById({ GSTIN: gstNumber });
      setCustomerData((prevData: any) => ({
        ...prevData,
        GSTIN: gstNumber, // Update customerData to reflect the latest value
      }));
      setIsEditingGst(false);
      showToast("success", "Success", "GST Number updated successfully!");
    } catch (error) {
      console.error("Error updating GST:", error);
      showToast("error", "Error", "Failed to update GST.");
    }
  };


  const handleSave = async (field: string) => {

    const updatedField = { [field]: tempValue };

    try {
      await UpdateProfileById({ ...updatedField }); // Send only the changed field
      setCustomerData({ ...customerData, ...updatedField });
      setEditField(null);
      showToast("success", "Success", `${field} updated successfully!`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      showToast("error", "Error", `Failed to update ${field}.`);
    }
  };

  const handleSaveAddress = async () => {

    try {
      const updatedAddress = {
        flatOrBuildingNo: address.building,
        areaOrLocality: address.locality,
        pincode: address.pincode,
      };

      await UpdateProfileById({ businessAddress: updatedAddress });

      setCustomerData((prevData: any) => ({
        ...prevData,
        businessAddressId: updatedAddress, // Ensure correct state update
      }));
      setIsEditingAddress(false);
      showToast("success", "Success", "Address updated successfully!");
    } catch (error) {
      showToast("error", "Error", "Failed to update address.");
    }
  };



  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Book Profile</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Info</Text>
        <ProfileItem
          label="Business Name"
          value={customerData?.username || "N/A"}
          field="username"
          isEditing={editField === "username"}
          tempValue={tempValue}
          setTempValue={setTempValue}
          onEdit={handleEdit}
          onSave={handleSave}
        />
        <ProfileItem
          label="Registered Number"
          value={customerData?.phoneNumber || "N/A"}
          field="phoneNumber"
          isEditing={editField === "phoneNumber"}
          tempValue={tempValue}
          setTempValue={setTempValue}
          onEdit={handleEdit}
          onSave={handleSave}
        />
        <ProfileItem
          label="Registered Email"
          value={customerData?.email || "N/A"}
          field="email"
          isEditing={editField === "email"}
          tempValue={tempValue}
          setTempValue={setTempValue}
          onEdit={handleEdit}
          onSave={handleSave}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Info</Text>
        <ProfileItem label="Business address" button onPress={() => {
          setAddress({
            building: customerData?.businessAddressId?.flatOrBuildingNo || "",
            locality: customerData?.businessAddressId?.areaOrLocality || "",
            pincode: customerData?.businessAddressId?.pincode || "",
          });
          setIsEditingAddress(true);
        }} />
        {/* Address Inside the Card */}
        {customerData?.businessAddressId && (
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              {customerData.businessAddressId.flatOrBuildingNo}, 
              {customerData.businessAddressId.areaOrLocality},
              {customerData.businessAddressId.pincode}
            </Text>
          </View>
        )}
        {isEditingAddress && (
          <View style={styles.addressForm}>
            <View style={styles.crossBox}>
              <TouchableOpacity style={styles.closeIcon} onPress={() => setIsEditingAddress(false)}>
                <Text style={styles.crossText}>X</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Flat / Building Number"
              value={address.building}
              onChangeText={(text) => setAddress({ ...address, building: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Area / Locality"
              value={address.locality}
              onChangeText={(text) => setAddress({ ...address, locality: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              keyboardType="numeric"
              value={address.pincode}
              onChangeText={(text) => setAddress({ ...address, pincode: text })}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Info</Text>
        <ProfileItem label="GSTIN" button onPress={() => {
          setGstNumber(customerData?.GSTIN || "");  // Ensure the latest value is set
          setIsEditingGst(true);
        }} />
          {customerData?.GSTIN && (
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              {customerData.GSTIN}
            </Text>
          </View>
        )}

        {isEditingGst && (
          <View style={styles.addressForm}>
            <View style={styles.crossBox}>
              <TouchableOpacity style={styles.closeIcon} onPress={() => setIsEditingGst(false)}>
                <Text style={styles.crossText}>X</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter GST Number"
              value={gstNumber}
              onChangeText={setGstNumber}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveGst}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.LogoutButton}>
        <TouchableOpacity style={styles.logoutBox} onPress={handleLogout}>
          <Text style={styles.logoutText} >Logout  </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const ProfileItem = ({
  label,
  value,
  field,
  isEditing,
  tempValue,
  setTempValue,
  onEdit,
  onSave,
  button,
  onPress
}: {
  label: string;
  value?: string;
  field?: string;
  isEditing?: boolean;
  tempValue?: string;
  setTempValue?: (text: string) => void;
  onEdit?: (field: string, value: string) => void;
  onSave?: (field: string) => void;
  button?: boolean;
  onPress?: () => void;  // Add this prop
}) => (
  <View style={styles.itemRow}>
    <View style={styles.itemTextContainer}>
      <Text style={styles.itemLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={tempValue}
          onChangeText={setTempValue}
          autoFocus
        />
      ) : (
        <Text style={styles.itemValue}>{value}</Text>
      )}
    </View>

    {button ? (
      <TouchableOpacity style={styles.addButton} onPress={onPress}>
        <Text style={styles.addButtonText}>Add Details</Text>
      </TouchableOpacity>
    ) : isEditing ? (
      <TouchableOpacity style={styles.saveButton} onPress={() => onSave && field && onSave(field)}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity style={styles.editButton} onPress={() => onEdit && field && onEdit(field, value || "")}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    )}
  </View>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  itemLabel: {
    fontSize: 14,
    color: '#666',
  },
  itemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  editButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#1E3A8A',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 6,
    backgroundColor: '#1E3A8A',
    alignItems: "center"
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1E3A8A',
  },
  addButtonText: {
    color: '#1E3A8A',
    fontWeight: 'bold',
  },
  addressForm: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  LogoutButton: {
    marginTop: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  logoutBox: {
    flexDirection: 'row',
    backgroundColor: '#EC5228',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    alignItems: "center",
  },
  closeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 10,
  },
  crossBox: {
    marginBottom: 50
  },
  crossText: {
    fontSize: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  
  addressContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  
  addressText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'left',
    lineHeight: 22,
  },
  
});

export default SettingPage;
