import {ActivityIndicator, Image, View} from 'react-native';
import {Colors} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import {memo} from 'react';
import {CircleImage} from '../../Components/CircleImage';
import {TextComponent} from '../../Components/TextComponent';
import {
  addCircleWhite,
  backIcon,
  divider,
  location,
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

const FriendProfileScreen = ({navigation, route}) => {
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
  } = useFriendProfileScreen(navigation, route);
  return (
    <View style={{flex: 1}}>
      <HeaderComponent
        goBack={() => navigation.goBack()}
        isBack
        backText={'Back'}
        backTextStyle={{color: Colors.textGray}}
      />
      <HeaderComp userData={userData} myUserData={myUserData} />
      <AniFlatOneByOne
        data={eventsList ?? []}
        flatViewStyle={styles.upComingFlatlistView}
        onRefresh={onRefresh}
        flatListProps={{
          ListEmptyComponent:
            eventsList != null && eventsList?.length == 0 ? (
              <DataNotFound onpress={onRefresh} btnStyles={{width: wp('80')}} />
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

export default memo(FriendProfileScreen);
