import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './src/Routes/AppRoutes'
import Toast from "react-native-toast-message";
import BannerAdds from './src/constants/BannerAdd';
import Launcher from './src/Screens/Louncher';
import { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-9070914924630643/6032809894';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});
const App = () => {
  const [showLauncher, setShowLauncher] = useState(true);
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setIsAdLoaded(true);
    });

    interstitial.load(); // Start loading the ad

    const timer = setTimeout(() => {
      setShowLauncher(false);
      if (isAdLoaded) {
        interstitial.show(); // Show the ad after splash screen
      }
    }, 3000);

    return () => {
      clearTimeout(timer); // Cleanup
      unsubscribe(); // Remove ad event listener
    };
  }, [isAdLoaded]);

  return (
    <>
      {showLauncher ? (
        <Launcher />
      ) : (
        <NavigationContainer>
          <AppNavigator />
          <BannerAdds />
          <Toast />
        </NavigationContainer>
      )}
    </>

  )
}

export default App