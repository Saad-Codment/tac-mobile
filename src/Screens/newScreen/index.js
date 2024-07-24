import {View, Text} from 'react-native';
import React from 'react';
import useNewScreen from './useNewScreen';

const newScreen = ({navigation}) => {
  const {} = useNewScreen(navigation);
  return (
    <View>
      <Text>newScreen</Text>
    </View>
  );
};

export default newScreen;
