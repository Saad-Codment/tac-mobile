import React, {memo} from 'react';
import {View, Text, ImageBackground, Image} from 'react-native';
import {arrowBack, backIcon, stepBg} from '../../Assets';
import {TextComponent} from '../../Components/TextComponent';
import {styles} from './styles';
import {CodeField, Cursor} from 'react-native-confirmation-code-field';
import useVerificationScreen from './useVerficationScreen';
import ThemeButton from '../../Components/ThemeButton';
import {hp, wp} from '../../Config/responsive';
import CountDownTimer from 'react-native-countdown-timer-hooks';
import {Colors} from '../../Theme/Variables';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';
import {Touchable} from '../../Components/Touchable';

const VerficationScreen = ({route, navigation}) => {
  const {
    props,
    getCellOnLayoutHandler,
    value,
    setValue,
    ref,
    CELL_COUNT,
    VerifyCode,
    goBack,
    isResend,
    setIsResend,
    refTimer,
    timerCallbackFunc,
    resendOTP,
    timerOnProgressFunc,
    sendVerfication,
  } = useVerificationScreen(navigation, route);
  // isBack
  return (
    <>
      <ImageBackground source={stepBg} style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Touchable
            onPress={() => {
              navigation.goBack();
            }}
            disabled={Boolean(route.params?.isBack)}>
            <Image
              source={backIcon}
              resizeMode="contain"
              style={{
                width: wp('6'),
                height: wp('6'),
                marginTop: hp('8'),
                marginLeft: wp('2'),
                display: !route.params?.isBack ? 'flex' : 'none',
              }}
            />
          </Touchable>
        </View>
      </ImageBackground>
      <KeyBoardWrapper>
        <TextComponent
          text={'Verification Code'}
          styles={{fontSize: hp('2'), fontWeight: 'bold', marginLeft: wp('5')}}
        />
        <TextComponent
          text={`An OTP has been sent to your number. Enter it below to continue.`}
          styles={styles.des}
        />
        <CodeField
          // ref={ref}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
        <View style={styles.otpSendView}>
          <TextComponent
            text={"Didn't receive OTP? "}
            styles={{fontSize: hp('1.5')}}
          />
          <CountDownTimer
            ref={refTimer}
            timestamp={120}
            timerCallback={timerCallbackFunc}
            timerOnProgress={timerOnProgressFunc}
            containerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            textStyle={styles.OtpTextStyle}
          />
          {isResend && (
            <TextComponent
              text={'Resend OTP'}
              styles={{color: Colors.primaryColor}}
              onPress={resendOTP}
              style={{
                marginTop: hp('5'),
                height: hp('4'),
                width: wp('85'),
                alignSelf: 'center',
                ontSize: hp('1.5'),
              }}
              textStyle={{fontSize: hp('1.5')}}
            />
          )}
        </View>
        {value.length == 6 && (
          <View style={styles.verificationBtn}>
            <ThemeButton
              onPress={async () => await VerifyCode()}
              title={'Verify'}
              style={{
                marginTop: hp('5'),
                height: hp('4'),
                width: wp('85'),
                alignSelf: 'center',
              }}
              textStyle={{fontSize: hp('1.5')}}
            />
          </View>
        )}
      </KeyBoardWrapper>
    </>
  );
};

export default memo(VerficationScreen);
