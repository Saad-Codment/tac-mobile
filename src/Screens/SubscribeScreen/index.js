import {View, Text, Image, Platform, ImageBackground} from 'react-native';
import React from 'react';
import useSubscribeScreen from './useSubscribeScreen';
import {styles} from './styles';
import {TextComponent} from '../../Components/TextComponent';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Colors, FontSize} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import {
  backIcon,
  heart,
  logout,
  medalstar,
  popular,
  save25,
  subBg,
  tickCircle,
  tickFrameYellow,
} from '../../Assets';
import ThemeButton from '../../Components/ThemeButton';
import {Touchable} from '../../Components/Touchable';
import {types} from '../../Redux/types';
import {logOutAuth} from '../../Redux/Action/AuthAction';
import DividerLine from '../../Components/DividerLine';

const Tab = createMaterialTopTabNavigator();

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const SubscribeScreen = ({navigation, route}) => {
  const {
    startTrial,
    products,
    buySubscription,
    startFreeTrial,
    userData,
    getProductsFromStore,
    dispatch,
    selectedPkg,
    setSelectedPkg,
  } = useSubscribeScreen(navigation, route);

  const TickCircle = ({text, tintColor, TextColor}) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: wp('2'),
        paddingVertical: hp('1'),
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
                <Text style={styles.monthlyTextBold} numberOfLines={2}>
                  {plan?.priceString}
                </Text>
              </Text>
              {/* <TextComponent
                styles={styles.textDes}
                text={'Salungat sa kaalaman ng marami.'}
              /> */}
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: hp('1.5'),
            width: wp('90'),
          }}>
          <TickCircle
            text={
              'Set up your own rodeo events or cowboy meetups with full control over dates, details, and invites.'
            }
          />
          <TickCircle
            text={
              'Explore upcoming rodeo events pulled from reliable sources and tailored to your location.'
            }
          />
          <TickCircle
            text={
              'Send friend requests, discover people with mutual interests, and build your rodeo network.'
            }
          />
          <TickCircle
            text={
              'Share your rodeo moments with engaging photo, video, or text updates on your timeline.'
            }
          />
          <TickCircle
            text={
              'React to your friends’ stories, show support, and keep the cowboy spirit alive through comments.'
            }
          />
          <TickCircle
            text={
              'Get alerts when friends post, events go live, or new connections are found.'
            }
          />
          <TickCircle
            text={
              'Sync your phone contacts to find friends already using the app or invite them to join the fun.'
            }
          />
          <TickCircle
            text={
              'Track RSVPs, see who’s coming, and manage event updates all in one place.'
            }
          />
          <TickCircle
            text={
              'Your data and privacy are always protected. You’re in control of who sees what.'
            }
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

  const feArry = [
    'Find rodeo events near you instantly',
    'See suggested events & friends',
    'Chat in real-time',
    'Create & manage rodeo events',
    'Sync events to your calendar',
    'Search users, posts & events',
  ];

  return (
    <ImageBackground style={styles.container} source={subBg}>
      <View style={styles.subsCon}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-end',
            width: wp('92'),
            // justifyContent: 'space-between',
            marginBottom: hp('2'),
            // backgroundColor: 'red',
          }}>
          <Touchable
            onPress={() => navigation.goBack()}
            disabled={!Boolean(route?.params)}>
            <Image
              source={backIcon}
              resizeMode="contain"
              style={{
                width: wp('5'),
                height: hp('3'),
                opacity: route?.params ? 1 : 0,
              }}
              // tintColor={'black'}
            />
          </Touchable>
          <TextComponent
            text={'Subscription plan'}
            styles={styles.subs}
            isWhite
          />

          {!route?.params && (
            <Touchable
              style={{marginLeft: wp('22')}}
              onPress={() => {
                dispatch({
                  type: types.restartOnboarding,
                });
                dispatch(logOutAuth());
              }}>
              <Image
                source={logout}
                resizeMode="contain"
                style={{width: wp('6'), height: wp('6')}}
              />
            </Touchable>
          )}
        </View>
        {userData?.trial_start_at == null && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <TextComponent
              text={'Start Your 30-Day'}
              isWhite
              size={hp('2.5')}
              fontFamily={'bold'}
            />
            <TextComponent
              text={' Free Trial'}
              styles={{color: 'rgba(255, 195, 83, 1)'}}
              size={hp('2.5')}
              fontFamily={'bold'}
            />
          </View>
        )}
        <TextComponent
          text={'Full access. No limits. Cancel anytime.'}
          size={hp('1.5')}
          fontFamily={'bold'}
          fade
          styles={{marginTop: hp('1')}}
        />
        <DividerLine
          DividerLineStyle={{
            borderBottomColor: 'rgba(157, 157, 157, 1)',
            width: wp('85'),
            marginVertical: hp('2'),
          }}
        />
        {userData?.trial_start_at == null && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-start',
            }}>
            <TextComponent
              text={'Today You Pay:'}
              isWhite
              size={hp('2.5')}
              // styles={{alignSelf: 'flex-start'}}
              fontFamily={'bold'}
            />
            <TextComponent
              text={' $0.00'}
              // isWhite
              size={hp('2.5')}
              styles={{alignSelf: 'flex-start', color: 'rgba(255, 195, 83, 1)'}}
              fontFamily={'bold'}
            />
          </View>
        )}
        {/* <TextComponent
            text={'Today You Pay: $0.00'}
            isWhite
            styles={{
              alignSelf: 'flex-start',
              color: 'rgba(203, 149, 49, 1)',
              marginTop: hp('1'),
            }}
          /> */}
        <TextComponent
          text={'What You Get:'}
          isWhite
          styles={{
            alignSelf: 'flex-start',
            color: 'rgba(203, 149, 49, 1)',
            marginTop: hp('2'),
          }}
        />
        <View style={{marginTop: hp('1'), alignSelf: 'flex-start'}}>
          {feArry.map(res => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                }}>
                <Image
                  source={tickFrameYellow}
                  resizeMode="contain"
                  style={{width: wp('5'), height: hp('2')}}
                />
                <TextComponent
                  text={res}
                  styles={{
                    color: Colors.textGray,
                    marginLeft: wp('2'),
                    paddingVertical: hp('0.5'),
                    alignSelf: 'flex-start',
                  }}
                  size={hp('1.5')}
                />
              </View>
            );
          })}
        </View>
        <View
          style={{
            marginTop: hp('5'),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            // alignSelf: 'flex-start',
            width: wp('92'),
          }}>
          <Touchable
            style={{
              width: wp('43'),
              paddingVertical: hp('1'),
              borderRadius: 10,
              borderColor:
                selectedPkg?.priceString == products[0]?.priceString
                  ? 'rgba(255, 195, 83, 1)'
                  : 'rgba(255, 255, 255, 0.05)',
              borderWidth: 1,
              paddingHorizontal: wp('2.5'),
              backgroundColor:
                selectedPkg?.priceString == products[0]?.priceString
                  ? 'rgba(203, 149, 49, 0.1)'
                  : 'rgba(255, 255, 255, 0.05)',

              // justifyContent: 'center',
              // alignItems: 'center',
            }}
            onPress={() => setSelectedPkg(products[0])}>
            <Image
              source={popular}
              resizeMode="contain"
              style={{
                width: wp('15'),
                height: hp('5'),
                position: 'absolute',
                right: wp('-3'),
                top: hp('-0.4'),
              }}
            />
            <TextComponent text={'Yearly Access'} isWhite fontFamily={'600'} />
            <Image
              source={save25}
              resizeMode="contain"
              style={{
                width: wp('18'),
                height: hp('3'),
                marginVertical: hp('1'),
              }}
            />
            <TextComponent
              text={`${products[0]?.priceString}`}
              isWhite
              fontFamily={'600'}
            />
          </Touchable>
          <Touchable
            style={{
              width: wp('43'),
              paddingVertical: hp('1'),
              borderRadius: 10,
              borderColor:
                selectedPkg?.priceString == products[1]?.priceString
                  ? 'rgba(255, 195, 83, 1)'
                  : 'rgba(255, 255, 255, 0.05)',
              borderWidth: 1,
              paddingHorizontal: wp('2.5'),
              backgroundColor:
                selectedPkg?.priceString == products[1]?.priceString
                  ? 'rgba(203, 149, 49, 0.1)'
                  : 'rgba(255, 255, 255, 0.05)',

              // justifyContent: 'center',
              // alignItems: 'center',
            }}
            onPress={() => setSelectedPkg(products[1])}>
            <TextComponent text={'Monthly Access'} isWhite fontFamily={'600'} />
            <Image
              source={save25}
              resizeMode="contain"
              style={{
                width: wp('15'),
                height: hp('3'),
                marginVertical: hp('1'),
                opacity: 0,
              }}
            />
            <TextComponent
              text={`${products[1]?.priceString}`}
              isWhite
              fontFamily={'600'}
            />
          </Touchable>
        </View>
        {selectedPkg != null && (
          <ThemeButton
            title={
              userData?.trial_start_at == null ? 'Start free trial' : 'Continue'
            }
            isYellowTheme
            style={{borderRadius: 30, marginTop: hp('10')}}
            onPress={() => buySubscription()}
          />
        )}
        {userData?.trial_start_at == null && (
          <TextComponent
            text={'Cancel anytime before the trial ends to avoid charges.'}
            styles={{
              color: Colors.textGray,
              marginLeft: wp('2'),
              paddingVertical: hp('0.5'),
            }}
            size={hp('1.5')}
          />
        )}
        {/* {userData?.trial_start_at == null && (
          <Text style={styles.subsDes} numberOfLines={2}>
            Start with <Text style={styles.boldText}>30 day free trial</Text>{' '}
            upgrade or downgrade any time.
          </Text>
        )} */}
      </View>

      {/* <Tab.Navigator
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
      </Tab.Navigator> */}
    </ImageBackground>
  );
};

export default SubscribeScreen;
