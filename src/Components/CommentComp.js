import {Image, Pressable, StyleSheet, View} from 'react-native';
import {CircleImage} from './CircleImage';
import {TextComponent} from './TextComponent';
import {hp, wp} from '../Config/responsive';
import {convertToCustomTimeFormat} from '../Services/GlobalFunctions';
import {types} from '../Redux/types';
import useReduxStore from '../Hooks/UseReduxStore';
import {imageUrl} from '../Utils/Urls';
import {heart, replyIcon} from '../Assets';

const CommentComp = ({item, index}) => {
  const {dispatch} = useReduxStore();

  const onImagePress = () => {
    dispatch({
      payload: item?.profile_image,
      type: types.openModal,
    });
  };

  return (
    <>
      <View style={styles.mainView}>
        <View style={styles.upperView}>
          <Pressable onPress={onImagePress}>
            <CircleImage
              image={imageUrl(item?.profile_image)}
              size={0.11}
              uri
            />
          </Pressable>
          <TextComponent
            text={`${item?.first_name} ${
              item?.last_name != null ? item?.last_name : ''
            }`}
            styles={styles.nameText}
          />
          <TextComponent
            text={convertToCustomTimeFormat(item?.created_at)}
            styles={styles.timeText}
          />
        </View>
        <TextComponent text={item?.text} styles={styles.descText} />
      </View>

      <View style={styles.replyContainer}>
        <TextComponent text={`${2} Likes`} fade size={hp('1.5')} />
        <Image
          source={replyIcon}
          resizeMode="contain"
          style={styles.replyIcon}
        />
        <TextComponent text={`${2} replies`} fade size={hp('1.5')} />
        <Image
          source={heart}
          resizeMode="contain"
          style={styles.absoluteHeartIcon}
        />
      </View>
      {[1, 2, 3, 45].map(res => {
        return (
          <View style={styles.innerReplyContainer}>
            <View style={styles.upperView}>
              <Pressable onPress={onImagePress}>
                <CircleImage
                  image={imageUrl(item?.profile_image)}
                  size={0.11}
                  uri
                />
              </Pressable>
              <TextComponent
                text={`${item?.first_name} ${
                  item?.last_name != null ? item?.last_name : ''
                }`}
                styles={styles.nameText}
              />
              <TextComponent
                text={convertToCustomTimeFormat(item?.created_at)}
                styles={styles.timeText}
              />
            </View>
            <TextComponent text={item?.text} styles={styles.descText} />
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
    position: 'absolute',
    right: wp('4'),
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
