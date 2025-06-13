import {Image, StyleSheet, View} from 'react-native';
import {hp, wp} from '../Config/responsive';
import {Colors} from '../Theme/Variables';
import {TextComponent} from './TextComponent';
import {calendar, calender, clock, dollarCircle, location} from '../Assets';
import {
  convertToArray,
  convertToLocalTime,
  getDateMonthYear,
  showFirstThreeAndCountRest,
} from '../Services/GlobalFunctions';
import {Touchable} from './Touchable';
import {MultiSelectButton} from './MultiSelectButton';

const SmallEventCardsComp = ({item, onPress}) => {
  console.log('lkjsdbvklsbdlkvbklsdbvlsbdkvbksldvksd', item);
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

          <Image
            source={dollarCircle}
            resizeMode="contain"
            style={styles.locationIcon}
            tintColor={'black'}
          />
          <TextComponent
            text={item?.added_money ?? 0}
            styles={styles.locationText}
            fade
            numberOfLines={1}
          />
        </View>
        <View style={styles.centerView}>
          {item?.event_types && (
            <View
              style={{
                flexDirection: 'row',
                // alignItems: 'center',
              }}>
              <TextComponent
                text={'Event types: '}
                styles={{fontSize: hp('1.2'), marginTop: hp('0.6')}}
              />
              <MultiSelectButton
                items={showFirstThreeAndCountRest(
                  convertToArray(item?.event_types),
                )}
                isDisable={true}
                btnStyle={styles.tagsBtn}
                textStyle={{fontSize: hp('1.2'), color: '#525252'}}
              />
            </View>
          )}
          {item?.associations && (
            <View style={{flexDirection: 'row'}}>
              <TextComponent
                text={'Association types: '}
                styles={{fontSize: hp('1.2'), marginTop: hp('0.6')}}
              />
              <MultiSelectButton
                items={showFirstThreeAndCountRest(
                  convertToArray(item?.associations),
                )}
                isDisable={true}
                btnStyle={styles.tagsBtn}
                textStyle={{fontSize: hp('1.2'), color: '#525252'}}
              />
            </View>
          )}
        </View>
      </View>
    </Touchable>
  );
};
export default SmallEventCardsComp;

const styles = StyleSheet.create({
  mainView: {
    width: wp('92'),
    borderRadius: 10,
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
    paddingVertical: hp('0.3'),
  },
  monthText: {
    fontSize: hp('1.5'),
    fontWeight: 'bold',
    color: Colors.darkThemeTextColor,
  },
  dateText: {
    fontSize: hp('3'),
    fontWeight: 'bold',
    color: Colors.darkThemeTextColor,
  },
  secondView: {
    paddingTop: hp('0.5'),
    paddingHorizontal: wp('2'),
  },
  titleStyle: {
    color: Colors.darkThemeTextColor,
    fontWeight: 'bold',
    fontSize: hp('1.5'),
    width: wp('70'),
  },
  centerView: {marginTop: hp('0.5')},
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
  tagsBtn: {
    width: 'auto',
    paddingHorizontal: wp('1.5'),
    backgroundColor: 'transparent',
    overflow: 'hidden',
    height: 'auto',
    paddingVertical: hp('0.5'),
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    // marginTop: hp('0.5'),
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5'),
  },
  locationIcon: {width: wp('3'), height: hp('2'), marginRight: wp('1')},
  locationText: {fontSize: hp('1.2'), width: wp('30')},
});
