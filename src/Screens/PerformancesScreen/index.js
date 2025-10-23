import {View, Text, Image} from 'react-native';
import React, {memo} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import {filledCalender, filledClock} from '../../Assets';
import {
  convertToLocalTime,
  getDateMonthYear,
} from '../../Services/GlobalFunctions';
import {styles} from './styles';

const PerformancesScreen = ({navigation, route}) => {
  console.log(
    'PerformancesScreenPerformancesScreenPerformancesScreen',
    route?.params,
  );
  return (
    <View style={{flex: 1}}>
      <HeaderComponent headerTitle={'Performances'} isBack />
      {route?.params?.map(res => {
        return (
          <View
            style={{
              backgroundColor: 'white',
              width: wp('100'),
              paddingHorizontal: wp('2'),
              paddingVertical: hp('1'),
            }}>
            <TextComponent text={res?.title} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TextComponent text={'Start At'} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                <Image
                  source={filledCalender}
                  resizeMode="contain"
                  style={{
                    ...styles.eventCallImg,
                    // marginLeft: wp('20'),
                  }}
                />
                <TextComponent
                  text={`${getDateMonthYear(res?.from_date)?.monthName} ${
                    getDateMonthYear(res?.from_date)?.day
                  }, ${getDateMonthYear(res?.from_date)?.year}`}
                  // text={`${formatDateToLong(res?.from_date)}`}
                  // sep 4, 2025
                  styles={{fontSize: hp('1.2')}}
                />
                <Image
                  source={filledClock}
                  resizeMode="contain"
                  style={{...styles.eventCallImg, marginLeft: wp('4')}}
                />
                <TextComponent
                  text={
                    res?.start_time
                      ? `${convertToLocalTime(res?.start_time)?.time} ${
                          convertToLocalTime(res?.start_time)?.period ?? ''
                        }`
                      : 'Not Confirmed'
                  }
                  styles={{fontSize: hp('1.2')}}
                />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default memo(PerformancesScreen);
