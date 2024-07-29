import React from 'react';
import {Image, Dimensions} from 'react-native';
import BlurImage from './BlurImage';

export const CircleImage = props => {
  const {styles} = props;
  return (
    <BlurImage
      blurhash={'LKK1wP_3yYIU4.jsWrt7_NRjMdt7'}
      // uri={props?.image}
      uri={props?.uri ? {uri: props?.uri} : props?.image}
      styles={{
        borderRadius: Math.round(
          Dimensions.get('window').width + Dimensions.get('window').height,
        ),
        width: Dimensions.get('window').width * 0.15,
        height: Dimensions.get('window').width * 0.15,
        ...styles,
      }}
      isURI={props?.IsUri}
      radius={Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      )}
    />
  );
};
