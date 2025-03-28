import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DeleteById } from "../Api/billCrud/BillCrud";
import { showToast } from "../constants/showToast";

interface HeaderProps {
    title: string;
}

const SaleBillHeader: React.FC<HeaderProps> = ({title,billData}) => {
    const navigation = useNavigation();

      const handleDelete = async () => {
        Alert.alert("Confirm", "Are you sure you want to delete this Bill?", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              try {
                const result = await DeleteById(billData._id);
                showToast("success","Success", "Bill deleted successfully!");
                navigation.goBack()
              } catch (error) {
                showToast("error","Error", "Failed to delete Bill.");
              }
            },
          },
        ]);
    
      }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image
                        source={require('../assets/back.png')} // Ensure you have this image in your assets
                        style={styles.backArrow}
                    />
                </TouchableOpacity>
                    <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.iconBox}>
            <TouchableOpacity
            style={{ marginRight: 15,marginTop:20, flexDirection: "row", justifyContent: "center", alignItems: "center" }}
            onPress={() => navigation.navigate("Update Sale Bill",{saleBillData:billData})}
            >
                <Image
                    source={require("../assets/edit.png")}
                    style={{ height: 20, width: 20,marginRight:20,}}
                />
            </TouchableOpacity>
            <TouchableOpacity
            style={{ marginRight: 15,marginTop:20, flexDirection: "row", justifyContent: "center", alignItems: "center" }}
            onPress={handleDelete}
            >
                <Image
                    source={require("../assets/bin.png")}
                    style={{ height: 20, width: 20}}
                />
            </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor:"#fff",
        height: 100,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    iconBox:{
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        marginHorizontal:10
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginTop:20
      },
      backButton: {
        marginRight: 10,
      },
      backArrow: {
        width: 20,
        height: 20,
      },
    icon: {
        position: "absolute",
        left: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default SaleBillHeader;
