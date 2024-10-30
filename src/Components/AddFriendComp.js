import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import MutualFriends from './MutualFriendsComponent';
import ThemeButton from './ThemeButton';
import {CircleImage} from './CircleImage';
import {TextComponent} from './TextComponent';
import {Colors, FontSize} from '../Theme/Variables';
import {hp, wp} from '../Config/responsive';

const AddFriendComp = item => {
  return (
    <>
      <View style={styles.friendCard}>
        <View style={{alignItems: 'center'}}>
          <CircleImage
            image={'https://picsum.photos/200'}
            styles={styles.friendUserImage}
            uri={true}
          />
        </View>
        <TextComponent styles={styles.friendUserName} text={'Lily Van Ness'} />
        <View style={styles.bottomView}>
          <MutualFriends
            uri={'https://picsum.photos/200'}
            friends={[1, 2, 3, 4]}
          />
          {/* <TextComponent styles={styles.mutual} text={'32 Mutual friends'} /> */}
        </View>
        <ThemeButton
          style={styles.addBtn}
          title={'Add Friend'}
          textStyle={{
            color: Colors.white,
            fontWeight: 'bold',
          }}
        />
        <ThemeButton
          style={styles.removeBtn}
          textStyle={{color: Colors.textGray}}
          title={'Remove'}
        />
      </View>
    </>
  );
};

export default AddFriendComp;

const styles = StyleSheet.create({
  friendCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 15,
    margin: 10,
    width: wp('50%'),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  friendUserImage: {
    width: Dimensions.get('window').width * 0.19,
    height: Dimensions.get('window').width * 0.19,
    // alignSelf: 'center',
  },
  friendUserName: {
    fontSize: FontSize.scale18,
    fontWeight: '600',
    color: Colors.black,
    textAlign: 'center',
    marginTop: hp('2'),
    marginBottom: hp('0.5'),
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    borderRadius: 10,
    height: hp('5'),
    backgroundColor: Colors.backgroundTheme,
    marginTop: hp('1'),
  },
  removeBtn: {
    height: hp('5'),
    backgroundColor: 'transparent',
  },
});
