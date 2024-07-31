import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-elements';
import {FontSize} from '../Theme/Variables';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {wp} from '../Config/responsive';

const MutualFriends = () => {
  return (
    <View style={styles.container}>
      <View style={styles.avatars}>
        <Avatar
          rounded
          size={25}
          source={{
            uri: ' ',
          }}
          containerStyle={styles.avatar}
        />
        <Avatar
          rounded
          size={25}
          source={{
            uri: 'https://picsum.photos/200',
          }}
          containerStyle={styles.avatar}
        />
        <Avatar
          rounded
          size={25}
          source={{uri: 'https://picsum.photos/200'}}
          containerStyle={styles.avatar}
        />
      </View>
      <Text style={styles.text}>32 Mutual Friends</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  avatars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  avatar: {
    marginLeft: -18, // To create the overlapping effect
  },
  text: {
    fontSize: FontSize.scale12,
    color: Colors.black,
    fontWeight: '400',
  },
});

export default MutualFriends;
