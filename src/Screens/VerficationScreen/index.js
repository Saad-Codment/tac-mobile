import React, {memo} from 'react';
import {View, Text, ImageBackground} from 'react-native';
import {arrowBack, stepBg} from '../../Assets';
import {TextComponent} from '../../Components/TextComponent';
import {styles} from './styles';
import {CodeField, Cursor} from 'react-native-confirmation-code-field';
import useVerificationScreen from './useVerficationScreen';
import ThemeButton from '../../Components/ThemeButton';
import {hp, wp} from '../../Config/responsive';
import CountDownTimer from 'react-native-countdown-timer-hooks';
import {Colors} from '../../Theme/Variables';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';

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
  } = useVerificationScreen(navigation, route);

  return (
    <>
      <ImageBackground
        source={stepBg}
        style={styles.container}></ImageBackground>
      <KeyBoardWrapper>
        <TextComponent
          text={'Verification Code'}
          styles={{fontSize: hp('3'), fontWeight: 'bold', marginLeft: wp('5')}}
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
          <TextComponent text={"Didn't receive OTP? "} />
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
            />
          )}
        </View>
        {value.length == 6 && (
          <View style={styles.verificationBtn}>
            <ThemeButton
              onPress={async () => await VerifyCode()}
              title={'Verify'}
            />
          </View>
        )}
      </KeyBoardWrapper>
    </>
  );
};

export default memo(VerficationScreen);
