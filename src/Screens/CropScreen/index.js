import React, {memo, useRef} from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import ViewShot from 'react-native-view-shot';
import {Dimensions} from 'react-native';
import {wp} from '../../Config/responsive';

const {width} = Dimensions.get('window');

function CropScreen({route, navigation}) {
  const {image} = route.params;
  const cropRef = useRef();

  const CROP_SIZE = 400;

  const handleCrop = async () => {
    try {
      const uri = await cropRef.current.capture();
      route.params.afterCropImg(uri);
      // route.params.afterCropImg(`file://${uri}`);
      navigation.goBack();
      console.log('Cropped URI:', uri);
    } catch (e) {
      console.log('Crop error:', e);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {/* CROP AREA */}
      <ViewShot
        ref={cropRef}
        options={{format: 'png', quality: 1}}
        style={{
          width: CROP_SIZE,
          height: CROP_SIZE,
          alignSelf: 'center',
          // marginTop: 100,
          borderRadius: CROP_SIZE / 2,
          overflow: 'hidden',
          backgroundColor: '#000',
        }}>
        {/* ZOOMABLE IMAGE */}
        <ImageZoom
          cropWidth={CROP_SIZE}
          cropHeight={CROP_SIZE}
          imageWidth={CROP_SIZE}
          imageHeight={CROP_SIZE}
          minScale={1}
          maxScale={5}
          enableCenterFocus={false}
          pinchToZoom={true}>
          <Image
            source={{uri: image?.uri}}
            style={{width: CROP_SIZE, height: CROP_SIZE, resizeMode: 'contain'}}
          />
        </ImageZoom>
      </ViewShot>

      {/* BUTTON */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: wp('50'),
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginTop: 50,
            alignSelf: 'center',
            padding: 15,
            backgroundColor: '#fff',
            borderRadius: 10,
          }}>
          <Text style={{fontSize: 18, color: 'black'}}>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCrop}
          style={{
            marginTop: 50,
            alignSelf: 'center',
            padding: 15,
            backgroundColor: '#fff',
            borderRadius: 10,
          }}>
          <Text style={{fontSize: 18, color: 'black'}}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(CropScreen);
