import {Pressable, StyleSheet, View} from 'react-native';
import {CircleImage} from './CircleImage';
import {TextComponent} from './TextComponent';
import {hp, wp} from '../Config/responsive';
import {convertToCustomTimeFormat} from '../Services/GlobalFunctions';
import {types} from '../Redux/types';
import useReduxStore from '../Hooks/UseReduxStore';
import {imageUrl} from '../Utils/Urls';

const CommentComp = ({item, index}) => {
  const {dispatch} = useReduxStore();

  const onImagePress = () => {
    dispatch({
      payload: item?.profile_image,
      type: types.openModal,
    });
  };
  return (
    <View style={styles.mainView}>
      <View style={styles.upperView}>
        <Pressable onPress={onImagePress}>
          <CircleImage image={imageUrl(item?.profile_image)} size={0.12} uri />
        </Pressable>
        <TextComponent
          text={`${item?.first_name} ${item?.last_name}`}
          styles={styles.nameText}
        />
        <TextComponent text={convertToCustomTimeFormat(item?.created_at)} />
      </View>
      <TextComponent text={item?.text} styles={styles.descText} />
    </View>
  );
};
export default CommentComp;

const styles = StyleSheet.create({
  mainView: {paddingHorizontal: wp('2'), marginVertical: hp('1')},
  upperView: {flexDirection: 'row', alignItems: 'center'},
  nameText: {
    fontWeight: 'bold',
    fontSize: hp('2.2'),
    width: wp('67'),
    marginLeft: wp('2'),
  },
  descText: {marginTop: hp('0.5'), marginLeft: wp('2')},
});
