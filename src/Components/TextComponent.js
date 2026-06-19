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
  isDarkTheme,
  fontFamily,
  size,
  disable,
  onLongPress,
}) => {
  return (
    <Text
      onPress={onPress}
      numberOfLines={numberOfLines}
      android_disableSound={true}
      suppressHighlighting={true} // This is specifically for iOS but might help
      disabled={disable}
      onLongPress={onLongPress}
      style={{
        color: fade
          ? Colors.grayFaded
          : isWhite
          ? Colors.white
          : isThemeColor
          ? Colors.yellowTextColor
          : isLightThemeColor
          ? Colors.primaryColor
          : isDarkTheme
          ? Colors.backgroundTheme
          : Colors.black,
        fontSize: size ?? hp('2'),
        fontWeight: fontFamily ?? '400',
        ...styles,
      }}>
      {text}
    </Text>
  );
};
