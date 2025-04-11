import {Image, Pressable, StyleSheet, View} from 'react-native';
import {hp, wp} from '../Config/responsive';
import BlurImage from './BlurImage';
import {CircleImage} from './CircleImage';
import {TextComponent} from './TextComponent';
import {
  blackLock,
  calendar,
  commentIcon,
  dollarCircle,
  heartTheme,
  infoCircle,
  locationGray,
  shareTheme,
  timeCircle,
} from '../Assets';
import {Colors} from '../Theme/Variables';
import {MultiSelectButton} from './MultiSelectButton';
import {
  convertToCustomTimeFormat,
  getDateMonthYear,
} from '../Services/GlobalFunctions';
import {Touchable} from './Touchable';
import NavigationService from '../Services/NavigationService';
import useFriendServices from '../Services/FriendServices';
import useReduxStore from '../Hooks/UseReduxStore';
import {types} from '../Redux/types';

const tags = [
  {
    id: 1,
    title: 'Associations',
  },
  {
    id: 2,
    title: 'Circuits',
  },
];

const FriendEventsComp = ({
  item,
  index,
  mainViewStyles,
  upperImgStyle,
  refetechKeys,
}) => {
  const {likeAndDisLikeEvent} = useFriendServices();

  const {queryClient, dispatch} = useReduxStore();

  const onImagePress = () => {
    dispatch({
      payload: item?.user_image,
      type: types.openModal,
    });
  };
  return (
    <View style={{...styles.mainView, ...mainViewStyles}}>
      <BlurImage styles={{...styles.upperImage, ...upperImgStyle}} radius={0} />
      <Touchable
        style={styles.innerMainView}
        disabled={Boolean(!item?.id)}
        onPress={() =>
          NavigationService.navigate('EventsDetailScreen', {id: item?.id})
        }>
        <View style={styles.innerUpperView}>
          <Pressable onPress={onImagePress}>
            <CircleImage
              image={item?.user_image}
              uri={true}
              styles={styles.profileImg}
              radius={5}
            />
          </Pressable>
          <View
            style={{
              marginLeft: wp('3'),
              width: wp('60'),
            }}>
            <TextComponent
              text={item?.first_name + ' ' + item?.last_name}
              styles={{fontWeight: 'bold'}}
              numberOfLines={1}
            />
            <TextComponent
              text={'Associations  Circuits'}
              styles={styles.timeText}
            />
          </View>
          <Image
            source={infoCircle}
            resizeMode="contain"
            style={styles.lockImg}
          />
        </View>
        {/* <TextComponent
          text={`${item?.association_name}, ${item?.circuit_name}.`}
          styles={{fontWeight: 'bold', marginVertical: hp('1')}}
        /> */}
        <View style={styles.middleTimeView}>
          <View style={styles.middleLeftRightView}>
            <Image
              source={calendar}
              resizeMode="contain"
              style={{width: wp('5'), marginRight: wp('1')}}
            />
            <TextComponent
              text={'Start: '}
              isThemeColor={true}
              styles={{
                fontSize: hp('1.5'),
              }}
            />
            <TextComponent
              text={`${getDateMonthYear(item?.from_date)?.dayName}. ${
                getDateMonthYear(item?.from_date)?.monthName
              } ${getDateMonthYear(item?.from_date)?.day}`}
              isThemeColor={true}
              styles={{
                fontSize: hp('1.5'),
                fontWeight: 'bold',
              }}
            />
          </View>
          <View style={styles.middleLeftRightView}>
            <Image
              source={calendar}
              resizeMode="contain"
              style={{width: wp('5')}}
            />
            <TextComponent
              text={'End: '}
              isThemeColor={true}
              styles={{
                marginLeft: wp('1'),
                fontSize: hp('1.5'),
              }}
            />
            <TextComponent
              text={`${getDateMonthYear(item?.to_date)?.dayName}. ${
                getDateMonthYear(item?.to_date)?.monthName
              } ${getDateMonthYear(item?.to_date)?.day}`}
              isThemeColor={true}
              styles={{
                fontSize: hp('1.5'),
                fontWeight: 'bold',
              }}
            />
          </View>
        </View>
        <View style={styles.middleTimeView}>
          <View style={styles.middleLeftRightView}>
            <Image
              source={timeCircle}
              resizeMode="contain"
              style={{width: wp('5'), marginRight: wp('1')}}
            />
            <TextComponent
              text={`${convertToCustomTimeFormat(
                item?.start_time,
              )} - ${convertToCustomTimeFormat(item?.end_time)}0`}
              isThemeColor={true}
              styles={{
                fontSize: hp('1.5'),
              }}
            />
          </View>
          <View style={styles.middleLeftRightView}>
            <Image
              source={dollarCircle}
              resizeMode="contain"
              style={{width: wp('5')}}
            />
            <TextComponent
              text={' 10,000'}
              isThemeColor={true}
              styles={{
                fontSize: hp('1.5'),
              }}
            />
          </View>
        </View>
        <View style={styles.innerLocationView}>
          <Image
            source={locationGray}
            resizeMode="contain"
            style={{width: wp('5')}}
            tintColor={Colors.yellowTextColor}
          />
          <TextComponent
            text={item?.address}
            isThemeColor={true}
            styles={styles.locationText}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.bottomView}>
          <Touchable
            style={styles.leftRightView}
            onPress={async () => {
              await likeAndDisLikeEvent.mutateAsync(item?.id);
              if (refetechKeys) {
                refetechKeys.map(res => {
                  queryClient.invalidateQueries([res]); // Refetch data
                });
              }
            }}>
            <Image
              source={heartTheme}
              resizeMode="contain"
              tintColor={Colors.yellowTextColor}
              style={{width: wp('5'), marginRight: wp('1')}}
            />
            <TextComponent
              text={`${item?.likes_count} Likes`}
              isThemeColor={true}
              styles={{
                fontSize: hp('1.5'),
              }}
            />
          </Touchable>
          <Touchable
            style={styles.leftRightView}
            onPress={() =>
              NavigationService.navigate('CommentScreen', {
                id: item?.id,
                refetechKeys,
              })
            }>
            <Image
              source={commentIcon}
              resizeMode="contain"
              tintColor={Colors.yellowTextColor}
              style={{width: wp('5'), marginRight: wp('1')}}
            />
            <TextComponent
              text={`${item?.comments_count} Comment`}
              isThemeColor={true}
              styles={{
                fontSize: hp('1.5'),
              }}
            />
          </Touchable>
          <View style={styles.leftRightView}>
            <Image
              source={shareTheme}
              resizeMode="contain"
              tintColor={Colors.yellowTextColor}
              style={{width: wp('5')}}
            />
            <TextComponent
              text={'Share'}
              isThemeColor={true}
              styles={{
                marginLeft: wp('1'),
                fontSize: hp('1.5'),
              }}
            />
          </View>
        </View>
      </Touchable>
    </View>
  );
};

export default FriendEventsComp;

const styles = StyleSheet.create({
  mainView: {
    width: wp('87'),
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    backgroundColor: 'white',
    backgroundColor: Colors.yellowBgColor,
  },
  upperImage: {
    width: wp('87'),
    height: hp('13'),
    aspectRatio: 1,
  },
  innerMainView: {
    // width: wp('78'),
    // alignSelf: 'center',
    marginTop: hp('1'),
    paddingHorizontal: hp('2'),
  },
  innerUpperView: {flexDirection: 'row', alignItems: 'center'},
  profileImg: {borderRadius: 5, width: wp('12'), height: hp('5')},
  lockView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockImg: {
    width: wp('6'),
    height: hp('3'),
    marginLeft: wp('2'),
  },
  middleTimeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp('-1'),
  },
  middleLeftRightView: {
    flexDirection: 'row',
    width: wp('44.5'),
    alignItems: 'center',
  },
  timeText: {fontSize: hp('1.5')},
  innerTitleView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: hp('1'),
  },
  goldenText: {
    fontSize: hp('1.6'),
    marginLeft: wp('2'),
    color: Colors.primaryColor,
  },
  innerLocationView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('-0.9'),
  },
  locationText: {fontSize: hp('1.5'), marginLeft: wp('1')},
  tagsMainView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp('-0.7'),
  },
  tagsBtn: {
    width: 'auto',
    paddingHorizontal: wp('2'),
    backgroundColor: Colors.lightGray,
    overflow: 'hidden',
    height: 'auto',
    paddingVertical: hp('0.5'),
    borderWidth: 0,
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp('-1.5'),
  },
  leftRightView: {
    flexDirection: 'row',
    // width: wp('31.5'),
    alignItems: 'center',
  },
});
