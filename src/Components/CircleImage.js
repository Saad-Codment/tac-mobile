import React from 'react';
import {Image, Dimensions} from 'react-native';
import BlurImage from './BlurImage';

export const CircleImage = ({
  styles,
  size,
  image,
  uri,
  radius,
  defaultSource,
}) => {
  return (
    <BlurImage
      defaultSource={defaultSource}
      uri={image}
      styles={{
        borderRadius: Math.round(
          Dimensions.get('window').width + Dimensions.get('window').height,
        ),
        width: !size
          ? Dimensions.get('window').width * 0.11
          : Dimensions.get('window').width * size,
        height: !size
          ? Dimensions.get('window').width * 0.11
          : Dimensions.get('window').width * size,
        ...styles,
      }}
      isURI={uri}
      radius={
        radius ??
        Math.round(
          Dimensions.get('window').width + Dimensions.get('window').height,
        )
      }
    />
  );
};
