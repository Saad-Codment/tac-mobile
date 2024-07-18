import React from 'react';
import {Text, Image, StyleSheet} from 'react-native';
import {Colors, FontFamily} from '../Theme/Variables';
import {Touchable} from './Touchable';
import {hp, wp} from '../Config/responsive';

const ThemeButton = ({title, onPress, image, style, textStyle, btnStyle}) => {
  return (
    <Touchable
      Opacity={0.7}
      onPress={onPress}
      style={[styles.button, {justifyContent: 'center', ...style}]}>
      <Text style={[styles.text, {...textStyle}]}>{title}</Text>
    </Touchable>
  );
};

export default ThemeButton;

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
    fontWeight: 500,
  },
  linearGradient: {
    borderRadius: 10,
  },
});
