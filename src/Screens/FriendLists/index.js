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
import ThemeButton from '../../Components/ThemeButton';

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
                btnStyles={{width: wp('80')}}
                title={'No user found!'}
                subTitle={''}
              />
            ),
            // Show loading spinner at the bottom
            ListFooterComponent:
              friendListData.length >= 9 &&
              (isFetchingNextPage ? (
                <ActivityIndicator size="small" color="gray" />
              ) : (
                <ThemeButton
                  title={'Load More'}
                  style={{
                    marginTop: hp('2'),
                    width: wp('30'),
                    height: hp('4'),
                    alignSelf: 'center',
                    marginBottom: hp('5'),
                  }}
                  textStyle={{fontSize: hp('1.5')}}
                  onPress={async () => {
                    await fetchNextPage();
                    // afterFetchNextPage();
                  }}
                />
              )),
            // onEndReachedThreshold: 0.5, // Trigger fetch when 50% of the list is scrolled

            // onEndReached: () => {
            //   if (hasNextPage) fetchNextPage();
            // },
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
