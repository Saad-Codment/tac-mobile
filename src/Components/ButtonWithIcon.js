import React from 'react';
import {Text, Image, StyleSheet} from 'react-native';
import {Colors, FontFamily} from '../Theme/Variables';
import {Touchable} from './Touchable';
import {hp, wp} from '../Config/responsive';

const ButtonWithIcon = ({
  title,
  onPress,
  image,
  style,
  textStyle,
  imageStyle,
}) => {
  return (
    <Touchable
      Opacity={0.7}
      onPress={onPress}
      style={[styles.button, {...style}]}>
      <Image source={image} style={{...styles.image, ...imageStyle}} />
      <Text style={[styles.text, {...textStyle}]}>{title}</Text>
    </Touchable>
  );
};

export default ButtonWithIcon;

const styles = StyleSheet.create({
  button: {
    height: hp('6.5'),
    // width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
  },
  text: {
    fontSize: hp('2'),
    color: Colors.black,
    textAlign: 'center',
    marginLeft: wp('3'),
    fontWeight: 500,
  },
  image: {
    width: 23,
    height: 23,
    // marginBottom: 5,
    resizeMode: 'contain',
  },
  linearGradient: {
    borderRadius: 10,
  },
});
