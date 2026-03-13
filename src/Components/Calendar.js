import React from 'react';
import {Calendar} from 'react-native-calendars';
import {Text, View, TouchableOpacity} from 'react-native';
import {Colors} from '../Theme/Variables';
import {hp, wp} from '../Config/responsive';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const UseCalendar = ({
  onSelectVal,
  selectedVal,
  customMarkedDates = [],
  onMonthChange,
}) => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split('T')[0];

  const combinedMarked = {};

  // Mark dates with a SINGLE dot
  if (Array.isArray(customMarkedDates)) {
    customMarkedDates.forEach(item => {
      if (item && item.date) {
        combinedMarked[item.date] = {
          marked: true,
          dotColor: Colors.primaryColor,
          selected: item.date === selectedVal,
          selectedColor: item.date === selectedVal ? Colors.white : undefined,
          selectedTextColor:
            item.date === selectedVal ? Colors.black : undefined,
        };
      }
    });
  }

  // Ensure selected date always highlighted
  if (selectedVal && !combinedMarked[selectedVal]) {
    combinedMarked[selectedVal] = {
      selected: true,
      marked: true,
      dotColor: Colors.primaryColor,
      selectedColor: Colors.primaryColor,
      selectedTextColor: Colors.white,
    };
  }

  return (
    <Calendar
      firstDay={1}
      minDate={minDate}
      pastScrollRange={1}
      futureScrollRange={1}
      scrollEnabled
      showScrollIndicator={true}
      markedDates={combinedMarked}
      dayComponent={({date, state, marking}) => {
        const isSelected = marking?.selected;
        const isMarked = marking?.marked;

        return (
          <TouchableOpacity
            onPress={() => onSelectVal(date.dateString)}
            disabled={state === 'disabled'}
            style={{
              width: 38,
              height: 38,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isSelected ? Colors.white : 'transparent',
              borderRadius: 50,
            }}>
            <Text
              style={{
                color:
                  isSelected || state === 'today'
                    ? Colors.black
                    : state === 'disabled'
                    ? 'gray'
                    : Colors.black,
              }}>
              {date.day}
            </Text>

            {isMarked && (
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: Colors.primaryColor,
                  marginTop: 2,
                }}
              />
            )}
          </TouchableOpacity>
        );
      }}
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
      onMonthChange={onMonthChange}
      style={{
        height: 'auto',
        width: wp('92'),
        marginLeft: wp('-1'),
        paddingBottom: wp('1'),
        paddingTop: 0,
        paddingVertical: hp('0.5'),
        borderRadius: 10,
        shadowColor: '#181818',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: 'white',
      }}
    />
  );
};

export default UseCalendar;
