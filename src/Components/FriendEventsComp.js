import {Image, StyleSheet, View} from 'react-native';
import {hp, wp} from '../Config/responsive';
import BlurImage from './BlurImage';
import {CircleImage} from './CircleImage';
import {TextComponent} from './TextComponent';
import {
  blackLock,
  calendar,
  dollarCircle,
  heartTheme,
  infoCircle,
  locationGray,
  shareTheme,
  timeCircle,
} from '../Assets';
import {Colors} from '../Theme/Variables';
import {MultiSelectButton} from './MultiSelectButton';

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

const FriendEventsComp = () => {
  return (
    <View style={styles.mainView}>
      <BlurImage styles={styles.upperImage} radius={0} />
      <View style={styles.innerMainView}>
        <View style={styles.innerUpperView}>
          <CircleImage
            image={
              'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            }
            uri={true}
            styles={styles.profileImg}
            radius={5}
          />
          <View
            style={{
              marginLeft: wp('3'),
            }}>
            <TextComponent text={'Me'} styles={{fontWeight: 'bold'}} />
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
        <TextComponent
          text={'aMobridge, SD Slac.'}
          styles={{fontWeight: 'bold', marginVertical: hp('1')}}
        />
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
              text={'Mon. Nov 27'}
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
              text={'Mon. Nov 27'}
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
              text={'18:00 - 23:00 PM'}
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
            text={'Street338 Catherine St, Street Catherine St.'}
            isThemeColor={true}
            styles={styles.locationText}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.bottomView}>
          <View style={styles.leftRightView}>
            <Image
              source={heartTheme}
              resizeMode="contain"
              tintColor={Colors.yellowTextColor}
              style={{width: wp('5'), marginRight: wp('1')}}
            />
            <TextComponent
              text={'45 Likes'}
              isThemeColor={true}
              styles={{
                fontSize: hp('1.5'),
              }}
            />
          </View>
          <View style={styles.leftRightView}>
            <Image
              source={heartTheme}
              resizeMode="contain"
              tintColor={Colors.yellowTextColor}
              style={{width: wp('5'), marginRight: wp('1')}}
            />
            <TextComponent
              text={'Comment'}
              isThemeColor={true}
              styles={{
                fontSize: hp('1.5'),
              }}
            />
          </View>
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
      </View>
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
  },
  innerMainView: {
    width: wp('78'),
    alignSelf: 'center',
    marginTop: hp('1'),
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
    marginLeft: wp('23'),
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
    width: wp('31.5'),
    alignItems: 'center',
  },
});
