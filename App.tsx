import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './src/Routes/AppRoutes'
import Toast from "react-native-toast-message";
import BannerAdds from './src/constants/BannerAdd';
import Launcher from './src/Screens/Louncher';
import { loadAppOpenAd, showAppOpenAd } from './src/constants/OpenAppAds';

const App = () => {
  const [showLauncher, setShowLauncher] = useState(true);

  useEffect(() => {
    loadAppOpenAd();
    const timer = setTimeout(() => {
      setShowLauncher(false);
      showAppOpenAd();
    }, 3000);

    return () => {
      clearTimeout(timer); // Cleanup
    };
  }, []);

  return (
    <>
      {showLauncher ? (
        <Launcher />
      ) : (
        <NavigationContainer>
          <AppNavigator />
          <Toast />
        </NavigationContainer>
      )}
      <BannerAdds />
    </>

  )
}

export default App