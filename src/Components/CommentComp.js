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
import {convertToCustomTimeFormat} from '../Services/GlobalFunctions';
import {types} from '../Redux/types';
import useReduxStore from '../Hooks/UseReduxStore';
import {imageUrl} from '../Utils/Urls';
import {heart, heartFilledLike, replyIcon} from '../Assets';
import {useRef} from 'react';
import {Touchable} from './Touchable';

const CommentComp = ({
  item,
  index,
  replyArry,
  onReplyPress,
  onSwipeRight,
  onCommentLikePress,
}) => {
  const {dispatch} = useReduxStore();
  const pan = useRef(new Animated.ValueXY()).current;

  // Custom function to handle right swipe
  // const onSwipeRight = () => {
  //   console.log('Swiped right on comment:', item?.id); // Replace with your desired action
  //   // Example: dispatch an action, navigate, or perform any task
  //   // dispatch({ type: 'YOUR_ACTION', payload: item });
  // };

  // PanResponder configuration
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Allow movement only on X-axis
        pan.setValue({x: gestureState.dx, y: 0});
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Check if swiped right beyond threshold (e.g., 100 pixels)
        if (gestureState.dx > 100) {
          onSwipeRight(item?.id); // Trigger custom function
        }
        // Reset position
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

  return (
    <>
      <Animated.View
        style={[styles.mainView, {transform: [{translateX: pan.x}]}]}
        {...panResponder.panHandlers}>
        <View style={styles.upperView}>
          <Pressable onPress={onImagePress}>
            <CircleImage
              image={imageUrl(item?.user?.profile_image)}
              size={0.11}
              uri
            />
          </Pressable>
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
      {replyArry?.map(res => {
        return (
          <View key={res?.id} style={styles.innerReplyContainer}>
            <View style={styles.upperView}>
              <Pressable onPress={onImagePress}>
                <CircleImage
                  image={imageUrl(res?.user?.profile_image)}
                  size={0.11}
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
              <Image
                source={heart}
                resizeMode="contain"
                style={styles.rightHeartIcon}
              />
            </View>
          </View>
        );
      })}
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
    width: wp('67'),
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
    // position: 'absolute',
    // right: wp('4'),
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
    position: 'absolute',
    right: wp('9'),
  },
});
