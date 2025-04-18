import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet } from "react-native";

const AddServiceButton = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("Add Service"); // Navigate to CreateCustomer screen
  };

  return (
    <TouchableOpacity style={styles.fab} 
    onPress={handlePress}
    >
      <Image
        source={require("../assets/addService.png")}
        style={styles.icon}
      />
      <Text style={styles.label}>Add Service</Text>
    </TouchableOpacity>
  );
};

export default AddServiceButton;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    // elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
    marginRight: 8,
  },
  label: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
