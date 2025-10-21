import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Linking,
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
  lock,
  arrRight,
  edit2,
  editIcon,
  userEdit,
  securityUser,
  locksetting,
  notificationWhite,
  documentCloud,
  helpCircle,
  likeTag,
  infoIcon,
  privacyWithOutBg,
  termNoBg,
  blockUser,
  phone,
  horseShoe,
  callEmpty,
  manageSub,
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
import {
  aboutUrl,
  allAssociatesUrl,
  allEventTypeUrl,
  getMyFriendsUrl,
  imageUrl,
  privacyUrl,
  termsUrl,
} from '../../Utils/Urls';
import useReduxStore from '../../Hooks/UseReduxStore';
import {types} from '../../Redux/types';
import {Touchable} from '../../Components/Touchable';
import Purchases from 'react-native-purchases';

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
    isContact,
  } = useSettingScreen(navigation);

  const AccountInfo = {
    title: 'Account',
    arryView: [
      {
        title: `Edit Information`,
        leftIcon: userEdit,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () => NavigationService.navigate('ProfileScreen'),
      },
      {
        title: 'Account Privacy',
        leftIcon: securityUser,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () => NavigationService.navigate('AccountPrivacyScreen'),
        rightChilderView: (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextComponent
              text={userData?.privacy == 1 ? 'Private' : 'Public'}
              styles={styles.statusText}
              fade
            />
            <Image
              source={arrRight}
              resizeMode="contain"
              style={styles.rightImgStyle}
            />
          </View>
        ),
      },
      {
        title: 'Change Password',
        leftIcon: locksetting,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () => NavigationService.navigate('ChangePasswordScreen'),
      },
      {
        title: 'Change Number',
        leftIcon: callEmpty,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () => NavigationService.navigate('NumberEditScreen'),
      },
      {
        title: 'Are you willing to have horses for others?',
        leftIcon: horseShoe,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () => NavigationService.navigate('UpdateHorseScreen'),
        rightChilderView: (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextComponent text={'Edit'} styles={styles.statusText} fade />
            <Image
              source={arrRight}
              resizeMode="contain"
              style={styles.rightImgStyle}
            />
          </View>
        ),
      },
      {
        title: 'Blocked User',
        leftIcon: blockUser,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () => NavigationService.navigate('BlockedUserScreen'),
      },
    ],
  };
  const GeneralInfo = {
    title: 'General',
    arryView: [
      {
        title: `Subscriptions`,
        leftIcon: medalstar,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () => NavigationService.navigate('SubscriptionScreen', true),
      },
      {
        title: `Manage Subscriptions`,
        leftIcon: manageSub,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () =>
          NavigationService.navigate('SubscriptionInfoScreen', true),
      },
      {
        title: 'Notifications',
        leftIcon: notificationWhite,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () => NavigationService.navigate('NotificationScreen'),
      },
    ],
  };
  const FriendsInfo = {
    title: 'Friends',
    arryView: [
      {
        title: `Friend List`,
        leftIcon: friendList,
        rightIcon: arrRight,
        onPress: () =>
          NavigationService.navigate('SearchScreen', {
            url: getMyFriendsUrl,
            key: 'myFriends',
          }),
        rightIconColor: Colors.black,
      },
      {
        title: 'Friends Requests',
        leftIcon: userAdd,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () => NavigationService.navigate('FriendReqScreen'),
      },
      {
        title: 'Phonebook',
        leftIcon: documentCloud,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () => NavigationService.navigate('SyncPhonebookScreen'),
        rightChilderView: (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextComponent
              text={isContact ? 'Synced' : 'Not Sync'}
              styles={styles.statusText}
              fade
            />
            <Image
              source={arrRight}
              resizeMode="contain"
              style={styles.rightImgStyle}
            />
          </View>
        ),
      },
    ],
  };
  const RodeosInfo = {
    title: 'Rodeos',
    arryView: [
      {
        title: `Event Types`,
        leftIcon: racingIcon,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () =>
          navigation.navigate('ListViewScreen', {
            onSelectValue: res => {
              toggleModal({eventType: res}, true);
            },
            selectedValue: activeTags?.event_type?.eventTypes,
            urlName: allEventTypeUrl,
            isMultiSelect: true,
          }),
        // onPress: () => onOpenModal('event_type'),
      },
      {
        title: 'Associations',
        leftIcon: assoicationIcon,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () =>
          navigation.navigate('ListViewScreen', {
            onSelectValue: res => {
              toggleModal({associations: res}, true);
            },
            selectedValue: activeTags?.event_association?.eventAssociations,
            urlName: allAssociatesUrl,
            isMultiSelect: true,
          }),
      },
    ],
  };
  const CalenderInfo = {
    title: 'Calender',
    arryView: [
      {
        title: `My Events`,
        leftIcon: calender,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () => NavigationService.navigate('MyEventScreen'),
      },
      // {
      //   title: 'Event History',
      //   leftIcon: eventHistory,
      //   rightIcon: arrRight,
      //   rightIconColor: Colors.black,
      // },
    ],
  };
  const AboutApp = {
    title: 'About TAC',
    arryView: [
      // {
      //   title: `Help Center`,
      //   leftIcon: helpCircle,
      //   rightIcon: arrRight,
      //   rightIconColor: Colors.black,
      // },
      // {
      //   title: 'Feedback Submission',
      //   leftIcon: likeTag,
      //   rightIcon: arrRight,
      //   rightIconColor: Colors.black,
      // },
      {
        title: 'Contact Us',
        leftIcon: likeTag,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () => NavigationService.navigate('ContactUsScreen'),
      },
    ],
  };
  const SupportInfo = {
    title: 'Terms & Support',
    arryView: [
      {
        title: `About TAC`,
        leftIcon: infoIcon,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () => Linking.openURL(aboutUrl),
      },
      {
        title: 'Privacy Policy',
        leftIcon: privacyWithOutBg,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () => Linking.openURL(privacyUrl),
      },
      {
        title: 'Terms And Conditions',
        leftIcon: termNoBg,
        rightIcon: arrRight,
        rightIconColor: Colors.black,
        onPress: () => Linking.openURL(termsUrl),
      },
    ],
  };

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
      <HeaderComponent headerTitle={'Settings'} isBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{paddingBottom: hp('15')}}>
        <View style={styles.mainBtn}>
          <View style={styles.upperProfileView}>
            <Pressable onPress={onImagePress}>
              <CircleImage
                size={0.12}
                // size={Platform.OS == 'ios' ? 0.12 : 0.35}
                image={imageUrl(userData?.profile_image)}
                uri={true}
              />
            </Pressable>
            <View style={{marginLeft: wp('2')}}>
              <TextComponent
                text={
                  userData?.first_name +
                  ' ' +
                  (userData?.last_name ? userData?.last_name : '')
                }
                styles={{fontSize: hp('2'), fontWeight: 'bold'}}
              />
              <TextComponent
                text={userData?.email}
                styles={{fontSize: hp('1.2')}}
                fade
              />
            </View>
            <Touchable
              style={{marginLeft: 'auto'}}
              onPress={() => toggleAlert('logoutAlert')}>
              <Image
                source={logout}
                resizeMode="contain"
                style={{width: wp('6'), height: wp('6')}}
              />
            </Touchable>
          </View>
          <View
            style={{
              ...styles.upperWhiteView,
              marginTop: 0,
            }}>
            <TextComponent
              text={AccountInfo.title}
              styles={styles.headingText}
            />
            <MultiView
              data={AccountInfo.arryView}
              viewStyle={{alignSelf: 'center', width: wp('95')}}
              dividerStyles={{marginLeft: wp('8')}}
              titleStyles={{fontSize: hp('1.2')}}
              leftStyles={styles.leftIconStyle}
            />
          </View>
          <View style={styles.upperWhiteView}>
            <TextComponent
              text={GeneralInfo.title}
              styles={styles.headingText}
            />
            <MultiView
              data={GeneralInfo.arryView}
              viewStyle={{alignSelf: 'center', width: wp('95')}}
              dividerStyles={{marginLeft: wp('8')}}
              leftStyles={styles.leftIconStyle}
              titleStyles={{fontSize: hp('1.2')}}
            />
          </View>
          <View style={styles.upperWhiteView}>
            <TextComponent
              text={FriendsInfo.title}
              styles={styles.headingText}
            />
            <MultiView
              data={FriendsInfo.arryView}
              viewStyle={{alignSelf: 'center', width: wp('95')}}
              dividerStyles={{marginLeft: wp('8')}}
              leftStyles={styles.leftIconStyle}
              titleStyles={{fontSize: hp('1.2')}}
            />
          </View>
          <View style={styles.upperWhiteView}>
            <TextComponent
              text={RodeosInfo.title}
              styles={styles.headingText}
            />
            <MultiView
              data={RodeosInfo.arryView}
              viewStyle={{alignSelf: 'center', width: wp('95')}}
              dividerStyles={{marginLeft: wp('8')}}
              leftStyles={styles.leftIconStyle}
              titleStyles={{fontSize: hp('1.2')}}
            />
          </View>
          <View style={styles.upperWhiteView}>
            <TextComponent
              text={CalenderInfo.title}
              styles={styles.headingText}
            />
            <MultiView
              data={CalenderInfo.arryView}
              viewStyle={{alignSelf: 'center', width: wp('95')}}
              dividerStyles={{marginLeft: wp('8')}}
              leftStyles={styles.leftIconStyle}
              titleStyles={{fontSize: hp('1.2')}}
            />
          </View>
          <View style={styles.upperWhiteView}>
            <TextComponent text={AboutApp.title} styles={styles.headingText} />
            <MultiView
              data={AboutApp.arryView}
              viewStyle={{alignSelf: 'center', width: wp('95')}}
              dividerStyles={{marginLeft: wp('8')}}
              leftStyles={styles.leftIconStyle}
              titleStyles={{fontSize: hp('1.2')}}
            />
          </View>
          <View style={styles.upperWhiteView}>
            <TextComponent
              text={SupportInfo.title}
              styles={styles.headingText}
            />
            <MultiView
              data={SupportInfo.arryView}
              viewStyle={{alignSelf: 'center', width: wp('95')}}
              dividerStyles={{marginLeft: wp('8')}}
              leftStyles={styles.leftIconStyle}
              titleStyles={{fontSize: hp('1.2')}}
            />
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
          onPress={(e, isTrue) => {
            setModalVal(!modalVal);

            toggleModal(e, isTrue);
          }}
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
