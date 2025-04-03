import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import {CircleImage} from './CircleImage';
import {imageUrl} from '../Utils/Urls';
import {TextComponent} from './TextComponent';
import ThemeButton from './ThemeButton';
import {hp, wp} from '../Config/responsive';
import {Colors} from '../Theme/Variables';
import MutualFriends from './MutualFriendsComponent';
import useFriendServices from '../Services/FriendServices';
import useReduxStore from '../Hooks/UseReduxStore';
import {types} from '../Redux/types';

const FriendReqComp = ({
  item,
  index,
  onAcceptReq,
  onCancelReq,
  refetechKeys,
}) => {
  const {acceptFriendReq, rejectFriendReq} = useFriendServices();

  const {dispatch} = useReduxStore();

  const onImagePress = () => {
    dispatch({
      payload: item?.sender?.profile_image,
      type: types.openModal,
    });
  };

  console.log('lksnvklsdnlkvsdnl;vnsdl;vnls;dnv;sd', item);
  return (
    <View style={styles.cardView}>
      <Pressable onPress={onImagePress}>
        <CircleImage
          uri={imageUrl(item?.sender?.profile_image)}
          styles={styles.circleImg}
        />
      </Pressable>
      <View style={styles.secView}>
        <TextComponent
          text={item?.sender?.first_name + ' ' + item?.sender?.last_name}
          styles={styles.titleStyle}
        />
        <View style={styles.bottomView}>
          <MutualFriends
            uri={'https://picsum.photos/200'}
            friends={[1, 2, 3, 4]}
          />
        </View>
        <View style={styles.btnView}>
          <ThemeButton
            title={'Confirm'}
            style={styles.acceptBtn}
            textStyle={{
              color: 'white',
              fontSize: hp('1.5'),
            }}
            onPress={async () => {
              await acceptFriendReq.mutateAsync(item?.id);
              if (refetechKeys) {
                refetechKeys.map(res => {
                  queryClient.invalidateQueries([res]); // Refetch data
                });
              }
            }}
          />
          <ThemeButton
            title={'Delete'}
            style={styles.rejectBtn}
            textStyle={{
              fontSize: hp('1.5'),
              color: 'black',
            }}
            onPress={async () => {
              await rejectFriendReq.mutateAsync(item?.id);
              if (refetechKeys) {
                refetechKeys.map(res => {
                  queryClient.invalidateQueries([res]); // Refetch data
                });
              }
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardView: {
    flexDirection: 'row',
    paddingVertical: hp('1'),
    paddingHorizontal: wp('3'),
    // width: wp('98'),
  },
  circleImg: {
    width: Dimensions.get('window').width * 0.25,
    height: Dimensions.get('window').width * 0.25,
  },
  secView: {marginTop: hp('0.5'), marginLeft: wp('5')},
  bottomView: {
    flexDirection: 'row',
    marginTop: hp('1'),
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  titleStyle: {fontWeight: 'bold', fontSize: hp('2')},
  ratingText: {fontSize: hp('1.5'), marginTop: hp('0.5')},
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('62'),
    marginTop: hp('1'),
  },
  acceptBtn: {
    backgroundColor: Colors.primaryColor,
    height: hp('4'),
    width: wp('30'),
  },
  rejectBtn: {
    backgroundColor: Colors.diableBtnCOlor,
    height: hp('4'),
    width: wp('30'),
  },
});

export default FriendReqComp;
