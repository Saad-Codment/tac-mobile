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
import {useIsFetching, useMutation, useQuery} from '@tanstack/react-query';
import Geolocation from '@react-native-community/geolocation';
import {fcmService} from './src/Services/Notifications';
import {fcmRegister} from './src/Redux/Action/AuthAction';
import NavigationService from './src/Services/NavigationService';
import notifee, {EventType} from '@notifee/react-native';
import Orientation from 'react-native-orientation-locker';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import ImagePreviewComp from './src/Components/ImagePreviewComp';
// import {Settings} from 'react-native-fbsdk-next';
import Purchases, {LOG_LEVEL} from 'react-native-purchases';
import {io} from 'socket.io-client';
import MessageShowComp from './src/Components/MessageShowComp';
import {mergeIds} from './src/Services/GlobalFunctions';
import API from './src/Utils/helperFunc';
import {changeUserChatStatusUrl, GetChatListUrl} from './src/Utils/Urls';

const SOCKET_URL = 'https://messaging.theappforcowboys.com/'; // Use your socket URL

const App = () => {
  const [isVisible, setIsVisible] = useState(true);
  const Hide_Splash_Screen = () => {
    setIsVisible(false);
  };
  const {getState, dispatch} = useReduxStore();

  const appState = useRef(AppState.currentState);
  const {isloading} = getState('isloading');
  const {isLogin, userData} = getState('Auth');
  const {image, modalType} = getState('modalState');
  const isFetching = useIsFetching();

  /* This code snippet is defining a `useMutation` hook called `sendFriendReq` that will handle making a
POST request to the `sendFriendReqUrl` endpoint with the provided data. */
  const {mutateAsync} = useMutation({
    mutationFn: data => {
      return API.post(changeUserChatStatusUrl, data);
    },
  });

  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        mutateAsync({is_online: 0});
      } else if (state === 'background') {
        mutateAsync({is_online: 1});
      }
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (isLogin) {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
      if (Platform.OS === 'ios') {
        Purchases.configure({
          apiKey: 'appl_FlnMxEBtfVpRzXrWhCyKvhcVQYs',
          appUserID: userData?.customer_id?.toString(),
        });
      } else if (Platform.OS === 'android') {
        Purchases.configure({
          apiKey: 'goog_GGhwNAKnmUWMKwuIFJJghrHhAZG',
          appUserID: userData?.customer_id?.toString(),
        });
        // OR: if building for Amazon, be sure to follow the installation instructions then:
      }
    }
  }, [isLogin]);

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
    console.log(
      'payloadDatapayloadDatapayloadDatapayloasdsdsdsdDatapayloadData',
      notify,
    );
    if (notify?.notification?.data?.data) {
      const payloadData = JSON.parse(notify?.notification?.data?.data);
      if (notify?.notification?.data?.isRoute) {
        console.log('jksdbvkjsbdkovbdklsvbsdbvsdklblskd', payloadData);
        NavigationService.navigate('ChatScreen', {
          id: payloadData?.other_user?.id || payloadData?.id, // Fallback to item.id if other_user.id is missing
          userId: userData?.id,
          conversationId: payloadData?.conversation_id,
        });
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
    Orientation.lockToPortrait(); //this will lock the view to Portrait
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
    GoogleSignin.configure({
      offlineAccess: true,
      iosClientId:
        '433413678709-2dkgedloqvurj77k6474e09slpatdfta.apps.googleusercontent.com',
      webClientId:
        Platform.OS == 'ios'
          ? '433413678709-2dkgedloqvurj77k6474e09slpatdfta.apps.googleusercontent.com'
          : '433413678709-iuv7ovginqaklbprk8f135fbg7iiosgk.apps.googleusercontent.com',
    });
    // Settings.initializeSDK();
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

  const [chats, setChats] = useState([]);
  const socketRef = useRef(null);
  const [isInAppMsg, setIsInAppMsg] = useState(null);

  const {data, refetch} = useQuery({
    queryKey: ['chatList'],
    queryFn: () => API.get(GetChatListUrl),
    refetchOnReconnect: true,
    retry: 5,
  });
  console.log(
    'datadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadata',
    data?.data,
  );

  // Initialize Socket.io directly in useEffect
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });
    socketRef.current.on('connect', () =>
      console.log('Socket connectedklsdnlkbsdklvbklsdbvlkbsdlkbvklsd'),
    );
    socketRef.current.on('disconnect', () =>
      console.log('Socket disconnected'),
    );
    socketRef.current.on('error', err => console.error('Socket error:', err));
    // return () => {
    //   if (socketRef.current) {
    //     socketRef.current.disconnect();
    //   }
    // };
  }, []);

  // Setup socket listeners and fetch chats
  useEffect(() => {
    if (userData?.id && data?.data && data?.data.length > 0 && isLogin) {
      // Initialize chats with isTyping: false
      setChats(data.data);

      // Join all chat rooms
      data.data.forEach(chat => {
        socketRef.current.emit('join', userData?.id);
      });

      // Socket listeners
      socketRef.current.on('newMessage', payload => {
        const index = chats.findIndex(
          c => c.conversation_id === payload.conversation_id,
        );
        if (index !== -1) {
          console.log(
            'New message received ChatLjsdhbvckjsdbvjkbsdkjvbdjksbvjkdsbkjvbksdist:',
            payload,
          );
          setIsInAppMsg(payload);
          setTimeout(() => {
            setIsInAppMsg(null);
          }, 5000);
        }
      });
    }
  }, [data, userData?.id, isLogin]);

  const getNameFunc = NavigationService.getCurrentRoute();
  return (
    <>
      {isVisible === true ? Splash_Screen : <MainNavigator />}
      {modalType && <ImagePreviewComp visible={modalType} images={image} />}
      {isInAppMsg?.conversation_id && isLogin && (
        <MessageShowComp
          onDismiss={() => setIsInAppMsg(null)}
          visible={true}
          payload={isInAppMsg}
          onTap={() => {
            NavigationService.navigate('ChatScreen', {
              id: isInAppMsg?.other_user?.id || isInAppMsg?.id, // Fallback to item.id if other_user.id is missing
              userId: userData?.id,
              conversationId: isInAppMsg?.conversation_id,
            });
            setIsInAppMsg(null);
          }}
        />
      )}
      {isloading &&
        Boolean(getNameFunc?.getCurrentRoute()?.name != 'AllEventsScreen') &&
        Boolean(getNameFunc?.getCurrentRoute()?.name != 'HomeScreen') &&
        Boolean(getNameFunc?.getCurrentRoute()?.name != 'ChatScreen') &&
        Boolean(getNameFunc?.getCurrentRoute()?.name != 'GlobalSearchScreen') &&
        Boolean(getNameFunc?.getCurrentRoute()?.name != 'GlobalEventsScreen') &&
        Boolean(
          getNameFunc?.getCurrentRoute()?.name != 'FriendProfileScreen',
        ) && <Overlay />}
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
