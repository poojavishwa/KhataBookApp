import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EmailVerification from '../Auth/EmailVarification';
import OTPVerification from '../Auth/OTPVerification';
import BottomNavigation from '../Navigation/BottomNavigation';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateCustomer from '../Screens/customerScreen/CreateCustomer';
import CreateSupplier from '../Screens/supplierScreen/CreateSupplier';
import CreateProduct from '../Screens/ProductsScreen/CreateProduct';
import CustomerDetails from '../Screens/customerScreen/CustomerDetails';
import CreateSaleBill from '../Screens/billScreen/CreateSaleBill';
import CreatePucheseScreen from '../Screens/billScreen/CreateParcheseBill';
import ProductDetails from '../Screens/ProductsScreen/ProductDetails';
import Icon from "react-native-vector-icons/Feather";
import UpdateProduct from '../Screens/ProductsScreen/UpdateProduct';
import AddTransaction from '../Screens/customerScreen/AddTransaction';
import GotMoneyTansaction from '../Screens/customerScreen/GotMoneyTransaction';
import UpdateCustomer from '../Screens/customerScreen/UpdateCustomer';
import InvoiceScreen from '../Screens/billScreen/SaleInvoice';
import PurcheseInvoiceScreen from '../Screens/billScreen/PurcheseInvoice';
import SupplierDetails from '../Screens/supplierScreen/SupplierDetails';
import SupplierAddTransaction from '../Screens/supplierScreen/SupplierAddTransaction';
import SupplierGotMoneyTansaction from '../Screens/supplierScreen/SupplierGotMoneyTransaction';
import UpdateSupplier from '../Screens/supplierScreen/UpdateSupplier';
import SaleBillDetails from '../Screens/billScreen/SaleBillDetails';
import UpdateSaleBill from '../Screens/billScreen/UpdateSaleBill';
import PurcheseBillDetails from '../Screens/billScreen/PurcheseBillDetails';
import UpdatePurcheseBill from '../Screens/billScreen/UpdatePurcheseBill';
import CreateService from '../Screens/ServiceScreen/CreateService';
import ServiceDetails from '../Screens/ServiceScreen/ServiceDetails';
import UpdateService from '../Screens/ServiceScreen/UpdateService';
import ProductReport from '../Screens/Report/ProductReport';
import SaleBillReport from '../Screens/Report/SaleBillReport';
import PurchaseBillReport from '../Screens/Report/PurchaseBillReport';
const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await AsyncStorage.getItem("isLoggedIn");
      setIsLoggedIn(loggedIn === "true");
    };
    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={isLoggedIn ? "BottomNavigation" : "EmailVerification"}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen
            name="EmailVerification"
            component={EmailVerification}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OTPVerification"
            component={OTPVerification}
            options={{ headerShown: false }}
          />
        </>
      ) : null}
      <Stack.Screen
        name="BottomNavigation"
        component={BottomNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Add Customer" component={CreateCustomer} />
      <Stack.Screen name="Add Supplier" component={CreateSupplier} />
      <Stack.Screen name="Add Product" component={CreateProduct} />
      <Stack.Screen name="Customer Details" component={CustomerDetails}  options={{ headerShown: false }} />
      <Stack.Screen name="Supplier Details" component={SupplierDetails}  options={{ headerShown: false }} />
      <Stack.Screen name="Service Details" component={ServiceDetails}  options={{ headerShown: false }} />
      <Stack.Screen name="Add Service" component={CreateService} />
      <Stack.Screen name="Add Sale" component={CreateSaleBill} />
      <Stack.Screen name="Add Purchase" component={CreatePucheseScreen} />
      <Stack.Screen
        name="Product Details"
        component={ProductDetails}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="Update Product"
        component={UpdateProduct}
      />
        <Stack.Screen
        name="Debit Transaction"
        component={AddTransaction}
      />
        <Stack.Screen
        name="Credit Transaction"
        component={GotMoneyTansaction}
      />
        <Stack.Screen
        name="Update Customer"
        component={UpdateCustomer}
      />
      <Stack.Screen
        name="Sale Invoice"
        component={InvoiceScreen}
      />
      <Stack.Screen
        name="Purchase Invoice"
        component={PurcheseInvoiceScreen}
      />
  <Stack.Screen
        name="Supplier Debit Transaction"
        component={SupplierAddTransaction}
      />
        <Stack.Screen
        name="Supplier Credit Transaction"
        component={SupplierGotMoneyTansaction}
      />
       <Stack.Screen
        name="Update Supplier"
        component={UpdateSupplier}
      />
        <Stack.Screen
        name="Sale Bill Details"
        component={SaleBillDetails}
        options={{ headerShown: false }}
      />
        <Stack.Screen
        name="Update Sale Bill"
        component={UpdateSaleBill}
      />
        <Stack.Screen
        name="Purchase Bill Details"
        component={PurcheseBillDetails}
        options={{ headerShown: false }}
      />
         <Stack.Screen
        name="Update Purchase Bill"
        component={UpdatePurcheseBill}
      />
       <Stack.Screen
        name="Update Service"
        component={UpdateService}
      />
         <Stack.Screen
        name="Product Report"
        component={ProductReport}
      />
         <Stack.Screen
        name="Sale Bill Report"
        component={SaleBillReport}
      />
         <Stack.Screen
        name="Purchase Bill Report"
        component={PurchaseBillReport}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
