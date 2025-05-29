import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {hp, wp} from '../Config/responsive';
import {CircleImage} from './CircleImage';
import {TextComponent} from './TextComponent';
import NavigationService from '../Services/NavigationService';
import useReduxStore from '../Hooks/UseReduxStore';
import {imageUrl} from '../Utils/Urls';

const ChatUserComp = ({mainViewStyles, item, index, userDataProp}) => {
  const {getState} = useReduxStore();

  const userData = getState('Auth');

  const timestamp = item?.lastMessage?.createdAt?.seconds
    ? new Date(item?.lastMessage?.createdAt?.seconds * 1000)
    : '';

  // Format the date into a readable time (e.g., '4:32 PM')
  const formattedTime = !timestamp
    ? ''
    : timestamp.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
  const isUnread =
    userData?.id === item?.lastMessage?.receiver &&
    item?.lastMessage?.seen == 0;

  console.log(
    'timestamptimestamptimestamptimestamptimestamptimestamp',
    userData,
    userDataProp,
  );

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        NavigationService.navigate('ChatScreen', {
          ...item,
          userId: userDataProp?.id ?? userData?.id ?? item?.user_id,
        });
      }}>
      <CircleImage size={0.15} uri image={imageUrl(item?.profile_image)} />
      <View style={styles.textWrapper}>
        <TextComponent
          text={item?.first_name + ' ' + item?.last_name}
          styles={styles.nameText}
        />
        <TextComponent
          text={item?.lastMessage?.text || 'Start Conversation...'}
          numberOfLines={1}
          fade
          styles={styles.messageText}
        />
      </View>
      <TextComponent text={formattedTime} styles={styles.timeText} />
    </Pressable>
  );
};

export default ChatUserComp;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3'),
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: hp('1'),
    marginVertical: hp('0.5'),
    width: wp('98'),
    alignSelf: 'center',
  },
  textWrapper: {
    width: wp('60'),
    marginLeft: wp('2'),
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: hp('1.8'),
  },
  messageText: {
    fontSize: hp('1.5'),
  },
  timeText: {
    fontSize: hp('1.6'),
    marginTop: hp('-1'),
  },
});
