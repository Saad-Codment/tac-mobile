import React from 'react';
import {TouchableOpacity} from 'react-native';

export const Touchable = ({children, onPress, disabled, Opacity, style}) => (
  <TouchableOpacity {...{onPress, activeOpacity: Opacity, style, disabled}}>
    {children}
  </TouchableOpacity>
);
