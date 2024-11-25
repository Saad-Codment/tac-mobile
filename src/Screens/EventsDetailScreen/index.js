import {Image, View} from 'react-native';
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

const centerView = [
  {
    title: 'Mon. Jul 04 - 2024',
    leftIcon: filledCalender,
    rightText: 'Start',
    onPress: () => {},
  },
  {
    title: 'Mon. Jul 04 - 2024',
    leftIcon: filledCalender,
    rightText: 'End',
    onPress: () => {},
  },
  {
    title: '18:00 - 23:00 PM',
    leftIcon: filledClock,
    onPress: () => {},
  },
  {
    title: 'Monte Vista Colorado',
    leftIcon: filledLocation,
    rightText: 'View Location',
    rightTextStyles: {color: Colors.lightBlueTextColor},
  },
];

const bottomView = [
  {
    title: 'Association',
    rightText: 'Association Name',
    onPress: () => {},
  },
  {
    title: 'Added Money',
    rightText: '$10,000',
    onPress: () => {},
  },
  {
    title: '18:00 - 23:00 PM',
    leftIcon: filledClock,
    onPress: () => {},
  },
  {
    title: 'Monte Vista Colorado',
    leftIcon: filledLocation,
    rightText: 'View Location',
    rightTextStyles: {color: Colors.lightBlueTextColor},
  },
];

const EventsDetailScreen = ({navigation}) => {
  return (
    <View style={{flexGrow: 1, backgroundColor: 'white'}}>
      <HeaderComponent
        headerTitle={'Event Detail'}
        goBack={() => navigation.goBack()}
        isBack
      />
      <BlurImage
        isURI
        uri={
          'https://images.pexels.com/photos/29493395/pexels-photo-29493395/free-photo-of-stylish-winter-fashion-in-snowy-landscape.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
        }
        styles={{
          width: wp('95'),
          height: hp('20'),
          alignSelf: 'center',
          marginTop: hp('1'),
          borderRadius: 15,
        }}
      />
      <View
        style={{
          width: wp('95'),
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={tacLogo}
          resizeMode="contain"
          style={{width: wp('10'), marginRight: wp('2')}}
        />
        <TextComponent
          text={'System suggested'}
          styles={{fontSize: hp('1.8')}}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: wp('50'),
          }}>
          <Image
            source={unCheck}
            resizeMode="contain"
            style={{
              width: wp('8'),
              height: hp('3'),
              marginRight: wp('1'),
            }}
          />
          <TextComponent text={'Follow Event'} styles={{fontSize: hp('1.8')}} />
        </View>
      </View>
      <TextComponent
        text={'Monte Vista. CO.'}
        styles={{fontWeight: 'bold', marginLeft: wp('3'), fontSize: hp('2.5')}}
      />
      <View style={styles.bottomView}>
        <MutualFriends
          uri={'https://picsum.photos/200'}
          friends={[1, 2, 3, 4]}
          textAfterCount={'peoples like this event.'}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: wp('3'),
          paddingVertical: hp('1.5'),
          backgroundColor: Colors.lightInnerColor,
          marginVertical: hp('2'),
        }}>
        <TextComponent
          text={'Event Type'}
          styles={{fontWeight: 'bold', fontSize: hp('1.5')}}
        />
        <TextComponent
          text={'PRCA'}
          isLightThemeColor
          styles={{fontSize: hp('1.5')}}
        />
      </View>
      <MultiView
        viewStyle={{width: wp('98')}}
        data={centerView}
        dividerStyles={{display: 'none'}}
      />
      <MultiView
        viewStyle={{width: wp('98')}}
        data={bottomView}
        dividerStyles={{display: 'none'}}
      />
    </View>
  );
};

export default EventsDetailScreen;
