import React from 'react';
import {Text} from 'react-native';
import {hp} from '../Config/responsive';
import {Colors} from '../Theme/Variables';

export const TextComponent = ({
  text,
  styles,
  onPress,
  numberOfLines,
  fade,
  isWhite,
  isThemeColor,
  isLightThemeColor,
}) => {
  return (
    <Text
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={{
        color: fade
          ? Colors.grayFaded
          : isWhite
          ? Colors.white
          : isThemeColor
          ? Colors.yellowTextColor
          : isLightThemeColor
          ? Colors.primaryColor
          : Colors.black,
        fontSize: hp('2'),
        ...styles,
      }}>
      {text}
    </Text>
  );
};
