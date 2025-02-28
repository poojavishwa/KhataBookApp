import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CustomersTab from "../TabScreen/CustomersTab";
import SuppliersTab from "../TabScreen/SuppliersTab";

const Tab = createMaterialTopTabNavigator();

const Parties = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
        tabBarIndicatorStyle: { backgroundColor: "blue" },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Customers" component={CustomersTab} />
      <Tab.Screen name="Suppliers" component={SuppliersTab} />
    </Tab.Navigator>
  );
};

export default Parties;
