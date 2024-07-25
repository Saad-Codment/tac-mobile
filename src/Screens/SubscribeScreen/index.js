import {View, Text, Image, Platform} from 'react-native';
import React from 'react';
import useSubscribeScreen from './useSubscribeScreen';
import {styles} from './styles';
import {TextComponent} from '../../Components/TextComponent';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Colors, FontSize} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import {medalstar, tickCircle} from '../../Assets';
import ThemeButton from '../../Components/ThemeButton';

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
            height: hp(Platform.OS === 'android' ? '6' : '5'),
            alignSelf: 'center',
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
            // marginTop: hp('3'), // Adjust top margin as needed
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
  const TickCircle = ({text, tintColor, TextColor}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: wp('3'),
          paddingTop: hp('1'),
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
  };
  return (
    <View style={styles.container}>
      <View style={styles.upperCont}>
        <View style={styles.midCont}>
          <View style={styles.innerCont}>
            <Image source={medalstar} style={styles.icon} />
            <View style={{marginLeft: wp('2')}}>
              <Text style={styles.monthlyText} numberOfLines={2}>
                Monthly /<Text style={styles.monthlyTextBold}> $25</Text>
              </Text>
              <TextComponent
                styles={styles.textDes}
                text={'Salungat sa kaalaman ng marami.'}
              />
            </View>
          </View>
        </View>
        <View style={{marginTop: hp('2')}}>
          <TickCircle text={'All location'} />
          <TickCircle text={'No ads'} />
          <TickCircle text={'Companionship'} />
          <TickCircle text={'Transportation'} />
          <TickCircle
            tintColor={Colors.textGray}
            TextColor
            text={'Competition'}
          />
          <TickCircle
            tintColor={Colors.textGray}
            TextColor
            text={'Socialization'}
          />
          <TickCircle
            tintColor={Colors.textGray}
            TextColor
            text={'World from Horseback'}
          />
        </View>
        <View style={styles.buyCont}>
          <ThemeButton title={'Buy Plan'} textStyle={styles.buyPlan} />
        </View>
      </View>
    </View>
  );
};

const Yearly = () => {
  const TickCircle = ({text, tintColor, TextColor}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: wp('3'),
          paddingTop: hp('1'),
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
  };
  return (
    <View style={styles.container}>
      <View style={styles.upperCont}>
        <View style={styles.midCont}>
          <View style={styles.innerCont}>
            <Image source={medalstar} style={styles.icon} />
            <View style={{marginLeft: wp('2')}}>
              <Text style={styles.monthlyText} numberOfLines={2}>
                Yearly /<Text style={styles.monthlyTextBold}> $250</Text>
              </Text>
              <TextComponent
                styles={styles.textDes}
                text={'Salungat sa kaalaman ng marami.'}
              />
            </View>
          </View>
        </View>
        <View style={{marginTop: hp('2')}}>
          <TickCircle text={'All location'} />
          <TickCircle text={'No ads'} />
          <TickCircle text={'Companionship'} />
          <TickCircle text={'Transportation'} />
          <TickCircle text={'Competition'} />
          <TickCircle text={'Socialization'} />
          <TickCircle text={'World from Horseback'} />
        </View>
        <View style={styles.buyCont}>
          <ThemeButton title={'Buy Plan'} textStyle={styles.buyPlan} />
        </View>
      </View>
    </View>
  );
};
