import {Image, Linking, Pressable, ScrollView, View} from 'react-native';
import {HeaderComponent} from '../../Components/HeaderComponent';
import BlurImage from '../../Components/BlurImage';
import {hp, wp} from '../../Config/responsive';
import {
  filledCalender,
  filledClock,
  filledLocation,
  locationGray,
  tacLogo,
  tickCircle,
  tickSquare,
  unCheck,
} from '../../Assets';
import {TextComponent} from '../../Components/TextComponent';
import CheckBox, {CheckBoxComponent} from '@react-native-community/checkbox';
import MutualFriends from '../../Components/MutualFriendsComponent';
import {styles} from './styles';
import {Colors} from '../../Theme/Variables';
import {MultiView} from '../SettingScreen/MultiView';
import ThemeButton from '../../Components/ThemeButton';
import useEventDetailScreen from './useEventsDetailScreen';
import {
  checkParagraphForUndefined,
  convertToLocalTime,
  getDateMonthYear,
} from '../../Services/GlobalFunctions';
import {imageUrl} from '../../Utils/Urls';
import {CircleImage} from '../../Components/CircleImage';
import {Touchable} from '../../Components/Touchable';
import useReduxStore from '../../Hooks/UseReduxStore';
import {types} from '../../Redux/types';
import {Text} from 'react-native';
import {MultiSelectButton} from '../../Components/MultiSelectButton';
import DividerLine from '../../Components/DividerLine';

const EventsDetailScreen = ({navigation, route}) => {
  const {eventData, onRefresh, followUnFollowEvent, userData} =
    useEventDetailScreen(navigation, route);

  const {dispatch} = useReduxStore();

  const onImagePress = isEvent => {
    dispatch({
      payload: isEvent
        ? JSON.parse(eventData?.images)[0]
        : eventData?.user?.profile_image,
      type: types.openModal,
    });
  };

  const centerView = [
    {
      title: `${getDateMonthYear(eventData?.from_date)?.dayName}. ${
        getDateMonthYear(eventData?.from_date)?.monthName
      } ${getDateMonthYear(eventData?.from_date)?.day} - ${
        getDateMonthYear(eventData?.from_date)?.year
      }`,
      leftIcon: filledCalender,
      rightText: 'Start Date',
      onPress: () => {},
    },
    {
      title: `${convertToLocalTime(eventData?.start_time)?.time} ${
        convertToLocalTime(eventData?.start_time)?.period
      }`,
      leftIcon: filledClock,
      onPress: () => {},
      rightText: 'Start Time',
    },
    {
      title: `${getDateMonthYear(eventData?.to_date)?.dayName}. ${
        getDateMonthYear(eventData?.to_date)?.monthName
      } ${getDateMonthYear(eventData?.to_date)?.day} - ${
        getDateMonthYear(eventData?.to_date)?.year
      }`,
      leftIcon: filledCalender,
      rightText: 'End Date',
      onPress: () => {},
    },

    {
      title: `${convertToLocalTime(eventData?.end_time)?.time} ${
        convertToLocalTime(eventData?.end_time)?.period
      }`,
      leftIcon: filledClock,
      onPress: () => {},
      rightText: 'End Time',
    },
    {
      title: eventData?.address,
      leftIcon: filledLocation,
    },
  ];

  const bottomView = [
    {
      title: 'Added Money',
      rightText: `$ ${eventData?.added_money}` ?? 'Not Available',
      onPress: () => {},
      rightTextStyles: {color: Colors.primaryColor},
    },
    {
      title: 'Tour',
      rightText: eventData?.tour?.name ?? 'Not Available',
      onPress: () => {},
      rightTextStyles: {color: Colors.primaryColor},
    },
    {
      title: 'Event Confirmation',
      rightText: eventData?.is_confirmed == 0 ? 'Planning' : 'Confirmed',
      onPress: () => {},
      rightTextStyles: {color: Colors.primaryColor},
    },
  ];
  const performanceArry =
    eventData?.performances && eventData?.performances?.length > 0
      ? eventData?.performances?.map(res => ({
          title: res?.title,
          rightText: `${getDateMonthYear(res?.date)?.day}-${
            getDateMonthYear(res?.date)?.monthName
          } |  ${convertToLocalTime(res?.start_time)?.time} - ${
            convertToLocalTime(eventData?.end_time)?.time
          } ${convertToLocalTime(eventData?.end_time)?.period}.`,
          onPress: () => {},
          rightTextStyles: {color: Colors.primaryColor},
        }))
      : [];

  console.log('eventDataeventDataeventDataeventData', eventData);

  return (
    <View style={styles.mainView}>
      <HeaderComponent
        headerTitle={'Event Detail'}
        goBack={() => navigation.goBack()}
        isBack
      />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => onImagePress(true)}>
          <BlurImage
            isURI
            uri={
              eventData?.images
                ? imageUrl(JSON.parse(eventData?.images)[0])
                : ''
            }
            styles={styles.imgStyle}
            radius={15}
          />
        </Pressable>
        <View style={styles.systemView}>
          <Pressable
            onPress={() => onImagePress(false)}
            disabled={Boolean(
              !eventData?.user?.profile_image || !eventData?.suggested,
            )}>
            <CircleImage
              image={
                eventData?.user?.profile_image || !eventData?.suggested
                  ? imageUrl(eventData?.user?.profile_image)
                  : tacLogo
              }
              uri={Boolean(
                eventData?.user?.profile_image || !eventData?.suggested,
              )}
              styles={styles.tacImg}
              radius={5}
            />
          </Pressable>
          <TextComponent
            text={
              eventData?.user?.first_name
                ? `${eventData?.user?.first_name} ${eventData?.user?.last_name}`
                : 'System suggested'
            }
            styles={{
              fontSize: hp('1.8'),
              width: wp('56'),
            }}
          />
          {userData?.id != eventData?.user?.id && (
            <Touchable
              style={styles.followView}
              onPress={() => followUnFollowEvent(eventData?.id)}>
              <Image
                source={eventData?.is_followed ? tickSquare : unCheck}
                resizeMode="contain"
                style={styles.checkImg}
              />
              <TextComponent text={'Follow Event'} styles={styles.typeStyle} />
            </Touchable>
          )}
        </View>
        <TextComponent text={eventData?.title} styles={styles.titleStyle} />
        {eventData?.likes_count > 0 && (
          <View style={styles.bottomView}>
            <MutualFriends
              uri={'https://picsum.photos/200'}
              friends={[1, 2, 3, 4]}
              textAfterCount={'peoples like this event.'}
            />
          </View>
        )}
        {/* <View style={styles.eventTypeView}>
          <TextComponent text={'Event Type'} styles={styles.typeHeading} />
          <TextComponent
            text={eventData?.event_type?.name}
            isLightThemeColor
            styles={styles.typeStyle}
          />
        </View> */}
        <View style={styles.locationView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={locationGray}
              tintColor={Colors.primaryColor}
              style={styles.locationImg}
            />
            <TextComponent
              text={eventData?.address}
              numberOfLines={3}
              styles={{width: wp('60')}}
            />
          </View>
          <TextComponent
            text={'View Location'}
            styles={{color: Colors.lightBlueTextColor}}
          />
        </View>

        <View style={styles.eventTimeViewGray}>
          <View style={styles.eventTimeView}>
            <TextComponent text={'Starts At'} fade />
            <Image
              source={filledCalender}
              resizeMode="contain"
              style={{
                ...styles.eventCallImg,
                marginLeft: wp('15'),
              }}
            />
            <TextComponent
              text={`${getDateMonthYear(eventData?.from_date)?.monthName} ${
                getDateMonthYear(eventData?.from_date)?.day
              }, ${getDateMonthYear(eventData?.from_date)?.year}`}
            />
            <Image
              source={filledClock}
              resizeMode="contain"
              style={{...styles.eventCallImg, marginLeft: wp('4')}}
            />
            <TextComponent
              text={
                eventData?.start_time
                  ? `${convertToLocalTime(eventData?.start_time)?.time} ${
                      convertToLocalTime(eventData?.start_time)?.period
                    }`
                  : 'Not Confirmed'
              }
            />
          </View>
          <DividerLine
            DividerLineStyle={{width: wp('95'), marginVertical: hp('2')}}
          />
          <View style={styles.eventTimeView}>
            <TextComponent text={'Ends At'} fade />
            <Image
              source={filledCalender}
              resizeMode="contain"
              style={{
                ...styles.eventCallImg,
                marginLeft: wp('15'),
              }}
            />
            <TextComponent
              text={`${getDateMonthYear(eventData?.to_date)?.monthName} ${
                getDateMonthYear(eventData?.to_date)?.day
              }, ${getDateMonthYear(eventData?.to_date)?.year}`}
            />
            <Image
              source={filledClock}
              resizeMode="contain"
              style={{...styles.eventCallImg, marginLeft: wp('4')}}
            />
            <TextComponent
              text={
                eventData?.end_time
                  ? `${convertToLocalTime(eventData?.end_time)?.time} ${
                      convertToLocalTime(eventData?.end_time)?.period
                    }`
                  : 'Not Confirmed'
              }
            />
          </View>
        </View>

        {/* <MultiView
          viewStyle={{width: wp('98')}}
          data={centerView.filter(res =>
            checkParagraphForUndefined(res?.title),
          )}
          dividerStyles={{display: 'none'}}
        /> */}
        <View style={styles.arryMainView}>
          <TextComponent text={'Event Type'} styles={{fontSize: hp('1.56')}} />
          <View style={styles.multiMainView}>
            {eventData?.event_types?.length > 0 ? (
              <MultiSelectButton
                isDisable={true}
                items={eventData?.event_types ?? []}
                btnStyle={styles.selectedValStyle}
                textStyle={{fontSize: hp('1.5'), color: 'black'}}
              />
            ) : (
              <TextComponent
                text={'Event types are not selected.'}
                fade
                styles={{fontSize: hp('1.5')}}
              />
            )}
          </View>
          <DividerLine
            DividerLineStyle={{width: wp('95'), marginVertical: hp('2')}}
          />
          <TextComponent
            text={'Associations'}
            styles={{fontSize: hp('1.56')}}
          />
          <View style={styles.multiMainView}>
            {eventData?.associations?.length > 0 ? (
              <MultiSelectButton
                isDisable={true}
                items={eventData?.associations ?? []}
                btnStyle={styles.selectedValStyle}
                textStyle={{fontSize: hp('1.5'), color: 'black'}}
              />
            ) : (
              <TextComponent
                text={'Associations are not selected.'}
                fade
                styles={{fontSize: hp('1.5')}}
              />
            )}
          </View>
          <DividerLine
            DividerLineStyle={{width: wp('95'), marginVertical: hp('2')}}
          />
          <TextComponent text={'Circuits'} styles={{fontSize: hp('1.56')}} />
          <View style={styles.multiMainView}>
            {eventData?.circuits?.length > 0 ? (
              <MultiSelectButton
                isDisable={true}
                items={eventData?.circuits ?? []}
                btnStyle={styles.selectedValStyle}
                textStyle={{fontSize: hp('1.5'), color: 'black'}}
              />
            ) : (
              <TextComponent
                text={'Circuits are not selected.'}
                fade
                styles={{fontSize: hp('1.5')}}
              />
            )}
          </View>
        </View>
        <MultiView
          viewStyle={styles.multiViewStyle}
          data={bottomView}
          dividerStyles={styles.dividerStyle}
        />
        {eventData?.performances && performanceArry.length > 0 && (
          <>
            <TextComponent
              text={'Previous Performances'}
              styles={{
                ...styles.titleStyle,
                marginTop: hp('2'),
                marginBottom: hp('-1'),
              }}
            />
            <MultiView
              viewStyle={styles.multiViewStyle}
              data={performanceArry}
              dividerStyles={styles.dividerStyle}
            />
          </>
        )}
        <ThemeButton
          title={'View Event location on map'}
          style={styles.btnStyle}
          isYellowTheme
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${eventData?.latitude}%2C${eventData?.longitude}`,
            )
          }
        />
      </ScrollView>
    </View>
  );
};

export default EventsDetailScreen;
