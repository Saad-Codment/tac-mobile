import React, {memo} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {View} from 'react-native';
import UseCalendar from '../../Components/Calendar';
import {hp} from '../../Config/responsive';

function MyEventScreen({navigation}) {
  return (
    <View style={{flex: 1}}>
      <HeaderComponent
        headerTitle={'Event'}
        goBack={() => navigation.goBack()}
        isBack
      />
      <View style={{alignItems: 'center', marginTop: hp('2')}}>
        <UseCalendar markedDates={[]} />
      </View>
    </View>
  );
}

export default memo(MyEventScreen);
