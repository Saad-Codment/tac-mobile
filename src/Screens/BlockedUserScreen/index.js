import {View, Text} from 'react-native';
import React, {memo, useCallback} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {AniFlatOneByOne} from '../../AnimatedComp/AniFlatOneByOne';
import {DataNotFound} from '../../Components/DataNotFound';
import {wp} from '../../Config/responsive';
import {styles} from './styles';
import MyFriendComp from '../../Components/MyFriendComp';
import useBlockUSerScreen from './useBlockedUserScreen';

const BlockedUserScreen = () => {
  const {blockUserList, refetch, isLoading, isSuccess} = useBlockUSerScreen();

  console.log(
    'datadatadatadadsfsdfsdfsdfsdfsdsdsdfsdfsdtadatadatadatadata',
    Array.isArray(blockUserList) && blockUserList.length == 0 && isSuccess,
  );

  const renderData = useCallback(
    (item, index) => {
      return (
        <MyFriendComp
          isBlocked
          item={item}
          index={index}
          refetch={refetch}
          isDisable={true}
        />
      );
    },
    [blockUserList],
  );

  return (
    <View style={{flex: 1}}>
      <HeaderComponent headerTitle={'Blocked Users'} isBack />
      {!isLoading && (
        <AniFlatOneByOne
          data={blockUserList}
          flatViewStyle={styles.upComingFlatlistView}
          // onRefresh={refetch}
          flatListProps={{
            //   extraData: friendListData,
            numColumns: 1,
            ListEmptyComponent: Array.isArray(blockUserList) &&
              blockUserList.length == 0 &&
              isSuccess && (
                <DataNotFound
                  btnStyles={{width: wp('80')}}
                  title={'No block user found'}
                  subTitle={''}
                  // title={
                  //   url == getMyFriendsUrl
                  //     ? 'No Rodeo Crew Yet'
                  //     : 'Data not found'
                  // }
                  // subTitle={
                  //   url == getMyFriendsUrl
                  //     ? 'Search for friends or sync your contacts to see which rodeo enthusiasts are already on TAC.'
                  //     : 'No data, please try again later'
                  // }
                />
              ),
          }}
          InnerCompnonet={(item, index) => {
            return renderData(item, index);
          }}
        />
      )}
    </View>
  );
};

export default memo(BlockedUserScreen);
