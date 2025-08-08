import {View, Text, TextInput, Image} from 'react-native';
import React, {memo} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import ThemeButton from '../../Components/ThemeButton';
import {Touchable} from '../../Components/Touchable';
import {TextComponent} from '../../Components/TextComponent';
import useContactUsScreen from './useContactUsScreen';
import {styles} from './styles';
import {radioCircle, radioCircleOn} from '../../Assets';
import {hp, wp} from '../../Config/responsive';

const ContactUsScreen = ({navigation}) => {
  const {
    message,
    reasonList,
    selectedVal,
    setMessage,
    setSelectedVal,
    submitContactForm,
  } = useContactUsScreen();

  return (
    <View style={{flex: 1}}>
      <HeaderComponent headerTitle={'Contact Us'} isBack />
      {/* <TextComponent text="Report" styles={styles.modalHeading} /> */}
      <View style={{width: wp('90'), alignSelf: 'center'}}>
        <TextComponent
          text="Have questions or feedback? Reach out — we’re here for every rodeo ride!"
          styles={styles.innerHeading}
        />
        {reasonList?.map(res => (
          <View
            key={res.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Touchable onPress={() => setSelectedVal(res)}>
              <Image
                source={
                  res?.id === selectedVal?.id ? radioCircleOn : radioCircle
                }
                resizeMode="contain"
                style={styles.leftViewImg}
              />
            </Touchable>
            <TextComponent
              onPress={() => setSelectedVal(res)}
              text={res?.name}
              styles={styles.reportMessStyle}
            />
          </View>
        ))}
        <View style={styles.inputView}>
          <TextInput
            placeholder="Please type your message"
            placeholderTextColor="gray"
            value={message}
            onChangeText={setMessage}
            multiline
            style={{color: 'black', fontSize: hp('1.5')}}
          />
        </View>
      </View>
      <View style={styles.buttonRow}>
        <ThemeButton
          title="Cancel"
          style={styles.button}
          onPress={() => navigation.goBack()}
          textStyle={styles.buttonText}
        />
        <ThemeButton
          title="Submit"
          isYellowTheme
          style={styles.button}
          onPress={submitContactForm}
          textStyle={styles.buttonText}
        />
      </View>
    </View>
  );
};

export default memo(ContactUsScreen);
