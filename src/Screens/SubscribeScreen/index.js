import {View, Text, Image} from 'react-native';
import React from 'react';
import useSubscribeScreen from './useSubscribeScreen';
import {styles} from './styles';
import {TextComponent} from '../../Components/TextComponent';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Colors, FontSize} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import {medalstar} from '../../Assets';

const Tab = createMaterialTopTabNavigator();

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const SubscribeScreen = ({navigation}) => {
  const {} = useSubscribeScreen(navigation);

  return (
    <View style={styles.container}>
      <View style={styles.subsCon}>
        <TextComponent text={'Subscription plan'} styles={styles.subs} />
        <Text style={styles.subsDes} numberOfLines={2}>
          Start with <Text style={styles.boldText}>30 day free trial</Text>{' '}
          upgrade or downgrade any time.
        </Text>
      </View>
      <Tab.Navigator
        screenOptions={{
          // tabBarIndicator: false,
          tabBarInactiveTintColor: Colors.textGray,
          tabBarActiveTintColor: Colors.textGray,
          tabBarHideOnKeyboard: true,
          swipeEnabled: true,
          animationEnabled: true,
          tabBarAllowFontScaling: true,
          tabBarIndicatorStyle: {
            backgroundColor: Colors.white,
            height: hp('5'),

            borderRadius: 50,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
          },
          tabBarIndicatorContainerStyle: {},
          tabBarLabelStyle: {
            fontSize: FontSize.scale14,
            fontWeight: '500',
            fontFamily: 'Nunito_Bold',
            textTransform: 'none',
          },
          tabBarStyle: {
            marginTop: hp('3'), // Adjust top margin as needed
            marginHorizontal: wp('3'), // Adjust horizontal margin as needed
            backgroundColor: 'rgba(246, 246, 246, 1)', // Change background color if needed
            // borderTopLeftRadius: 10,
            // borderTopRightRadius: 10,
            borderRadius: 50,
          },
        }}>
        {['Monthly', 'Yearly'].map(screenName => (
          <Tab.Screen
            key={screenName}
            name={screenName}
            component={screenName === 'Monthly' ? Monthly : Yearly}
            options={{
              tabBarLabel: capitalizeFirstLetter(screenName),
            }}
          />
        ))}
      </Tab.Navigator>
    </View>
  );
};

export default SubscribeScreen;

const Monthly = () => {
  return (
    <View style={styles.container}>
      <View style={styles.midCont}>
        <View style={styles.innerCont}>
          <Image source={medalstar} style={styles.icon} />
          <View>
            <Text style={styles.subsDes} numberOfLines={2}>
              Monthly /<Text style={styles.boldText}> $25</Text>
            </Text>
            <Text>Monthly</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const Yearly = () => {
  return (
    <View style={styles.container}>
      <Text>Yearly</Text>
    </View>
  );
};
