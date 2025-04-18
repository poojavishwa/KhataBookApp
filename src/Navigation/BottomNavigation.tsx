import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Parties from '../Screens/Parties';
import Items from '../Screens/Items';
import Bills from '../Screens/Bills';
import SettingPage from '../Screens/SettingPage';
import { Image } from 'react-native';
import ReportTab from '../TabScreen/ReportTab';
import ReportPage from '../Screens/Report/ReportPage';

const PartiesIcon = require('../assets/customer.png');
const ItemsIcon = require('../assets/delivery.png');
const BillsIcon = require('../assets/receipt.png');
const SettingsIcon = require('../assets/settings.png');
const ReportIcon = require('../assets/report.png');

const Tab = createBottomTabNavigator();
const BottomNavigation = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === "Parties") {
          iconName = PartiesIcon;
        } else if (route.name === "Items") {
          iconName = ItemsIcon;
        } else if (route.name === "Bills") {
          iconName = BillsIcon;
        } else if (route.name === "Settings") {
          iconName = SettingsIcon;
        }else if (route.name === "Report") {
          iconName = ReportIcon;
        }
        return (
        <Image
        source={iconName}
        style={{ width: size, height: size, tintColor: color }}
        resizeMode="contain"
      />
    )},
      tabBarActiveTintColor: "blue",
      tabBarInactiveTintColor: "gray",
      headerStyle: {
        backgroundColor: '#fff', 
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0, 
      },
    })}
  >
    <Tab.Screen name="Parties" component={Parties} />
    <Tab.Screen name="Items" component={Items} />
    <Tab.Screen name="Bills" component={Bills} />
    <Tab.Screen name="Report" component={ReportPage} />
    <Tab.Screen name="Settings" component={SettingPage} />
  </Tab.Navigator>
  )
}

export default BottomNavigation