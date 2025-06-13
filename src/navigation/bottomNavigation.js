import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Platform, Dimensions, StyleSheet, Image} from 'react-native';
import * as Screens from '../Screens/index';
import {Colors} from '../Theme/Variables';
import {hp, wp} from '../Config/responsive';
// import Orientation from 'react-native-orientation-locker';
import {
  home1,
  home,
  message,
  message1,
  notification1,
  notification,
  setting1,
  setting,
  bell,
  sosImage,
  heart,
  addcircle,
  messages,
  messageOut,
  searchBottom,
  searchFill,
  searchNormal,
  userFill,
  userBlack,
  unfilledCalender,
  groupBlack,
  circleCalFilled,
  chatDotFill,
  chatDotTransparent,
} from '../Assets';
import {types} from '../Redux/types';
import useReduxStore from '../Hooks/UseReduxStore';
import {VerifyUserUrl} from '../Utils/Urls';
import {fetchGetWithToken} from '../Utils/helperFunc';

globalStyles = {};
const isIOS = Boolean(Platform.OS == 'ios');
const tabarComponent = (activeImage, unActiveImage, ImageStyle, notUseTint) => {
  return {
    tabBarIcon: ({focused}) => {
      const tintColor = !notUseTint
        ? {
            tintColor: focused ? Colors.primaryColor : Colors.backgroundTheme,
          }
        : {};

      return (
        <View style={styles.tabarView}>
          <Image
            style={{
              ...styles.imgstyle,
              ...ImageStyle,
              ...tintColor,
            }}
            source={focused ? activeImage : unActiveImage}
          />
        </View>
      );
    },
    title: '',
    tabBarLabelStyle: styles.tabarTitle,
  };
};

const Tab = createBottomTabNavigator();

function MybottomTabs() {
  const {getState, dispatch} = useReduxStore();

  const {isChatNotify} = getState('isChatNotify');

  fetchGetWithToken(VerifyUserUrl);

  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={({route}) => ({
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: 'transparent',
        headerShown: false,
        tabBarActiveBackgroundColor: 'white',
        tabBarInactiveBackgroundColor: 'white',
        tabBarHideOnKeyboard: true,
        swipeEnabled: true,
        animationEnabled: true,
        tabBarAllowFontScaling: true,
        tabBarItemStyle: {
          width: 'auto',
        },
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: 'white',
          borderWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          height: hp('8'),
          paddingBottom: hp('1.5'),
          // bottom: Platform.OS == 'ios' ? hp('1.7') : hp('1.5'),
          width: wp('100'),
          alignSelf: 'center',
          // backfaceVisibility:'hidden',
          // overflow: 'hidden',
          marginTop: hp('-2'),
        },
      })}>
      <Tab.Screen
        name="HomeScreen"
        options={tabarComponent(home1, home)}
        component={Screens.HomeScreen}
      />
      <Tab.Screen
        name="HomeScreen1"
        options={tabarComponent(groupBlack, groupBlack)}
        component={Screens.SearchScreen}
      />
      <Tab.Screen
        name="MyEventScreen"
        options={tabarComponent(
          circleCalFilled,
          unfilledCalender,
          {width: wp('9')},
          true,
        )}
        component={Screens.MyEventScreen}
      />
      <Tab.Screen
        name="ChatUsersScreen"
        options={tabarComponent(
          isChatNotify ? chatDotFill : messages,
          isChatNotify ? chatDotTransparent : messageOut,
          !isChatNotify ? {} : {width: wp('8')},
          true,
        )}
        component={Screens.ChatUsersScreen}
      />
      <Tab.Screen
        name="MyProfileScreen"
        options={tabarComponent(userFill, userBlack)}
        component={Screens.MyProfileScreen}
      />
      {/* <Tab.Screen
        name="FavourateScreen"
        options={tabarComponent(message, message1)}
        component={Screens.HomeScreen}
      /> */}
      {/* <Tab.Screen
        name="SOSScreen"
        AMPMLayout
        options={tabarComponent(
          sosImage,
          sosImage,
          (ImageStyle = {
            width: wp('20'),
            marginTop: hp('-6'),
            height: hp('12'),
            // position: 'absolute',
            // top: -50, // Adjust this value to position the center icon properly
            // alignSelf: 'center',
            // zIndex: 10,
            // position: 'absolute',
          }),
        )}
        component={Screens.SOSScreen}
      /> */}
      {/* <Tab.Screen
        name="ChatScreen"
        options={tabarComponent(notification, notification1)}
        component={Screens.SeetingScreen}
      /> */}
      {/* <Tab.Screen
        name="SettingScreen"
        options={tabarComponent(setting1, setting)}
        component={Screens.SeetingScreen}
      /> */}
    </Tab.Navigator>
  );
}
export default MybottomTabs;

const styles = StyleSheet.create({
  badgeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    fontSize: hp('1.5'),
    backgroundColor: Colors.badgeColor,
  },
  tabarTitle: {
    display: 'none',
  },
  tabarView: (focused, last) => ({
    width: 'auto',
    backgroundColor: 'transparent',
    bottom: hp('0.5'),
  }),

  imgstyle: {
    resizeMode: 'contain',
    width: wp('5'),
  },
});
