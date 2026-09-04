import React, {memo, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  ImageBackground,
  Modal,
  Alert,
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
  signupBg,
} from '../../Assets';
import {InputComponent} from '../../Components/InputComponent';
import {Controller} from 'react-hook-form';
import {Touchable} from '../../Components/Touchable';
import useRegister from './useRegisterScreen';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';
import {LoginBg} from '../../Assets';
import {hp, wp} from '../../Config/responsive';
import SocialBottomComp from '../../Components/SocialBottomComp';
import {Colors, FontSize} from '../../Theme/Variables';
import CheckBox from 'react-native-checkbox';

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
    socialLoginFun,
    onInvalid, // add this
  } = useRegister(navigation);

  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <ImageBackground source={signupBg} style={styles.ImgBg}>
      <KeyBoardWrapper
        styles={styles.logInMain}
        showsVerticalScrollIndicator={false}>
        <View style={styles.loginBottom}>
          <View style={styles.loginTop}>
            <TextComponent text={'Sign Up'} styles={styles.signInText} />
          </View>
          <InputComponent
            {...{
              name: 'first_name',
              handleSubmit,
              errors,
              reset,
              control,
              getValues,
              placeholder: 'First Name',
              isImage: user,
              defaultValue: __DEV__ ? 'user' : '',
              handleSubmit,
              errors,
              reset,
              control,
              getValues,
              viewStyle: {height: hp('5')},
              inputIconStyle: {flex: 0.5},
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
              defaultValue: __DEV__ ? 'last' : '',
              isImage: user,
              viewStyle: {height: hp('5')},
              inputIconStyle: {flex: 0.5},
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
              viewStyle: {height: hp('5')},
              inputIconStyle: {flex: 0.5},
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
              defaultValue: __DEV__ ? 'Test@123' : '',
              isSecure: true,
              inputIconStyle: styles.lockstyle,
              viewStyle: {height: hp('5')},
              inputIconStyle: {flex: 0.4},
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
              defaultValue: __DEV__ ? 'Test@123' : '',
              isSecure: true,
              inputIconStyle: styles.lockstyle,
              viewStyle: {height: hp('5')},
              inputIconStyle: {flex: 0.4},
            }}
          />
          {/* Terms & Conditions Checkbox */}
          <View style={styles.checkboxContainer}>
            <CheckBox
              label=""
              checked={isChecked}
              onChange={
                () => setShowModal(true) // Show EULA modal only if terms are not accepted
              }
              // onChange={() => setIsChecked(!isChecked)}
            />
            <Text style={styles.checkboxText}>
              I agree to the
              <TextComponent
                styles={styles.termsLink}
                onPress={() =>
                  Linking.openURL(
                    'https://theappforcowboys.com/terms_and_conditions',
                  )
                }
                text={` Terms of Use (EULA)`}
              />
            </Text>
          </View>
          <View style={{paddingTop: hp('3')}}>
            <ThemeButton
              title={'Register'}
              onPress={() => {
                if (isChecked) handleSubmit(signUpButton, onInvalid)();
                else Alert.alert('Please accept the terms and policy');
              }}
              style={styles.buttonStyle}
              isYellowTheme={true}
              textStyle={{fontSize: hp('1.5')}}
            />
          </View>
          <View style={styles.barMain}>
            <View style={styles.barLine}></View>
            <TextComponent text={'Or Sign Up with'} styles={styles.barText} />
            <View style={styles.barLine}></View>
          </View>
          <SocialBottomComp onSocialPress={socialLoginFun} />
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

        {/* Terms & Conditions Modal */}
        <Modal visible={showModal} animationType="slide" transparent>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Terms of Use (EULA)</Text>
              <ScrollView style={styles.modalContent}>
                <Text
                  style={{
                    fontSize: FontSize.scale16,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  Effective Date: February 19, 2025{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  Welcome to TAC! By accessing or using our platform, you agree
                  to comply with these Terms of Use, our Privacy Policy, and
                  Community Guidelines. Please read them carefully.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  TABLE OF CONTENTS{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  - Acceptance of Terms{'\n'}- User Responsibilities{'\n'}-
                  Community Guidelines{'\n'}- Job Posting & Reporting System
                  {'\n'}- Content Moderation & Enforcement{'\n'}- Compliance
                  with Apple’s Policies{'\n'}- No Tolerance for Objectionable
                  Content or Abusive Users{'\n'}- Changes to These Terms{'\n'}-
                  Contact Us{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  1. Acceptance of Terms{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  By accessing or using TAC ("Platform"), you agree to abide by
                  these Terms of Use. If you do not agree, please refrain from
                  using our services.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  2. User Responsibilities{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  As a user of TAC, you are expected to:{'\n'}- Provide Accurate
                  Information: Ensure all information you provide is truthful
                  and current.{'\n'}- Comply with Laws: Adhere to all applicable
                  laws and regulations.{'\n'}- Respect Others: Engage with other
                  users professionally and courteously.{'\n'}- Avoid Prohibited
                  Activities: Refrain from fraudulent, misleading, or harmful
                  actions.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  3. Community Guidelines{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  To maintain a safe and respectful environment, users must not:
                  {'\n'}- Post Spam or Scams: Avoid sharing deceptive or
                  irrelevant content.{'\n'}- Share Inappropriate Content: Do not
                  post offensive, explicit, or illegal material.{'\n'}- Provide
                  Misleading Information: Ensure all shared information is
                  accurate and clear.{'\n'}- Engage in Unsafe or Illegal
                  Activities: Activities that are dangerous or unlawful are
                  strictly prohibited.{'\n\n'}
                  Violations of these guidelines may lead to content removal or
                  account suspension.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  4. Job Posting & Reporting System{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  TAC enables users to post and accept jobs. To uphold quality
                  and safety, we have implemented a reporting system for
                  user-generated content.{'\n\n'}
                  Reporting Process:{'\n'}
                  Users can report posts for reasons including:{'\n'}- Spam or
                  Scam{'\n'}- Inappropriate Content{'\n'}- Misleading
                  Information{'\n'}- Unsafe or Illegal Activity{'\n'}- Duplicate
                  Content or Job Posting{'\n'}- Violation of Community
                  Guidelines{'\n\n'}
                  Reported content will be reviewed and may be removed. Users
                  who consistently violate guidelines may face account
                  suspension.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  5. Content Moderation & Enforcement{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  Our moderation team actively reviews reported content and
                  takes necessary actions:{'\n'}- Content Removal: Content that
                  breaches our guidelines will be taken down.{'\n'}- Account
                  Suspension: Repeat offenders may have their accounts
                  suspended.{'\n'}- Appeals: Users can contact support if they
                  believe a report was made in error.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  6. Compliance with Apple’s Policies{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  In line with Apple's App Store Review Guidelines, TAC has
                  implemented:{'\n'}- User Reporting Mechanism: Users can flag
                  objectionable content directly within the app.{'\n'}- Content
                  Filtering: Systems are in place to identify and filter
                  inappropriate content.{'\n'}- User Blocking Feature: Users can
                  block others who engage in abusive behavior.{'\n'}- Timely
                  Response: Reported content is reviewed promptly, with actions
                  taken within 24 hours when necessary.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  7. No Tolerance for Objectionable Content or Abusive Users
                  {'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  At TAC, we are committed to maintaining a safe, respectful,
                  and professional environment for all users. We have a
                  zero-tolerance policy for objectionable content and abusive
                  behavior. By using our platform, you agree to abide by the
                  following guidelines:{'\n\n'}- Prohibited Content: Any content
                  that is offensive, discriminatory, violent, sexually explicit,
                  misleading, fraudulent, or otherwise inappropriate is strictly
                  forbidden. This includes posting text, events, messages, and
                  any other user-generated content.{'\n'}- Respectful
                  Interactions: Users must communicate in a professional and
                  courteous manner. Harassment, hate speech, bullying, threats,
                  or any form of abusive behavior will not be tolerated.{'\n'}-
                  Reporting and Enforcement: Users can report violations
                  directly through the app.{'\n'}- Immediate Action: We actively
                  monitor reported content and take necessary actions within 24
                  hours. Users who violate these policies may be permanently
                  banned from using the platform.{'\n\n'}
                  By using TAC, you acknowledge and agree to these terms. Any
                  violation may result in immediate action, including removal of
                  content or termination of your account.{'\n'}
                  We are dedicated to fostering a safe and positive community.
                  If you encounter any violations, please report them promptly.
                  {'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  8. Changes to These Terms{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  We may update these Terms periodically. Continued use of the
                  platform signifies acceptance of any changes.{'\n\n'}
                </Text>

                <Text
                  style={{
                    fontSize: FontSize.scale18,
                    fontWeight: '700',
                    color: 'black',
                  }}>
                  9. Contact Us{'\n'}
                </Text>
                <Text style={{color: 'black'}}>
                  For questions or concerns about these Terms, please reach out
                  to us at{' '}
                  <Text style={{fontWeight: '700', color: 'black'}}>
                    theappforcowboys@gmail.com
                  </Text>
                  .{'\n\n'}
                  By using TAC, you agree to these Terms and commit to fostering
                  a positive community. Thank you for being a valued member of
                  our platform!{'\n'}
                </Text>
              </ScrollView>

              {/* Modal Actions */}
              <View style={styles.modalButtons}>
                <ThemeButton
                  title="Decline"
                  onPress={() => {
                    setIsChecked(false);

                    setShowModal(false);
                  }}
                  // style={styles.modalCancel}
                  textStyle={{
                    fontSize: FontSize.scale15,
                    fontFamily: 'Nunito-bold',
                  }}
                  style={{
                    ...styles.buttonStyle,
                    width: wp('40'),
                  }}
                />
                <ThemeButton
                  title="Accept & Proceed"
                  onPress={() => {
                    setIsChecked(true);
                    setShowModal(false);
                    // handleSubmit(signUpButton)();
                  }}
                  textStyle={{
                    fontSize: FontSize.scale15,
                    fontFamily: 'Nunito-bold',
                    color: Colors.white,
                  }}
                  style={{
                    ...styles.buttonStyle,
                    backgroundColor: Colors.primaryColor,
                    width: wp('40'),
                    marginLeft: wp('2'),
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </KeyBoardWrapper>
    </ImageBackground>
  );
};
export default memo(RegisterScreen);
