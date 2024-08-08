import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-elements';
import {FontSize} from '../Theme/Variables';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {wp} from '../Config/responsive';

const MutualFriends = ({size, uri, text}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatars}>
        <Avatar
          rounded
          size={size ?? 25}
          source={{
            uri: uri,
          }}
          containerStyle={styles.avatar}
        />
        <Avatar
          rounded
          size={size ?? 25}
          source={{
            uri: uri,
          }}
          containerStyle={styles.avatar}
        />
        <Avatar
          rounded
          size={size ?? 25}
          source={{uri: uri}}
          containerStyle={styles.avatar}
        />
      </View>
      <Text style={styles.text}>{text}</Text>
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
    marginLeft: -12, // To create the overlapping effect
  },
  text: {
    fontSize: FontSize.scale12,
    color: Colors.black,
    fontWeight: '400',
  },
});

export default MutualFriends;
