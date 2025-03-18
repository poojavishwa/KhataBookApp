import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
    title: string;
}

const SupplierHeader: React.FC<HeaderProps> = ({ title,name ,phone,getSupplierById}) => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image
                        source={require('../assets/back.png')} // Ensure you have this image in your assets
                        style={styles.backArrow}
                    />
                </TouchableOpacity>
                <View style={styles.detailsBox}>
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.phone}>{phone}</Text>
                </View>
            </View>
            <TouchableOpacity
                style={{ marginRight: 15, flexDirection: "row", justifyContent: "center", alignItems: "center" }}
                onPress={() => navigation.navigate("Update Supplier",{supplierById:getSupplierById})}
            >
                <Image
                    source={require("../assets/edit.png")}
                    style={{ height: 20, width: 20, marginRight: 5 }}
                />
                <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>Edit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 150,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        padding: 20,
    },
    detailsBox:{

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
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
    phone: {
        fontSize: 12,
        fontWeight: "bold",
    },
});

export default SupplierHeader;
