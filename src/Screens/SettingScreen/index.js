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
} from '../../Assets';
import {TextComponent} from '../../Components/TextComponent';
import {CircleImage} from '../../Components/CircleImage';
import BlurImage from '../../Components/BlurImage';
import {profileData, settingData} from '../../Utils/localDB';
import {keyExtractor} from '../../Utils';
import {hp, wp} from '../../Config/responsive';
import useSettingScreen from './useSettingScreen';

import {IconBtn} from '../../Components/IconBtn';
import {styles} from './styles';
import {medalstar} from '../../Assets';
import {Colors} from '../../Theme/Variables';
import {HeaderComponentProfile} from '../../Components/HeaderComponentProfile';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {MultiView} from './MultiView';
import NavigationService from '../../Services/NavigationService';
import SettingModal from './SettingModal';
import {AlertDesign} from '../../Components/AlertDesign';
import {
  calculateAge,
  capitalizeFirstLetter,
} from '../../Services/GlobalFunctions';
import {getMyFriendsUrl, imageUrl} from '../../Utils/Urls';
import useReduxStore from '../../Hooks/UseReduxStore';
import {types} from '../../Redux/types';

const SettingScreen = ({navigation}) => {
  const {
    toggleAlert,
    onConfirm,
    dynamicRoute,
    onOpenModal,
    toggleModal,
    setModalVal,
    privateTheProfile,
    activeTags,
    modalVal,
    deleteAlert,
    logoutAlert,
    isloading,
    userData,
    onPressKey,
    allData,
  } = useSettingScreen(navigation);

  const centerView = [
    {
      title: `My profile`,
      leftIcon: profileCircle,
      rightText: 'View',
      onPress: () =>
        NavigationService.navigate('FriendProfileScreen', {id: userData?.id}),
    },
    {
      title: `Private`,
      leftIcon: profileCircle,
      rightChilderView: (
        <Switch
          trackColor={{
            false: Colors.grayFaded,
            true: 'transparent',
          }}
          thumbColor={userData?.privacy == 1 ? Colors.primaryColor : '#EAF6ED'}
          ios_backgroundColor="#EAF6ED"
          onValueChange={privateTheProfile}
          value={Boolean(userData?.privacy == 1)}
        />
      ),
      onPress: () =>
        NavigationService.navigate('FriendProfileScreen', {id: userData?.id}),
    },
    {
      title: `${calculateAge(userData?.age) ?? 'Not Availabe'} Years`,
      leftIcon: ageIcon,
      rightText: 'Change',
      onPress: () => onOpenModal('age_view'),
    },
    {
      title: capitalizeFirstLetter(userData?.gender ?? 'Not Availabe'),
      leftIcon: profileIcon,
      rightText: 'Change',
      onPress: () => onOpenModal('user_gender'),
    },
    {
      title: 'My Events',
      leftIcon: calender,
      onPress: () => NavigationService.navigate('MyEventScreen'),
    },
    {
      title: 'Event Types',
      leftIcon: racingIcon,
      rightText: 'Change',
      onPress: () => onOpenModal('event_type'),
    },
    {
      title: 'Association',
      leftIcon: assoicationIcon,
      rightText: 'Change',
      onPress: () => onOpenModal('event_association'),
    },
    {
      title: 'Event History',
      leftIcon: eventHistory,
      rightText: 'View',
      onPress: () => {},
    },
    {
      title: 'Friend Requests',
      leftIcon: userAdd,
      rightText: 'View',
      onPress: () => NavigationService.navigate('FriendReqScreen'),
    },
    {
      title: 'Sync phonebook',
      leftIcon: syncContact,
      rightText: 'View',
      onPress: () => NavigationService.navigate('SyncPhonebookScreen'),
    },
    {
      title: 'Friends List',
      leftIcon: friendList,
      rightText: 'View',
      onPress: () =>
        NavigationService.navigate('FriendLists', {
          url: getMyFriendsUrl,
          key: 'myFriends',
        }),
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
      <HeaderComponent
        headerTitle={'Profile'}
        saveReset={editProfile}
        onRightPress={() => onOpenModal('edit_profile')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{paddingBottom: hp('100')}}>
        <View style={styles.mainBtn}>
          <View style={styles.upperWhiteView}>
            <Pressable style={styles.imgView} onPress={onImagePress}>
              <CircleImage
                size={Platform.OS == 'ios' ? 0.4 : 0.35}
                image={imageUrl(userData?.profile_image)}
                uri={true}
              />
            </Pressable>
            <TextComponent
              text={userData?.first_name + ' ' + userData?.last_name}
              styles={{fontSize: hp('3'), fontWeight: 'bold'}}
            />
            <TextComponent
              text={userData?.email}
              styles={{fontSize: hp('1.5')}}
              fade
            />
            <MultiView data={centerView} />
          </View>
          <View
            style={{
              ...styles.upperWhiteView,
              ...styles.bottomView,
            }}>
            <MultiView data={bottomView} />
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

export default memo(SettingScreen);
