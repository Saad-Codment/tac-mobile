import {Image, StyleSheet, View} from 'react-native';
import {hp, wp} from '../Config/responsive';
import {Colors} from '../Theme/Variables';
import {TextComponent} from './TextComponent';
import {calendar, calender, clock, location} from '../Assets';
import {
  convertToLocalTime,
  getDateMonthYear,
} from '../Services/GlobalFunctions';
import {Touchable} from './Touchable';

const SmallEventCardsComp = ({item, onPress}) => {
  return (
    <Touchable onPress={onPress} style={styles.mainView}>
      <View style={styles.dateView}>
        <TextComponent
          text={getDateMonthYear(item?.from_date)?.monthName}
          isThemeColor
          styles={styles.monthText}
        />
        <TextComponent
          text={getDateMonthYear(item?.from_date)?.day}
          isThemeColor
          styles={styles.dateText}
        />
      </View>
      <View style={styles.secondView}>
        <TextComponent text={item?.title} styles={styles.titleStyle} />
        <View style={styles.centerView}>
          {/* <Image
            source={calender}
            resizeMode="contain"
            style={styles.calendarStyle}
          />
          <TextComponent
            text={`${getDateMonthYear(item?.from_date)?.dayName}. ${
              getDateMonthYear(item?.from_date)?.monthName
            } ${getDateMonthYear(item?.from_date)?.day} - ${
              getDateMonthYear(item?.from_date)?.year
            }`}
            styles={{fontSize: hp('1.5')}}
            fade
          /> */}
          <Image
            source={clock}
            resizeMode="contain"
            style={styles.clockStyle}
          />
          <TextComponent
            text={`${convertToLocalTime(item?.start_time)?.time} - ${
              convertToLocalTime(item?.end_time)?.time
            } ${convertToLocalTime(item?.end_time)?.period}`}
            styles={{fontSize: hp('1.5')}}
            fade
          />
        </View>
        <View style={styles.bottomView}>
          <Image
            source={location}
            resizeMode="contain"
            style={styles.locationIcon}
          />
          <TextComponent
            text={item?.address}
            styles={styles.locationText}
            fade
            numberOfLines={1}
          />
        </View>
      </View>
    </Touchable>
  );
};
export default SmallEventCardsComp;

const styles = StyleSheet.create({
  mainView: {
    width: wp('92'),
    borderRadius: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    // alignItems: 'center',
    marginBottom: hp('1'),
    overflow: 'hidden',
  },
  dateView: {
    width: wp('18'),
    backgroundColor: Colors.yellowBgColor,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: hp('1.5'),
  },
  monthText: {
    fontSize: hp('2.5'),
    fontWeight: 'bold',
    color: Colors.darkThemeTextColor,
  },
  dateText: {
    fontSize: hp('3.5'),
    fontWeight: 'bold',
    color: Colors.darkThemeTextColor,
  },
  secondView: {paddingVertical: hp('1'), paddingHorizontal: wp('2')},
  titleStyle: {color: Colors.darkThemeTextColor, fontWeight: 'bold'},
  centerView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('4'),
  },
  calendarStyle: {
    width: wp('4'),
    marginRight: wp('1'),
    height: hp('2'),
  },
  clockStyle: {
    width: wp('4'),
    // marginLeft: wp('2'),
    marginRight: wp('1'),
  },
  bottomView: {flexDirection: 'row', alignItems: 'center'},
  locationIcon: {width: wp('4'), height: hp('2'), marginRight: wp('1')},
  locationText: {fontSize: hp('1.5'), width: wp('65')},
});
