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
} from 'react-native';
import React, {useCallback, useState} from 'react';
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
  } = useHomeScreen(navigation);

  const renderItem = useCallback(({item, index}) => {
    return (
      <UpcomingEventsComp
        item={item}
        index={index}
        functionToUpdateLike={() => {}}
        openBottomSheet={id => setModal(id)}
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
                text={'Upcoming Events'}
              />
              <TextComponent
                styles={{color: Colors.black, ...styles.viewall}}
                text={'View All'}
                onPress={() => {
                  dynamicRoute('AllEventsScreen', {
                    url: allUpComingEventsUrl,
                    key: 'upcomingEvents',
                    title: 'Upcoming Events',
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

        <FlatList
          data={homeTimeLine ?? []}
          extraData={homeTimeLine}
          contentContainerStylee={styles.upComingFlatlistView}
          keyExtractor={keyExtractor}
          refreshing={false}
          ListEmptyComponent={
            <DataNotFound
              onpress={onRefresh}
              btnStyles={{width: wp('80')}}
              mainViewStyles={{alignSelf: 'center', marginTop: hp('20')}}
            />
          }
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
          ListFooterComponent={
            homeTimeLine.length >= 9 &&
            (isFetchingNextPage ? (
              <ActivityIndicator size="small" color="gray" />
            ) : (
              <ThemeButton
                title={'Load More'}
                style={{
                  marginTop: hp('2'),
                  width: wp('40'),
                  alignSelf: 'center',
                  marginBottom: hp('5'),
                }}
                onPress={async () => {
                  await fetchNextPage();
                  afterFetchNextPage();
                }}
              />
            )) // Show loading spinner at the bottom
          }
          // ListFooterComponent={
          //   isFetchingNextPage && (
          //     <ActivityIndicator size="small" color="gray" />
          //   )
          // }
          // onEndReachedThreshold={1} // 0.2 means when user scrolls near 20% from bottom
          // onTouchEnd={async () => {
          //   if (
          //     !isFetchingNextPage &&
          //     // homeTimeLine.length >= 9&&
          //     !isEndReachedCalledDuringMomentum
          //   ) {
          //     setIsEndReachedCalledDuringMomentum(true);
          //     await fetchNextPage();
          //     afterFetchNextPage();
          //   }
          // }}
          // onEndReached={async () => {
          //   if (
          //     !isFetchingNextPage &&
          //     // homeTimeLine.length >= 9&&
          //     !isEndReachedCalledDuringMomentum
          //   ) {
          //     setIsEndReachedCalledDuringMomentum(true);
          //     await fetchNextPage();
          //     afterFetchNextPage();
          //   }
          // }}
          // onMomentumScrollBegin={() => {
          //   setIsEndReachedCalledDuringMomentum(false);
          // }}
        />

        {/* <FlatList
          data={[]}
          renderItem={renderItem}
          horizontal // Enable horizontal scrolling
          keyExtractor={item => item.toString()}
          showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
          contentContainerStyle={{paddingHorizontal: 10}} // Padding around the list
        />
        <View style={styles.innerView}>
          <TextComponent
            styles={{
              ...styles.upcoming,
            }}
            text={'Friend’s Events'}
          />
          <TextComponent
            styles={{
              ...styles.viewall,
            }}
            text={'View All'}
            onPress={() => dynamicRoute('FriendsEventsScreen')}
          />
        </View>
        <FlatList
          data={[]}
          renderItem={friendEvents}
          horizontal // Enable horizontal scrolling
          keyExtractor={item => item.toString()}
          showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
          contentContainerStyle={{paddingHorizontal: 10}} // Padding around the list
        />
        <View style={styles.innerView}>
          <TextComponent
            styles={{
              color: scrollPosition > 550 ? Colors.white : Colors.black,
              ...styles.upcoming,
            }}
            text={'Suggested Events'}
          />
          <TextComponent
            styles={{
              color: scrollPosition > 550 ? Colors.white : Colors.black,
              ...styles.viewall,
            }}
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
          data={[]}
          renderItem={renderItem}
          horizontal // Enable horizontal scrolling
          keyExtractor={item => item.toString()}
          showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
          contentContainerStyle={{paddingHorizontal: 10}} // Padding around the list
        /> */}
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
