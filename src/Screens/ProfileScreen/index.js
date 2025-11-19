import {
  Alert,
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
  mapState,
  mapCity,
} from '../../Assets';
import {TextComponent} from '../../Components/TextComponent';
import {CircleImage} from '../../Components/CircleImage';
import {hp, wp} from '../../Config/responsive';
import {styles} from './styles';
import {Colors, FontSize} from '../../Theme/Variables';
import {HeaderComponent} from '../../Components/HeaderComponent';
import NavigationService from '../../Services/NavigationService';
import {AlertDesign} from '../../Components/AlertDesign';
import {
  calculateAge,
  capitalizeFirstLetter,
  convertToPNG,
  uploadFromCamera,
  uploadFromGalary,
  uploadFromGalleryWithEditor,
} from '../../Services/GlobalFunctions';
import {getMyFriendsUrl, imageUrl} from '../../Utils/Urls';
import useReduxStore from '../../Hooks/UseReduxStore';
import {types} from '../../Redux/types';
import {MultiView} from '../SettingScreen/MultiView';
import usePorfileScreen from './useProfileScreen';
import IconBtnView from '../../Components/IconBtnView';
import {Touchable} from '../../Components/Touchable';
import SettingModal from '../SettingScreen/SettingModal';
import {states} from '../../Utils/localDB';
import {statesWithCities} from '../../Utils/statesWithCities';

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
      title:
        userData?.first_name +
        ' ' +
        (userData?.last_name ? userData?.last_name : ''),
      leftIcon: profileCircle,
      rightText: 'Edit',
      onPress: () => onOpenModal('edit_profile'),
    },
    {
      title: userData?.age
        ? `${calculateAge(userData?.age || '')} Years`
        : 'Not Available',
      leftIcon: ageIcon,
      rightText: 'Edit',
      onPress: () => onOpenModal('age_view'),
    },
    {
      title: capitalizeFirstLetter(userData?.gender ?? 'Not Available'),
      leftIcon: profileIcon,
      rightText: 'Edit',
      onPress: () => onOpenModal('user_gender'),
    },
    {
      // title: userData?.city
      //   ? `Home Town (${userData?.state}, ${userData?.city})`
      //   : 'Select your home town',
      leftIcon: mapState,
      titleChildComp: (
        <>
          {userData?.city ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                textAlign: 'left',
                marginLeft: wp('3'),
                flex: 1,
              }}>
              <TextComponent
                text={'Home Town '}
                styles={{
                  fontSize: hp('1.2'),
                }}
                fade
              />
              <TextComponent
                text={
                  userData?.city
                    ? `(${userData?.state}, ${userData?.city})`
                    : ''
                }
                styles={{
                  fontSize: hp('1.2'),
                }}
              />
            </View>
          ) : (
            <TextComponent
              text={'Select your home town'}
              styles={{
                fontSize: hp('1.2'),
                textAlign: 'left',
                marginLeft: wp('3'),
                flex: 1,
              }}
            />
          )}
        </>
      ),
      rightText: 'Edit',
      onPress: () =>
        navigation.navigate('StateCityScreen', {
          // 1. Callback – REQUIRED (to get selected city back)
          onSelectValue: selected => {
            console.log('User selected:', selected);
            // → { state: "California", city: "Los Angeles" }  or  null
            // Save it wherever you want (state, context, redux, etc.)
            // setSelectedLocation(selected);
          },
          listArray: states.map(item => ({id: item, name: item})),
          // 2. Pre-selected value – OPTIONAL (if you want to show already selected city)
          selectedValue: [{id: userData?.state, name: userData?.state}],
          onSelectedPress: true,
          title: 'Select State',
          // OR pass null if nothing selected yet
          // selectedValue: null,
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
      type: types.openModalCircle,
    });
  };

  console.log(
    'sljkdvblksdbvlbsdklvblskdbvklsdbvlksbdvbsd',
    userData?.profile_image,
  );

  return (
    // <ImageBackground source={stepBg} style={styles.container}>
    <View showsVerticalScrollIndicator={false} style={{flexGrow: 1}}>
      <HeaderComponent headerTitle={'Profile'} isBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{flexGrow: 1}}>
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
                  Alert.alert(
                    'Pick to choose image',
                    '',
                    [
                      {
                        text: 'Camera',
                        onPress: async () => {
                          const img = await uploadFromCamera(false, false);
                          navigation.navigate('CropScreen', {
                            image: img,
                            afterCropImg: e => justUploadImg({...img, uri: e}),
                          });
                        },
                      },
                      {
                        text: 'Gallery', // Just a dismissal button
                        onPress: async () => {
                          const img = await uploadFromGalary(false, false);
                          navigation.navigate('CropScreen', {
                            image: img,
                            afterCropImg: e => justUploadImg({...img, uri: e}),
                          });
                        },
                      },
                      {
                        text: 'Cancel', // Just a dismissal button
                        style: 'destructive',
                        onPress: async () => {
                          // console.log(
                          //   'slkdbvklsdbvklsdbklvbskdlv',
                          //   value?.length,
                          // );
                          // const imgData = await uploadFromGalary(
                          //   true,
                          //   false,
                          //   Math.max(0, 5 - (value?.length ?? 0)),
                          // );
                          // onChange([...(value ?? []), ...imgData]);
                        },
                      },
                    ],
                    {cancelable: true},
                  );
                  // const img = await uploadFromGalary(false, true);
                  // justUploadImg(img);
                }}>
                <Image
                  source={editPicBtn}
                  resizeMode="contain"
                  style={{height: hp('4')}}
                />
              </Touchable>
            </Pressable>
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
              styles={{fontSize: hp('1.2'), marginVertical: hp('0.5')}}
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
          allData={
            Boolean(onPressKey == 'state' || onPressKey == 'city')
              ? onPressKey == 'state'
                ? states
                : onPressKey == 'city'
                ? statesWithCities[userData?.state ?? ''] || []
                : []
              : allData ?? []
          }
          // allData={allData ?? []}
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
