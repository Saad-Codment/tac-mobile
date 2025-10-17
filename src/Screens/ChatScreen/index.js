import {
  View,
  Text,
  Platform,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import React, {memo, useCallback, useRef} from 'react';
import {Colors} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import {Touchable} from '../../Components/Touchable';
import {backIcon, send} from '../../Assets';
import {TextComponent} from '../../Components/TextComponent';
import {CircleImage} from '../../Components/CircleImage';
import {styles} from './styles';
import {keyExtractor} from '../../Utils';
import useChatScreen from './useChatScreen';
import {imageUrl} from '../../Utils/Urls';
import Overlay from '../../Components/Overlay';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChatScreen = ({navigation, route}) => {
  const {
    sendMessage,
    setMessage,
    handleAutoScroll,
    handleScroll,
    isLoading,
    scrollViewRef,
    message,
    allMessages,
    userData,
    receiverData,
    pickAndSendMedia,
    isTyping,
    lastSeenMessageId,
    lastSeen,
  } = useChatScreen(navigation, route);

  console.log(
    'lskvklsbdvblksdbvkjsdbkjvbsdkjvbkjsdbvbsdjbvkjsbdjkbvkjjsbd',
    allMessages[9],
  );

  const renderItem = useCallback(
    ({item, index}) => {
      const timestamp = item.created_at
        ? new Date(item.created_at)
        : new Date();
      const formattedTime = timestamp.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const isSender = item.sender_id === userData?.id;

      console.log('itemmsssgggg', item?.sender?.id, lastSeenMessageId);

      return (
        <View
          style={{
            ...styles.senderView(isSender),
            justifyContent: isSender ? 'flex-end' : 'flex-start',
          }}>
          {!isSender && (
            <TextComponent
              text={formattedTime}
              fade={true}
              styles={{fontSize: hp('1.2'), marginLeft: wp('2')}}
            />
          )}
          <View style={styles.senderText(isSender, item.type)}>
            {item.type === 'text' ? (
              <TextComponent
                text={item.text}
                styles={{
                  fontWeight: '300',
                  fontSize: hp('1.5'),
                  color: isSender ? 'white' : 'black',
                }}
              />
            ) : item.type == 'image' ? (
              item?.metadata?.files.map(res => {
                return (
                  <Image
                    source={{uri: imageUrl(res)}}
                    style={styles.mediaStyle}
                    resizeMode="contain"
                  />
                );
              })
            ) : item.type === 'video' ? (
              <Video
                source={{uri: `data:${item.mime};base64,${item.content}`}}
                style={styles.mediaStyle}
                controls={true}
                resizeMode="contain"
              />
            ) : null}
            {isSender && index === allMessages.length - 1 && (
              <TextComponent
                text={item?.id == lastSeenMessageId ? '✓✓' : '✓'}
                styles={{
                  fontSize: hp('1.2'),
                  color:
                    item?.id == lastSeenMessageId
                      ? Colors.blue
                      : Colors.grayFaded,
                  marginTop: hp('0.5'),
                  alignSelf: 'flex-end',
                }}
              />
            )}
          </View>
          {isSender && (
            <TextComponent
              text={formattedTime}
              fade={true}
              styles={{fontSize: hp('1.2'), marginRight: wp('2')}}
            />
          )}
        </View>
      );
    },
    [allMessages, lastSeenMessageId, userData],
  );

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: Colors.themeBlack}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? hp('0') : 0}>
      <View style={styles.headerView}>
        <View style={styles.HeaderLeft}>
          <Touchable
            onPress={() => navigation.goBack()}
            style={styles.backMain}>
            <Image
              source={backIcon}
              style={{
                resizeMode: 'contain',
                ...styles.arrowback,
              }}
            />
          </Touchable>
        </View>
        <Touchable
          style={styles.HeaderCenter}
          onPress={() =>
            navigation.navigate('FriendProfileScreen', {id: receiverData?.id})
          }>
          <CircleImage
            image={imageUrl(receiverData?.profile_image)}
            uri={true}
          />
          <View style={{marginLeft: wp('2')}}>
            <TextComponent
              text={
                receiverData?.first_name +
                ' ' +
                (receiverData?.last_name ? receiverData?.last_name : '')
              }
              styles={{color: 'white', fontWeight: 'bold'}}
            />
            {isTyping && (
              <TextComponent
                text={`${receiverData?.first_name} is typing...`}
                styles={{
                  color: isTyping ? 'green' : 'gray',
                  fontSize: hp('1.4'),
                }}
                fontFamily={'500'}
              />
            )}
          </View>
        </Touchable>
        <View style={styles.HeaderRight} />
      </View>
      <FlatList
        data={allMessages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onLayout={handleAutoScroll}
        onScroll={handleScroll}
        ref={scrollViewRef}
        onContentSizeChange={handleAutoScroll}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.searchMain}>
        <Touchable onPress={pickAndSendMedia} style={styles.attachmentBtn}>
          <Ionicons name="attach" size={24} color={Colors.grayFaded} />
        </Touchable>
        <TextInput
          enablesReturnKeyAutomatically
          style={styles.searchinput}
          onChangeText={setMessage}
          value={message}
          placeholder={'Type a message'}
          placeholderTextColor={Colors.grayFaded}
          multiline
        />
        {message?.trim() && (
          <Touchable onPress={sendMessage} style={styles.sendBtnStyle}>
            <View style={styles.msgsRecieve}>
              <Image source={send} style={styles.sendIcon} />
            </View>
          </Touchable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default memo(ChatScreen);
