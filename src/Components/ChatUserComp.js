import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import React from 'react';
import {hp, wp} from '../Config/responsive';
import {CircleImage} from './CircleImage';
import {TextComponent} from './TextComponent';
import NavigationService from '../Services/NavigationService';
import useReduxStore from '../Hooks/UseReduxStore';
import {imageUrl} from '../Utils/Urls';
import {Colors} from '../Theme/Variables';
import {convertToCustomDateTimeFormat} from '../Services/GlobalFunctions';

const ChatUserComp = ({mainViewStyles, item, index, userDataProp}) => {
  const {getState} = useReduxStore();

  const {userData} = getState('Auth');

  const lastMessage =
    item?.last_message?.text ||
    (item?.last_message?.type == 'image' && 'Photos shared') ||
    'No messages yet';
  const isTyping = item?.isTyping || false;
  const unreadCount = Boolean(item?.last_message?.sender_id != userData?.id)
    ? item?.unread_count
    : 0;

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        NavigationService.navigate('ChatScreen', {
          id: item?.other_user?.id || item?.id, // Fallback to item.id if other_user.id is missing
          userId: userData?.id,
          conversationId: item?.conversation_id,
        });
      }}>
      <CircleImage
        size={0.1}
        uri
        image={imageUrl(item?.other_user?.profile_image)}
      />
      <View style={styles.textWrapper}>
        <TextComponent
          text={
            item?.other_user?.first_name +
            ' ' +
            (item?.other_user?.last_name ? item?.other_user?.last_name : '')
          }
          styles={styles.nameText}
        />
        <TextComponent
          text={isTyping ? 'typing...' : lastMessage}
          numberOfLines={1}
          fade
          styles={isTyping ? styles.typingText : styles.lastMessage}
        />
      </View>

      {unreadCount > 0 ? (
        <View style={styles.unreadBadge}>
          <TextComponent text={unreadCount} styles={styles.unreadText} />
        </View>
      ) : (
        <TextComponent
          text={
            item?.last_message?.created_at
              ? convertToCustomDateTimeFormat(item?.last_message?.created_at)
              : ''
          }
          fade
          styles={styles.timeText}
        />
      )}
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
    // paddingVertical: hp('0.3'),
    marginVertical: hp('0.5'),
    width: wp('98'),
    alignSelf: 'center',
    height: hp('6'),
  },
  textWrapper: {
    width: wp('67'),
    marginLeft: wp('2'),
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: hp('1.5'),
  },
  messageText: {
    fontSize: hp('1.2'),
  },
  lastMessage: {
    fontSize: hp('1.3'),
    color: Colors.gray || '#757575',
    maxWidth: wp('60'), // Prevent overflow
    flexWrap: 'wrap',
  },
  typingText: {
    fontSize: hp('1.3'),
    color: Colors.green || '#4CAF50',
    fontStyle: 'italic',
  },
  unreadBadge: {
    backgroundColor: Colors.primaryColor || '#6200EE', // Fallback purple
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('1.5'),
    marginLeft: wp('8'),
    borderRadius: 10,
    paddingVertical: hp('0.5'),
    // borderRadius: Math.round(
    //   Dimensions.get('window').width + Dimensions.get('window').height,
    // ),
    // width: Dimensions.get('window').width * 0.05,
    // height: Dimensions.get('window').width * 0.05,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  unreadText: {
    color: Colors.white || '#FFFFFF',
    fontSize: hp('1.2'),
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: hp('1.2'),
    // marginTop: hp('-1'),
    right: wp('8'),
  },
});
