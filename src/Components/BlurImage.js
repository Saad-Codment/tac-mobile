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
  isURI = true, // default to true since most cases will use URI
  defaultSource,
  resizeMode,
  shiftY = 0,
}) => {
  const [load, setLoad] = useState(true);
  const [error, setError] = useState(false);

  // Improved URL validation
  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Determine the image source
  const getImageSource = () => {
    if (!isURI) return uri;
    if (isValidUrl(uri)) return {uri, priority: FastImage.priority.high};
    return null;
  };

  const imageSource = getImageSource();
  console.log(
    'sjdkbfklsdbfkbsdjkfbdsjkfbjksdbfjsdfbsjdfbsdjfbsdkfbsdkfsd',
    imageSource,
  );
  return (
    <View
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: radius ?? 10,
      }}>
      {/* {imageSource && ( */}
      <FastImage
        style={[
          styles,
          {
            zIndex: -1,
            position: 'relative',
            transform: [{translateY: shiftY}],
          },
        ]}
        source={imageSource}
        // defaultSource={defaultSource ? defaultSource() : null}
        onLoad={() => setLoad(false)}
        onError={() => {
          // setError(true);
          setLoad(false);
        }}
        resizeMode={resizeMode ?? 'cover'}
      />
      {/* )} */}

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
