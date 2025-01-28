import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  LogBox,
  Image,
  AppState,
  Platform,
} from 'react-native';
import MainNavigator from './src/navigation/MainNavigator';
import {logoScreen, splash, splash2} from './src/Assets';
import Overlay from './src/Components/Overlay';
import useReduxStore from './src/Hooks/UseReduxStore';
import {hp, wp} from './src/Config/responsive';
import {useIsFetching} from '@tanstack/react-query';
import Geolocation from '@react-native-community/geolocation';
import {fcmService} from './src/Services/Notifications';
import {fcmRegister} from './src/Redux/Action/AuthAction';
import NavigationService from './src/Services/NavigationService';
import notifee, {EventType} from '@notifee/react-native';

const App = () => {
  const [isVisible, setIsVisible] = useState(true);
  const Hide_Splash_Screen = () => {
    setIsVisible(false);
  };
  const {getState, dispatch} = useReduxStore();

  const appState = useRef(AppState.currentState);
  const {isloading} = getState('isloading');
  const {isLogin} = getState('Auth');
  const isFetching = useIsFetching();

  console.log('load', isloading);
  const time = () => {
    return 3000;
  };

  useEffect(() => {
    /* It's a function that registers the device to receive push notifications. */
    if (isLogin) {
      setTimeout(() => {
        fcmService.register(
          onRegister,
          onOpenNotification,
          appState.current,
          () => {},
        );
      }, 1000);
    }
    return () => {
      /* It's a function that unregisters the device from receiving push notifications. */
      if (isLogin) {
        fcmService.unRegister();
      }
    };
  }, [isLogin]);
  const onRegister = fcm_token => {
    console.log('fcm_token', Platform.OS, fcm_token);
    dispatch(fcmRegister(fcm_token));
  };

  const onOpenNotification = notify => {
    if (notify?.data?.payload) {
      console.log(
        'payloadDatapayloadDatapayloadDatapayloadDatapayloadData',
        payloadData,
      );
      const payloadData = JSON.parse(notify?.data?.payload);
      if (payloadData?.isRoute) {
        NavigationService.navigate(
          payloadData?.screenRoute,
          payloadData?.app_data?.id && payloadData?.app_data,
        );
      }
    } else {
      NavigationService.navigate('NotificationScreen');
    }
  };

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          const notify = detail.notification;
          if (notify?.data?.payload) {
            console.log(
              'payloadDatapayloadDatapayloadDatapayloadDatapayloadData',
              payloadData,
            );
            const payloadData = JSON.parse(notify?.data?.payload);
            if (payloadData?.isRoute) {
              NavigationService.navigate(
                payloadData?.screenRoute,
                payloadData?.app_data?.id && payloadData?.app_data,
              );
            }
          }
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  }, []);

  useEffect(() => {
    Geolocation.setRNConfiguration({
      config: {
        skipPermissionRequests: true,
        authorizationLevel: 'always' | 'whenInUse' | 'auto',
        enableBackgroundLocationUpdates: true,
        locationProvider: 'playServices' | 'android' | 'auto',
      },
    });
  }, []);

  useEffect(async () => {
    (async () => {
      LogBox.ignoreLogs([
        'VirtualizedLists should never be nested',
        'ViewPropTypes will be removed from React Native',
        'Settings is not yet supported on Android',
        'ViewPropTypes will be removed',
        "exported from 'deprecated-react-native-prop-types'.",
        'Sending...',
        'Non-serializable values were found in the navigation state',
      ]);
      LogBox.ignoreAllLogs(true);
    })();
    // await logOutFirebase();
    setTimeout(function () {
      Hide_Splash_Screen();
    }, time());
  }, []);

  // let Splash_Screen = (
  //   <View style={styles.SplashScreen_RootView}>
  //     <Image source={splash} style={styles.image}></Image>
  //   </View>
  // );

  let Splash_Screen = (
    <ImageBackground
      source={splash2}
      style={styles.SplashScreen_RootView}></ImageBackground>
  );

  return (
    <>
      {isVisible === true ? Splash_Screen : <MainNavigator />}
      {(isloading || isFetching >= 1) && <Overlay />}
      {/* <StackNavigatior />; */}
    </>
  );
};

const styles = StyleSheet.create({
  SplashScreen_RootView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  image: {
    width: wp('35'),
    resizeMode: 'contain',
    height: hp('35'),
  },
});

export default App;
