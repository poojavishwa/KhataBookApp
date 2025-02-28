import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EmailVerification from '../Auth/EmailVarification';
import OTPVerification from '../Auth/OTPVerification';
import BottomNavigation from '../Navigation/BottomNavigation';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateCustomer from '../Screens/customerScreen/CreateCustomer';
import CreateSupplier from '../Screens/supplierScreen/CreateSupplier';
import CreateProduct from '../Screens/ProductsScreen/CreateProduct';

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
      </Stack.Navigator>
  );
};

export default AppNavigator;
