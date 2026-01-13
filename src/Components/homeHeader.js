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
  homeSearch,
  location,
  notificationWhite,
  redDotBell,
  searchIcon,
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
  const {userData} = getState('Auth');

  const onImagePress = () => {
    dispatch({
      payload: userDataImg,
      type: types.openModalCircle,
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
                width: Dimensions.get('window').width * 0.11,
                height: Dimensions.get('window').width * 0.11,
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
                style={{width: wp('7'), height: hp('3')}}
                loop
                autoPlay
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                top: hp('-0.7'),
              }}>
              {userData?.state ? (
                <>
                  <Image
                    source={location}
                    resizeMode="contain"
                    style={{width: wp('3'), height: hp('2')}}
                  />
                  <TextComponent
                    text={' ' + userData?.state + ', ' + (userData?.city ?? '')}
                    styles={{
                      color: Colors.textGray,
                      fontSize: hp('1.2'),
                    }}
                  />
                </>
              ) : (
                <TextComponent
                  text={'Welcome back!'}
                  styles={{
                    color: Colors.textGray,
                    fontSize: hp('1.2'),
                  }}
                />
              )}
            </View>
          </View>
        </Touchable>
        <Touchable
          onPress={() => NavigationService.navigate('GlobalSearchScreen')}>
          {/* onPress={() => NavigationService.navigate('EventFilterScreen')}> */}
          <Image
            source={homeSearch}
            resizeMode="contain"
            style={styles.setIcon}
            tintColor={'white'}
          />
        </Touchable>
        <Touchable onPress={onNotificarioPress}>
          <Image
            source={isNotification ? redDotBell : notificationWhite}
            resizeMode="contain"
            style={styles.notiIcon}
          />
        </Touchable>
      </View>
      <View style={styles.searchComponent}>
        <ThemeButton
          title={"What's on your mind?"}
          style={{
            ...styles.upperBtn,
            justifyContent: 'flex-start',
            paddingLeft: wp('5'),
          }}
          imageStyle={{width: wp('3')}}
          image={editYellow}
          textStyle={{fontSize: hp('1.2')}}
          onPress={() => NavigationService.navigate('CreatePostScreen')}
          isRightImg={galleryYellow}
          rightImgStyle={{
            width: wp('5'),
            height: hp('3'),
            marginLeft: wp('48'),
          }}
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
    paddingTop: hp('1'),
    position: 'relative',
    height: hp('18'),
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
    fontSize: hp('1.7'),
    fontWeight: 'bold',
    color: Colors.white,
    // marginTop: hp('2.5'),
  },
  notiIcon: {width: wp('5'), marginTop: hp('1')},
  setIcon: {width: wp('5.5'), marginTop: hp('1')},
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
    marginTop: hp('-12.5'),
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
    width: wp('93'),
    borderRadius: 30,
    height: hp('4.5'),
    borderWidth: 0.5,
    borderColor: Colors.grayBorder,
    marginRight: wp('2'),
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
