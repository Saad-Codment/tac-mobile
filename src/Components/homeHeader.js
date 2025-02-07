import React from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Colors} from '../Theme/Variables';
import {hp, wp} from '../Config/responsive';
import {TextComponent} from '../Components/TextComponent';
import {
  handShake,
  handShakeLottie,
  notificationWhite,
  settingWhite,
} from '../Assets';
import {Touchable} from '../Components/Touchable';
import Lottie from 'lottie-react-native';
import {CircleImage} from './CircleImage';
import {imageUrl} from '../Utils/Urls';

const HomeHeader = ({text, onNotificarioPress, userDataImg}) => {
  return (
    <View style={styles.headerView}>
      <View style={styles.firstView}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: wp('70'),
          }}>
          <CircleImage
            image={imageUrl(userDataImg)}
            uri={true}
            styles={{
              alignSelf: 'center',
              marginTop: hp('3.5'),
              marginRight: hp('1'),
              borderRadius: Math.round(
                Dimensions.get('window').width +
                  Dimensions.get('window').height,
              ),
              width: Dimensions.get('window').width * 0.16,
              height: Dimensions.get('window').width * 0.16,
            }}
          />
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp('2.5'),
              }}>
              <TextComponent text={text} styles={styles.nameText} />
              <Lottie
                source={handShakeLottie}
                resizeMode="contain"
                style={{width: wp('10')}}
                loop
                autoPlay
              />
            </View>
            <TextComponent
              text={'Welcome back'}
              styles={{top: hp('0'), color: Colors.textGray}}
            />
          </View>
        </View>
        <Touchable onPress={onNotificarioPress}>
          <Image
            source={notificationWhite}
            resizeMode="contain"
            style={styles.notiIcon}
          />
        </Touchable>
        {/* <Touchable>
          <Image
            source={settingWhite}
            resizeMode="contain"
            style={styles.setIcon}
          />
        </Touchable> */}
      </View>
    </View>
  );
};
export default HomeHeader;

const styles = StyleSheet.create({
  headerView: {
    backgroundColor: Colors.backgroundTheme,
    width: wp('100'),
    paddingTop: hp('2'),
    zIndex: 0,
    position: 'absolute',
  },
  firstView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? hp('2') : hp('-2'),
    width: wp('100'),
    alignSelf: 'center',
    paddingBottom: hp('25'),
    justifyContent: 'space-between',
    paddingHorizontal: wp('4'),
  },
  nameText: {
    fontSize: hp('3'),
    fontWeight: 'bold',
    color: Colors.white,
    // marginTop: hp('2.5'),
  },
  notiIcon: {width: wp('7')},
  setIcon: {width: wp('7')},
  headingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('92'),
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: hp('3'),
  },
});
