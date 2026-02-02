import {ActivityIndicator, Image, View} from 'react-native';
import {Colors} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import {memo, useCallback} from 'react';
import {CircleImage} from '../../Components/CircleImage';
import {TextComponent} from '../../Components/TextComponent';
import {
  addCircleWhite,
  backIcon,
  divider,
  filledLocation,
  location,
  lockCircle,
  message,
  messages,
  radioCircle,
  threeDots,
  threeDotsHor,
} from '../../Assets';
import ThemeButton from '../../Components/ThemeButton';
import HeaderComp from './HeaderComp';
import {HeaderComponent} from '../../Components/HeaderComponent';
import useFriendProfileScreen from './useFriendProfileScreen';
import {AniFlatOneByOne} from '../../AnimatedComp/AniFlatOneByOne';
import {DataNotFound} from '../../Components/DataNotFound';
import UpcomingEventsComp from '../../Components/UpCommingEventsComp';
import {styles} from './styles';
import PostViewComp from '../../Components/PostViewComp';
import {BottomSheet} from 'react-native-elements';
import BottomModalComponent from '../../Components/BottomModalComponent';
import {Touchable} from '../../Components/Touchable';
import SharePostComp from '../../Components/SharePostComp';
import ShareEventComp from '../../Components/ShareEventComp';

const FriendProfileScreen = ({navigation, route}) => {
  const {
    userData,
    eventsList,
    isRefetching,
    isFetching,
    hasMoreData,
    myUserData,
    modal,
    isHitFirstTime,
    setModal,
    blockUser,
    openBottomSheet,
    onRefresh,
    loadMoreData,
    refetch,
    functionToUpdateLike,
    functionToDelete,
    functionToUpdateComment,
    functionToUpdateFollow,
  } = useFriendProfileScreen(navigation, route);

  console.log(
    'eventsListeventsListeventsListeventsListsdoifnskdnfkosdn',
    eventsList[0],
  );

  const renderItem = useCallback(
    (item, index) => {
      return (
        <View style={{marginVertical: hp('0.5')}}>
          {(item?.type == 2 || item?.type == 5 || item?.type == 6) && (
            <UpcomingEventsComp
              item={item}
              index={index}
              mainViewStyle={{width: wp('95'), alignSelf: 'center'}}
              upperImgStyle={{width: wp('95')}}
              functionToUpdateLike={functionToUpdateLike}
              openBottomSheet={id => setModal({id, type: 'event'})}
              refetch={refetch}
              functionToDelete={functionToDelete}
              functionToUpdateFollow={functionToUpdateFollow}
              // likePost={likePost}
            />
          )}
          {item?.type == 5 && (
            <ShareEventComp
              item={item}
              index={index}
              mainViewStyle={{width: wp('95')}}
              upperImgStyle={{width: wp('95')}}
              functionToUpdateLike={functionToUpdateLike}
              openBottomSheet={id => setModal({id, type: 'event'})}
              refetch={refetch}
              functionToDelete={functionToDelete}
              functionToUpdateFollow={functionToUpdateFollow}
              upperMainView={{
                width: wp('100'),
                marginBottom: hp('1'),
                marginTop: hp('1'),
              }}
            />
          )}
          {item?.type == 1 && (
            <PostViewComp
              item={item}
              index={index}
              functionToUpdateLike={functionToUpdateLike}
              openBottomSheet={id => setModal({id, type: 'post'})}
              functionToUpdateComment={(i, isComment) =>
                functionToUpdateComment(index, isComment)
              }
              functionToDelete={functionToDelete}
            />
          )}
          {item?.type == 3 && (
            <SharePostComp
              item={item}
              index={index}
              functionToUpdateLike={functionToUpdateLike}
              openBottomSheet={id => setModal({id, type: 'post'})}
              functionToUpdateComment={(i, isComment) =>
                functionToUpdateComment(index, isComment)
              }
              functionToDelete={functionToDelete}
              upperMainView={{
                width: wp('100'),
              }}
            />
          )}
        </View>
      );
    },
    [refetch, isRefetching, functionToUpdateComment, eventsList],
  );

  console.log('skldvbklsdbvklsdbvklsdbklvklsdvksdlvs', userData);

  return (
    <View style={{flex: 1}}>
      <HeaderComponent
        goBack={() => navigation.goBack()}
        isBack
        backText={'Back'}
        backTextStyle={{color: Colors.textGray}}
        isAnotherRightChildern={
          <TextComponent
            text={'Block User'}
            isWhite
            styles={{
              height: hp('2'),
              fontSize: hp('1.5'),
            }}
            onPress={() => blockUser()}
          />
        }
      />
      <HeaderComp userData={userData} myUserData={myUserData} />
      {userData?.privacy == 1 &&
      userData?.friends == 0 &&
      userData?.id != myUserData?.id ? (
        <View style={{flex: 1, marginTop: hp('15')}}>
          <View style={styles.iconMainContainer}>
            <View style={styles.iconContainer}>
              <Image
                source={lockCircle} // Replace with your lock icon
                style={styles.icon}
              />
            </View>
            <TextComponent
              text={`${userData?.first_name} locked his profile`}
              styles={styles.title}
            />
            <TextComponent
              text={'Only his friends can see what he shares on his profile.'}
              styles={styles.description}
            />
          </View>
        </View>
      ) : (
        isHitFirstTime && (
          <AniFlatOneByOne
            data={eventsList ?? []}
            flatViewStyle={styles.upComingFlatlistView}
            onRefresh={onRefresh}
            flatListProps={{
              ListEmptyComponent:
                eventsList != null && eventsList?.length == 0 ? (
                  <DataNotFound
                    btnStyles={{width: wp('80')}}
                    title={'No Posts Yet'}
                    subTitle={
                      'This user hasn’t shared any posts or events yet. Check back soon to see their rodeo journey!'
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
                    style={{
                      marginTop: hp('2'),
                      width: wp('30'),
                      height: hp('4'),
                    }}
                    onPress={() => loadMoreData()}
                    textStyle={{fontSize: hp('1.5')}}
                  />
                )), // Show loading spinner at the bottom
            }}
            InnerCompnonet={(item, index) => {
              return renderItem(item, index);
            }}
          />
        )
      )}

      {Boolean(modal != null) && (
        <BottomModalComponent
          isVisible={Boolean(modal != null)}
          isReport
          id={modal?.id}
          type={modal?.type}
          onClose={() => setModal(null)}
        />
      )}
    </View>
  );
};

export default memo(FriendProfileScreen);
