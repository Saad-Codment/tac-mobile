import React from 'react';
import {Text, Image, StyleSheet} from 'react-native';
import {Colors, FontFamily} from '../Theme/Variables';
import {Touchable} from './Touchable';
import {hp, wp} from '../Config/responsive';

const TabButton = ({title, onPress, image, style, textStyle, btnStyle}) => {
  return (
    <Touchable
      Opacity={0.7}
      onPress={onPress}
      style={[styles.button, {justifyContent: 'center', ...style}]}>
      <Text style={[styles.text, {...textStyle}]}>{title}</Text>
    </Touchable>
  );
};

export default TabButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primaryColor,
    // height: hp('5'),
    paddingVertical: hp('1.1'),
    paddingHorizontal: wp('3.7'),
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontSize: hp('1.8'),
    color: Colors.white,
    textAlign: 'center',
    // marginLeft: wp('3'),
    fontWeight: 400,
  },
  linearGradient: {
    borderRadius: 7,
  },
});
