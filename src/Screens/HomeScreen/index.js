import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  FlatList,
  Platform,
  ActivityIndicator,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import useHomeScreen from './useHomeScreen';
import HomeHeader from '../../Components/homeHeader';
import {TextComponent} from '../../Components/TextComponent';
import {styles} from './styles';
import {
  calender,
  clock,
  editYellow,
  galleryYellow,
  heart,
  location,
  lock,
  searchIcon,
  searchsetting,
} from '../../Assets';
import {Colors} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import ThemeButton from '../../Components/ThemeButton';
import UpcomingEventsComp from '../../Components/UpCommingEventsComp';
import FriendEventsComp from '../../Components/FriendEventsComp';
import AddFriendComp from '../../Components/AddFriendComp';
import {allSuggestedEventsUrl, allUpComingEventsUrl} from '../../Utils/Urls';
import Overlay from '../../Components/Overlay';
import {keyExtractor} from '../../Utils';
import {DataNotFound} from '../../Components/DataNotFound';
import PostViewComp from '../../Components/PostViewComp';
import BottomModalComponent from '../../Components/BottomModalComponent';
import InfiniteScrollView from 'react-native-infinite-scroll-view';

const HomeScreen = ({navigation}) => {
  const {
    search,
    setSearch,
    dynamicRoute,
    onRefresh,
    suggestedFriends,
    sendReq,
    userData,
    refetchKey,
    isFetchingNextPage,
    fetchNextPage,
    afterFetchNextPage,
    homeTimeLine,
    upcommingEvents,
    modal,
    setModal,
    refreshing,
    isEndReachedCalledDuringMomentum,
    setIsEndReachedCalledDuringMomentum,
    fetchData,
    handleLoadMore,
    isLoading,
    hasMoreData,
    handleScroll,
    isRefetching,
    loadMoreDebounced,
    hasNextPage,
  } = useHomeScreen(navigation);

  const scrollOffset = useRef(0);

  const renderItem = useCallback(({item, index}) => {
    return (
      <UpcomingEventsComp
        item={item}
        index={index}
        functionToUpdateLike={() => {}}
        openBottomSheet={id => setModal(id)}
        mainViewStyle={{width: wp('90'), marginLeft: wp('2')}}
        refetechKeys={['homeSuggestedFriends']}
      />
    );
  }, []);

  const friendEvents = useCallback(({item}) => {
    return <FriendEventsComp />;
  }, []);

  const renderItemAddFriend = useCallback(({item}) => {
    return (
      <AddFriendComp
        item={item}
        sendReq={sendReq}
        mainViewStyle={{marginHorizontal: wp('1')}}
      />
    );
  }, []);

  return (
    <View>
      <HomeHeader
        text={`Hi, ${userData?.first_name}`}
        onNotificarioPress={() => dynamicRoute('NotificationScreen')}
        userDataImg={userData?.profile_image}
        onProfilePress={() =>
          dynamicRoute('FriendProfileScreen', {id: userData?.id})
        }
      />

      <ScrollView
        // onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // refreshControl={}
        contentContainerStyle={styles.scrollContainer}>
        {upcommingEvents.length > 0 && (
          <>
            <View style={styles.innerView}>
              <TextComponent
                styles={{color: Colors.black, ...styles.upcoming}}
                text={'Suggested Events'}
              />
              <TextComponent
                styles={{color: Colors.black, ...styles.viewall}}
                text={'View All'}
                onPress={() => {
                  dynamicRoute('AllEventsScreen', {
                    url: allSuggestedEventsUrl,
                    key: 'suggestedEvents',
                    title: 'Suggested Events',
                  });
                }}
              />
            </View>
            <FlatList
              data={upcommingEvents}
              renderItem={renderItem}
              horizontal // Enable horizontal scrolling
              keyExtractor={item => item.toString()}
              showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
              contentContainerStyle={{paddingHorizontal: 10}} // Padding around the list
            />
          </>
        )}
        <View style={styles.innerView}>
          <TextComponent
            styles={{color: Colors.black, ...styles.upcoming}}
            text={'Add Friends'}
          />
          <TextComponent
            styles={{color: Colors.black, ...styles.viewall}}
            text={'View All'}
            onPress={() => navigation.navigate('AllSuggestedFriendsScreen')}
          />
        </View>
        <FlatList
          data={suggestedFriends}
          renderItem={renderItemAddFriend}
          horizontal // Enable horizontal scrolling
          keyExtractor={item => item.toString()}
          showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
          contentContainerStyle={{paddingHorizontal: wp('1')}} // Padding around the list
        />
        {/* 
        <InfiniteScrollView
          data={homeTimeLine ?? []}
          renderItem={({item, index}) => {
            return (
              <>
                {item?.type == 'event' && (
                  <UpcomingEventsComp
                    item={item}
                    index={index}
                    refetechKeys={refetchKey}
                    mainViewStyle={styles.cardStyles}
                    functionToUpdateLike={() => {}}
                    openBottomSheet={id => setModal(id)}
                  />
                )}
                {item?.type == 'post' && (
                  <PostViewComp
                    item={item}
                    index={index}
                    refetechKeys={refetchKey}
                    mainViewStyle={styles.cardStyles}
                    functionToUpdateLike={() => {}}
                    openBottomSheet={id => setModal(id)}
                  />
                )}
                {item?.type == 'suggested_event' && (
                  <UpcomingEventsComp
                    item={item}
                    index={index}
                    refetechKeys={refetchKey}
                    mainViewStyle={styles.cardStyles}
                    functionToUpdateLike={() => {}}
                    openBottomSheet={id => setModal(id)}
                  />
                )}
              </>
            );
          }}
          onLoadMore={fetchNextPage}
          canLoadMore={true}
          loadingMore={isFetchingNextPage}
          LoadingIndicator={() => (
            <ActivityIndicator size="small" color="gray" />
          )}
        /> */}

        <FlatList
          data={homeTimeLine ?? []}
          extraData={homeTimeLine}
          contentContainerStylee={styles.upComingFlatlistView}
          keyExtractor={keyExtractor}
          refreshing={false}
          ListFooterComponent={
            homeTimeLine.length >= 9 &&
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
                  afterFetchNextPage();
                }}
              />
            )) // Show loading spinner at the bottom
          }
          renderItem={({item, index}) => {
            //             const isEvent = {
            //               post = 1
            // event = 2
            // shared post = 3
            // suggested event= 4
            // shared event = 5
            // shared suggested event = 6

            //             }
            return (
              <>
                {item?.type == 3 || item?.type == 1 ? (
                  <PostViewComp
                    item={item}
                    index={index}
                    refetechKeys={refetchKey}
                    mainViewStyle={styles.cardStyles}
                    functionToUpdateLike={() => {}}
                    openBottomSheet={id => setModal(id)}
                  />
                ) : (
                  <UpcomingEventsComp
                    item={item}
                    index={index}
                    refetechKeys={refetchKey}
                    mainViewStyle={styles.cardStyles}
                    functionToUpdateLike={() => {}}
                    openBottomSheet={id => setModal(id)}
                  />
                )}
              </>
            );
          }}
          // ListFooterComponent={
          //   isFetchingNextPage && (
          //     <ActivityIndicator size="small" color="gray" />
          //   )
          // }
          // onScroll={useCallback(
          //   event => {
          //     const {contentOffset, contentSize, layoutMeasurement} =
          //       event.nativeEvent;
          //     const scrollPosition = contentOffset.y + layoutMeasurement.height;
          //     const loadThreshold = contentSize.height * 0.7; // 70% scroll depth

          //     if (scrollPosition >= loadThreshold) {
          //       loadMoreDebounced(); // Using debounced version
          //     }
          //   },
          //   [loadMoreDebounced],
          // )}
          // Add these to prevent ghost calls
          // Instagram's performance optimizations:
          // initialNumToRender={7}
          // maxToRenderPerBatch={5}
          // windowSize={10}
          // updateCellsBatchingPeriod={100}
          // removeClippedSubviews={true}
          // onEndReachedThreshold={0.5} // Fallback
          // scrollEventThrottle={16} // ~60fps
          // onEndReached={handleLoadMore}
          // onEndReached={() => {
          //   if (hasNextPage) handleLoadMore();
          // }}
          // estimatedItemSize={50}
          // onEndReachedThreshold={0.5} // Trigger fetch when 50% of the list is scrolled
          // onEndReached={({nativeEvent}) => {
          //   // const {contentOffset, contentSize, layoutMeasurement} = nativeEvent;
          //   // const isEndReached =
          //   //   contentOffset.y + layoutMeasurement.height >=
          //   //   contentSize.height - 20;
          //   // if (isEndReached) {
          //   handleLoadMore();
          //   // }
          // }}
        />
      </ScrollView>
      {Boolean(modal != null) && (
        <BottomModalComponent
          isVisible={Boolean(modal != null)}
          isReport
          event_id={modal}
          onClose={() => setModal(null)}
        />
      )}
    </View>
  );
};

export default HomeScreen;
