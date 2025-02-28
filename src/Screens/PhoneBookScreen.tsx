// PhoneBookScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, PermissionsAndroid, Platform, StyleSheet } from 'react-native';
import Contacts from 'react-native-contacts';

const PhoneBookScreen = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function requestContactsPermission() {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          loadContacts();
        } else {
          console.log("Contacts permission denied");
        }
      } else {
        loadContacts();
      }
    }

    requestContactsPermission();
  }, []);

  const loadContacts = () => {
    console.log("Contacts module before getAll:", Contacts);
if (Contacts && Contacts.getAll) {
  Contacts.getAll()
    .then(contacts => {
      console.log("Fetched contacts:", contacts);
      setContacts(contacts);
    })
    .catch(error => {
      console.log('Error loading contacts:', error.message || error);
    });
} else {
  console.log("Contacts module is not available.");
}

  };
  
  

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.recordID}
        renderItem={({ item }) => (
          <Text style={styles.contactText}>
            {item.givenName} {item.familyName}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  contactText: { fontSize: 16, paddingVertical: 10 },
});

export default PhoneBookScreen;
