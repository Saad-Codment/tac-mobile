import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import React, {memo, useCallback, useState} from 'react';
import {
  goalGreen,
  passGreen,
  rightIos,
  logout,
  trashIcon,
  trash,
  about,
  privacy,
  terms,
  profile,
  editProfile,
  ageIcon,
  profileIcon,
  racingIcon,
  assoicationIcon,
  eventHistory,
  friendList,
  trashRed,
  calender,
  friendReq,
  profileCircle,
  userAdd,
  syncContact,
  editPicBtn,
} from '../../Assets';
import {TextComponent} from '../../Components/TextComponent';
import {CircleImage} from '../../Components/CircleImage';
import {hp, wp} from '../../Config/responsive';
import {styles} from './styles';
import {Colors} from '../../Theme/Variables';
import {HeaderComponent} from '../../Components/HeaderComponent';
import NavigationService from '../../Services/NavigationService';
import {AlertDesign} from '../../Components/AlertDesign';
import {
  calculateAge,
  capitalizeFirstLetter,
  uploadFromGalary,
} from '../../Services/GlobalFunctions';
import {getMyFriendsUrl, imageUrl} from '../../Utils/Urls';
import useReduxStore from '../../Hooks/UseReduxStore';
import {types} from '../../Redux/types';
import {MultiView} from '../SettingScreen/MultiView';
import usePorfileScreen from './useProfileScreen';
import IconBtnView from '../../Components/IconBtnView';
import {Touchable} from '../../Components/Touchable';
import SettingModal from '../SettingScreen/SettingModal';

const ProfileScreen = ({navigation}) => {
  const {
    toggleAlert,
    onConfirm,
    dynamicRoute,
    onOpenModal,
    toggleModal,
    setModalVal,
    privateTheProfile,
    justUploadImg,
    activeTags,
    modalVal,
    deleteAlert,
    logoutAlert,
    isloading,
    userData,
    onPressKey,
    allData,
  } = usePorfileScreen(navigation);

  const centerView = [
    {
      title: userData?.first_name + ' ' + userData?.last_name,
      leftIcon: profileCircle,
      rightText: 'Edit',
      onPress: () => onOpenModal('edit_profile'),
    },
    {
      title: `${calculateAge(userData?.age) ?? 'Not Availabe'} Years`,
      leftIcon: ageIcon,
      rightText: 'Edit',
      onPress: () => onOpenModal('age_view'),
    },
    {
      title: capitalizeFirstLetter(userData?.gender ?? 'Not Availabe'),
      leftIcon: profileIcon,
      rightText: 'Edit',
      onPress: () => onOpenModal('user_gender'),
    },
  ];
  const bottomView = [
    {
      title: `Delete Account`,
      leftIcon: trashRed,
      leftIconColor: 'red',
      onPress: () => toggleAlert('deleteAlert'),
    },
    {
      title: 'Log out',
      leftIcon: logout,
      onPress: () => toggleAlert('logoutAlert'),
    },
  ];

  const {dispatch} = useReduxStore();

  const onImagePress = () => {
    dispatch({
      payload: userData?.profile_image,
      type: types.openModal,
    });
  };

  return (
    // <ImageBackground source={stepBg} style={styles.container}>
    <View showsVerticalScrollIndicator={false} style={{flexGrow: 1}}>
      <HeaderComponent headerTitle={'Profile'} isBack />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.mainBtn}>
          <View style={styles.upperWhiteView}>
            <Pressable style={styles.imgView} onPress={onImagePress}>
              <CircleImage
                size={Platform.OS == 'ios' ? 0.3 : 0.35}
                image={imageUrl(userData?.profile_image)}
                uri={true}
              />
              <Touchable
                style={{
                  position: 'absolute',
                  right: wp('-14'),
                  height: hp('6'),
                  top: hp('9'),
                }}
                onPress={async () => {
                  const img = await uploadFromGalary();
                  justUploadImg(img);
                }}>
                <Image
                  source={editPicBtn}
                  resizeMode="contain"
                  style={{height: hp('4')}}
                />
              </Touchable>
            </Pressable>
            <TextComponent
              text={userData?.first_name + ' ' + userData?.last_name}
              styles={{fontSize: hp('2'), fontWeight: 'bold'}}
            />
            <TextComponent
              text={userData?.email}
              styles={{fontSize: hp('1.5')}}
              fade
            />
            <MultiView
              data={centerView}
              titleStyles={{fontSize: hp('1.2')}}
              leftStyles={styles.leftIconStyle}
            />
          </View>
          <View
            style={{
              ...styles.upperWhiteView,
              ...styles.bottomView,
            }}>
            <Touchable
              style={styles.listView}
              //   onPress={() => toggleAlert('deleteAlert')}
            >
              <IconBtnView
                title={'Delete Account'}
                leftIcon={trashRed}
                leftIconColor={'red'}
                onPress={() => toggleAlert('deleteAlert')}
                textStyle={{fontSize: hp('1.2')}}
                leftStyle={styles.leftIconStyle}
              />
            </Touchable>
          </View>
        </View>
      </ScrollView>
      {modalVal && (
        <SettingModal
          activeTags={activeTags[onPressKey] ?? []}
          allData={allData ?? []}
          heading={onPressKey}
          isModal={modalVal}
          onSelect={() => {}}
          onPress={(e, isTrue) => toggleModal(e, isTrue)}
          onBackPress={() => setModalVal(false)}
        />
      )}
      <AlertDesign
        isVisible={
          (deleteAlert == true && deleteAlert) ||
          (logoutAlert == true && logoutAlert)
        }
        message={
          (logoutAlert && 'Are you sure you want to logout?') ||
          (deleteAlert && 'Are you sure that you want to delete your account?')
        }
        title={'Warning'}
        onConfirm={() =>
          onConfirm(
            (logoutAlert && 'logoutAlert') || (deleteAlert && 'deleteAlert'),
          )
        }
        onCancel={() =>
          toggleAlert(
            (logoutAlert && 'logoutAlert') || (deleteAlert && 'deleteAlert'),
          )
        }
      />
    </View>
    // </ImageBackground>
  );
};

export default memo(ProfileScreen);
