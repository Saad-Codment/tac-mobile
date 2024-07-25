import {View, Text} from 'react-native';
import React from 'react';
import useHomeScreen from './useHomeScreen';

const HomeScreen = ({navigation}) => {
  const {} = useHomeScreen(navigation);
  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;
