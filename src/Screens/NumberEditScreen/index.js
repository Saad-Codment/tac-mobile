import {View, Text, ImageBackground, Image} from 'react-native';
import React, {memo} from 'react';
import {backIcon, heart, logout, stepBg} from '../../Assets';
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
import {logOutAuth} from '../../Redux/Action/AuthAction';

const NumberEditScreen = ({navigation, route}) => {
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
    dispatch,
  } = useNumberEditScreen(navigation);

  console.log(
    'formattedNumberformattedNumberformattedNumberformattedNumber',
    formattedNumber,
  );

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
            disabled={!Boolean(route.params)}>
            <Image
              source={backIcon}
              resizeMode="contain"
              style={{
                width: wp('6'),
                height: wp('6'),
                marginTop: hp('8'),
                marginLeft: wp('2'),
                display: route.params ? 'flex' : 'none',
              }}
            />
          </Touchable>
          <Touchable
            onPress={() => {
              dispatch(logOutAuth());
            }}>
            <Image
              source={logout}
              resizeMode="contain"
              style={{
                width: wp('6'),
                height: wp('6'),
                marginTop: hp('8'),
                alignSelf: 'flex-end',
                marginRight: wp('2'),
              }}
            />
          </Touchable>
        </View>
      </ImageBackground>
      <KeyBoardWrapper>
        <TextComponent
          text={(edit ? 'Enter Your' : 'Confirm Your') + ' Number'}
          styles={{
            fontSize: hp('1.8'),
            fontWeight: 'bold',
            marginLeft: wp('5'),
          }}
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
              onPress={() =>
                updateState({edit: true, number: '', formattedNumber: ''})
              }
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
                  style: {
                    // backgroundColor: 'red',
                    height: hp('2'),
                  },
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
            style={{
              marginTop: hp('5'),
              height: hp('4'),
              width: wp('85'),
              alignSelf: 'center',
            }}
            textStyle={{fontSize: hp('1.5')}}
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
