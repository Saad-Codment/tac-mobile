import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  boldDivider,
  crossWhite,
  editPicBtn,
  rightIos,
  send,
} from '../../Assets';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import ThemeButton from '../../Components/ThemeButton';
import {useCallback, useLayoutEffect, useRef, useState} from 'react';
import {CircleImage} from '../../Components/CircleImage';
import {Touchable} from '../../Components/Touchable';
import {Colors} from '../../Theme/Variables';
import ErrorInputComponent from '../../Components/ErrorInputComponent';
import {MultiSelectButton} from '../../Components/MultiSelectButton';
import {
  formatDateToCustomFormat,
  sortByNameAlphabetically,
  uploadFromGalary,
} from '../../Services/GlobalFunctions';
import {
  getEventsCommentRepliesUrl,
  getEventsCommentUrl,
  getPostCommentRepliesUrl,
  getPostCommentUrl,
  imageUrl,
} from '../../Utils/Urls';
import DatePicker from 'react-native-date-picker';
import {step2} from '../../Utils/localDB';
import useReduxStore from '../../Hooks/UseReduxStore';
import useFriendServices from '../../Services/FriendServices';
import {useQuery} from '@tanstack/react-query';
import {keyExtractor} from '../../Utils';
import {DataNotFound} from '../../Components/DataNotFound';
import CommentComp from '../../Components/CommentComp';
import API from '../../Utils/helperFunc';

const ageRange = Array.from({length: 23}, (_, i) => {
  const age = 18 + i;
  return {label: String(age), value: String(age)};
});
const CommentModalComp = ({
  isModal,
  onPress,
  onBackPress,
  functionToUpdateComment,
  id,
  refetechKeys,
  index,
  isPost,
}) => {
  const {queryClient, getState} = useReduxStore();

  const [message, setMessage] = useState(null);
  const [postReplyId, setPostReplyId] = useState(null);

  const [commentReply, setCommentReply] = useState(null);

  const {
    postComment,
    addCommentOnPost,
    addReplyOnCommentOnPost,
    addLikeOnCommentPost,
    addLikeOnCommentEvent,
    addReplyOnCommentOnEvent,
  } = useFriendServices();

  const {data, error, refetch, isSuccess} = useQuery({
    queryKey: [(isPost ? 'postComments' : 'eventComment') + id],
    queryFn: () =>
      API.get((isPost ? getPostCommentUrl : getEventsCommentUrl) + id),
    staleTime: 0, // 👈 Treat data as stale immediately
    cacheTime: 0, // 👈 Don't cache the data
  });

  const getPostCommentReplies = useQuery({
    queryKey: ['postCommentReplies' + postReplyId],
    queryFn: () => API.get(getPostCommentRepliesUrl + postReplyId),
    staleTime: 0, // 👈 Treat data as stale immediately
    cacheTime: 0, // 👈 Don't cache the data
    enabled: false,
  });

  const getEventCommentReplies = useQuery({
    queryKey: ['eventCommentReplies' + postReplyId],
    queryFn: () => API.get(getEventsCommentRepliesUrl + postReplyId),
    staleTime: 0, // 👈 Treat data as stale immediately
    cacheTime: 0, // 👈 Don't cache the data
    enabled: false,
  });

  console.log(
    'slkdbvklsbdklvbsdklvbklsdbvlksklvsd',
    getPostCommentReplies.data?.data,
  );

  const scrollViewRef = useRef();
  const handleAutoScroll = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: false});
    }
  };
  useLayoutEffect(() => {
    handleAutoScroll();
  }, []);

  let regexp = /^(?![\s\b]+$).+/gm;

  const sendMessage = async comment => {
    if (isPost) {
      if (commentReply?.id) {
        await addReplyOnCommentOnPost.mutateAsync({
          comment_id: commentReply?.id,
          text: message,
        });
        setMessage(null);
        refetch();
        getPostCommentReplies.refetch();
        setCommentReply(null);
      } else {
        if (message.trim()) {
          await addCommentOnPost.mutateAsync({
            post_id: id,
            text: message,
          });

          setMessage(null);
          functionToUpdateComment(index, true);
          refetch();
        }
      }
    } else {
      if (commentReply?.id) {
        await addReplyOnCommentOnEvent.mutateAsync({
          comment_id: commentReply?.id,
          text: message,
        });
        setMessage(null);
        refetch();
        getEventCommentReplies.refetch();
        setCommentReply(null);
      } else {
        if (message.trim()) {
          await postComment.mutateAsync({
            event_id: id,
            text: message,
          });

          setMessage(null);
          functionToUpdateComment(index, true);
          refetch();
        }
      }
    }
  };

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <CommentComp
          item={item}
          replyArry={
            Boolean(
              item?.id ==
                ((
                  isPost
                    ? getPostCommentReplies.data?.data?.data?.length
                    : getEventCommentReplies.data?.data?.data?.length
                )
                  ? isPost
                    ? getPostCommentReplies.data?.data?.data[0]?.parent_id
                    : getEventCommentReplies.data?.data?.data[0]?.parent_id
                  : 0),
            )
              ? isPost
                ? getPostCommentReplies.data?.data?.data
                : getEventCommentReplies.data?.data?.data
              : []
          }
          onSwipeRight={() => setCommentReply(item)}
          onCommentReplyLikePress={async id => {
            if (isPost) {
              await addLikeOnCommentPost.mutateAsync({comment_id: id});
              getPostCommentReplies.refetch();
            } else {
              await addLikeOnCommentEvent.mutateAsync({comment_id: id});
              getEventCommentReplies.refetch();
            }
          }}
          onCommentLikePress={async () => {
            if (isPost)
              await addLikeOnCommentPost.mutateAsync({comment_id: item?.id});
            else
              await addLikeOnCommentEvent.mutateAsync({comment_id: item?.id});
            refetch();
          }}
          onReplyPress={() => {
            setPostReplyId(item?.id);
            setTimeout(() => {
              if (isPost) getPostCommentReplies.refetch();
              else getEventCommentReplies.refetch();
            }, 1000);
          }}
        />
      );
    },
    [
      getPostCommentReplies.data?.data?.data,
      data?.data,
      getEventCommentReplies.data?.data?.data,
    ],
  );

  return (
    <View style={styles.modalView}>
      <Modal
        isVisible={isModal}
        animationInTiming={100}
        animationOutTiming={100}
        avoidKeyboard
        animationType="fade"
        // hideModalContentWhileAnimating
        // useNativeDriver
        onBackButtonPress={onBackPress}
        style={styles.bottomModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              ...styles.modalData,
              paddingBottom: !onPress ? hp('5') : 0,
            }}>
            <View style={styles.upperIconView}>
              <Image
                source={boldDivider}
                resizeMode="contain"
                style={styles.divider}
              />
              <Touchable onPress={() => onBackPress()}>
                <Image
                  source={crossWhite}
                  resizeMode="contain"
                  style={styles.cancelIcon}
                />
              </Touchable>
            </View>
            <View
              style={{flex: 1}}
              behavior={Platform.OS === 'ios' ? 'padding' : null}>
              <FlatList
                data={data?.data?.data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onLayout={handleAutoScroll}
                ref={scrollViewRef}
                onContentSizeChange={handleAutoScroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: wp('0.5')}}
                ListEmptyComponent={
                  isSuccess &&
                  Array.isArray(data?.data?.data) &&
                  data?.data?.data?.length == 0 && (
                    <DataNotFound
                      btnStyles={{width: wp('80')}}
                      mainViewStyles={{marginTop: hp('25')}}
                      title={'No Comments yet!'}
                      subTitle={''}
                    />
                  )
                }
              />
              {/* <View style={styles.searchMain}>
                <TextInput
                  enablesReturnKeyAutomatically
                  style={styles.searchinput}
                  onChangeText={e => setMessage(e)}
                  value={message}
                  placeholder={'Type a message...'}
                  placeholderTextColor={Colors.grayFaded}
                  multiline
                />

                {message != null && message != '' && regexp.test(message) && (
                  <Touchable onPress={sendMessage} style={styles.sendBtnStyle}>
                    <View style={styles.msgsRecieve}>
                      <Image source={send} style={styles.sendIcon} />
                    </View>
                  </Touchable>
                )}
              </View> */}
              <View style={styles.mainInputContainer}>
                {commentReply && (
                  <View style={styles.commentContainer}>
                    <View style={{width: wp('70')}}>
                      <TextComponent
                        text={`Replying to ${commentReply?.user?.first_name}`}
                        size={hp('1.5')}
                      />
                      <TextComponent
                        text={commentReply?.text}
                        fade
                        size={hp('1.2')}
                        numberOfLines={1}
                        styles={{
                          width: wp('70'),
                          marginVertical: hp('0.5'),
                        }}
                      />
                    </View>
                    <Touchable onPress={() => setCommentReply(null)}>
                      <Image
                        source={crossWhite}
                        resizeMode="contain"
                        style={{
                          ...styles.cancelIcon,
                          right: wp('-10'),
                          top: hp('-1'),
                        }}
                      />
                    </Touchable>
                  </View>
                )}
                <View style={styles.searchMain}>
                  <TextInput
                    enablesReturnKeyAutomatically
                    style={styles.searchinput}
                    onChangeText={e => setMessage(e)}
                    value={message}
                    placeholder={'Type a message'}
                    placeholderTextColor={Colors.grayFaded}
                    multiline
                  />

                  {message != null && message != '' && regexp.test(message) && (
                    <Touchable
                      onPress={sendMessage}
                      style={styles.sendBtnStyle}>
                      <View style={styles.msgsRecieve}>
                        {/* <TextComponent text={'Post'} styles={styles.sendTextStyle} /> */}
                        <Image source={send} style={styles.sendIcon} />
                      </View>
                    </Touchable>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CommentModalComp;

styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalData: {
    // height: tripType ? hp('40') : hp('30'),
    backgroundColor: Colors.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 10,
    },
    shadowOpacity: 3,
    shadowRadius: 7.68,
    elevation: 20,
    width: wp('100'),
    // paddingHorizontal: wp('5'),
    height: hp('70'),
    alignSelf: 'center',
    marginBottom: hp('-2.5'),

    // height: hp('40'),
  },
  upperIconView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  divider: {width: wp('15'), height: hp('5'), left: wp('45'), top: hp('1')},
  cancelIcon: {
    alignSelf: 'flex-end',
    tintColor: 'black',
    width: wp('5'),
    height: hp('2'),
    right: wp('5'),
  },
  mainInputContainer: {
    width: wp('100'),
    // backgroundColor: 'red',
    // marginTop: hp('1'),
    paddingTop: hp('1'),
    borderTopWidth: 0.2,
  },
  headingText: {
    fontSize: hp('1.5'),
    fontWeight: 'bold',
    paddingLeft: wp('5'),
    marginBottom: hp('1'),
  },
  addIcon: {
    position: 'absolute',
    right: wp('15'),
    height: hp('6'),
    top: hp('8.8'),
  },
  whiteCircle: {
    // height: hp('22'),
    // width: wp('32'),
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('90'),
    marginTop: hp('10'),
  },
  modalScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wp('90'),
    // paddingBottom: hp('5'), // Adjust as needed
  },

  ageViewModal: {
    width: wp('90'),
    marginBottom: hp('20'),
    marginTop: hp('3'),
  },
  modalBtn: {
    width: wp('50'),
    alignSelf: 'center',
    marginTop: hp('2'),
    marginBottom: hp('2'),
    height: hp('4'),
  },
  textStyle: {
    fontSize: hp('1.5'),
    textAlign: 'center',
    borderRadius: 25,
    borderWidth: 1,
    paddingVertical: hp('2'),
  },
  gender: selectedGender => ({
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: selectedGender ? Colors.black : Colors.textGray,
    borderRadius: 50,
    width: wp('92'),
    paddingHorizontal: wp('4'),
    paddingVertical: hp('1.5'),
    alignItems: 'center',
    marginBottom: hp('3.5'),
    backgroundColor: selectedGender ? Colors.black : 'transparent',
    // height: hp('3'),
  }),
  genderTitle: selectedGender => ({
    fontWeight: '400',
    fontSize: hp('1.5'),
    color: selectedGender ? Colors.white : Colors.textGray,
  }),
  leftIconStyle: {
    width: wp('5'),
    height: hp('2'),
  },
  headerView: {
    flexDirection: 'row',
    // marginTop: Platform.OS == 'ios' ? hp('6') : hp('3'),
    paddingHorizontal: wp('5'),
    paddingBottom: hp('3'),
    backgroundColor: Colors.themeRed,
    paddingTop: Platform.OS == 'ios' ? hp('6') : hp('2'),
    height: Platform.OS == 'ios' ? hp('12') : hp('8'),
    alignItems: 'center',
  },
  HeaderLeft: {
    flex: 0.2,
    // justifyContent: 'center',
    // alignItems: 'center',
    // alignContent: 'center',
  },
  arrowback: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    width: wp('7'),
  },
  HeaderCenter: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'blue',
    height: hp('5'),
    textAlignVertical: 'center',
    flexDirection: 'row',
    // marginTop: hp('3'),
  },
  HeaderRight: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backMain: {
    alignItems: 'center',
    flexDirection: 'row',
    textAlign: 'left',
    alignItems: 'flex-end',

    // backgroundColor: 'red',
  },
  senderView: isSender => ({
    width: wp('100'),
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginVertical: hp('1.5'),
    marginLeft: isSender ? 0 : wp('2'),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 5,
    elevation: 50,
    // justifyContent: 'flex-end',
  }),
  senderText: isSender => ({
    maxWidth: wp('80'),
    borderWidth: 0.3,
    borderColor: Colors.grayFaded,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    borderBottomEndRadius: isSender ? 0 : 15,
    borderBottomStartRadius: isSender ? 15 : 0,
    paddingVertical: hp('1.5'),
    paddingHorizontal: wp('3.5'),
    marginRight: isSender ? wp('2') : 0,
    backgroundColor: isSender ? Colors.themeRed : 'transparent',
    lineHeight: 100,
  }),
  msgsRecieve: {
    paddingHorizontal: wp('2'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendIcon: {
    width: wp('3'),
    height: hp('2'),
    resizeMode: 'contain',
    // marginLeft: wp('1'),
  },
  inputView: {
    width: wp('90'),
    height: hp('5'),
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: Colors.dkBorderColor,
    paddingHorizontal: wp('3'),
    marginBottom: hp('5'),
  },
  commentContainer: {
    width: wp('85'),
    // paddingHorizontal: wp('2'),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  searchMain: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.2,
    minHeight: hp('5'),
    maxHeight: hp('14'),
    // height: 'auto',
    // borderTopEndRadius: 10,
    // borderTopStartRadius: 10,
    // borderTopColor: 'rgba(150, 150, 150, 1)',
    paddingHorizontal: wp('1.8'),
    // marginHorizontal: wp('4'),
    // marginVertical: hp('2'),
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: Platform.OS == 'ios' ? hp('-3') : hp('0'), // justifyContent: 'center',
    backgroundColor: Colors.themeBlack,
    // borderBottomWidth: 0,
    alignSelf: 'center',
    width: wp('85'),
  },
  searchinput: {
    // paddingHorizontal: wp(''),
    // width: wp('65'),
    paddingRight: wp('3'),
    fontSize: hp('1.5'),
    flex: 1,
    color: 'black',
    marginBottom: hp('1'),
  },
  sendBtnStyle: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.primaryColor,
    height: hp('3.5'),
    width: wp('10'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendTextStyle: {
    color: 'white',
    marginLeft: wp('1.5'),
    paddingVertical: hp('0.8'),
    fontSize: hp('1.5'),
    // paddingHorizontal: wp('3'),
  },
  upperButton: {
    width: wp('100'),
    alignItems: 'center',
    paddingHorizontal: wp('5'),
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.lightBlack,
    justifyContent: 'space-between',
  },
});
