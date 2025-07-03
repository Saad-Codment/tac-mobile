import React from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
} from 'react-native';
import {Colors} from '../Theme/Variables';
import {hp, wp} from '../Config/responsive';
import {TextComponent} from '../Components/TextComponent';
import {
  editIcon,
  editProfileBlack,
  editYellow,
  galleryYellow,
  handShake,
  handShakeLottie,
  notificationWhite,
  privacy,
  securityUser,
  setting,
  setting1,
  settingWhite,
  userEditWhite,
} from '../Assets';
import {Touchable} from '../Components/Touchable';
import Lottie from 'lottie-react-native';
import {CircleImage} from './CircleImage';
import {editProfileUrl, imageUrl} from '../Utils/Urls';
import ThemeButton from './ThemeButton';
import NavigationService from '../Services/NavigationService';
import useReduxStore from '../Hooks/UseReduxStore';
import {types} from '../Redux/types';
import {
  checkMaleFemaleForImg,
  uploadFromCamera,
  uploadFromGalary,
} from '../Services/GlobalFunctions';
import {useMutation} from '@tanstack/react-query';
import {formDataFunc} from '../Utils/helperFunc';
import {errorMessage, successMessage} from '../Config/NotificationMessage';

const ProfileHeader = ({
  text,
  onNotificarioPress,
  userDataImg,
  onProfilePress,
}) => {
  const {dispatch, getState} = useReduxStore();

  const onImagePress = () => {
    dispatch({
      payload: userDataImg,
      type: types.openModal,
    });
  };

  const {mutateAsync} = useMutation({
    mutationFn: data => {
      return formDataFunc(editProfileUrl, data, 'profile_image');
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage('Your profile updated sucessfully!');
        dispatch({
          type: types.UpdateProfile,
          payload: data.user,
        });
      } else {
        errorMessage(data?.message);
      }
    },
    onError: ({message}) => {
      errorMessage('Problem occurred while uploading data.');
    },
  });

  const {userData} = getState('Auth');

  return (
    <View style={styles.headerView}>
      <View style={styles.firstView}>
        <Touchable
          onPress={onProfilePress}
          style={styles.profileTouchable}
          disabled>
          <Pressable onPress={onImagePress} style={styles.imagePressable}>
            <CircleImage
              image={imageUrl(userData?.profile_image)}
              uri={true}
              styles={styles.circleImage}
            />
            <Touchable
              style={styles.editIconTouchable}
              onPress={async () => {
                Alert.alert(
                  'Pick to choose image',
                  '',
                  [
                    {
                      text: 'Camera',
                      onPress: async () => {
                        const images = await uploadFromCamera();
                        mutateAsync({
                          profile_image: images,
                        });
                      },
                    },
                    {
                      text: 'Gallery', // Just a dismissal button
                      onPress: async () => {
                        const images = await uploadFromGalary();
                        mutateAsync({
                          profile_image: images,
                          first_name: userData?.first_name,
                        });
                      },
                    },
                  ],
                  {cancelable: true},
                );
              }}>
              <Image
                source={editProfileBlack}
                resizeMode="contain"
                style={styles.editIcon}
              />
            </Touchable>
          </Pressable>
          <View>
            <View style={styles.nameContainer}>
              <TextComponent
                text={
                  userData?.first_name +
                  ' ' +
                  (userData?.last_name ? userData?.last_name : '')
                }
                styles={styles.nameText}
              />
            </View>
            <View style={styles.accountTypeContainer}>
              <Image
                source={securityUser}
                resizeMode="contain"
                style={styles.securityIcon}
              />
              <TextComponent
                text={`${
                  userData?.privacy == 1 ? 'Private' : 'Public'
                } account`}
                styles={styles.accountTypeText}
              />
            </View>
          </View>
        </Touchable>
        <Touchable onPress={() => NavigationService.navigate('ProfileScreen')}>
          <Image
            source={userEditWhite}
            resizeMode="contain"
            style={styles.notiIcon}
            tintColor={'white'}
          />
        </Touchable>
        <Touchable onPress={() => NavigationService.navigate('SettingScreen')}>
          <Image
            source={setting1}
            resizeMode="contain"
            style={styles.notiIcon}
            tintColor={'white'}
          />
        </Touchable>
      </View>
    </View>
  );
};
export default ProfileHeader;

const styles = StyleSheet.create({
  headerView: {
    backgroundColor: Colors.backgroundTheme,
    width: wp('100'),
    paddingTop: hp('2'),
    position: 'relative',
    // height: hp('18'),
  },
  firstView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? hp('0') : hp('-2'),
    width: wp('100'),
    alignSelf: 'center',
    paddingBottom: hp('2'),
    justifyContent: 'space-between',
    paddingHorizontal: wp('4'),
  },
  profileTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('70'),
  },
  imagePressable: {
    marginTop: hp('3.5'),
    marginRight: hp('2.5'),
  },
  circleImage: {
    alignSelf: 'center',
    borderRadius: Math.round(
      Dimensions.get('window').width + Dimensions.get('window').height,
    ),
    width: Dimensions.get('window').width * 0.15,
    height: Dimensions.get('window').width * 0.15,
  },
  editIconTouchable: {
    position: 'absolute',
    bottom: 0,
    right: wp('-2'),
  },
  editIcon: {
    width: wp('5'),
    height: hp('3'),
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('5'),
  },
  nameText: {
    fontSize: hp('1.5'),
    fontWeight: 'bold',
    color: Colors.white,
  },
  accountTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: hp('0.5'),
  },
  securityIcon: {
    width: wp('5'),
    height: hp('2'),
  },
  accountTypeText: {
    color: Colors.textGray,
    fontSize: hp('1.2'),
    marginLeft: wp('1'),
  },
  notiIcon: {
    width: wp('5'),
    marginTop: hp('1'),
  },
  setIcon: {
    width: wp('7'),
  },
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
    height: hp('7.5'),
    width: wp('96'),
    paddingHorizontal: wp('2'),
    alignSelf: 'center',
  },
  upperBtn: {
    width: wp('80'),
    borderRadius: 30,
    height: hp('5'),
    borderWidth: 0.5,
    borderColor: Colors.grayBorder,
  },
  imgStyle: {
    marginRight: wp('0.2'),
    width: wp('5'),
  },
  searchStyle: {
    resizeMode: 'contain',
    width: wp('4'),
    marginRight: wp('1'),
  },
  searchsetting: {
    resizeMode: 'contain',
    width: wp('7'),
    height: hp('4'),
  },
});
