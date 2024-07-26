import {
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
} from '../../Assets';
import {TextComponent} from '../../Components/TextComponent';
import {CircleImage} from '../../Components/CircleImage';
import BlurImage from '../../Components/BlurImage';
import {profileData, settingData} from '../../Utils/localDB';
import {keyExtractor} from '../../Utils';
import {hp} from '../../Config/responsive';
import useSettingScreen from './useSettingScreen';

import {IconBtn} from '../../Components/IconBtn';
import {styles} from './styles';
import {medalstar} from '../../Assets';
import {Colors} from '../../Theme/Variables';

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
    <View showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TextComponent text={'Settings'} styles={styles.topHd} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled
        contentContainerStyle={{
          // paddingBottom: hp('70'),
          backgroundColor: 'background: rgba(255, 255, 255, 0.7)',
        }}>
        <TextComponent text={'Plans'} styles={styles.plan} />
        <View style={styles.mainBtn}>
          <FlatList
            data={[
              {
                icon: medalstar,
                name: 'Subscription',
                onpress: (navigate, route) => navigate(route),
                screenName: 'SubscribeScreen',
              },
            ]}
            scrollEnabled={false}
            keyExtractor={keyExtractor}
            renderItem={props =>
              renderItem({
                ...props,
                data: [
                  {
                    icon: goalGreen,
                    name: 'Edit Profile',
                    onpress: (navigate, route) => navigate(route),
                    screenName: 'EditProfileScreen',
                  },
                ],
              })
            }
          />
        </View>
        <TextComponent text={'General'} styles={styles.plan} />

        <View style={styles.mainBtn}>
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
          {/* <FlatList
            data={profileData}
            keyExtractor={keyExtractor}
            scrollEnabled={false}
            renderItem={props => renderItem({...props, data: profileData})}
          /> */}
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
        </View>
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
