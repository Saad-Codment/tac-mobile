import React from 'react';
import {Calendar} from 'react-native-calendars';
import {Text, View, TouchableOpacity} from 'react-native';
import {Colors} from '../Theme/Variables';
import {hp, wp} from '../Config/responsive';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const UseCalendar = ({
  onSelectVal,
  selectedVal,
  customMarkedDates = [], // default to empty array
  onMonthChange,
}) => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split('T')[0];

  const dotMap = {};

  // ✅ Safe check before .forEach
  if (Array.isArray(customMarkedDates)) {
    customMarkedDates.forEach(item => {
      if (item && item.date && typeof item.count === 'number') {
        dotMap[item.date] = Array.from({length: item.count}).map((_, i) => ({
          key: `${item.date}-${i}`,
          color: Colors.primaryColor,
        }));
      }
    });
  }

  const combinedMarked = {};

  if (Array.isArray(customMarkedDates)) {
    customMarkedDates.forEach(({date}) => {
      combinedMarked[date] = {
        marked: true,
        selected: date === selectedVal,
        selectedColor: date === selectedVal ? Colors.white : undefined,
        selectedTextColor: date === selectedVal ? Colors.black : undefined,
        type: 'multi-dot',
        dots: dotMap[date] || [],
      };
    });
  }

  if (selectedVal && !combinedMarked[selectedVal]) {
    combinedMarked[selectedVal] = {
      selected: true,
      marked: true,
      selectedColor: Colors.primaryColor,
      selectedTextColor: Colors.white,
      dots: [],
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
        const dots = marking?.dots || [];

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
            <View
              style={{
                flexDirection: 'row',
                marginTop: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {dots.map((dot, idx) => (
                <View
                  key={dot.key || idx}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 2.5,
                    backgroundColor: dot.color,
                    marginHorizontal: 1,
                  }}
                />
              ))}
            </View>
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
