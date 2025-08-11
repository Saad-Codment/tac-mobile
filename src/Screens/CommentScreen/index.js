import {memo, useCallback} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import useCommentScreen from './useCommentScreen';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';
import {TextComponent} from '../../Components/TextComponent';
import {Touchable} from '../../Components/Touchable';
import {keyExtractor} from '../../Utils';
import {DataNotFound} from '../../Components/DataNotFound';
import {styles} from './styles';
import {crossWhite, send} from '../../Assets';
import CommentComp from '../../Components/CommentComp';

const CommentScreen = ({navigation, route}) => {
  const {
    commentsList,
    dynamicRoute,
    onRefresh,
    handleAutoScroll,
    regexp,
    scrollViewRef,
    message,
    setMessage,
    sendMessage,
    commentReply,
    setPostReplyId,
    postReplyId,
    getPostCommentReplies,
    setCommentReply,
  } = useCommentScreen(navigation, route);

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <CommentComp
          item={item}
          replyArry={
            Boolean(
              item?.id == getPostCommentReplies.data?.data?.data[0]?.parent_id,
            )
              ? getPostCommentReplies.data?.data?.data
              : []
          }
          onSwipeRight={() => setCommentReply(item)}
          // onCommentLikePress={async () => {
          //   await addLikeOnCommentPost.mutateAsync({comment_id: item?.id});
          //   refetch();
          // }}
          onReplyPress={() => {
            setPostReplyId(item?.id);
            setTimeout(() => {
              getPostCommentReplies.refetch();
            }, 1000);
          }}
        />
      );
    },
    [commentsList],
  );

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <HeaderComponent
        headerTitle={'Comments'}
        goBack={() => navigation.goBack()}
        isBack
      />
      <FlatList
        data={commentsList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onLayout={handleAutoScroll}
        ref={scrollViewRef}
        onContentSizeChange={handleAutoScroll}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <DataNotFound
            btnStyles={{width: wp('80')}}
            mainViewStyles={{marginTop: hp('25')}}
            title={'No Comments yet!'}
            subTitle={''}
          />
        }
      />
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
            <Touchable onPress={sendMessage} style={styles.sendBtnStyle}>
              <View style={styles.msgsRecieve}>
                {/* <TextComponent text={'Post'} styles={styles.sendTextStyle} /> */}
                <Image source={send} style={styles.sendIcon} />
              </View>
            </Touchable>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default memo(CommentScreen);
