import React, {useState} from 'react';
import {View} from 'react-native';
import {Blurhash} from 'react-native-blurhash';
import FastImage from 'react-native-fast-image';

const BlurImage = ({
  styles,
  uri,
  blurhash,
  radius,
  children,
  isURI,
  defaultSource,
}) => {
  const [load, setLoad] = useState(Boolean(!defaultSource));
  const imageSource = {uri, priority: FastImage.priority.high};
  function hasHttpProtocol(url) {
    // Check if the URL starts with http:// or https://
    return /^https?:\/\//i.test(url);
  }

  // const imageSource = uri
  //   ? {uri, priority: FastImage.priority.normal}
  //   : background;
  return (
    <View
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: radius ?? 10,
      }}>
      <FastImage
        style={[styles, {zIndex: -1, position: 'relative'}]}
        source={Boolean(hasHttpProtocol(uri) && isURI) ? imageSource : uri}
        defaultSource={defaultSource ? defaultSource() : null}
        onLoad={() => setLoad(false)}
        // resizeMode="contain"
      />
      {load && (
        <Blurhash
          shouldRasterizeIOS
          blurhash={blurhash || 'LKK1wP_3yYIU4.jsWrt7_NRjMdt7'}
          style={[styles, {zIndex: 1, position: 'absolute'}]}
        />
      )}
      {children}
    </View>
  );
};

export default React.memo(BlurImage);
