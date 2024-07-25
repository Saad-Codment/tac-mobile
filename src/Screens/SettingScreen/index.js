import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {memo, useCallback, useState} from 'react';
import {
  arrLeft,
  goalGreen,
  logOut,
  logoutGreen,
  passGreen,
  profile,
  stepBg,
  trash,
  trashRed,
} from '../../Assets';
import {TextComponent} from '../../Components/TextComponent';
import {CircleImage} from '../../Components/CircleImage';
import BlurImage from '../../Components/BlurImage';
import {profileData, settingData} from '../../Utils/localDB';
import {keyExtractor} from '../../Utils';
import {hp} from '../../Config/responsive';
import useSettingScreen from './useSettingScreen';
import {imageUrl} from '../../Utils/Urls';
import {IconBtn} from '../../Components/IconBtn';
import {styles} from './styles';

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
      <Touchable
        onPress={() => item?.onpress(navigation.navigate, item?.screenName)}
        style={styles.listBtn}>
        <Image source={item?.icon} style={styles.iconGreen} />
        <View
          style={[
            styles.listInner,
            index === data.length - 1 && styles.lastItem,
          ]}>
          <TextComponent text={item?.name} styles={styles.title} />
          <Image source={arrLeft} style={styles.arrowRight} />
        </View>
      </Touchable>
    );
  });

  return (
    <ImageBackground source={stepBg} style={styles.container}>
      <View showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TextComponent text={'Settings'} styles={styles.topHd} />
        </View>
        {/* <CircleImage /> */}
        <BlurImage
          blurhash={'LKK1wP_3yYIU4.jsWrt7_NRjMdt7'}
          // radius={75}
          isURI={true}
          styles={styles.ProfileImage}
          blurStyle={styles.blurMain}
          uri={imageUrl(userData?.profile_image)}
        />
        <TextComponent
          text={userData?.first_name + ' ' + userData?.last_name}
          styles={styles.name}
        />
        <TextComponent text={userData?.email} styles={styles.email} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled
          contentContainerStyle={{paddingBottom: hp('70')}}>
          <View style={styles.mainBtn}>
            <FlatList
              data={[
                {
                  icon: goalGreen,
                  name: 'Edit Profile',
                  onpress: (navigate, route) => navigate(route),
                  screenName: 'EditProfileScreen',
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
          <View style={styles.mainBtn}>
            <FlatList
              data={settingData}
              scrollEnabled={false}
              keyExtractor={keyExtractor}
              renderItem={props => renderItem({...props, data: settingData})}
            />
          </View>
          <View style={styles.mainBtn}>
            <IconBtn
              icon={passGreen}
              btnText={'Change Password'}
              changeText={'Change'}
              onpress={() => navigation.navigate('ChangePasswordScreen')}
            />
            <FlatList
              data={profileData}
              keyExtractor={keyExtractor}
              scrollEnabled={false}
              renderItem={props => renderItem({...props, data: profileData})}
            />
          </View>
          <View style={{...styles.mainBtn, ...styles.bottomSpace}}>
            <IconBtn
              icon={logoutGreen}
              btnText={'Log Out'}
              onpress={() => toggleAlert('logoutAlert')}
            />
            <IconBtn
              icon={trash}
              btnText={'Deactivate Account'}
              extraStyle={styles.lastItem}
              onpress={() => toggleAlert('deleteAlert')}
            />
          </View>
        </ScrollView>
        <SettingModal
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
        />
      </View>
    </ImageBackground>
  );
};

export default memo(SettingScreen);
