import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SaleBill from '../TabScreen/BillTab/SaleBill';
import PurcheseBill from '../TabScreen/BillTab/PurcheseBill';
import Expenses from '../TabScreen/BillTab/Expenses';

const Tab = createMaterialTopTabNavigator();
const Bills = () => {
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
      tabBarIndicatorStyle: { backgroundColor: "blue" },
      tabBarActiveTintColor: "blue",
      tabBarInactiveTintColor: "gray",
    }}
  >
    <Tab.Screen name="Sale" component={SaleBill} />
    <Tab.Screen name="Purchase" component={PurcheseBill} />
    {/* <Tab.Screen name="Expenses" component={Expenses} /> */}
  </Tab.Navigator>
  )
}

export default Bills