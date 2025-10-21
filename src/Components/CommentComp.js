import {
  Image,
  Pressable,
  StyleSheet,
  View,
  PanResponder,
  Animated,
} from 'react-native';
import {CircleImage} from './CircleImage';
import {TextComponent} from './TextComponent';
import {hp, wp} from '../Config/responsive';
import {
  convertToCustomTimeFormat,
  convertUTCToLocalTimeForComment,
} from '../Services/GlobalFunctions';
import {types} from '../Redux/types';
import useReduxStore from '../Hooks/UseReduxStore';
import {imageUrl} from '../Utils/Urls';
import {heart, heartFilledLike, replyIcon} from '../Assets';
import {useCallback, useRef, useState} from 'react';
import {Touchable} from './Touchable';
import BottomModalComponent from './BottomModalComponent';

const CommentComp = ({
  item,
  index,
  replyArry,
  onReplyPress,
  onSwipeRight,
  onCommentLikePress,
  onCommentReplyLikePress,
  isPost,
}) => {
  const {dispatch} = useReduxStore();
  const pan = useRef(new Animated.ValueXY()).current;
  const [modal, setModal] = useState(null); // State for report modal

  // PanResponder configuration
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        pan.setValue({x: gestureState.dx, y: 0});
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100) {
          onSwipeRight(item?.id);
        }
        Animated.spring(pan, {
          toValue: {x: 0, y: 0},
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  const onImagePress = () => {
    dispatch({
      payload: item?.profile_image,
      type: types.openModal,
    });
  };

  const onReportPress = () => {
    setModal({id: item?.id, type: 'event'});
  };

  const onReportLongPress = id => {
    setModal({id, type: isPost ? 'postComment' : 'eventComment'});
  };

  const renderReply = useCallback(
    res => {
      return (
        <Pressable
          key={res?.id}
          style={styles.innerReplyContainer}
          onLongPress={() => onReportLongPress(res?.id)}>
          <View style={styles.upperView}>
            <Pressable onPress={onImagePress}>
              <CircleImage
                image={imageUrl(res?.user?.profile_image)}
                size={0.07}
                uri
              />
            </Pressable>
            <TextComponent
              text={`${res?.user?.first_name} ${
                res?.user?.last_name != null ? res?.user?.last_name : ''
              }`}
              styles={styles.nameText}
            />
            <TextComponent
              text={convertToCustomTimeFormat(res?.created_at)}
              styles={styles.timeText}
            />
          </View>
          <TextComponent text={res?.text} styles={styles.descText} />
          <View style={styles.likesRow}>
            <TextComponent text={`${2} Likes`} fade size={hp('1.5')} />
            <Touchable
              onPress={() => onCommentReplyLikePress(res?.id)}
              style={{
                position: 'absolute',
                right: wp('10'),
              }}>
              <Image
                source={res?.is_liked ? heartFilledLike : heart}
                resizeMode="contain"
                style={styles.rightHeartIcon}
              />
            </Touchable>
          </View>
        </Pressable>
      );
    },
    [replyArry],
  );

  return (
    <>
      <Animated.View
        style={[styles.mainView, {transform: [{translateX: pan.x}]}]}
        {...panResponder.panHandlers}>
        <Pressable onLongPress={() => onReportLongPress(item?.id)}>
          <View
            style={styles.upperView}
            // onPress={onImagePress} // Regular press for profile modal
          >
            <CircleImage
              image={imageUrl(item?.user?.profile_image)}
              size={0.11}
              uri
            />
            <TextComponent
              text={`${item?.user?.first_name} ${
                item?.user?.last_name != null ? item?.user?.last_name : ''
              }`}
              styles={styles.nameText}
            />
            <TextComponent
              text={convertToCustomTimeFormat(item?.created_at)}
              styles={styles.timeText}
            />
          </View>
          <TextComponent text={item?.text} styles={styles.descText} />
        </Pressable>
      </Animated.View>

      <View style={styles.replyContainer}>
        <TextComponent
          text={`${item?.likes_count} Likes`}
          fade
          size={hp('1.5')}
        />
        <Image
          source={replyIcon}
          resizeMode="contain"
          style={styles.replyIcon}
        />
        <TextComponent
          text={`${item?.replies_count} replies`}
          fade
          size={hp('1.5')}
          onPress={() => onReplyPress()}
          disable={Boolean(
            item?.replies_count == 0 || item?.replies_count == null,
          )}
        />
        <Image
          source={replyIcon}
          resizeMode="contain"
          style={styles.replyIcon}
        />
        <TextComponent
          text={`Reply to comment`}
          fade
          size={hp('1.5')}
          onPress={() => onSwipeRight(item?.id)}
        />
        <Touchable
          onPress={() => onCommentLikePress()}
          style={{
            position: 'absolute',
            right: wp('4'),
          }}>
          <Image
            source={item?.is_liked ? heartFilledLike : heart}
            resizeMode="contain"
            style={styles.absoluteHeartIcon}
          />
        </Touchable>
      </View>
      {replyArry?.map(
        res => renderReply(res), // Render each reply using the renderReply function
      )}
      {modal && (
        <BottomModalComponent
          isVisible={!!modal}
          isReport
          id={modal?.id}
          type={modal?.type}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
};

export default CommentComp;

const styles = StyleSheet.create({
  mainView: {
    paddingHorizontal: wp('2'),
    backgroundColor: 'white',
    paddingVertical: hp('1'),
    marginTop: hp('1'),
  },
  upperView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: hp('1.5'),
    width: wp('64'),
    marginLeft: wp('2'),
  },
  timeText: {
    fontSize: hp('1.2'),
  },
  descText: {
    marginTop: hp('1'),
    marginLeft: wp('2'),
    fontSize: hp('1.5'),
  },
  replyContainer: {
    width: wp('100'),
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2'),
  },
  replyIcon: {
    width: wp('3'),
    height: hp('3'),
    marginLeft: wp('2'),
  },
  absoluteHeartIcon: {
    width: wp('4'),
    height: hp('3'),
  },
  innerReplyContainer: {
    paddingHorizontal: wp('2'),
    backgroundColor: 'white',
    paddingVertical: hp('1'),
    width: wp('95'),
    marginLeft: wp('4'),
  },
  likesRow: {
    width: wp('100'),
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2'),
    marginTop: hp('0.5'),
  },
  rightHeartIcon: {
    width: wp('4'),
    height: hp('3'),
    // position: 'absolute',
    // right: wp('9'),
  },
});
