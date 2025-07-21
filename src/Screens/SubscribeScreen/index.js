import {View, Text, Image, Platform} from 'react-native';
import React from 'react';
import useSubscribeScreen from './useSubscribeScreen';
import {styles} from './styles';
import {TextComponent} from '../../Components/TextComponent';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Colors, FontSize} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import {heart, medalstar, tickCircle} from '../../Assets';
import ThemeButton from '../../Components/ThemeButton';

const Tab = createMaterialTopTabNavigator();

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const SubscribeScreen = ({navigation}) => {
  const {
    startTrial,
    products,
    buySubscription,
    startFreeTrial,
    userData,
    getProductsFromStore,
  } = useSubscribeScreen();

  const TickCircle = ({text, tintColor, TextColor}) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: wp('2'),
        paddingTop: hp('0.5'),
      }}>
      <Image
        tintColor={tintColor}
        source={tickCircle}
        style={styles.tickCircle}
      />
      <TextComponent
        text={text}
        styles={{
          color: TextColor ? Colors.textGray : Colors.backgroundTheme,
          ...styles.packText,
        }}
      />
    </View>
  );

  const PlanCard = ({plan, isMonthly}) => (
    <View style={styles.container}>
      <View style={styles.upperCont}>
        <View style={styles.midCont}>
          <View style={styles.innerCont}>
            <Image source={medalstar} style={styles.icon} />
            <View style={{marginLeft: wp('1.5')}}>
              <Text style={styles.monthlyText} numberOfLines={2}>
                {plan?.title} /
                <Text style={styles.monthlyTextBold}>{plan?.priceString}</Text>
              </Text>
              <TextComponent
                styles={styles.textDes}
                text={'Salungat sa kaalaman ng marami.'}
              />
            </View>
          </View>
        </View>
        <View style={{marginTop: hp('1.5')}}>
          <TickCircle text={'All location'} />
          <TickCircle text={'No ads'} />
          <TickCircle text={'Companionship'} />
          <TickCircle text={'Transportation'} />
          <TickCircle
            text={'Competition'}
            tintColor={!isMonthly ? undefined : Colors.textGray}
            TextColor={isMonthly}
          />
          <TickCircle
            text={'Socialization'}
            tintColor={!isMonthly ? undefined : Colors.textGray}
            TextColor={isMonthly}
          />
          <TickCircle
            text={'World from Horseback'}
            tintColor={!isMonthly ? undefined : Colors.textGray}
            TextColor={isMonthly}
          />
        </View>
        <View style={styles.buyCont}>
          <ThemeButton
            onPress={() => buySubscription(plan)}
            title={'Buy Plan'}
            textStyle={styles.buyPlan}
            containerStyle={{
              paddingVertical: hp('1'),
              paddingHorizontal: wp('4'),
            }}
            style={{height: hp('4.5'), width: wp('25')}}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.subsCon}>
        <TextComponent text={'Subscription plan'} styles={styles.subs} />
        {userData?.trial_start_at == null && (
          <Text style={styles.subsDes} numberOfLines={2}>
            Start with <Text style={styles.boldText}>30 day free trial</Text>{' '}
            upgrade or downgrade any time.
          </Text>
        )}
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarInactiveTintColor: Colors.textGray,
          tabBarActiveTintColor: Colors.textGray,
          tabBarHideOnKeyboard: true,
          swipeEnabled: true,
          animationEnabled: true,
          tabBarAllowFontScaling: true,
          tabBarIndicatorStyle: {
            backgroundColor: Colors.white,
            height: hp(Platform.OS === 'android' ? '4' : '3.5'),
            alignSelf: 'center',
            borderRadius: 25,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 2.5,
            elevation: 3,
          },
          tabBarLabelStyle: {
            fontSize: FontSize.scale12,
            fontWeight: '500',
            fontFamily: 'Nunito_Bold',
            textTransform: 'none',
            marginTop: hp('-0.5'),
          },
          tabBarStyle: {
            marginHorizontal: wp('2'),
            backgroundColor: 'rgba(246, 246, 246, 1)',
            borderRadius: 30,
            height: hp(Platform.OS === 'android' ? '4.5' : '4'),
          },
        }}>
        <Tab.Screen
          name="Monthly"
          children={() => <PlanCard plan={products[1]} isMonthly />}
        />
        <Tab.Screen
          name="Yearly"
          children={() => <PlanCard plan={products[0]} isMonthly={false} />}
        />
      </Tab.Navigator>
      {userData?.trial_start_at == null && (
        <ThemeButton
          title={'Start free trial'}
          isYellowTheme
          textStyle={{fontSize: hp('1.5')}}
          style={{
            position: 'absolute',
            bottom: hp('10'),
            width: wp('90'),
            alignSelf: 'center',
            height: hp('5'),
          }}
          onPress={startFreeTrial}
        />
      )}
    </View>
  );
};

export default SubscribeScreen;
