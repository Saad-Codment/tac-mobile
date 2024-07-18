import React, {memo} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  ImageBackground,
} from 'react-native';
import {TextComponent} from '../../Components/TextComponent';
import {styles} from './styles';
import ThemeButton from '../../Components/ThemeButton';
import {
  email,
  lock,
  userIcon,
  phone,
  logo,
  rememberImg,
  rememberEmpty,
  username,
  emailIcon,
  passwordIcon,
  company,
  google,
  facebook,
  apple,
  locksetting,
  sms,
  user,
} from '../../Assets';
import {InputComponent} from '../../Components/InputComponent';
import {Controller} from 'react-hook-form';
import {Touchable} from '../../Components/Touchable';
import useRegister from './useRegisterScreen';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';
import {LoginBg} from '../../Assets';
import {hp} from '../../Config/responsive';
import SocialBottomComp from '../../Components/SocialBottomComp';

const RegisterScreen = ({navigation}) => {
  const {
    handleSubmit,
    errors,
    reset,
    control,
    getValues,
    goBack,
    loginNav,
    signUpButton,
    PolicyValue,
    policy,
  } = useRegister(navigation);
  return (
    <ImageBackground source={LoginBg} style={styles.ImgBg}>
      <KeyBoardWrapper
        styles={styles.logInMain}
        showsVerticalScrollIndicator={false}>
        <View style={styles.loginBottom}>
          <View style={styles.loginTop}>
            <TextComponent text={'Sign Up'} styles={styles.signInText} />
          </View>
          <InputComponent
            {...{
              name: 'name',
              handleSubmit,
              errors,
              reset,
              control,
              getValues,
              placeholder: 'First Name',
              isImage: user,
              defaultValue: '',
              handleSubmit,
              errors,
              reset,
              control,
              getValues,
            }}
          />
          <InputComponent
            {...{
              name: 'last_name',
              handleSubmit,
              errors,
              reset,
              control,
              getValues,
              placeholder: 'Last Name',
              defaultValue: '',
              isImage: user,
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
              placeholder: 'Email Address',
              isImage: sms,
              defaultValue: '',
            }}
          />
          <InputComponent
            {...{
              name: 'password',
              handleSubmit,
              errors,
              reset,
              control,
              getValues,
              placeholder: 'Password',
              isImage: locksetting,
              defaultValue: '',
              isSecure: true,
              inputIconStyle: styles.lockstyle,
            }}
          />
          <InputComponent
            {...{
              name: 'confirm_password',
              handleSubmit,
              errors,
              reset,
              control,
              getValues,
              placeholder: 'Confirm Password',
              isImage: locksetting,
              defaultValue: '',
              isSecure: true,
              inputIconStyle: styles.lockstyle,
            }}
          />
          <View style={{paddingTop: hp('3')}}>
            <ThemeButton
              title={'Register'}
              onPress={handleSubmit(signUpButton)}
              style={styles.buttonStyle}
            />
          </View>
          <View style={styles.barMain}>
            <View style={styles.barLine}></View>
            <TextComponent text={'Or Sign Up with'} styles={styles.barText} />
            <View style={styles.barLine}></View>
          </View>
          <SocialBottomComp />
          <View style={styles.dontHave}>
            <TextComponent
              text={'Already have an account?'}
              styles={styles.dontHaveText}
            />
            <Touchable onPress={loginNav}>
              <Text style={styles.signUpText}>Log In</Text>
            </Touchable>
          </View>
        </View>
      </KeyBoardWrapper>
    </ImageBackground>
  );
};
export default memo(RegisterScreen);
