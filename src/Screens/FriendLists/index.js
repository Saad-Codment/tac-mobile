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
import Overlay from '../../Components/Overlay';
import {getMyFriendsUrl} from '../../Utils/Urls';

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
    params,
    isLoading,
    url,
  } = useFriendLists(navigation, route);

  const renderData = useCallback(
    (item, index) => {
      return (
        userData?.id != item?.id && (
          <MyFriendComp item={item} index={index} refetch={refetch} />
        )
      );
    },
    [friendListData],
  );

  return (
    <>
      <HeaderComponent
        headerTitle={params?.title ?? 'Friend List'}
        goBack={() => navigation.goBack()}
        isBack
      />
      {!isLoading && (
        <AniFlatOneByOne
          data={friendListData}
          flatViewStyle={styles.upComingFlatlistView}
          onRefresh={refetch}
          flatListProps={{
            extraData: friendListData,
            numColumns: 1,
            ListEmptyComponent: (
              <DataNotFound
                onpress={refetch}
                btnStyles={{width: wp('80')}}
                title={
                  url == getMyFriendsUrl
                    ? 'No Rodeo Crew Yet'
                    : 'Data not found'
                }
                subTitle={
                  url == getMyFriendsUrl
                    ? 'Search for friends or sync your contacts to see which rodeo enthusiasts are already on TAC.'
                    : 'No data, please try again later'
                }
              />
            ),
            onEndReachedThreshold: 0.5, // Trigger fetch when 50% of the list is scrolled
            ListFooterComponent: () =>
              isFetchingNextPage ? <ActivityIndicator /> : null,
            onEndReached: () => {
              if (hasNextPage) fetchNextPage();
            },
          }}
          InnerCompnonet={(item, index) => {
            return renderData(item, index);
          }}
        />
      )}
    </>
  );
};

export default FriendLists;
