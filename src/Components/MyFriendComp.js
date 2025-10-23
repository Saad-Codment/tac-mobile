import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  Dimensions,
  Pressable,
} from 'react-native';
import React from 'react';
import BlurImage from './BlurImage';
import {hp, wp} from '../Config/responsive';
import {TextComponent} from './TextComponent';
import {Touchable} from './Touchable';
import {Colors, FontSize} from '../Theme/Variables';
import {chat, profileAdd} from '../Assets';
import {CircleImage} from './CircleImage';
import {getConversationIdUrl, imageUrl} from '../Utils/Urls';
import MutualFriends from './MutualFriendsComponent';
import ThemeButton from './ThemeButton';
import NavigationService from '../Services/NavigationService';
import useFriendServices from '../Services/FriendServices';
import useReduxStore from '../Hooks/UseReduxStore';
import {types} from '../Redux/types';
import API from '../Utils/helperFunc';

const MyFriendComp = ({
  item,
  refetch,
  mainViewStyles,
  isDisable,
  notShowProfile,
  isBlocked,
}) => {
  const {sendFriendReq, unblockUser} = useFriendServices();
  const {dispatch} = useReduxStore();

  const onImagePress = () => {
    dispatch({
      payload: item?.profile_image,
      type: types.openModal,
    });
  };

  return (
    <Touchable
      style={{...styles.view, ...mainViewStyles}}
      disabled={isDisable}
      onPress={() =>
        NavigationService.navigate('FriendProfileScreen', {id: item?.id})
      }>
      {!notShowProfile && (
        <Pressable onPress={onImagePress}>
          <CircleImage image={imageUrl(item?.profile_image)} size={0.11} uri />
        </Pressable>
      )}
      <View style={styles.titleView}>
        <TextComponent
          text={(item?.first_name ?? '') + ' ' + (item?.last_name ?? '')}
          styles={styles.title}
        />
        {item?.mutal_count && (
          <View style={{flexDirection: 'row'}}>
            <MutualFriends
              uri={'https://picsum.photos/200'}
              friends={[1, 2, 3, 4, 5]}
            />
          </View>
        )}
      </View>
      {isBlocked ? (
        <ThemeButton
          title={'UnBlock'}
          isYellowTheme
          // image={chat}
          style={{width: wp('14'), height: hp('3'), borderRadius: 8}}
          imageStyle={{width: wp('3.5')}}
          textStyle={{fontSize: hp('1.2'), marginLeft: wp('-0.5')}}
          onPress={async () => {
            await unblockUser.mutateAsync(item?.user_id);
            refetch();
          }}
        />
      ) : item?.isInvited ? (
        <ThemeButton
          title={'Invite'}
          isYellowTheme
          style={{width: wp('15'), height: hp('4'), paddingHorizontal: wp('3')}}
          imageStyle={{width: wp('5')}}
          textStyle={{fontSize: hp('1.5')}}
          // onPress={async () => {
          //   await sendFriendReq.mutateAsync(item?.id);
          //   refetch();
          // }}
        />
      ) : item?.friends == 0 ? (
        item?.requested == 0 ? (
          <ThemeButton
            title={'Add'}
            isYellowTheme
            image={profileAdd}
            style={{
              width: wp('15'),
              height: hp('4'),
              paddingHorizontal: wp('3'),
            }}
            imageStyle={{width: wp('3.5')}}
            textStyle={{fontSize: hp('1.5'), marginLeft: wp('-0.5')}}
            onPress={async () => {
              await sendFriendReq.mutateAsync(item?.id);
              refetch();
            }}
          />
        ) : (
          <ThemeButton
            title={'Requested'}
            style={{
              width: wp('20'),
              height: hp('4'),
              backgroundColor: Colors.diableBtnCOlor,
            }}
            imageStyle={{width: wp('5')}}
            textStyle={{color: Colors.black, fontSize: hp('1.5')}}
            isDisable
          />
        )
      ) : (
        <ThemeButton
          title={'Chat'}
          isYellowTheme
          image={chat}
          style={{width: wp('14'), height: hp('3'), borderRadius: 8}}
          imageStyle={{width: wp('3.5')}}
          textStyle={{fontSize: hp('1.2'), marginLeft: wp('-0.5')}}
          onPress={async () => {
            const {ok, data} = await API.get(getConversationIdUrl + item?.id);
            if (ok)
              NavigationService.navigate('ChatScreen', {
                id: item?.other_user?.id || item?.id, // Fallback to item.id if other_user.id is missing
                userId: item?.id,
                conversationId: data?.conversation_id,
              });
          }}
        />
      )}
    </Touchable>
  );
};

export default MyFriendComp;

const styles = StyleSheet.create({
  view: {
    borderRadius: 15,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('95'),
    alignSelf: 'center',
    marginVertical: hp('0.5'),
    paddingVertical: hp('1'),
    paddingHorizontal: wp('2'),
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  blurImage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('12'),
    height: Platform.OS == 'ios' ? hp('6') : hp('6.5'),
    borderRadius: 10,
    backgroundColor: 'red',
  },
  circle: {
    resizeMode: 'cover',
    width: wp('15'),
    height: hp('10'),
    // overflow: 'hidden',
  },
  titleView: {
    alignSelf: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    marginLeft: wp('3'),
  },
  title: {
    fontSize: FontSize.scale18,
    color: Colors.backgroundTheme,
    fontWeight: '600',
    // marginLeft: wp('1'),
    // marginTop: hp('0.5'),
    marginVertical: hp('0.5'),
    fontSize: hp('1.2'),
  },
  des: {
    fontSize: FontSize.scale14,
    color: Colors.textGray,
    fontWeight: 400,
  },
  detbtn: {
    fontSize: FontSize.scale14,
    color: Colors.primaryColor,
    fontWeight: 500,
  },
  r8: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introImage: {
    aspectRatio: 3 / 2,
    width: wp('4'),
    tintColor: Colors.primaryColor,
  },
  chatView: {
    backgroundColor: Colors.primaryColor,
    padding: 10,
    flexDirection: 'row',
    borderRadius: 10,
  },
  chat: {
    resizeMode: 'contain',
    height: hp('2'),
    width: wp('5'),
  },
  chatTxt: {
    fontSize: FontSize.scale16,
    color: Colors.white,
    fontWeight: 500,
  },
});
