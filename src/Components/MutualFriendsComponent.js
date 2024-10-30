import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-elements';
import {FontSize} from '../Theme/Variables';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {hp, wp} from '../Config/responsive';
import {CircleImage} from './CircleImage';
import {TextComponent} from './TextComponent';

const MutualFriends = ({friends, size}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatars}>
        {friends.slice(0, 3).map(res => {
          return (
            <Avatar
              rounded
              size={size ?? 25}
              source={{
                uri: res?.uri ?? 'https://picsum.photos/200',
              }}
              containerStyle={styles.avatar}
              avatarStyle={{
                borderColor: 'white',
                borderWidth: 1,
              }}
            />
          );
        })}
      </View>
      <TextComponent
        text={' ' + friends.length + ' Mutual friends'}
        styles={{fontSize: hp('1.5')}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: wp('2'),
    // margin: 10,
  },
  avatars: {
    flexDirection: 'row',
    // marginRight: wp('2'),
  },
  avatar: {
    marginLeft: wp('-3'), // To create the overlapping effect
  },
  text: {
    fontSize: FontSize.scale12,
    color: Colors.black,
    fontWeight: '400',
  },
});

export default MutualFriends;
