import {Image, Pressable, StyleSheet, View} from 'react-native';
import {hp, wp} from '../Config/responsive';
import BlurImage from './BlurImage';
import {CircleImage} from './CircleImage';
import {TextComponent} from './TextComponent';
import {
  blackLock,
  calendar,
  dollarCircle,
  eventLogo,
  heartFilledLike,
  heartTheme,
  infoCircle,
  locationGray,
  shareTheme,
} from '../Assets';
import {Colors} from '../Theme/Variables';
import {MultiSelectButton} from './MultiSelectButton';
import {
  convertToCustomTimeFormat,
  convertToLocalTime,
  getDateMonthYear,
  showFirstThreeAndCountRest,
} from '../Services/GlobalFunctions';
import {Touchable} from './Touchable';
import NavigationService from '../Services/NavigationService';
import {imageUrl} from '../Utils/Urls';
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

const UpcomingEventsComp = ({
  item,
  index,
  mainViewStyle,
  upperImgStyle,
  refetechKeys,
  functionToUpdateLike,
  afterLikeFun,
  openBottomSheet,
}) => {
  const {likeAndDisLikeEvent} = useFriendServices();

  const {queryClient, getState, dispatch} = useReduxStore();

  const {userData} = getState('Auth');

  const onImagePress = () => {
    dispatch({
      payload: item?.user_image ?? item?.profile_image,
      type: types.openModal,
    });
  };

  console.log('sljdbvksbdklvbsdklbskldbvlksdbkvlsdbklvbds', item);

  return (
    <Pressable
      style={{...styles.mainView, ...mainViewStyle}}
      onPress={() => {
        NavigationService.navigate('EventsDetailScreen', {id: item?.id});
      }}>
      <View style={styles.upperImage}>
        <Pressable onPress={onImagePress}>
          <CircleImage
            size={0.15}
            image={
              Boolean(item?.user_image ?? item?.profile_image)
                ? imageUrl(item?.user_image ?? item?.profile_image)
                : eventLogo
            }
            uri={!Boolean(!item?.user_image ?? !item?.profile_image)}
          />
        </Pressable>
        <View style={styles.nameView}>
          <TextComponent
            text={item?.title ?? 'System suggested '}
            styles={{fontWeight: 'bold', fontSize: hp('1.7')}}
            numberOfLines={1}
          />
          <View style={styles.locationView}>
            <Image
              source={locationGray}
              tintColor={'black'}
              resizeMode="contain"
              style={styles.locationIcom}
            />
            <TextComponent
              text={item?.address}
              styles={{fontSize: hp('1.7')}}
              numberOfLines={1}
            />
          </View>
        </View>
        {userData?.id != item?.user_id && (
          <TextComponent
            text={'Report'}
            fade
            styles={styles.reportText}
            onPress={() => {
              if (userData?.id != item?.user_id) openBottomSheet(item?.id);
            }}
          />
        )}
      </View>
      <View style={styles.priceMainView}>
        <TextComponent
          text={'aMonte Vista.co.'}
          styles={{fontWeight: 'bold'}}
        />
        <View style={styles.priceView}>
          <Image
            source={dollarCircle}
            resizeMode="contain"
            tintColor={'black'}
            style={styles.dollarIcon}
          />
          <TextComponent text={item?.added_money ?? 0} styles={styles.price} />
        </View>
      </View>
      <View style={styles.centerView}>
        <TextComponent text={'Starts at'} styles={styles.leftText} />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={calendar}
            resizeMode="contain"
            tintColor={'black'}
            style={styles.calenderIcon}
          />
          <TextComponent
            text={`${getDateMonthYear(item?.from_date)?.monthName} ${
              getDateMonthYear(item?.from_date)?.day
            }, ${getDateMonthYear(item?.from_date)?.year}`}
            styles={{fontSize: hp('1.7')}}
          />
          <Image
            source={calendar}
            resizeMode="contain"
            tintColor={'black'}
            style={{...styles.calenderIcon, marginLeft: wp('2')}}
          />
          <TextComponent
            text={convertToCustomTimeFormat(item?.start_time)}
            styles={{fontSize: hp('1.7')}}
          />
        </View>
      </View>
      <View style={styles.divider} />

      <View style={styles.centerView}>
        <TextComponent text={'Ends at'} styles={styles.leftText} />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={calendar}
            resizeMode="contain"
            tintColor={'black'}
            style={styles.calenderIcon}
          />
          <TextComponent
            text={`${getDateMonthYear(item?.to_date)?.monthName} ${
              getDateMonthYear(item?.to_date)?.day
            }, ${getDateMonthYear(item?.to_date)?.year}`}
            styles={{fontSize: hp('1.7')}}
          />
          <Image
            source={calendar}
            resizeMode="contain"
            tintColor={'black'}
            style={{...styles.calenderIcon, marginLeft: wp('2')}}
          />
          <TextComponent
            text={convertToCustomTimeFormat(item?.end_time)}
            styles={{fontSize: hp('1.7')}}
          />
        </View>
      </View>
      <View style={styles.divider} />

      <View style={styles.centerView}>
        <TextComponent text={'Event types:'} styles={styles.leftText} />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MultiSelectButton
            items={showFirstThreeAndCountRest([1, 2, 3, 4, 5])}
            isDisable={true}
            btnStyle={styles.tagsBtn}
            textStyle={{fontSize: hp('1.5'), color: '#525252'}}
          />
        </View>
      </View>
      <View style={styles.divider} />

      <View style={styles.centerView}>
        <TextComponent text={'Associations:'} styles={styles.leftText} />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MultiSelectButton
            items={showFirstThreeAndCountRest([1, 2, 3, 4, 5])}
            isDisable={true}
            btnStyle={styles.tagsBtn}
            textStyle={{fontSize: hp('1.5'), color: '#525252'}}
          />
        </View>
      </View>
      <View style={styles.divider} />

      <View style={styles.bottomView}>
        <Touchable
          style={styles.leftRightView}
          onPress={async () => {
            functionToUpdateLike(index);
            await likeAndDisLikeEvent.mutateAsync(item?.id);
            if (refetechKeys)
              refetechKeys.map(res => queryClient.invalidateQueries([res]));
          }}>
          <Image
            source={item?.is_liked ? heartFilledLike : heartTheme}
            resizeMode="contain"
            tintColor={'rgba(255, 0, 55, 1)'}
            style={{
              width: wp('5'),
              marginRight: wp('1'),
              height: hp('3'),
            }}
          />
          <TextComponent
            text={`${item?.likes_count} Likes`}
            styles={{
              fontSize: hp('1.5'),
            }}
          />
        </Touchable>
        <View style={styles.leftRightView}>
          <Image
            source={shareTheme}
            resizeMode="contain"
            style={{width: wp('5'), height: hp('3')}}
            tintColor={'black'}
          />
          <TextComponent
            text={'Share'}
            styles={{
              marginLeft: wp('1'),
              fontSize: hp('1.5'),
            }}
          />
        </View>
      </View>
    </Pressable>
  );
};

// <View style={{...styles.mainView, ...mainViewStyle}}>
// <BlurImage
//   styles={{...styles.upperImage, ...upperImgStyle}}
//   radius={0}
//   isURI={Boolean(item?.images != '[]')}
//   uri={
//     item?.images == undefined || item?.images == '[]'
//       ? null
//       : imageUrl(JSON.parse(item?.images)[0])
//   }
// />
// <Touchable
//   style={styles.innerMainView}
//   disabled={Boolean(!item?.id)}
//   onPress={() =>
//     NavigationService.navigate('EventsDetailScreen', {id: item?.id})
//   }>
//   <View style={styles.innerUpperView}>
//     <Pressable onPress={onImagePress}>
//       <CircleImage
//         image={imageUrl(item?.user_image ?? item?.profile_image)}
//         uri={true}
//         styles={styles.profileImg}
//         radius={5}
//       />
//     </Pressable>
//     <View
//       style={{
//         marginLeft: wp('3'),
//         width: wp('69'),
//       }}>
//       <View style={styles.lockView}>
//         <TextComponent
//           text={item?.title}
//           styles={{
//             fontWeight: 'bold',
//             maxWidth: wp('65'),
//           }}
//           numberOfLines={1}
//         />
//         <Image
//           source={blackLock}
//           resizeMode="contain"
//           style={styles.lockImg}
//         />
//       </View>
//       <TextComponent
// text={`${getDateMonthYear(item?.from_date)?.dayName}. ${
//   getDateMonthYear(item?.from_date)?.monthName
// } ${
//   getDateMonthYear(item?.from_date)?.day
// } - ${convertToCustomTimeFormat(
//   item?.from_date,
// )} - ${convertToCustomTimeFormat(item?.to_date)}`}
//         // text={'Mon. Nov 27 - 18:00 - 23:00 PM'}
//         fade={true}
//         styles={styles.timeText}
//       />
//     </View>
//     {userData?.id != item?.user_id && (
//       <Touchable
//         onPress={() => {
//           if (userData?.id != item?.user_id) openBottomSheet(item?.id);
//         }}>
//         <Image
//           source={infoCircle}
//           resizeMode="contain"
//           style={{width: wp('5'), height: hp('5')}}
//         />
//       </Touchable>
//     )}
//   </View>
//   {item?.event_type_name && (
//     <View style={styles.innerTitleView}>
//       <TextComponent
//         text={item?.event_type_name}
//         styles={{fontWeight: 'bold'}}
//       />
//       {/* <TextComponent
//         text={'( Bull Riding )'}
//         styles={styles.goldenText}
//       /> */}
//     </View>
//   )}
//   <View style={styles.innerLocationView}>
//     <Image
//       source={locationGray}
//       resizeMode="contain"
//       style={{width: wp('5')}}
//     />
//     <TextComponent
//       text={item?.address}
//       fade={true}
//       styles={styles.locationText}
//     />
//   </View>
//   <View style={styles.tagsMainView}>
//     <MultiSelectButton
//       items={[item?.association_name, item?.circuit_name].filter(
//         res => res != null,
//       )}
//       isDisable={true}
//       btnStyle={styles.tagsBtn}
//       textStyle={{fontSize: hp('1.5'), color: '#525252'}}
//     />
//   </View>
//   <View style={styles.divider} />
//   <View style={styles.bottomView}>
//     <Touchable
//       style={styles.leftRightView}
//       onPress={async () => {
//         functionToUpdateLike(index);
//         await likeAndDisLikeEvent.mutateAsync(item?.id);
//         if (refetechKeys)
//           refetechKeys.map(res => queryClient.invalidateQueries([res]));
//       }}>
//       <Image
//         source={item?.is_liked ? heartFilledLike : heartTheme}
//         resizeMode="contain"
//         style={{width: wp('5'), marginRight: wp('1')}}
//       />
//       <TextComponent
//         text={`${item?.likes_count} Likes`}
//         fade={true}
//         styles={{
//           fontSize: hp('1.5'),
//         }}
//       />
//     </Touchable>
//     <View style={styles.leftRightView}>
//       <Image
//         source={shareTheme}
//         resizeMode="contain"
//         style={{width: wp('5')}}
//       />
//       <TextComponent
//         text={'Share'}
//         fade={true}
//         styles={{
//           marginLeft: wp('1'),
//           fontSize: hp('1.5'),
//         }}
//       />
//     </View>
//   </View>
// </Touchable>
// </View>

export default UpcomingEventsComp;

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
    paddingVertical: hp('1'),
    paddingHorizontal: wp('2'),
  },
  upperImage: {flexDirection: 'row', alignItems: 'center'},
  nameView: {
    marginLeft: wp('2'),
    width: wp('61'),
  },
  locationView: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
    width: wp('62'),
  },
  locationIcom: {
    width: wp('4'),
    height: hp('3'),
    marginLeft: wp('-0.5'),
    marginRight: wp('1'),
  },
  reportText: {fontSize: hp('1.8'), top: hp('-2')},
  priceMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1'),
    justifyContent: 'space-between',
    fontSize: hp('1.8'),
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dollarIcon: {width: wp('4'), height: hp('3')},
  price: {fontWeight: 'bold', marginLeft: wp('1')},
  centerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('1'),
  },
  leftText: {width: wp('30'), fontSize: hp('1.7')},
  calenderIcon: {width: wp('4'), height: hp('3'), marginRight: wp('1')},
  innerMainView: {
    // alignSelf: 'center',
    marginTop: hp('1'),
    paddingHorizontal: hp('2'),
    // flex: 1,
  },
  innerUpperView: {flexDirection: 'row', alignItems: 'center'},
  profileImg: {borderRadius: 5, width: wp('12'), height: hp('5')},
  lockView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockImg: {width: wp('4'), height: hp('2'), marginLeft: wp('1')},
  timeText: {fontSize: hp('1.5'), fontWeight: 'bold'},
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
    backgroundColor: 'transparent',
    overflow: 'hidden',
    height: 'auto',
    paddingVertical: hp('0.5'),
    borderWidth: 1,
    borderColor: Colors.primaryColor,
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: hp('0.5'),
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1'),
    // marginVertical: hp('-1.5'),
  },
  leftRightView: {
    flexDirection: 'row',
    // width: wp('63'),
    alignItems: 'center',
  },
});
