import {View, Text, FlatList, Image, ActivityIndicator} from 'react-native';
import React, {useCallback} from 'react';
import useFriendLists from './useFriendLists';
import {styles} from './styles';
import {TextComponent} from '../../Components/TextComponent';
import {Touchable} from '../../Components/Touchable';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {chat, rightIos} from '../../Assets';
import BlurImage from '../../Components/BlurImage';
import {hp, wp} from '../../Config/responsive';
import MutualFriends from '../../Components/MutualFriendsComponent';
import {AniFlatOneByOne} from '../../AnimatedComp/AniFlatOneByOne';
import {DataNotFound} from '../../Components/DataNotFound';
import MyFriendComp from '../../Components/MyFriendComp';

const FriendLists = ({navigation, route}) => {
  const {
    friendListData,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isPending,
    refetch,
    userData,
  } = useFriendLists(navigation, route);

  return (
    <>
      <HeaderComponent
        headerTitle={'Friend List'}
        goBack={() => navigation.goBack()}
        isBack
      />
      <AniFlatOneByOne
        data={friendListData}
        flatViewStyle={styles.upComingFlatlistView}
        onRefresh={refetch}
        flatListProps={{
          numColumns: 1,
          ListEmptyComponent: (
            <DataNotFound onpress={refetch} btnStyles={{width: wp('80')}} />
          ),
          onEndReachedThreshold: 0.5, // Trigger fetch when 50% of the list is scrolled
          ListFooterComponent: () =>
            isFetchingNextPage ? <ActivityIndicator /> : null,
          onEndReached: () => {
            if (hasNextPage) fetchNextPage();
          },
        }}
        InnerCompnonet={(item, index) => {
          return (
            userData?.id != item?.id && (
              <MyFriendComp item={item} index={index} refetch={refetch} />
            )
          );
        }}
      />
    </>
  );
};

export default FriendLists;
