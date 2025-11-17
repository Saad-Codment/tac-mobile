import {View, Text, Image} from 'react-native';
import React, {memo} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import {
  calendar,
  calender,
  filledCalender,
  filledClock,
  timeCircle,
} from '../../Assets';
import {
  convertToLocalTime,
  getDateMonthYear,
} from '../../Services/GlobalFunctions';
import {styles} from './styles';
import DividerLine from '../../Components/DividerLine';

const PerformancesScreen = ({navigation, route}) => {
  console.log(
    'PerformancesScreenPerformancesScreenPerformancesScreen',
    route?.params,
  );

  return (
    <View style={styles.container}>
      <HeaderComponent headerTitle={'Performances'} isBack />
      {route?.params?.map((res, i) => {
        return (
          <View key={i} style={styles.performanceCard}>
            <TextComponent
              text={`Performances ${i + 1}`}
              fade
              size={hp('1.5')}
            />

            <View style={styles.titleRow}>
              <TextComponent text={res?.title} fontFamily={'bold'} />
              <View style={styles.dateRow}>
                <Image
                  source={calender}
                  resizeMode="contain"
                  style={styles.calendarIcon}
                />
                <TextComponent
                  text={` ${getDateMonthYear(res?.date)?.monthName} ${
                    getDateMonthYear(res?.date)?.day
                  }, ${getDateMonthYear(res?.date)?.year}`}
                  fade
                  size={hp('1.5')}
                />
              </View>
            </View>

            <DividerLine />

            <View style={styles.timeContainer}>
              <View style={styles.timeRow}>
                <TextComponent text={'Start At : '} size={hp('1.3')} />
                <Image
                  source={timeCircle}
                  resizeMode="contain"
                  style={styles.timeIcon}
                />
                <TextComponent
                  text={
                    res?.start_time
                      ? `${convertToLocalTime(res?.start_time)?.time} ${
                          convertToLocalTime(res?.start_time)?.period ?? ''
                        }`
                      : 'Not Confirmed'
                  }
                  styles={styles.timeText}
                />
              </View>

              <View style={styles.timeRow}>
                <TextComponent text={'End At : '} size={hp('1.3')} />
                <Image
                  source={timeCircle}
                  resizeMode="contain"
                  style={styles.timeIcon}
                />
                <TextComponent
                  text={
                    res?.end_time
                      ? `${convertToLocalTime(res?.end_time)?.time} ${
                          convertToLocalTime(res?.end_time)?.period ?? ''
                        }`
                      : 'Not Confirmed'
                  }
                  styles={styles.timeText}
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
