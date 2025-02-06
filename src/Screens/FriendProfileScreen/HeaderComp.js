import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import {Colors} from '../../Theme/Variables';
import {CircleImage} from '../../Components/CircleImage';
import {
  addCircleWhite,
  backIcon,
  divider,
  location,
  message,
  threeDotsHor,
} from '../../Assets';
import ThemeButton from '../../Components/ThemeButton';
import {Touchable} from '../../Components/Touchable';
import NavigationService from '../../Services/NavigationService';

const HeaderComp = ({userData}) => {
  const FriendCountHeaderComp = ({num, title}) => {
    return (
      <View style={styles.compView}>
        <TextComponent text={num} isWhite styles={{fontSize: hp('1.5')}} />
        <TextComponent text={' ' + title} fade styles={{fontSize: hp('1.5')}} />
      </View>
    );
  };

  const friendCountArry = [
    {
      num: userData?.events_count,
      title: 'Events',
    },
    {
      num: userData?.friends,
      title: 'Friends',
    },
    {
      num: userData?.posts_count,
      title: 'Mutal',
    },
  ];

  return (
    <View style={styles.mainView}>
      <View style={{flexDirection: 'row'}}>
        <View>
          <CircleImage image={userData?.profile_image} uri size={0.27} />
        </View>
        <View style={styles.centerView}>
          <TextComponent
            text={`${userData?.first_name} ${userData?.last_name}`}
            isWhite
            styles={styles.nameText}
            numberOfLines={1}
          />
          <View style={styles.locationView}>
            {friendCountArry.map(res => (
              <FriendCountHeaderComp num={res?.num} title={res?.title} />
            ))}
          </View>
          <View style={styles.countView}>
            <ThemeButton
              title={'Add friend'}
              image={addCircleWhite}
              isYellowTheme
              style={styles.btnView}
              imageStyle={styles.btnImg}
            />
            <ThemeButton
              title={'Message'}
              image={message}
              style={{...styles.btnView, backgroundColor: 'white'}}
              imageStyle={styles.btnImg}
              textStyle={{color: Colors.textGray}}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default HeaderComp;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: Colors.headerBg,
    width: wp('100'),
    // paddingVertical: hp('2'),
    paddingHorizontal: wp('2'),
    paddingBottom: hp('2'),
    // height: hp('40'),
  },
  centerView: {
    marginLeft: wp('2.5'),
    marginVertical: hp('0.5'),
    justifyContent: 'space-between',
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: hp('2.5'),
    marginLeft: wp('0.7'),
    width: wp('60'),
  },
  locationView: {flexDirection: 'row', alignItems: 'center'},
  locIcon: {
    width: wp('5'),
    height: hp('2'),
    tintColor: Colors.primaryColor,
  },
  countView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp('65'),
  },
  backView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('4'),
  },
  compView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp('5'),
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('2'),
  },
  btnView: {width: wp('30'), height: hp('4')},
  btnImg: {width: wp('5'), height: hp('5')},
  dotsBtnView: {
    width: wp('15'),
    height: hp('5'),
    backgroundColor: 'white',
  },
  dotBtnImg: {marginLeft: wp('2'), width: wp('5'), height: hp('5')},
  divider: {
    marginTop: hp('2'),
    width: wp('95'),
    marginLeft: wp('0.5'),
  },
});
