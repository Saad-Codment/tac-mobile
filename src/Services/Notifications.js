import {Alert, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {
  EventType,
  AndroidLaunchActivityFlag,
} from '@notifee/react-native';
import {requestNotifications, openSettings} from 'react-native-permissions';
import {useQueryClient} from '@tanstack/react-query';
import {store} from '../Redux/Reducer';
import {types} from '../Redux/types';
// import {setNotificationLength} from '../Redux/Action/recentNotification';

// const {dispatch} = useReduxStore();
const sound = Platform.select({ios: 'interval.wav', android: 'interval.mp3'});

const onNotificationNotiFee = async (data, appState) => {
  // store.dispatch(setNotificationLength(data));
  // await notifee.setBadgeCount(5);
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    // sound,
  });

  // Display a notification
  notifee.displayNotification({
    ...data.notification,
    android: {
      channelId,
      ...data.notification.android,
      pressAction: {
        id: 'default',
        launchActivity: 'default',
        launchActivityFlags: [AndroidLaunchActivityFlag.SINGLE_TOP],
      },
      // sound,
      badge: {
        // Include badge count here
        count: data.notification.android?.badge || 0,
      },
    },
    ios: {sound},
  });
  console.log('data=>>>>>>>', data);

  // const isActive = Boolean(NavigationService.ref && appState == 'active');
  // const notificationObj = JSON.parse(data.data.payload);
  // const getNameFunc = NavigationService.getCurrentRoute();
  // const routeName = getNameFunc?.getCurrentRoute()?.name;
  // if (
  //   isActive &&
  //   notificationObj?.notification_type == 'badge_unlocked' &&
  //   routeName != 'MusicPlayer'
  // ) {
  //   NavigationService.navigate('Congratulations', notificationObj || {});
  // }

  if (
    data?.notification?.body?.includes('has sent a message') ||
    data?.notification?.title?.includes('has sent a message')
  ) {
    store.dispatch({type: types.isChatNotifyTrue});
  } else store.dispatch({type: types.isNotifyTrue});
};

class FCMService {
  register = (onRegister, onOpenNotification, appState) => {
    this.checkPermission(onRegister);
    this.createNoitificationListeners(onRegister, onOpenNotification, appState);
  };

  checkPermission = async onRegister => {
    try {
      const authStatus = await messaging().hasPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) this.getToken(onRegister);
      else this.requestPermission(onRegister);
    } catch (error) {
      console.log(error);
    }
  };

  getToken = onRegister => {
    messaging()
      .getToken()
      .then(res => onRegister(res));
    // if (Platform.OS == 'android') {
    //   messaging()
    //     .getToken()
    //     .then(res => onRegister(res));
    // } else {
    //   messaging()
    //     .getAPNSToken()
    //     .then(res => onRegister(res));
    // }
  };

  requestPermission = async onRegister => {
    try {
      const {status} = await requestNotifications(['alert', 'sound', 'badge']);
      if (status === 'granted') this.getToken(onRegister);
      else {
        Alert.alert(
          'Warning',
          `Push notifications have been ${status}. You will not receive any important notification unless enabled from settings.`,
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Open Setting',
              onPress: () => {
                openSettings().catch(() =>
                  console.warn('Cannot open settings'),
                );
              },
            },
          ],
          {
            userInterfaceStyle: 'light',
          },
        );
      }
    } catch (error) {
      console.log('Requested persmission rejected ', error);
    }
  };

  deletedToken = () => {
    messaging()
      .deleteToken()
      .catch(error => {
        console.log('Delected token error ', error);
      });
  };

  createNoitificationListeners = async (
    onRegister,
    onOpenNotification,
    appState,
  ) => {
    // Triggered  when a particular  notification  has been recevied in foreground
    this.notificationListener = messaging().onMessage(
      data => {
        console.log(data, 'eieiieieieieieiei', 'aklsdjalksjdlakjsdlajklkdjl');

        onNotificationNotiFee(data, appState);
        if (
          data?.notification?.body?.includes('has sent a message') ||
          data?.notification?.title?.includes('has sent a message')
        ) {
          store.dispatch({type: types.isChatNotifyTrue});
        } else store.dispatch({type: types.isNotifyTrue});
      },
      // {
      //   if (NavigationService.ref && appState == 'active') {
      //     NavigationService.navigate(
      //       'Congratulations',
      //       JSON.parse(data.data.payload) || {},
      //     );
      //   }
      // },
    );

    // If your app is backgound, you can listen for when a
    //notification is clicked / tapped / opened as follows
    this.notificationOpenedListener = messaging().onNotificationOpenedApp(
      notification => {
        // console.log(notification);
        console.log(notification, 'aklsdjalksjdlakjsdlajklkdjl');

        if (notification) onOpenNotification(notification);
        // this.removeDelieveredNotification(notification);
      },
    );

    // if your app is closed, you can check if  it was opened by notification
    // being  clicked / tapped / opened as follows
    messaging()
      .getInitialNotification()
      .then(notification => {
        if (notification) onOpenNotification(notification);
        // this.removeDelieveredNotification(notification);
      });

    // Triggered when have  new token
    this.onTokenRefreshListener = messaging().onTokenRefresh(onRegister);

    this.forgroundListener = notifee.onForegroundEvent(
      async ({type, detail}) => {
        console.log(detail, 'alkjakljalkajlkajl11ajlajklajlajl');
        // const notificationdisplay = await notifee.getDisplayedNotifications();

        const {notification} = detail;
        const isPressed = Boolean(
          type === EventType.ACTION_PRESS || type == EventType.PRESS,
        );
        if (isPressed) onOpenNotification(detail);
        if (type !== 7) await this.setBadge();
        // this.getNotification();
      },
    );
    this.backgroundListner = notifee.onBackgroundEvent(
      async ({type, detail}) => {
        console.log(detail, 'alkjakljalkajlkajlajlajklajlajl');

        const {notification} = detail;
        const isPressed = Boolean(
          type === EventType.ACTION_PRESS || type === EventType.PRESS,
        );

        if (isPressed) {
          // Handle notification press
          onOpenNotification(notification);
        }

        if (type !== 7) {
          // Check if this condition is relevant for iOS (adjust as needed)
          await this.setBadge();
        }
      },
    );
  };
  setBadge = (badge = 0) => notifee.setBadgeCount(badge);
  // getNotification = () => {
  //   const queryClient = useQueryClient();
  //   queryClient.invalidateQueries({queryKey: ['notificationdisplaykey']});
  // };
  // APP receive notification on foreground, if go to background and click the notification

  unRegister = () => {
    this.notificationListener();
    this.notificationOpenedListener();
    // this.onTokenRefreshListener();
    this.forgroundListener();
    // this.deletedToken();
    this.backgroundListner;
    console.log('FCMService unRegister successfully');
  };
}

export const fcmService = new FCMService();
