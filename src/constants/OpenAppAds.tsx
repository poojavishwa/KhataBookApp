import { AppOpenAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-9070914924630643/8099945315';

let appOpenAd: AppOpenAd | null = null;

export const loadAppOpenAd = () => {
    appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
    });

    appOpenAd.load();
};

export const showAppOpenAd = () => {
    if (appOpenAd && appOpenAd.loaded) {
        appOpenAd.show();
    }
};
