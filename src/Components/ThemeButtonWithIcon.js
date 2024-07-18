import React from 'react';
import {Text, Image, StyleSheet} from 'react-native';
import {Colors, FontFamily} from '../Theme/Variables';
import {Touchable} from './Touchable';
import {hp, wp} from '../Config/responsive';
import {documentDownload} from '../Assets';

const ThemeButtonWithIcon = ({
  title,
  onPress,
  image,
  style,
  textStyle,
  btnStyle,
  imageStyle,
}) => {
  return (
    <Touchable
      Opacity={0.7}
      onPress={onPress}
      style={[styles.button, {justifyContent: 'center', ...style}]}>
      <Image source={image} style={[styles.iconStyle, {...imageStyle}]} />
      <Text style={[styles.text, {...textStyle}]}>{title}</Text>
    </Touchable>
  );
};

export default ThemeButtonWithIcon;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primaryColor,
    height: hp('6.5'),
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontSize: hp('2'),
    color: Colors.white,
    textAlign: 'center',
    // marginLeft: wp('3'),
    fontWeight: 400,
  },
  linearGradient: {
    borderRadius: 10,
  },
  iconStyle: {
    width: wp('6'),
    height: hp('3'),
    marginRight: wp('3'),
  },
});
