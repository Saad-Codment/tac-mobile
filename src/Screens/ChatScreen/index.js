import {
  View,
  Text,
  Platform,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  Vibration,
} from 'react-native';
import React, {memo, useCallback, useRef} from 'react';
import {Colors} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import {Touchable} from '../../Components/Touchable';
import {
  backIcon,
  calendar,
  calender,
  dollarCircle,
  location,
  send,
  tacLogo,
} from '../../Assets';
import {TextComponent} from '../../Components/TextComponent';
import {CircleImage} from '../../Components/CircleImage';
import {styles} from './styles';
import {keyExtractor} from '../../Utils';
import useChatScreen from './useChatScreen';
import {imageUrl} from '../../Utils/Urls';
import Overlay from '../../Components/Overlay';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BlurImage from '../../Components/BlurImage';
import useReduxStore from '../../Hooks/UseReduxStore';
import {types} from '../../Redux/types';
import {
  convertToCustomDateTimeFormat,
  convertToCustomTimeFormat,
  convertToLocalTime,
  formatPrice,
  getDateMonthYear,
  isOnlyEmoji,
} from '../../Services/GlobalFunctions';
import NavigationService from '../../Services/NavigationService';
import DividerLine from '../../Components/DividerLine';
import Clipboard from '@react-native-clipboard/clipboard';
import {successMessage} from '../../Config/NotificationMessage';

const formatMessageDate = utcTimestamp => {
  const date = new Date(utcTimestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const getDaySuffix = day => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  if (isToday) {
    return 'Today';
  } else if (isYesterday) {
    return 'Yesterday';
  } else {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day}${getDaySuffix(day)}, ${year}`;

    // Format as DD/MM/YYYY
    // return `${date.getDate().toString().padStart(2, '0')}/${(
    //   date.getMonth() + 1
    // )
    //   .toString()
    //   .padStart(2, '0')} ${date.getFullYear()}`;
  }
};

const groupMessagesByDate = messages => {
  if (!messages || messages.length === 0) return [];

  const groupedMessages = [];
  let currentDate = null;

  messages.forEach((message, index) => {
    console.log(
      'ksjdbvkjlsbdkvlbskdlvbsdbvbklsd',
      formatMessageDate(message.created_at),
    );
    const messageDate = formatMessageDate(message.created_at); // Get date part (e.g., "Today" or "DD/MM/YYYY")

    if (messageDate !== currentDate) {
      groupedMessages.push({
        type: 'date_header',
        date: messageDate,
        id: `date_${index}_${messageDate}`, // Unique ID for date header
      });
      currentDate = messageDate;
    }

    groupedMessages.push(message);
  });

  return groupedMessages;
};

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
    onImagePress,
    isSeenTrue,
    onRefresh,
    isShowFlat,
    setIsShowFlat,
  } = useChatScreen(navigation, route);

  console.log(
    'lskvklsbdvblksdbvkjsdbkjvbsdkjvbkjsdbvbsdjbvkjsbdjkbvkjjsbd',
    allMessages[9],
  );

  const images = [
    'profile_image/1754511428_d7da06fc-c638-4c22-881c-90b0764b7f3b.png',
    // 'profile_image/1754511428_d7da06fc-c638-4c22-881c-90b0764b7f3b.png',
    // 'profile_image/1754511428_d7da06fc-c638-4c22-881c-90b0764b7f3b.png',
    // 'profile_image/1754511428_d7da06fc-c638-4c22-881c-90b0764b7f3b.png',
    // 'profile_image/1754511428_d7da06fc-c638-4c22-881c-90b0764b7f3b.png',
  ];

  const RenderImages = ({images, onImagePress}) => {
    if (images.length == 1) {
      return (
        <Pressable onPress={onImagePress}>
          <BlurImage
            uri={imageUrl(images[0])}
            isURI
            styles={styles.singleImage}
            // resizeMode={'contain'}
          />
        </Pressable>
      );
    } else if (images.length == 2) {
      return (
        <Touchable style={styles.twoImagesContainer} onPress={onImagePress}>
          {images.map((img, index) => (
            <BlurImage uri={imageUrl(img)} isURI styles={styles.twoImage} />
          ))}
        </Touchable>
      );
    } else if (images.length == 3) {
      return (
        <Touchable style={styles.twoImagesContainer} onPress={onImagePress}>
          {images.slice(0, 1).map((img, index) => (
            <BlurImage
              uri={imageUrl(img)}
              isURI
              styles={{
                width: wp('35'),
                height: hp('40.5'),
              }}
            />
          ))}
          <View style={{justifyContent: 'space-between'}}>
            {images.slice(1, 3).map((img, index) => (
              <BlurImage
                uri={imageUrl(img)}
                isURI
                styles={{
                  width: wp('35'),
                  height: hp('20'),
                }}
              />
            ))}
          </View>
        </Touchable>
      );
    } else {
      return (
        <Touchable style={styles.gridContainer} onPress={onImagePress}>
          {images.slice(0, 4).map((img, index) => (
            <View key={index} style={styles.gridItem}>
              <BlurImage
                uri={imageUrl(img)}
                isURI
                styles={{
                  ...styles.gridImage,
                  marginTop: index > 1 ? hp('0.5') : 0,
                }}
                // resizeMode={'contain'}
              />
              {index === 3 && images.length > 4 && (
                <View style={styles.overlay}>
                  <Text style={styles.overlayText}>+{images.length - 4}</Text>
                </View>
              )}
            </View>
          ))}
        </Touchable>
      );
    }
  };

  const renderItem = useCallback(
    ({item, index}) => {
      if (item.type === 'date_header') {
        return (
          <View style={styles.dateHeader}>
            <TextComponent text={item.date} styles={styles.dateHeaderText} />
          </View>
        );
      }
      const isSender = item.sender_id == userData?.id;
      // Find the last sender's message in allMessages
      const lastSenderMessage = allMessages
        .filter(msg => msg.sender_id == userData?.id)
        .slice(-1)[0];

      console.log('lastSeenMessageId', item);

      return (
        <View>
          <View
            style={{
              ...styles.senderView(isSender),
              justifyContent: isSender ? 'flex-end' : 'flex-start',
            }}>
            {isSender && (
              <TextComponent
                text={
                  convertToLocalTime(item?.created_at)?.time + ' '
                  // +
                  // convertToLocalTime(item?.created_at)?.period
                }
                fade={true}
                styles={{fontSize: hp('1.1'), marginRight: wp('2')}}
              />
            )}
            <View
              style={styles.senderText(
                isSender,
                item.type,
                Boolean(isOnlyEmoji(item?.text) && item?.text?.length == 2),
              )}>
              {item.type === 'text' &&
              isOnlyEmoji(item.text) &&
              item.text.length == 2 ? (
                <TextComponent
                  text={item.text}
                  styles={{
                    fontWeight: '300',
                    fontSize: isOnlyEmoji(item?.text) ? hp('10') : hp('1.5'),
                    color: isSender ? 'white' : 'black',
                  }}
                />
              ) : item.type === 'text' ? (
                <TextComponent
                  onLongPress={() => {
                    Clipboard.setString(item.text);
                    Vibration.vibrate(100); // very short
                    successMessage('Message copied to clipboard');
                  }}
                  text={item.text}
                  styles={{
                    fontWeight: '400',
                    fontSize: hp('1.5'),
                    color: isSender ? 'white' : 'black',
                  }}
                />
              ) : item.type == 'image' ? (
                <RenderImages
                  images={item?.metadata?.files}
                  onImagePress={() => onImagePress(item)}
                />
              ) : item.type === 'video' ? (
                <Video
                  source={{uri: `data:${item.mime};base64,${item.content}`}}
                  style={styles.mediaStyle}
                  controls={true}
                  resizeMode="contain"
                />
              ) : (
                item.type == 'event' && (
                  <Touchable
                    style={{width: wp('70'), borderRadius: 20}}
                    onPress={() => {
                      NavigationService.navigate('EventsDetailScreen', {
                        id: item?.metadata?.data?.id,
                      });
                    }}>
                    {item?.metadata?.data?.images != null &&
                      JSON.parse(item?.metadata?.data?.images)?.length > 0 && (
                        <BlurImage
                          isURI
                          uri={
                            item?.metadata?.data?.images != null
                              ? imageUrl(
                                  JSON.parse(item?.metadata?.data?.images)[0],
                                )
                              : null
                          }
                          styles={{...styles.singleImage, height: hp('15')}}
                        />
                      )}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: hp('1'),
                        marginHorizontal: wp('1'),
                      }}>
                      <CircleImage
                        uri={Boolean(item?.metadata?.data?.user_image != null)}
                        image={
                          item?.metadata?.data?.user_image != null
                            ? imageUrl(item?.metadata?.data?.user_image)
                            : tacLogo
                        }
                      />
                      <View style={{marginLeft: wp('2')}}>
                        <TextComponent
                          text={
                            item?.metadata?.data?.first_name
                              ? `${item?.metadata?.data?.first_name} ${
                                  item?.metadata?.data?.last_name
                                    ? item?.metadata?.data?.last_name
                                    : ''
                                }`
                              : 'System suggested'
                          }
                          isWhite={isSender}
                          size={hp('1.8')}
                        />
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Image
                            source={location}
                            resizeMode="contain"
                            style={{width: wp('3'), height: hp('2')}}
                            tintColor={isSender ? 'white' : 'black'}
                          />
                          <TextComponent
                            text={item?.metadata?.data?.address}
                            size={hp('1.2')}
                            styles={{width: wp('30')}}
                            numberOfLines={1}
                            isWhite={isSender}
                          />
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginHorizontal: wp('1'),
                        marginBottom: hp('1'),
                      }}>
                      <TextComponent
                        text={item?.metadata?.data?.title}
                        size={hp('1.8')}
                        numberOfLines={1}
                        styles={{
                          marginBottom: hp('0.5'),
                          width: wp('48'),
                        }}
                        isWhite={isSender}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-around',
                        }}>
                        <TextComponent
                          text={formatPrice(item?.metadata?.data?.added_money)}
                          size={hp('1.5')}
                          isWhite={isSender}
                        />
                      </View>
                    </View>
                    <DividerLine
                      DividerLineStyle={{
                        backgroundColor: isSender ? 'white' : 'black',
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: hp('1'),
                        marginHorizontal: wp('1'),
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TextComponent
                          text={'Start At : '}
                          isWhite={isSender}
                          size={hp('1.2')}
                        />
                        <Image
                          source={calender}
                          resizeMode="contain"
                          style={{width: wp('3'), height: hp('2')}}
                          tintColor={isSender ? 'white' : 'black'}
                        />
                        <TextComponent
                          text={` ${
                            getDateMonthYear(item?.metadata?.data?.from_date)
                              ?.monthName
                          } ${
                            getDateMonthYear(item?.metadata?.data?.from_date)
                              ?.day
                          }, ${
                            getDateMonthYear(item?.metadata?.data?.from_date)
                              ?.year
                          }`}
                          isWhite={isSender}
                          size={hp('1.2')}
                        />
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TextComponent
                          text={' End At : '}
                          isWhite={isSender}
                          size={hp('1.2')}
                        />
                        <Image
                          source={calender}
                          resizeMode="contain"
                          style={{width: wp('3'), height: hp('2')}}
                          tintColor={isSender ? 'white' : 'black'}
                        />
                        <TextComponent
                          text={` ${
                            getDateMonthYear(item?.metadata?.data?.to_date)
                              ?.monthName
                          } ${
                            getDateMonthYear(item?.metadata?.data?.to_date)?.day
                          }, ${
                            getDateMonthYear(item?.metadata?.data?.to_date)
                              ?.year
                          }`}
                          isWhite={isSender}
                          size={hp('1.2')}
                        />
                      </View>
                    </View>
                  </Touchable>
                )
              )}
            </View>
            {!isSender && (
              <TextComponent
                text={
                  convertToLocalTime(item?.created_at)?.time + ' '
                  // +
                  // convertToLocalTime(item?.created_at)?.period
                }
                fade={true}
                styles={{fontSize: hp('1.1'), marginLeft: wp('2')}}
              />
            )}
          </View>
          {isSender && item.id === lastSenderMessage?.id && (
            <TextComponent
              text={
                item.id === lastSeenMessageId || isSeenTrue
                  ? 'Seen'
                  : 'Delivered'
              }
              styles={{
                fontSize: hp('1.2'),
                color: Colors.grayFaded,
                textAlign: 'right',
                marginRight: wp('2'),
              }}
            />
          )}
        </View>
      );
    },
    [allMessages, lastSeenMessageId, userData, isSeenTrue],
  );

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: 'white'}}
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
        data={groupMessagesByDate(allMessages)}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onLayout={handleAutoScroll}
        // onScroll={handleScroll}
        onRefresh={onRefresh}
        refreshing={false}
        ref={scrollViewRef}
        onContentSizeChange={handleAutoScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: hp('6'),
          backgroundColor: 'white',
          opacity: isShowFlat ? 1 : 0,
          // display: isShowFlat ? 'flex' : 'none',
        }}
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
          <Touchable
            onPress={() => {
              setMessage('');
              sendMessage(message);
            }}
            style={styles.sendBtnStyle}>
            <View style={styles.msgsRecieve}>
              <Image source={send} style={styles.sendIcon} />
            </View>
          </Touchable>
        )}
      </View>
      {!isShowFlat && <Overlay />}
    </KeyboardAvoidingView>
  );
};

export default memo(ChatScreen);
