import {View, Text} from 'react-native';
import React, {memo} from 'react';
import useFriendReqScreen from './useFriendReqScreen';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {AniFlatOneByOne} from '../../AnimatedComp/AniFlatOneByOne';
import {DataNotFound} from '../../Components/DataNotFound';
import {wp} from '../../Config/responsive';
import AddFriendComp from '../../Components/AddFriendComp';
import {styles} from './styles';
import FriendReqComp from '../../Components/FriendReqComp';

const FriendReqScreen = ({navigation}) => {
  const {acceptReq, declineReq, friendList, onRefresh} =
    useFriendReqScreen(navigation);
  return (
    <>
      <HeaderComponent
        headerTitle={'Friend Requests'}
        goBack={() => navigation.goBack()}
        isBack
      />
      <AniFlatOneByOne
        data={friendList}
        flatViewStyle={styles.upComingFlatlistView}
        onRefresh={onRefresh}
        flatListProps={{
          numColumns: 1,
          ListEmptyComponent: (
            <DataNotFound onpress={onRefresh} btnStyles={{width: wp('80')}} />
          ),
        }}
        InnerCompnonet={(item, index) => (
          <FriendReqComp
            item={item}
            index={index}
            onAcceptReq={acceptReq}
            onCancelReq={declineReq}
          />
        )}
      />
    </>
  );
};

export default memo(FriendReqScreen);
