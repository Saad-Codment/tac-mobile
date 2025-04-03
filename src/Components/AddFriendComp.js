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
import useReduxStore from '../Hooks/UseReduxStore';
import {types} from '../Redux/types';

const AddFriendComp = ({item, sendReq, mainViewStyle}) => {
  const {dispatch} = useReduxStore();

  const onImagePress = () => {
    dispatch({
      payload: item?.profile_image,
      type: types.openModal,
    });
  };

  return (
    <>
      <Touchable
        style={{...styles.friendCard, ...mainViewStyle}}
        onPress={() =>
          NavigationService.navigate('FriendProfileScreen', {id: item?.user_id})
        }>
        <Touchable style={{alignItems: 'center'}} onPress={onImagePress}>
          <CircleImage
            image={imageUrl(item?.profile_image)}
            styles={styles.friendUserImage}
            uri
          />
        </Touchable>
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
        {/* {item?.requested == 0 ? (
          <>
            <ThemeButton
              style={styles.addBtn}
              title={'Add Friend'}
              onPress={() => sendReq(item?.id)}
              textStyle={styles.addText}
            />
          </>
        ) : (
          <TextComponent
            text={'Already requested'}
            styles={{textAlign: 'center', marginVertical: hp('2')}}
          />
        )} */}
        <ThemeButton
          style={styles.addBtn}
          title={'Add Friend'}
          onPress={() => sendReq(item?.user_id)}
          textStyle={styles.addText}
        />
      </Touchable>
    </>
  );
};

export default AddFriendComp;

const styles = StyleSheet.create({
  friendCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    marginHorizontal: wp('2'),
    width: wp('40'),
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
    marginVertical: hp('0.5'),
  },
  friendUserImage: {
    width: Dimensions.get('window').width * 0.15,
    height: Dimensions.get('window').width * 0.15,
    // alignSelf: 'center',
  },
  friendUserName: {
    fontSize: hp('1.5'),
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
    borderRadius: 8,
    height: hp('3'),
    backgroundColor: Colors.backgroundTheme,
    marginTop: hp('1'),
    width: wp('30'),
    alignSelf: 'center',
    marginBottom: hp('0.5'),
  },
  addText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: hp('1.2'),
  },
  removeBtn: {
    height: hp('4'),
    backgroundColor: 'transparent',
  },
});
