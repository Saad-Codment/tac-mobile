import React from 'react';
import {Image, Dimensions} from 'react-native';
import BlurImage from './BlurImage';

export const CircleImage = ({styles, uri, IsUri, image}) => {
  // const {styles} = props;
  return (
    <BlurImage
      blurhash={'LKK1wP_3yYIU4.jsWrt7_NRjMdt7'}
      // uri={props?.image}
      uri={uri ? {uri: uri} : image}
      styles={{
        borderRadius: Math.round(
          Dimensions.get('window').width + Dimensions.get('window').height,
        ),
        width: Dimensions.get('window').width * 0.15,
        height: Dimensions.get('window').width * 0.15,
        ...styles,
      }}
      isURI={IsUri}
      radius={Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      )}
    />
  );
};
