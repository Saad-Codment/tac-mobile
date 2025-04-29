import {View, Text, Image, StyleSheet, ActivityIndicator} from 'react-native';
import React, {memo} from 'react';
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

const MyProfileScreen = ({navigation}) => {
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
  } = useMyProfileScreen(navigation);

  console.log('lkdbkldbfklbdfklbkldfbl;kdbsf;b;ldflnb;df', myUserData);

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
            <TextComponent text={' Evnets'} styles={styles.statLabel} />
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
        <View style={styles.statItem}>
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
        </View>
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
                  style={{marginTop: hp('2'), width: wp('40')}}
                  onPress={() => loadMoreData()}
                />
              )), // Show loading spinner at the bottom
          }}
          InnerCompnonet={(item, index) => {
            return (
              <View style={{marginVertical: hp('1')}}>
                {item.type == 2 ? (
                  <UpcomingEventsComp
                    item={item}
                    index={index}
                    mainViewStyle={{width: wp('95')}}
                    upperImgStyle={{width: wp('95')}}
                    functionToUpdateLike={functionToUpdateLike}
                    openBottomSheet={id => setModal(id)}
                    // likePost={likePost}
                  />
                ) : (
                  <PostViewComp
                    item={item}
                    index={index}
                    functionToUpdateLike={functionToUpdateLike}
                    openBottomSheet={id => setModal(id)}
                  />
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default memo(MyProfileScreen);
