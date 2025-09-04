import {View, Text} from 'react-native';
import React, {memo} from 'react';

const PerformancesScreen = ({navigation, route}) => {
  console.log(
    'PerformancesScreenPerformancesScreenPerformancesScreen',
    route?.params,
  );
  return (
    <View>
      <Text>PerformancesScreen</Text>
    </View>
  );
};

export default memo(PerformancesScreen);
