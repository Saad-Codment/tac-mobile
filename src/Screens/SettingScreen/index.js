import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
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

const centerView = [
  {
    title: '26 Years',
    leftIcon: ageIcon,
    rightText: 'Change',
    onPress: () => {},
  },
  {
    title: 'Female',
    leftIcon: profileIcon,
  },
  {
    title: 'Barrel Racing',
    leftIcon: racingIcon,
    rightText: 'Change',
  },
  {
    title: 'Association',
    leftIcon: assoicationIcon,
    rightText: 'Change',
  },
  {
    title: 'Event History',
    leftIcon: eventHistory,
    rightText: 'View',
    onPress: () => {},
  },
  {
    title: 'Friends List',
    leftIcon: friendList,
    rightText: 'View',
    onPress: () => {},
  },
];

const bottomView = [
  {
    title: 'Log Out',
    leftIcon: trashRed,
    onPress: () => {},
  },
  {
    title: 'Delete Account',
    leftIcon: trashRed,
    onPress: () => {},
  },
];

const SettingScreen = ({navigation}) => {
  const {
    toggleAlert,
    onConfirm,
    dynamicRoute,
    deleteAlert,
    logoutAlert,
    isloading,
    userData,
  } = useSettingScreen(navigation);

  const renderItem = useCallback(({item, index, data}) => {
    return (
      <>
        <Pressable
          onPress={() => item?.onpress(navigation.navigate, item?.screenName)}
          style={styles.listBtn}>
          <Image source={item?.icon} style={styles.iconGreen} />
          <View
            style={[
              styles.listInner,
              index === data.length - 1 && styles.lastItem,
            ]}>
            <TextComponent text={item?.name} styles={styles.title} />
            <Image source={rightIos} style={styles.arrowRight} />
          </View>
        </Pressable>
      </>
    );
  });

  return (
    // <ImageBackground source={stepBg} style={styles.container}>
    <View showsVerticalScrollIndicator={false} style={{flex: 1}}>
      <HeaderComponent headerTitle={'Profile'} saveReset={editProfile} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.mainBtn}>
          <View
            style={{
              backgroundColor: 'white',
              width: wp('90'),
              height: hp('57'),
              borderRadius: 20,
              marginTop: hp('10'),
              paddingTop: hp('10'),
              alignItems: 'center',
            }}>
            <View
              style={{
                alignSelf: 'center',
                position: 'absolute',
                zIndex: 1,
                top: hp('-9'),
              }}>
              <CircleImage size={0.4} image={null} />
            </View>
            <TextComponent
              text={'Kinlie Brennise'}
              styles={{fontSize: hp('3'), fontWeight: 'bold'}}
            />
            <TextComponent
              text={'kinlie@tac.com'}
              styles={{fontSize: hp('1.5')}}
              fade
            />
            <MultiView data={centerView} />
          </View>
        </View>
        {/* <View
          style={{
            backgroundColor: 'white',
            width: wp('90'),
            height: hp('57'),
            borderRadius: 20,
            // marginTop: hp('10'),
            paddingTop: hp('10'),
            alignItems: 'center',
          }}>
          <MultiView data={bottomView} />
        </View> */}

        {/* <View style={styles.mainBtn}>
          <IconBtn
            icon={profile}
            btnText={'Edit Profile'}
            onpress={() => navigation.navigate('EditProfileScreen')}
          />
          <IconBtn
            icon={about}
            btnText={'About TAC'}
            onpress={() => navigation.navigate('ChangePasswordScreen')}
          />
          <IconBtn
            icon={privacy}
            btnText={'Privacy Policy'}
            onpress={() => navigation.navigate('ChangePasswordScreen')}
          />
          <IconBtn
            rightIos
            icon={terms}
            btnText={'Terms and Conditions'}
            onpress={() => navigation.navigate('ChangePasswordScreen')}
            extraStyle={styles.lastItem}
          />
        </View>
        <TextComponent text={'Deactivation'} styles={styles.plan} />

        <View style={{...styles.mainBtn, ...styles.bottomSpace}}>
          <IconBtn
            icon={logout}
            btnText={'Log Out'}
            onpress={() => toggleAlert('logoutAlert')}
          />
          <IconBtn
            borderLine
            icon={trash}
            btnText={'Deactivate Account'}
            extraStyle={styles.lastItem}
            onpress={() => toggleAlert('deleteAlert')}
          />
        </View> */}
      </ScrollView>
      {/* <SettingModal
          icon={logOut}
          isVisible={
            (deleteAlert == true && deleteAlert) ||
            (logoutAlert == true && logoutAlert)
          }
          onClose={() =>
            toggleAlert(
              (logoutAlert && 'logoutAlert') || (deleteAlert && 'deleteAlert'),
            )
          }
          title="Oh no! you are leaving..."
          content="Are you sure ?"
          FirstBtnText={
            (logoutAlert && 'No! Not this time') ||
            (deleteAlert && 'Don’t Deactivate')
          }
          SecondBtnText={
            (logoutAlert && 'Yes! log me out') ||
            (deleteAlert && 'Deactivate Account')
          }
          FirstBtnOnpress={() =>
            toggleAlert(
              (logoutAlert && 'logoutAlert') || (deleteAlert && 'deleteAlert'),
            )
          }
          SecondBtnOnpress={() => {
            onConfirm(
              (logoutAlert && 'logoutAlert') || (deleteAlert && 'deleteAlert'),
            );
          }}
        /> */}
    </View>
    // </ImageBackground>
  );
};

export default memo(SettingScreen);
