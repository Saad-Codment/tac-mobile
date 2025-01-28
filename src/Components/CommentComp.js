import {StyleSheet, View} from 'react-native';
import {CircleImage} from './CircleImage';
import {TextComponent} from './TextComponent';
import {hp, wp} from '../Config/responsive';
import {convertToCustomTimeFormat} from '../Services/GlobalFunctions';

const CommentComp = ({item, index}) => {
  return (
    <View style={styles.mainView}>
      <View style={styles.upperView}>
        <View>
          <CircleImage image={null} size={0.12} />
        </View>
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
