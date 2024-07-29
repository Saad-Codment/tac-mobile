import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import useReduxStore from '../Hooks/UseReduxStore';
import NavigationService from '../Services/NavigationService';
import * as Screens from '../Screens/index';
import MybottomTabs from './bottomNavigation';
import Orientation from 'react-native-orientation-locker';

const Stack = createNativeStackNavigator();

function MainNavigator() {
  const {getState} = useReduxStore();
  const {onboarding} = getState('onboarding');
  const {isLogin} = getState('Auth');

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
        {!onboarding && (
          <Stack.Screen
            name="OnBoardScreen"
            component={Screens.OnBoardScreen}
          />
        )}
        {!isLogin && (
          <>
            <Stack.Screen name="HomeScreen" component={Screens.HomeScreen} />

            <Stack.Screen
              name="SettingScreen"
              options={'SettingScreen'}
              component={Screens.SettingScreen}
            />
            <Stack.Screen
              name="SubscribeScreen"
              component={Screens.SubscribeScreen}
            />
            <Stack.Screen
              name="OnStepScreen"
              component={Screens.OnStepScreen}
            />
            <Stack.Screen name="LoginScreen" component={Screens.LoginScreen} />
            <Stack.Screen
              name="RegisterScreen"
              component={Screens.RegisterScreen}
            />

            <Stack.Screen name="MybottomTabs" component={MybottomTabs} />

            {/* <Stack.Screen
              name="ForgetPasswordScreen"
              component={Screens.ForgetPasswordScreen}
              /> */}
          </>
        )}
        {isLogin && (
          <>
            <Stack.Screen name="MybottomTabs" component={MybottomTabs} />
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
