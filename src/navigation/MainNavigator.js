import React, {useEffect, useRef, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import useReduxStore from '../Hooks/UseReduxStore';
import NavigationService from '../Services/NavigationService';
import * as Screens from '../Screens/index';
import MybottomTabs from './bottomNavigation';
import Orientation from 'react-native-orientation-locker';
import {useQuery} from '@tanstack/react-query';
import API from '../Utils/helperFunc';
import {mergeIds} from '../Services/GlobalFunctions';
import MessageShowComp from '../Components/MessageShowComp';
import {io} from 'socket.io-client';

const Stack = createNativeStackNavigator();

function MainNavigator() {
  const {getState} = useReduxStore();
  const {onboarding} = getState('onboarding');
  const {isLogin, userData} = getState('Auth');

  return (
    <NavigationContainer
      ref={ref => {
        NavigationService.setRef(ref);
        // const p = NavigationService.getCurrentRoute(ref.getCurrentRoute());
      }}>
      <Stack.Navigator
        screenOptions={{
          headerTransparent: true,
          headerTitle: null,
          headerShown: false,
        }}>
        {!isLogin && (
          <>
            {!onboarding && (
              <Stack.Screen
                name="OnBoardScreen"
                component={Screens.OnBoardScreen}
              />
            )}
            {/* <Stack.Screen
              name="EventsDetailScreen"
              component={Screens.EventsDetailScreen}
            /> */}
            <Stack.Screen name="LoginScreen" component={Screens.LoginScreen} />
            <Stack.Screen
              name="RegisterScreen"
              component={Screens.RegisterScreen}
            />
            {/* <Stack.Screen
              name="OnStepScreen"
              component={Screens.OnStepScreen}
            /> */}

            <Stack.Screen
              name="ForgotPasswordScreen"
              component={Screens.ForgotPasswordScreen}
            />
          </>
        )}
        {isLogin && (
          <>
            {userData?.is_onboard == 0 && (
              <Stack.Screen
                name="OnStepScreen"
                component={Screens.OnStepScreen}
              />
            )}
            {userData?.verified == 0 && (
              <>
                <Stack.Screen
                  name="NumberEditScreen"
                  component={Screens.NumberEditScreen}
                />
                <Stack.Screen
                  name="VerficationScreen"
                  component={Screens.VerficationScreen}
                />
              </>
            )}
            {!userData?.identifier && userData?.is_sub_granted != 1 && (
              <Stack.Screen
                name="SubscribeScreen"
                component={Screens.SubscribeScreen}
              />
            )}
            <Stack.Screen name="MybottomTabs" component={MybottomTabs} />
            <Stack.Screen
              name="SubscriptionScreen"
              component={Screens.SubscribeScreen}
            />
            <Stack.Screen
              name="AfterLoginNumberEditScreen"
              component={Screens.NumberEditScreen}
            />
            <Stack.Screen
              name="SubscriptionInfoScreen"
              component={Screens.SubscriptionInfoScreen}
              options={{
                presentation: 'modal', // 👈 Makes it open as a modal
                animation: 'slide_from_bottom', // Optional animation style
                headerShown: false, // Optional, hides the header
              }}
            />
            <Stack.Screen
              name="UpdateHorseScreen"
              component={Screens.UpdateHorseScreen}
            />
            <Stack.Screen
              name="GlobalSearchScreen"
              component={Screens.GlobalSearchScreen}
            />
            <Stack.Screen
              name="EventFilterScreen"
              component={Screens.EventFilterScreen}
            />
            <Stack.Screen
              name="AfterLoginVerficationScreen"
              component={Screens.VerficationScreen}
            />
            <Stack.Screen
              name="ListViewScreen"
              component={Screens.ListViewScreen}
              options={{
                presentation: 'formSheet', // 👈 Makes it open as a modal
                animation: 'slide_from_bottom', // Optional animation style
                headerShown: false, // Optional, hides the header
              }}
            />
            <Stack.Screen
              name="BlockedUserScreen"
              component={Screens.BlockedUserScreen}
            />
            <Stack.Screen
              name="PerformancesScreen"
              component={Screens.PerformancesScreen}
            />
            <Stack.Screen
              name="ContactUsScreen"
              component={Screens.ContactUsScreen}
            />

            <Stack.Screen
              name="MyEventScreen"
              component={Screens.MyEventScreen}
            />
            <Stack.Screen
              name="ProfileScreen"
              component={Screens.ProfileScreen}
            />
            <Stack.Screen
              name="AccountPrivacyScreen"
              component={Screens.AccountPrivacyScreen}
            />
            <Stack.Screen
              name="ChangePasswordScreen"
              component={Screens.ChangePasswordScreen}
            />
            <Stack.Screen
              name="SyncPhonebookScreen"
              component={Screens.SyncPhonebookScreen}
            />
            <Stack.Screen
              name="SearchScreen"
              component={Screens.SearchScreen}
            />
            <Stack.Screen
              name="EventsDetailScreen"
              component={Screens.EventsDetailScreen}
            />
            <Stack.Screen
              name="GlobalEventsScreen"
              component={Screens.GlobalEventsScreen}
            />
            <Stack.Screen
              name="LocationScreen"
              component={Screens.LocationScreen}
              options={{
                presentation: 'formSheet', // 👈 Makes it open as a modal
                animation: 'slide_from_bottom', // Optional animation style
                headerShown: false, // Optional, hides the header
              }}
            />
            <Stack.Screen
              name="SelectFriendListScreem"
              component={Screens.SelectFriendListScreem}
              options={{
                presentation: 'formSheet', // 👈 Makes it open as a modal
                animation: 'slide_from_bottom', // Optional animation style
                headerShown: false, // Optional, hides the header
              }}
            />
            <Stack.Screen
              name="CreateEventsScreen"
              component={Screens.CreateEventsScreen}
            />
            <Stack.Screen name="HomeScreen" component={Screens.HomeScreen} />
            <Stack.Screen
              name="SettingScreen"
              options={'SettingScreen'}
              component={Screens.SettingScreen}
            />
            <Stack.Screen
              name="HistoryScreen"
              options={'HistoryScreen'}
              component={Screens.HistoryScreen}
            />
            <Stack.Screen
              name="FriendLists"
              options={'FriendLists'}
              component={Screens.FriendLists}
            />
            <Stack.Screen
              name="EditProfileScreen"
              options={'EditProfileScreen'}
              component={Screens.EditProfileScreen}
            />

            <Stack.Screen
              name="AllSuggestedFriendsScreen"
              component={Screens.AllSuggestedFriendsScreen}
            />
            <Stack.Screen
              name="CreatePostScreen"
              component={Screens.CreatePostScreen}
            />
            <Stack.Screen
              name="FriendReqScreen"
              component={Screens.FriendReqScreen}
            />
            <Stack.Screen
              name="NotificationScreen"
              component={Screens.NotificationScreen}
            />
            <Stack.Screen
              name="AllEventsScreen"
              component={Screens.AllEventsScreen}
            />
            <Stack.Screen
              name="FriendsEventsScreen"
              component={Screens.FriendsEventsScreen}
            />
            <Stack.Screen
              name="CommentScreen"
              component={Screens.CommentScreen}
            />
            <Stack.Screen
              name="FriendProfileScreen"
              component={Screens.FriendProfileScreen}
            />
            <Stack.Screen name="ChatScreen" component={Screens.ChatScreen} />
            {/* <Stack.Screen
              name="SkeletonScreen"
              component={Screens.SkeletonScreen}
            /> */}
            {/* <Stack.Screen
              name="SkeletonScreen"
              component={Screens.SkeletonScreen}
            /> */}
            {/* <Stack.Screen
              name="EmergencyContactScreen"
              component={Screens.EmergencyContactScreen}
            /> */}
            {/* <Stack.Screen
              name="TrainingScreen"
              component={Screens.TrainingScreen}
            /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;
