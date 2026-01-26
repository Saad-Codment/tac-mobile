import {View, Text, Linking, ImageBackground, Image} from 'react-native';
import React, {memo, useEffect} from 'react';
import Purchases from 'react-native-purchases';
import {backIcon, subBg} from '../../Assets';
import {TextComponent} from '../../Components/TextComponent';
import {hp, wp} from '../../Config/responsive';
import DividerLine from '../../Components/DividerLine';
import useCancelSubScreen from './useCancelSubScreen';
import {Touchable} from '../../Components/Touchable';
import ThemeButton from '../../Components/ThemeButton';

const CancelSubScreen = ({navigation}) => {
  const {userData} = useCancelSubScreen();

  return (
    <ImageBackground
      style={{flex: 1, paddingHorizontal: wp('4.5')}}
      source={subBg}>
      <Touchable
        style={{
          marginTop: hp('5'),
        }}
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={backIcon}
          resizeMode="contain"
          style={{width: wp('5'), height: hp('4')}}
        />
      </Touchable>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <TextComponent
          text={'TAC is now '}
          isWhite
          size={hp('3')}
          fontFamily={'bold'}
        />
        <TextComponent
          text={'Free'}
          isLightThemeColor
          size={hp('3')}
          fontFamily={'bold'}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: hp('2'),
        }}>
        <TextComponent text={'Great news! TAC is now '} fade size={hp('1.8')} />
        <TextComponent text={'100%'} isWhite size={hp('1.8')} />
        <TextComponent text={' free for everyone.'} fade size={hp('1.8')} />
      </View>
      <DividerLine
        DividerLineStyle={{
          backgroundColor: 'white',
          width: wp('95'),
          alignSelf: 'center',
          marginVertical: hp('2'),
        }}
      />
      <TextComponent
        text={'You can continue using every feature of the app at no cost.'}
        isWhite
        size={hp('2')}
        fontFamily={'bold'}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: hp('2'),
        }}>
        <TextComponent
          text={'You previously subscribed to '}
          isWhite
          size={hp('2')}
        />
        <TextComponent
          text={`${userData?.product?.billing_period} package`}
          isLightThemeColor
          size={hp('2')}
          fontFamily={'bold'}
        />
      </View>
      <TextComponent
        text={`To avoid future charges, please cancel your subscription in your App Store account.`}
        isWhite
        size={hp('2')}
      />
      <TextComponent
        text={
          'You’ll continue to enjoy all features for free, even after canceling.'
        }
        isWhite
        size={hp('2')}
        styles={{
          marginVertical: hp('2'),
        }}
      />
      <DividerLine
        DividerLineStyle={{
          backgroundColor: 'white',
          width: wp('95'),
          alignSelf: 'center',
          marginVertical: hp('2'),
        }}
      />
      <TextComponent
        text={'How to Cancel?'}
        isWhite
        size={hp('2')}
        fontFamily={'bold'}
      />

      <TextComponent
        text={
          userData?.product?.platform == 'app_store'
            ? 'iPhone: Settings → Apple ID → Subscriptions → TAC → Cancel'
            : 'Android: Play Store → Profile → Subscriptions → TAC → Cancel'
        }
        fade
        size={hp('1.8')}
        styles={{marginTop: hp('1.5')}}
      />
      <ThemeButton
        title={'I Understand, Cancel my subscription'}
        isYellowTheme
        style={{height: hp('6'), marginTop: hp('10')}}
        onPress={async () => {
          const customerInfo = await Purchases.getCustomerInfo();
          const managementUrl = customerInfo.managementURL;
          console.log(
            'managementUrlmanagementUrlmanagementUrlmanagementUrlmanagementUrlmanagementUrl',
            managementUrl,
          );
          Linking.openURL(managementUrl);
        }}
      />
    </ImageBackground>
  );
};

export default memo(CancelSubScreen);
