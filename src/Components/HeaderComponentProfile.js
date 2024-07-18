import React, {useCallback} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {hp, wp} from '../Config/responsive';
import {Colors} from '../Theme/Variables';
import {TextComponent} from './TextComponent';
// import {goBack} from '../Utils';
import {backIcon, edit2, profileBg, searchIcon} from '../Assets';
import {Touchable} from './Touchable';
import TabButton from './TabButton';
import BlurImage from './BlurImage';
import {imageUrl} from '../Utils/Urls';

export const HeaderComponentProfile = ({
  onPress,
  title,
  search,
  edit,
  isCategory,
  categoryData,
  headerShow,
  activeBtn,
  goBack,
  profileImage,
}) => {
  return (
    <ImageBackground
      source={profileBg}
      resizeMode="cover"
      style={styles.bgMain}>
      <View style={{...styles.headerTop, ...headerShow}}>
        <View style={styles.headerInner}>
          <Touchable onPress={goBack}>
            {goBack && (
              <Image
                source={backIcon}
                style={styles.backBtn}
                resizeMode="contain"
              />
            )}
          </Touchable>

          <TextComponent
            text={title}
            numberOfLines={1}
            styles={styles.heading}
          />
          <Touchable onPress={edit}>
            <Image
              source={search ? edit2 : ''}
              style={styles.searchBtn}
              resizeMode="contain"
            />
          </Touchable>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerTop: {
    // backgroundColor: Colors.black,
  },
  bgMain: {
    // marginTop: hp('-5'),
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5'),
    paddingTop: Platform.OS == 'ios' ? hp('7') : hp('4'),
    paddingBottom: hp('16'),
    // verticalAlign: 'middle',
  },
  heading: {
    color: Colors.white,
    fontSize: hp('2.5'),
  },
  backBtn: {
    width: wp('6'),
    height: hp('3.5'),
  },
  searchBtn: {
    width: wp('5'),
    height: hp('3.5'),
  },
  tabs: isActive => ({
    // width: '110%',
    marginRight: wp('2.2'),
    marginBottom: hp('2.5'),
    backgroundColor: isActive
      ? Colors.primaryColor
      : 'rgba(255, 255, 255, 0.1)',
  }),
  btnMain: {
    marginLeft: wp('5'),
  },
});
