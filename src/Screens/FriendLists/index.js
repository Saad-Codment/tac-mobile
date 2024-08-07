import {View, Text} from 'react-native';
import React from 'react';
import useFriendLists from './useFriendLists';

const FriendLists = ({navigation}) => {
  const {} = useFriendLists(navigation);
  return (
    <View>
      <Text>FriendLists</Text>
    </View>
  );
};

export default FriendLists;
