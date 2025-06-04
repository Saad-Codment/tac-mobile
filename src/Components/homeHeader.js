import React from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import {Colors} from '../Theme/Variables';
import {hp, wp} from '../Config/responsive';
import {TextComponent} from '../Components/TextComponent';
import {
  editYellow,
  galleryYellow,
  handShake,
  handShakeLottie,
  notificationWhite,
  redDotBell,
  settingWhite,
} from '../Assets';
import {Touchable} from '../Components/Touchable';
import Lottie from 'lottie-react-native';
import {CircleImage} from './CircleImage';
import {imageUrl} from '../Utils/Urls';
import ThemeButton from './ThemeButton';
import NavigationService from '../Services/NavigationService';
import useReduxStore from '../Hooks/UseReduxStore';
import {types} from '../Redux/types';
import {checkMaleFemaleForImg} from '../Services/GlobalFunctions';

const HomeHeader = ({
  text,
  onNotificarioPress,
  userDataImg,
  onProfilePress,
}) => {
  const {dispatch, getState} = useReduxStore();

  const {isNotification} = getState('isNotification');

  const onImagePress = () => {
    dispatch({
      payload: userDataImg,
      type: types.openModal,
    });
  };

  return (
    <View style={styles.headerView}>
      <View style={styles.firstView}>
        <Touchable
          onPress={onProfilePress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: wp('70'),
          }}>
          <Pressable
            onPress={onImagePress}
            style={{
              marginTop: hp('3.5'),
              marginRight: hp('1'),
            }}>
            <CircleImage
              image={imageUrl(userDataImg)}
              // defaultSource={checkMaleFemaleForImg}
              uri={true}
              styles={{
                alignSelf: 'center',

                borderRadius: Math.round(
                  Dimensions.get('window').width +
                    Dimensions.get('window').height,
                ),
                width: Dimensions.get('window').width * 0.14,
                height: Dimensions.get('window').width * 0.14,
              }}
            />
          </Pressable>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp('5.4'),
              }}>
              <TextComponent text={text} styles={styles.nameText} />
              <Lottie
                source={handShakeLottie}
                resizeMode="contain"
                style={{width: wp('10')}}
                loop
                autoPlay
              />
            </View>
            <TextComponent
              text={'Welcome back'}
              styles={{
                top: hp('-0.7'),
                color: Colors.textGray,
                fontSize: hp('1.5'),
              }}
            />
          </View>
        </Touchable>
        <Touchable onPress={onNotificarioPress}>
          <Image
            source={isNotification ? redDotBell : notificationWhite}
            resizeMode="contain"
            style={styles.notiIcon}
          />
        </Touchable>
        {/* <Touchable>
          <Image
            source={settingWhite}
            resizeMode="contain"
            style={styles.setIcon}
          />
        </Touchable> */}
      </View>
      <View style={styles.searchComponent}>
        <ThemeButton
          title={'Write something'}
          style={{
            ...styles.upperBtn,
            justifyContent: 'flex-start',
            paddingLeft: wp('5'),
          }}
          imageStyle={{width: wp('5')}}
          image={editYellow}
          textStyle={{fontSize: hp('1.5')}}
          onPress={() => NavigationService.navigate('CreatePostScreen')}
        />
        {/* <ThemeButton
          image={galleryYellow}
          style={{
            ...styles.upperBtn,
            borderRadius: Math.round(
              Dimensions.get('window').width + Dimensions.get('window').height,
            ),
            width: Dimensions.get('window').width * 0.1,
            height: Dimensions.get('window').width * 0.1,
          }}
          imageStyle={styles.imgStyle}
          textStyle={{marginLeft: wp('0.2')}}
          onPress={() => NavigationService.navigate('CreatePostScreen')}
        /> */}
      </View>
    </View>
  );
};
export default HomeHeader;

const styles = StyleSheet.create({
  headerView: {
    backgroundColor: Colors.backgroundTheme,
    width: wp('100'),
    paddingTop: hp('2'),
    position: 'relative',
    height: hp('22'),
  },
  firstView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? hp('0') : hp('-2'),
    width: wp('100'),
    alignSelf: 'center',
    paddingBottom: hp('11'),
    justifyContent: 'space-between',
    paddingHorizontal: wp('4'),
  },
  nameText: {
    fontSize: hp('2'),
    fontWeight: 'bold',
    color: Colors.white,
    // marginTop: hp('2.5'),
  },
  notiIcon: {width: wp('7'), marginTop: hp('1')},
  setIcon: {width: wp('7')},
  headingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('92'),
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: hp('3'),
  },
  searchComponent: {
    marginTop: hp('-10.5'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: Colors.white,
    height: hp('7.5'),
    width: wp('96'),
    paddingHorizontal: wp('2'),
    alignSelf: 'center',
  },
  upperBtn: {
    width: wp('92'),
    borderRadius: 30,
    height: hp('5'),
    borderWidth: 0.5,
    borderColor: Colors.grayBorder,
  },
  imgStyle: {marginRight: wp('0.2'), width: wp('5')},
  searchStyle: {
    resizeMode: 'contain',
    width: wp('4'),
    marginRight: wp('1'),
  },
  searchsetting: {
    resizeMode: 'contain',
    width: wp('8'),
    height: hp('5'),
  },
});
