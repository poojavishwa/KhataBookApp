import { View, Text } from 'react-native'
import React, { useRef } from 'react'
import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-9070914924630643/4048610542';

const BannerAdds = () => {
    const bannerRef = useRef<BannerAd>(null);
  return (
    <View>
       <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  )
}

export default BannerAdds