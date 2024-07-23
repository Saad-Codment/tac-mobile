import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {hp, isIOS, wp} from '../Config/responsive';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../Theme/Variables';
import {keyExtractor} from '../Utils';
import {addGalleryImage} from '../Assets';
import {Touchable} from './Touchable';
const GalleryComponent = ({galleryData, onSelectImage, deleteImage}) => {
  console.log(galleryData, 'asldkfjlaskdjflajksdfkl');
  const [images, setImages] = useState([]);

  const renderItemImages = ({item, index}) => {
    return (
      <View style={{width: wp('45')}}>
        <TouchableOpacity
          style={styles.cancelImage}
          onPress={() => deleteImage(index)}>
          <MaterialIcons
            name="cancel"
            size={hp('2.5')}
            color={Colors.themeYellow}
          />
        </TouchableOpacity>

        <Image
          source={{uri: isIOS ? item?.sourceURL : item?.path}}
          style={styles.imagesStyle}
        />
      </View>
    );
  };
  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      refreshing={false}
      data={galleryData}
      renderItem={renderItemImages}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{
        ...styles.flatListMain,
      }}
      // horizontal
      numColumns={2}
      ListFooterComponent={() => {
        return (
          <Touchable onPress={onSelectImage}>
            <Image
              style={styles.imagesStyle}
              source={addGalleryImage || null}
            />
          </Touchable>
        );
      }}
    />
  );
};

export default GalleryComponent;

const styles = StyleSheet.create({
  cancelImage: {
    position: 'absolute',
    zIndex: 1,
    left: wp('37'),
    top: hp('0.9'),
  },
  imagesStyle: {
    width: wp('43'),
    height: hp('11'),
    borderRadius: 10,
    marginHorizontal: hp('0.5'),
    marginVertical: hp('0.5'),
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  flatListMain: {
    marginTop: hp('1'),
  },
});
