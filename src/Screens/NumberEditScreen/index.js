import {View, Text, ImageBackground} from 'react-native';
import React, {memo} from 'react';
import {stepBg} from '../../Assets';
import {TextComponent} from '../../Components/TextComponent';
import {InputComponent} from '../../Components/InputComponent';
import ThemeButton from '../../Components/ThemeButton';
import useNumberEditScreen from './useNumberEditScreen';
import {hp, wp} from '../../Config/responsive';
import {styles} from './styles';
import {AlertDesign} from '../../Components/AlertDesign';
import PhoneInput from 'react-native-phone-number-input';
import {Touchable} from '../../Components/Touchable';
import {Colors} from '../../Theme/Variables';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';
import {parsePhoneNumberFromString} from 'libphonenumber-js';

const NumberEditScreen = ({navigation}) => {
  const {
    goBack,
    formattedNumber,
    sendVerficationCode,
    updateState,
    edit,
    phoneNumber,
    phoneInput,
    handleCountryChange,
    handlePhoneNumberChange,
    validationError,
    maxLength,
    number,
  } = useNumberEditScreen(navigation);

  console.log(
    'formattedNumberformattedNumberformattedNumberformattedNumber',
    formattedNumber,
  );

  return (
    <>
      <ImageBackground
        source={stepBg}
        style={styles.container}></ImageBackground>
      <KeyBoardWrapper>
        <TextComponent
          text={(edit ? 'Enter Your' : 'Confirm Your') + ' Number'}
          styles={{fontSize: hp('3'), fontWeight: 'bold', marginLeft: wp('5')}}
        />
        <TextComponent
          text={'Please enter you phone number for verfication purposes.'}
          styles={styles.des}
        />
        {!edit && (
          <View style={styles.numberView}>
            <TextComponent
              text={phoneNumber}
              styles={{fontSize: hp('2'), fontWeight: 'bold'}}
            />
            <TextComponent
              text={'Edit'}
              styles={{fontSize: hp('2'), color: 'gray'}}
              onPress={() => updateState({edit: true})}
            />
          </View>
        )}
        {edit && (
          <>
            <View style={styles.fieldView}>
              <PhoneInput
                ref={phoneInput}
                defaultValue={number}
                defaultCode="US"
                layout="first"
                onChangeFormattedText={handlePhoneNumberChange}
                onChangeCountry={handleCountryChange}
                value={formattedNumber}
                autoFocus={false}
                containerStyle={styles.inputView}
                textInputStyle={{
                  textAlignVertical: 'center',
                  verticalAlign: 'middle',
                }}
                textInputProps={{
                  placeholderTextColor: 'gray',
                  keyboardType: 'number-pad',
                  blurOnSubmit: true,
                  padding: 0,
                  maxLength: maxLength, // Add maxLength restriction
                }}
                textContainerStyle={{backgroundColor: 'transparent'}}
              />
            </View>
            {/* {validationError ? (
              <TextComponent
                text={validationError}
                styles={{color: 'red', marginTop: hp('1')}}
              />
            ) : null} */}
          </>
        )}
        <View style={styles.btnView}>
          <ThemeButton
            onPress={sendVerficationCode}
            title={'Send'}
            isYellowTheme
            style={{marginTop: hp('5')}}
          />
          {/* {edit && !isVerified && (
            <Touchable onPress={skipVerification}>
              <ThemeButton
                style={styles.bottomText}
                GradientAlignment={0.6}
                title={'Skip Verification'}
              />
            </Touchable>
          )} */}
        </View>
      </KeyBoardWrapper>
    </>
  );
};

export default memo(NumberEditScreen);
