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
import {getEventsUrl, getMyFriendsUrl} from '../../Utils/Urls';
import SettingModal from '../SettingScreen/SettingModal';
import CommentModalComp from './CommentModalComp';

const MyProfileScreen = ({navigation, route}) => {
  const {
    userData,
    eventsList,
    isRefetching,
    isFetching,
    hasMoreData,
    myUserData,
    modal,
    activeTags,
    modalVal,
    onPressKey,
    allData,
    isSuccess,
    isHitFirstTime,
    commentModal,
    modalType,
    setModalType,
    setCommentModal,
    setModal,
    openBottomSheet,
    onRefresh,
    loadMoreData,
    refetch,
    functionToUpdateLike,
    functionToDelete,
    functionToUpdateComment,
    setModalVal,
    onOpenModal,
    functionToUpdatePostOrEvent,
    setNextScreen,
    stateForModalData,
    setStateForModalData,
  } = useMyProfileScreen(navigation, route);

  console.log('lkdbkldbfklbdfklbkldfbl;kdbsf;b;ldflnb;df', eventsList);

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
              refetch={refetch}
              setCommentModal={id => {
                setModalType(true);
                setStateForModalData({id, index});
                setCommentModal(true);
              }}
              functionToUpdatePostOrEvent={newItem =>
                functionToUpdatePostOrEvent(index, newItem)
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
              refetch={refetch}
              functionToUpdatePostOrEvent={newItem =>
                functionToUpdatePostOrEvent(index, newItem)
              }
              setCommentModal={id => {
                setModalType(false);
                setStateForModalData({id, index});
                setCommentModal(true);
              }}
              functionToUpdateComment={(i, isComment) =>
                functionToUpdateComment(index, isComment)
              }
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
      // functionToUpdateLike,
      // functionToUpdateComment,
      // functionToDelete,
      // setModal,
    ],
  );

  return (
    <View style={styles.container}>
      <ProfileHeader nextScreen={screen => setNextScreen(screen)} />
      <View style={styles.statsContainer}>
        <Touchable
          style={styles.statItem}
          onPress={() => {
            setNextScreen('AllEventsScreen');
            navigation.navigate('AllEventsScreen', {
              url: getEventsUrl,
              key: 'myProfileEvents',
              title: 'Events',
            });
          }}>
          <Image source={flag} resizeMode="contain" style={styles.statIcon} />
          <View style={styles.statTextContainer}>
            <TextComponent
              text={userData?.event_count}
              styles={styles.statNumber}
            />
            <TextComponent text={' Events'} styles={styles.statLabel} />
          </View>
        </Touchable>
        <Touchable
          style={styles.statItem}
          onPress={() => onOpenModal('event_association')}>
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
        </Touchable>
        <Touchable
          style={styles.statItem}
          onPress={() => {
            setNextScreen('FriendLists');
            navigation.navigate('FriendLists', {
              url: getMyFriendsUrl,
              key: 'myFriends',
            });
          }}>
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
      {isHitFirstTime && (
        <AniFlatOneByOne
          data={eventsList ?? []}
          flatViewStyle={styles.upComingFlatlistView}
          onRefresh={onRefresh}
          flatListProps={{
            ListEmptyComponent:
              eventsList != null && eventsList?.length == 0 ? (
                <DataNotFound
                  btnStyles={{width: wp('80')}}
                  title={'Your Profile is Waiting for Your First Post'}
                  subTitle={
                    'Share a story, photo, or video to start building your rodeo legacy.'
                  }
                />
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
      {modalVal && (
        <SettingModal
          activeTags={activeTags[onPressKey] ?? []}
          allData={allData ?? []}
          heading={onPressKey}
          isModal={modalVal}
          onSelect={() => {}}
          onBackPress={() => setModalVal(false)}
        />
      )}
      {commentModal && (
        <CommentModalComp
          isModal={commentModal}
          index={stateForModalData?.index}
          id={stateForModalData?.id}
          onBackPress={() => setCommentModal(false)}
          isPost={modalType}
          functionToUpdateComment={(index, val) =>
            functionToUpdateComment(index, val)
          }
        />
      )}
    </View>
  );
};

export default memo(MyProfileScreen);
