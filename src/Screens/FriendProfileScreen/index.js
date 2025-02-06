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

const FriendProfileScreen = ({navigation, route}) => {
  const {
    userData,
    eventsList,
    isRefetching,
    isFetching,
    onRefresh,
    loadMoreData,
  } = useFriendProfileScreen(navigation, route);
  return (
    <View style={{flex: 1}}>
      <HeaderComponent
        goBack={() => navigation.goBack()}
        isBack
        backText={'Back'}
        backTextStyle={{color: Colors.textGray}}
      />
      <HeaderComp userData={userData} />
      <AniFlatOneByOne
        data={eventsList}
        flatViewStyle={styles.upComingFlatlistView}
        onRefresh={onRefresh}
        flatListProps={{
          ListEmptyComponent: (
            <DataNotFound onpress={onRefresh} btnStyles={{width: wp('80')}} />
          ),
          ListFooterComponent:
            eventsList.length >= 9 &&
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
        InnerCompnonet={(item, index) => (
          <UpcomingEventsComp
            item={item}
            index={index}
            mainViewStyle={{marginTop: hp('2'), width: wp('95')}}
            upperImgStyle={{width: wp('95')}}
            // likePost={likePost}
          />
        )}
      />
    </View>
  );
};

export default memo(FriendProfileScreen);
