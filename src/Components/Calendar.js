import React, {useState} from 'react';
import {Calendar, CalendarList, LocaleConfig} from 'react-native-calendars';
import {Colors, FontSize} from '../Theme/Variables';
import {hp, wp} from '../Config/responsive';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet} from 'react-native';

const UseCalendar = ({onSelectVal, selectedVal, markedDates, dotCount}) => {
  const today = new Date(); // Get current date
  today.setDate(today.getDate() + 1); // Increase date by one day

  const minDate = today.toISOString().split('T')[0];

  let markedDay = {};

  markedDates.map(item => {
    markedDay[item] = {
      selected: true,
      marked: true,
      selectedColor: Colors.white,
      // selectedColor: selectedVal == item ? Colors.white : Colors.primaryColor,
      // disabled: true,
      inactive: true,
      dotColor: Colors.primaryColor,
      type: 'dot',
      selectedTextColor: Colors.black,
      // selectedTextColor: selectedVal == item ? Colors.black : Colors.white,
      // selectedColor: Colors.primaryColor,
      // dots: dotCount.map(res => ({
      //   key: res,
      //   color: Colors.primaryColor,
      //   selectedDotColor: Colors.primaryColor,
      // })),
    };
  });

  return (
    <Calendar
      firstDay={1}
      pastScrollRange={1}
      futureScrollRange={1}
      scrollEnabled
      minDate={minDate} // Set minimum selectable date
      showScrollIndicator={true}
      renderArrow={direction =>
        direction === 'left' ? (
          <MaterialCommunityIcons
            name="chevron-left"
            color="black"
            size={hp('3')}
          />
        ) : (
          <MaterialCommunityIcons
            name="chevron-right"
            color="black"
            size={hp('3')}
          />
        )
      }
      onDayPress={day => {
        onSelectVal(day.dateString);
      }}
      markedDates={{
        [selectedVal]: {
          selected: true,
          selectedTextColor: Colors.white,
          selectedColor: Colors.primaryColor,
          // type: 'period',
        },
        ...markedDay,
      }}
      style={{
        height: 'auto',
        width: wp('92'),
        marginLeft: wp('-1'),
        paddingBottom: wp('1'),
        paddingTop: 0,
        paddingVertical: hp('0.5'),
        borderRadius: 10,
        shadowColor: '#181818',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: 'white',
      }}
      theme={{
        // calendarBackground: Colors.themeBlack,
        textSectionTitleColor: Colors.black,
        selectedDayBackgroundColor: Colors.themeRed,
        // todayTextColor: Colors.grayFaded,
        dayTextColor: Colors.black,
        // textDisabledColor: Colors.grayFaded,
        monthTextColor: Colors.black,
        selectedDayTextColor: Colors.black,
        arrowColor: Colors.black,
        textDayFontSize: hp('1.2'),
        textMonthFontSize: hp('1.8'),
        textDayStyle: {
          alignItems: 'center',
          alignSelf: 'center',
          lineHeight: hp('2.6'),
        },

        'stylesheet.calendar.main': {},
        'stylesheet.calendar.header': {
          headerContainer: {
            // backgroundColor: 'orange',
            position: 'absolute',
            flexDirection: 'row',
            left: wp('0'),
            gap: 5, // because of the loader spinner 'displayLoadingIndicator' if its active
          },
          header: {
            //   backgroundColor: 'purple',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingHorizontal: wp('0'),
            // marginTop: hp('1'),
            alignItems: 'center',
          },
        },
      }}
    />
  );
};
export default UseCalendar;
