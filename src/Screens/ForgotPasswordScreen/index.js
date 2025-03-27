import {View, Text, ImageBackground, Image} from 'react-native';
import React, {memo} from 'react';
import {arrowLeft, sms, stepBg} from '../../Assets';
import {styles} from './styles';
import {TextComponent} from '../../Components/TextComponent';
import {hp, wp} from '../../Config/responsive';
import {InputComponent} from '../../Components/InputComponent';
import useForgotPasswordScreen from './useForgotPasswordScreen';
import {Colors} from '../../Theme/Variables';
import ThemeButton from '../../Components/ThemeButton';
import {Touchable} from '../../Components/Touchable';

const ForgotPasswordScreen = ({navigation}) => {
  const {
    handleSubmit,
    errors,
    reset,
    control,
    getValues,
    goBack,
    forgotPassword,
  } = useForgotPasswordScreen(navigation);
  return (
    <>
      <ImageBackground source={stepBg} style={styles.container}>
        <Touchable style={styles.skipBtn} onPress={navigation.goBack}>
          <Image
            source={arrowLeft}
            style={{
              resizeMode: 'contain',
              tintColor: 'white',
              width: wp('5'),
              // ...styles.arrowback,
              // ...backIconStyle,
            }}
          />
          <TextComponent
            text={'Back'}
            fade
            // onPress={() => handleNextStep[step]()}
          />
        </Touchable>
      </ImageBackground>
      <TextComponent
        text={'Forgot Password'}
        styles={{fontSize: hp('3'), fontWeight: 'bold', marginLeft: wp('5')}}
      />
      <TextComponent
        text={
          'Don’t worry! It happens, please enter the email address associated with your account.'
        }
        styles={{
          marginLeft: wp('5'),
          marginVertical: hp('2'),
          fontSize: hp('1.5'),
          color: 'gray',
        }}
      />
      <InputComponent
        {...{
          name: 'email',
          handleSubmit,
          errors,
          reset,
          control,
          getValues,
          placeholder: 'Email',
          isImage: sms,
          defaultValue: __DEV__ ? 'iphonexr@gmail.com' : '',
          placeholderTextColor: 'gray',
          selectionColor: 'gray',
          viewStyle: {
            backgroundColor: 'transparent',
            borderColor: 'gray',
            width: wp('95'),
            alignSelf: 'center',
            marginTop: hp('2'),
          },
          errorStyle: {
            color: Colors.themeRed,
          },
          textStyle: {
            color: 'black',
          },
        }}
      />
      <ThemeButton
        onPress={handleSubmit(forgotPassword)}
        title={'Send'}
        isYellowTheme
        style={styles.buttonStyle}
      />
    </>
  );
};

export default memo(ForgotPasswordScreen);
