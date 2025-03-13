import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {memo} from 'react';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';
import {styles} from './styles';
import {View} from 'react-native';
import TacUserScreen from './tacUserScreen';
import InvitedUserScreen from './invitedUserScreen';

const Tab = createMaterialTopTabNavigator();

export const MyTabs = ({tacContacts, invitedContacts}) => {
  return (
    <View style={styles.tabMain}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.backgroundTheme,
          tabBarInactiveTintColor: Colors.grayFaded,
          tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
          activeTintColor: Colors.backgroundTheme,
          tabBarPressColor: Colors.transparent,
          tabBarLabelStyle: {fontWeight: 600},
          tabBarItemStyle: {height: hp('5'), borderColor: 'red'},
          tabBarStyle: {
            backgroundColor: 'transparent',
            shadowOpacity: 0,
            shadowColor: 'transparent',
          },
        }}>
        <Tab.Screen name="TAC users">
          {() => <TacUserScreen tacContacts={tacContacts} />}
        </Tab.Screen>
        <Tab.Screen name="Invite friends">
          {() => <InvitedUserScreen invitedContacts={invitedContacts} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};
