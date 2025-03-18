import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
    title: string;
}

const SaleBillHeader: React.FC<HeaderProps> = ({title,billData}) => {
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
                    <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.iconBox}>
            <TouchableOpacity
            onPress={() => navigation.navigate("Update Sale Bill",{saleBillData:billData})}
            >
                <Image
                    source={require("../assets/edit.png")}
                    style={{ height: 30, width: 30,marginRight:20,}}
                />
            </TouchableOpacity>
            <TouchableOpacity
            >
                <Image
                    source={require("../assets/bin.png")}
                    style={{ height: 30, width: 30}}
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
        height: 150,
        // backgroundColor: "red",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        padding: 20,
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

export default SaleBillHeader;
