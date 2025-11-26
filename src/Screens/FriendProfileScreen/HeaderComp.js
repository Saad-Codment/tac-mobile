import {View, Text, Image, StyleSheet, Pressable, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import {Colors} from '../../Theme/Variables';
import {CircleImage} from '../../Components/CircleImage';
import {
  addCircleWhite,
  backIcon,
  divider,
  location,
  message,
  threeDotsHor,
} from '../../Assets';
import ThemeButton from '../../Components/ThemeButton';
import {Touchable} from '../../Components/Touchable';
import NavigationService from '../../Services/NavigationService';
import {
  getConversationIdUrl,
  getEventsUrl,
  getFriendEventsUrl,
  getMutalFriendsUrl,
  getUserFriendsUrl,
  imageUrl,
} from '../../Utils/Urls';
import useFriendServices from '../../Services/FriendServices';
import useReduxStore from '../../Hooks/UseReduxStore';
import {types} from '../../Redux/types';
import API from '../../Utils/helperFunc';

const HeaderComp = ({userData, myUserData}) => {
  const FriendCountHeaderComp = ({num, title, onPress}) => {
    return (
      <Touchable
        style={styles.compView}
        onPress={onPress}
        disabled={userData?.privacy == 1}>
        <TextComponent text={num ?? 0} isWhite styles={{fontSize: hp('1.2')}} />
        <TextComponent
          text={' ' + (num > 1 ? `${title}s` : title)}
          fade
          styles={{fontSize: hp('1.2')}}
        />
      </Touchable>
    );
  };

  // const friendCountArry = [
  //   {
  //     num: userData?.event_count,
  //     title: 'Events',
  //   },
  //   {
  //     num: userData?.friends_count,
  //     title: 'Friends',
  //     onPress: () =>
  //       NavigationService.navigate('FriendLists', {
  //         url: getUserFriendsUrl + userData?.id + '?',
  //         key: 'userFriends',
  //       }),
  //   },
  // ];

  const [friendCountArry, setFriendCountArry] = useState([
    {
      num: userData?.event_count,
      title: 'Event',
    },
    {
      num: userData?.friends_count,
      title: 'Friend',
      onPress: () =>
        NavigationService.navigate('FriendLists', {
          url: getUserFriendsUrl + userData?.id + '?',
          key: 'userFriends',
        }),
    },
  ]);

  useEffect(() => {
    if (userData?.id != myUserData?.id) {
      setFriendCountArry(prev => [
        {
          num: userData?.event_count,
          title: 'Event',
          onPress: () =>
            NavigationService.navigate('AllEventsScreen', {
              url: getFriendEventsUrl + userData?.id,
              key: ' getFriendEventsUrl+userData?.id',
              title: 'Events',
              // NavigationService.navigate('MyEventScreen', userData?.id),
            }),
        },
        {
          num: userData?.friends_count,
          title: 'Friend',
          onPress: () =>
            NavigationService.navigate('FriendLists', {
              url: getUserFriendsUrl + userData?.id + '?',
              key: 'userFriends',
            }),
        },
        {
          num: userData?.mutual_count,
          title: 'Mutual',
          onPress: () =>
            NavigationService.navigate('FriendLists', {
              url: getMutalFriendsUrl + userData?.id + '?',
              key: 'userMutalFriends',
              title: 'Mutal friends',
            }),
        },
      ]);
    } else {
      setFriendCountArry([
        {
          num: userData?.event_count,
          title: 'Events',
        },
        {
          num: userData?.friends_count,
          title: 'Friends',
          onPress: () =>
            NavigationService.navigate('FriendLists', {
              url: getUserFriendsUrl + userData?.id + '?',
              key: 'userFriends',
            }),
        },
      ]);
    }
  }, [userData?.id, myUserData?.id]);

  const {sendFriendReq, removeFriend} = useFriendServices();
  const {queryClient, dispatch} = useReduxStore();

  const onImagePress = () => {
    dispatch({
      payload: userData?.profile_image,
      type: types.openModalCircle,
    });
  };

  return (
    <View style={styles.mainView}>
      <View style={{flexDirection: 'row'}}>
        <Pressable onPress={onImagePress}>
          <CircleImage
            image={imageUrl(userData?.profile_image)}
            uri
            size={0.2}
          />
        </Pressable>
        <View style={styles.centerView}>
          <TextComponent
            text={`${userData?.first_name} ${
              userData?.last_name ? userData?.last_name : ''
            }`}
            isWhite
            styles={styles.nameText}
            numberOfLines={1}
          />
          <View style={styles.locationView}>
            {friendCountArry.map(res => (
              <FriendCountHeaderComp
                num={res?.num}
                title={res?.title}
                onPress={res?.onPress}
              />
            ))}
          </View>
          {userData?.id != myUserData?.id ? (
            <View style={styles.countView}>
              <ThemeButton
                title={
                  userData?.friends != 0
                    ? 'Remove'
                    : userData?.requested == 0
                    ? 'Add friend'
                    : 'Requested'
                }
                image={addCircleWhite}
                isYellowTheme
                style={styles.btnView}
                imageStyle={styles.btnImg}
                textStyle={{fontSize: hp('1.2')}}
                onPress={async () => {
                  if (userData?.friends == 0) {
                    await sendFriendReq.mutateAsync(userData?.id);
                  } else {
                    Alert.alert(
                      'Confirmation Alert',
                      `Are you sure you want to remove ${userData?.first_name} as a friend?`,
                      [
                        {text: 'Cancel', style: 'cancel'},
                        {
                          text: 'Yes, Remove',
                          style: 'destructive',
                          onPress: async () => {
                            await removeFriend.mutateAsync(userData?.friends);
                            queryClient.invalidateQueries(['getProfileData']);
                          },
                        },
                      ],
                    );
                  }
                  queryClient.invalidateQueries(['getProfileData']);
                }}
                isDisable={Boolean(
                  userData?.requested == 1 && userData?.friends == 0,
                )}
              />
              {!Boolean(userData?.friends == 0) && (
                <ThemeButton
                  title={'Message'}
                  image={message}
                  style={{...styles.btnView, backgroundColor: 'white'}}
                  imageStyle={styles.btnImg}
                  textStyle={{color: Colors.textGray, fontSize: hp('1.2')}}
                  isYellowTheme={Boolean(userData?.friends == 1)}
                  isDisable={Boolean(userData?.friends == 0)}
                  onPress={async () => {
                    const {ok, data} = await API.get(
                      getConversationIdUrl + userData?.id,
                    );
                    if (ok)
                      NavigationService.navigate('ChatScreen', {
                        id: userData?.other_user?.id || userData?.id, // Fallback to item.id if other_user.id is missing
                        userId: userData?.id,
                        conversationId: data?.conversation_id,
                      });
                  }}
                />
              )}
            </View>
          ) : (
            <>
              <View />
              <View />
              <View />
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default HeaderComp;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: Colors.headerBg,
    width: wp('100'),
    // paddingVertical: hp('2'),
    paddingHorizontal: wp('2'),
    paddingBottom: hp('2'),
    // height: hp('40'),
  },
  centerView: {
    marginLeft: wp('2.5'),
    marginVertical: hp('0.5'),
    justifyContent: 'space-between',
  },
  nameText: {
    // fontWeight: 'bold',
    fontSize: hp('2'),
    // marginLeft: wp('0.7'),
    width: wp('60'),
  },
  locationView: {flexDirection: 'row', alignItems: 'center'},
  locIcon: {
    width: wp('5'),
    height: hp('2'),
    tintColor: Colors.primaryColor,
  },
  countView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp('52'),
  },
  backView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('4'),
  },
  compView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp('5'),
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('2'),
  },
  btnView: {width: wp('25'), height: hp('3')},
  btnImg: {width: wp('4'), height: hp('3')},
  dotsBtnView: {
    width: wp('15'),
    height: hp('5'),
    backgroundColor: 'white',
  },
  dotBtnImg: {marginLeft: wp('2'), width: wp('5'), height: hp('5')},
  divider: {
    marginTop: hp('2'),
    width: wp('95'),
    marginLeft: wp('0.5'),
  },
});
