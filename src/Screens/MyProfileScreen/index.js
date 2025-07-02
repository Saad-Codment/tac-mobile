import {View, Text, Image, StyleSheet, ActivityIndicator} from 'react-native';
import React, {memo, useCallback} from 'react';
import ProfileHeader from '../../Components/ProfileHeader';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';
import {assoicationIcon, flag, friendReq} from '../../Assets';
import {TextComponent} from '../../Components/TextComponent';
import {styles} from './styles';
import DividerLine from '../../Components/DividerLine';
import useMyProfileScreen from './useMyProfileScreen';
import {AniFlatOneByOne} from '../../AnimatedComp/AniFlatOneByOne';
import {DataNotFound} from '../../Components/DataNotFound';
import ThemeButton from '../../Components/ThemeButton';
import UpcomingEventsComp from '../../Components/UpCommingEventsComp';
import PostViewComp from '../../Components/PostViewComp';
import {Touchable} from '../../Components/Touchable';
import {getMyFriendsUrl} from '../../Utils/Urls';

const MyProfileScreen = ({navigation, route}) => {
  const {
    userData,
    eventsList,
    isRefetching,
    isFetching,
    hasMoreData,
    myUserData,
    modal,
    setModal,
    openBottomSheet,
    onRefresh,
    loadMoreData,
    refetch,
    functionToUpdateLike,
    functionToDelete,
    functionToUpdateComment,
  } = useMyProfileScreen(navigation, route);

  console.log('lkdbkldbfklbdfklbkldfbl;kdbsf;b;ldflnb;df', myUserData);

  const renderItem = useCallback(
    (item, index) => {
      return (
        <View style={{marginVertical: hp('1')}}>
          {item?.type == 3 || item?.type == 1 ? (
            <PostViewComp
              item={item}
              index={index}
              functionToUpdateLike={functionToUpdateLike}
              openBottomSheet={id => setModal(id)}
              functionToDelete={functionToDelete}
              functionToUpdateComment={(i, isComment) =>
                functionToUpdateComment(index, isComment)
              }
            />
          ) : (
            <UpcomingEventsComp
              item={item}
              index={index}
              mainViewStyle={{width: wp('95')}}
              upperImgStyle={{width: wp('95')}}
              functionToUpdateLike={functionToUpdateLike}
              openBottomSheet={id => setModal(id)}
              functionToDelete={functionToDelete}

              // likePost={likePost}
            />
          )}
        </View>
      );
    },
    [
      refetch,
      isRefetching,
      eventsList,
      isRefetching,
      functionToUpdateLike,
      functionToUpdateComment,
      functionToDelete,
      setModal,
    ],
  );

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Image source={flag} resizeMode="contain" style={styles.statIcon} />
          <View style={styles.statTextContainer}>
            <TextComponent
              text={userData?.event_count}
              styles={styles.statNumber}
            />
            <TextComponent text={' Events'} styles={styles.statLabel} />
          </View>
        </View>
        <View style={styles.statItem}>
          <Image
            source={assoicationIcon}
            resizeMode="contain"
            style={styles.statIcon}
          />
          <View style={styles.statTextContainer}>
            <TextComponent
              text={myUserData?.associations?.length}
              styles={styles.statNumber}
            />
            <TextComponent text={' Associations'} styles={styles.statLabel} />
          </View>
        </View>
        <Touchable
          style={styles.statItem}
          onPress={() =>
            navigation.navigate('FriendLists', {
              url: getMyFriendsUrl,
              key: 'myFriends',
            })
          }>
          <Image
            source={friendReq}
            resizeMode="contain"
            style={styles.statIcon}
          />
          <View style={styles.statTextContainer}>
            <TextComponent
              text={userData?.friends_count}
              styles={styles.statNumber}
            />
            <TextComponent text={' Friends'} styles={styles.statLabel} />
          </View>
        </Touchable>
      </View>
      {!isFetching && (
        <AniFlatOneByOne
          data={eventsList ?? []}
          flatViewStyle={styles.upComingFlatlistView}
          onRefresh={onRefresh}
          flatListProps={{
            ListEmptyComponent:
              eventsList != null && eventsList?.length == 0 ? (
                <DataNotFound btnStyles={{width: wp('80')}} />
              ) : null,
            ListFooterComponent:
              eventsList != null &&
              eventsList.length >= 9 &&
              !hasMoreData &&
              (isFetching ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : (
                <ThemeButton
                  title={'Load More'}
                  style={{marginTop: hp('2'), width: wp('30'), height: hp('4')}}
                  onPress={() => loadMoreData()}
                  textStyle={{fontSize: hp('1.5')}}
                />
              )), // Show loading spinner at the bottom
          }}
          InnerCompnonet={(item, index) => {
            return renderItem(item, index);
          }}
        />
      )}
    </View>
  );
};

export default memo(MyProfileScreen);
