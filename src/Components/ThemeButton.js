import React from 'react';
import {Text, Image, StyleSheet} from 'react-native';
import {Colors, FontFamily} from '../Theme/Variables';
import {Touchable} from './Touchable';
import {share} from '@/Assets/Images';
import {hp, wp} from '../Config/responsive';

const ThemeButton = ({
  title,
  onPress,
  image,
  style,
  textStyle,
  imageStyle,
  isDisable,
  isYellowTheme,
  isRightImg,
  rightImgStyle,
  isWhite,
}) => {
  return (
    // <ShadowButton>
    <Touchable
      Opacity={0.7}
      onPress={onPress}
      disabled={isDisable}
      style={[
        styles.button,
        {
          justifyContent: 'center',
          backgroundColor: isYellowTheme
            ? Colors.primaryColor
            : isWhite
            ? Colors.white
            : Colors.backgroundTheme,
          ...style,
        },
      ]}>
      {image && (
        <Image
          source={image}
          style={{
            ...styles.image,
            marginRight: image ? wp('1') : 0,
            ...imageStyle,
          }}
          resizeMode="contain"
        />
      )}
      <Text
        style={[
          styles.text,
          {
            marginLeft: image ? wp('1') : 0,
            color: isWhite ? 'black' : 'white',
            ...textStyle,
          },
        ]}>
        {title}
      </Text>
      {isRightImg && (
        <Image
          source={isRightImg}
          style={{
            ...styles.image,
            marginRight: isRightImg ? wp('1') : 0,
            ...rightImgStyle,
          }}
          resizeMode="contain"
        />
      )}
    </Touchable>
    // </ShadowButton>
  );
};

export default ThemeButton;

const styles = StyleSheet.create({
  button: {
    height: hp('6.5'),
    // width: wp('40'),
    width: '100%',
    borderRadius: 10,
    // marginVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    // paddingHorizontal: '22.5%',
    justifyContent: 'center',
  },
  image: {
    width: wp('8'),
    height: hp('8'),
    // marginBottom: 5,
    resizeMode: 'contain',
  },
  text: {
    // fontSize: heightPercentageToDP('2'),
    color: Colors.white,
    textAlign: 'center',
    fontSize: hp('2'),
    // marginRight: wp('3'),
    // fontFamily: FontFamily.regular,
  },
});
