import React, {useState, useRef} from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useReduxStore from '../Hooks/UseReduxStore';
import {types} from '../Redux/types';
import {imageUrl} from '../Utils/Urls';
import {whp, p, hp, wp} from '../Config/responsive';
import ImageZoom from 'react-native-image-pan-zoom'; // 🔼 Add this at the top

const ImagePreviewComp = ({visible, onClose, images}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const {dispatch} = useReduxStore();

  const onCloseModa = () => {
    dispatch({
      type: types.closeModal,
    });
  };

  // Handle single image case (convert to array if needed)
  const imageArray = Array.isArray(images) ? images : [images];

  const goToNext = () => {
    const newIndex =
      currentIndex === imageArray.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    flatListRef.current?.scrollToIndex({index: newIndex, animated: true});
  };

  const goToPrevious = () => {
    const newIndex =
      currentIndex === 0 ? imageArray.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    flatListRef.current?.scrollToIndex({index: newIndex, animated: true});
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCloseModa}>
      <View style={styles.modalContainer}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={onCloseModa}>
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>

        {/* Main image content */}
        <View style={styles.imageContainer}>
          {imageArray.length > 1 && (
            <TouchableOpacity
              style={styles.navButtonLeft}
              onPress={goToPrevious}>
              <Ionicons name="chevron-back" size={40} color="white" />
            </TouchableOpacity>
          )}
          <FlatList
            ref={flatListRef}
            data={imageArray}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View
                style={{
                  width: Dimensions.get('window').width,
                  alignItems: 'center',
                }}>
                <ImageZoom
                  cropWidth={Dimensions.get('window').width}
                  cropHeight={hp('80')}
                  imageWidth={Dimensions.get('window').width}
                  imageHeight={hp('80')}
                  enableCenterFocus
                  enableDoubleClickZoom>
                  <Image
                    source={
                      typeof item === 'string' ? {uri: imageUrl(item)} : item
                    }
                    style={styles.image}
                    resizeMode="contain"
                  />
                </ImageZoom>
              </View>
            )}
            onMomentumScrollEnd={e => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / Dimensions.get('window').width,
              );
              setCurrentIndex(index);
            }}
            initialScrollIndex={currentIndex}
            getItemLayout={(data, index) => ({
              length: Dimensions.get('window').width,
              offset: Dimensions.get('window').width * index,
              index,
            })}
          />

          {imageArray.length > 1 && (
            <TouchableOpacity style={styles.navButtonRight} onPress={goToNext}>
              <Ionicons name="chevron-forward" size={40} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Indicator for multiple images */}
        {imageArray.length > 1 && (
          <View style={styles.indicatorContainer}>
            <Text style={styles.indicatorText}>
              {currentIndex + 1} / {imageArray.length}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: wp('2'),
    zIndex: 1,
    // backgroundColor: 'white',
    // width: wp('10'),
    height: hp('5'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Math.round(
      Dimensions.get('window').width + Dimensions.get('window').height,
    ),
    width: Dimensions.get('window').width * 0.11,
    height: Dimensions.get('window').width * 0.11,
    // opacity: 0.5,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  image: {
    width: wp('100'),
    height: hp('80'),
  },
  navButtonLeft: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  navButtonRight: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  indicatorText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ImagePreviewComp;
