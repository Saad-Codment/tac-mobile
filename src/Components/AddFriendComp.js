import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import MutualFriends from './MutualFriendsComponent';
import ThemeButton from './ThemeButton';
import {CircleImage} from './CircleImage';
import {TextComponent} from './TextComponent';
import {Colors, FontSize} from '../Theme/Variables';
import {hp, wp} from '../Config/responsive';
import {imageUrl} from '../Utils/Urls';
import {Touchable} from './Touchable';
import NavigationService from '../Services/NavigationService';

const AddFriendComp = ({item, sendReq}) => {
  return (
    <>
      <Touchable
        style={styles.friendCard}
        onPress={() =>
          NavigationService.navigate('FriendProfileScreen', {id: item?.id})
        }>
        <View style={{alignItems: 'center'}}>
          <CircleImage
            image={imageUrl(item?.profile_image)}
            styles={styles.friendUserImage}
            uri={true}
          />
        </View>
        <TextComponent
          styles={styles.friendUserName}
          text={item?.first_name + ' ' + item?.last_name}
        />
        <View style={styles.bottomView}>
          {/* <MutualFriends
            uri={'https://picsum.photos/200'}
            friends={[1, 2, 3, 4]}
          /> */}
          {/* <TextComponent styles={styles.mutual} text={'32 Mutual friends'} /> */}
        </View>
        {item?.requested == 0 ? (
          <>
            <ThemeButton
              style={styles.addBtn}
              title={'Add Friend'}
              onPress={() => sendReq(item?.id)}
              textStyle={styles.addText}
            />
            {/* <ThemeButton
              style={styles.removeBtn}
              textStyle={{color: Colors.textGray, fontSize: hp('1.5')}}
              title={'Remove'}
            /> */}
          </>
        ) : (
          <TextComponent
            text={'Already requested'}
            styles={{textAlign: 'center', marginVertical: hp('2')}}
          />
        )}
      </Touchable>
    </>
  );
};

export default AddFriendComp;

const styles = StyleSheet.create({
  friendCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    margin: 10,
    width: wp('45'),
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
    paddingVertical: hp('1'),
    paddingHorizontal: wp('2'),
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
    marginTop: hp('1'),
    marginBottom: hp('0.5'),
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    borderRadius: 10,
    height: hp('4'),
    backgroundColor: Colors.backgroundTheme,
    marginTop: hp('1'),
  },
  addText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: hp('1.5'),
  },
  removeBtn: {
    height: hp('4'),
    backgroundColor: 'transparent',
  },
});
