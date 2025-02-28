import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CustomersTab from "../TabScreen/CustomersTab";
import SuppliersTab from "../TabScreen/SuppliersTab";
import ProductsTab from "../TabScreen/ProductsTab";
import Servicestab from "../TabScreen/Servicestab";

const Tab = createMaterialTopTabNavigator();

const Items = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
        tabBarIndicatorStyle: { backgroundColor: "blue" },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Products" component={ProductsTab} />
      <Tab.Screen name="Services" component={Servicestab} />
    </Tab.Navigator>
  );
};

export default Items;
