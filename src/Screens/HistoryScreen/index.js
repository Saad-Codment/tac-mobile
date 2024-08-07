import {View, Text} from 'react-native';
import React from 'react';
import useHistoryScreen from './useHistoryScreen';

const HistoryScreen = ({navigation}) => {
  const {} = useHistoryScreen(navigation);
  return (
    <View>
      <Text>HistoryScreen</Text>
    </View>
  );
};

export default HistoryScreen;
