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
  resizeMode,
  shiftY = 0, // NEW: shift image upward
}) => {
  const [load, setLoad] = useState(Boolean(!defaultSource));
  const imageSource = {uri, priority: FastImage.priority.high};

  function hasHttpProtocol(url) {
    return /^https?:\/\//i.test(url);
  }

  return (
    <View
      style={{
        position: 'relative',
        overflow: 'hidden', // Ensure overflow is hidden to crop excess image
        borderRadius: radius ?? 10,
      }}>
      <FastImage
        style={[
          styles,
          {
            zIndex: -1,
            position: 'relative',
            transform: [{translateY: shiftY}], // shift image upward
          },
        ]}
        source={Boolean(hasHttpProtocol(uri) && isURI) ? imageSource : uri}
        defaultSource={defaultSource ? defaultSource() : null}
        onLoad={() => setLoad(false)}
        resizeMode={resizeMode ?? 'cover'} // cover mode with custom offset
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
