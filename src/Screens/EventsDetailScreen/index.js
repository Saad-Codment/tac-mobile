import {Image, ScrollView, View} from 'react-native';
import {HeaderComponent} from '../../Components/HeaderComponent';
import BlurImage from '../../Components/BlurImage';
import {hp, wp} from '../../Config/responsive';
import {
  filledCalender,
  filledClock,
  filledLocation,
  tacLogo,
  tickCircle,
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
  convertToLocalTime,
  getDateMonthYear,
} from '../../Services/GlobalFunctions';
import {imageUrl} from '../../Utils/Urls';

const EventsDetailScreen = ({navigation, route}) => {
  const {eventData, onRefresh} = useEventDetailScreen(navigation, route);

  const centerView = [
    {
      title: `${getDateMonthYear(eventData?.from_date)?.dayName}. ${
        getDateMonthYear(eventData?.from_date)?.monthName
      } ${getDateMonthYear(eventData?.from_date)?.day} - ${
        getDateMonthYear(eventData?.from_date)?.year
      }`,
      leftIcon: filledCalender,
      rightText: 'Start',
      onPress: () => {},
    },
    {
      title: `${getDateMonthYear(eventData?.to_date)?.dayName}. ${
        getDateMonthYear(eventData?.to_date)?.monthName
      } ${getDateMonthYear(eventData?.to_date)?.day} - ${
        getDateMonthYear(eventData?.to_date)?.year
      }`,
      leftIcon: filledCalender,
      rightText: 'End',
      onPress: () => {},
    },
    {
      title: `${convertToLocalTime(eventData?.start_time)?.time} - ${
        convertToLocalTime(eventData?.end_time)?.time
      } ${convertToLocalTime(eventData?.end_time)?.period}`,
      leftIcon: filledClock,
      onPress: () => {},
    },
    {
      title: eventData?.address,
      leftIcon: filledLocation,
      rightText: 'View Location',
      rightTextStyles: {color: Colors.lightBlueTextColor},
    },
  ];

  const bottomView = [
    {
      title: 'Association',
      rightText: eventData?.association?.name,
      onPress: () => {},
      rightTextStyles: {color: Colors.primaryColor},
    },
    {
      title: 'Added Money',
      rightText: '$10,000',
      onPress: () => {},
      rightTextStyles: {color: Colors.primaryColor},
    },
    {
      title: 'Circuits',
      rightText: eventData?.circuit?.name,
      onPress: () => {},
      rightTextStyles: {color: Colors.primaryColor},
    },
    {
      title: 'tour',
      rightText: eventData?.tour?.name,
      onPress: () => {},
      rightTextStyles: {color: Colors.primaryColor},
    },
    {
      title: '1st Performance',
      rightText: '04-Jul   |   08 : 00 - 11 : 00 P.m.',
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
        <BlurImage
          isURI
          uri={
            eventData?.images ? imageUrl(JSON.parse(eventData?.images)[0]) : ''
          }
          styles={styles.imgStyle}
          radius={15}
        />
        <View style={styles.systemView}>
          <Image source={tacLogo} resizeMode="contain" style={styles.tacImg} />
          <TextComponent
            text={'System suggested'}
            styles={{fontSize: hp('1.8')}}
          />
          <View style={styles.followView}>
            <Image
              source={unCheck}
              resizeMode="contain"
              style={styles.checkImg}
            />
            <TextComponent text={'Follow Event'} styles={styles.typeStyle} />
          </View>
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
        <View style={styles.eventTypeView}>
          <TextComponent text={'Event Type'} styles={styles.typeHeading} />
          <TextComponent
            text={eventData?.event_type?.name}
            isLightThemeColor
            styles={styles.typeStyle}
          />
        </View>
        <MultiView
          viewStyle={{width: wp('98')}}
          data={centerView}
          dividerStyles={{display: 'none'}}
        />
        <MultiView
          viewStyle={styles.multiViewStyle}
          data={bottomView}
          dividerStyles={styles.dividerStyle}
        />
        <ThemeButton
          title={'View Event location on map'}
          style={styles.btnStyle}
          isYellowTheme
        />
      </ScrollView>
    </View>
  );
};

export default EventsDetailScreen;
