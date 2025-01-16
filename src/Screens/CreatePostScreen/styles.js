import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';

export const styles = StyleSheet.create({
  userView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('2'),
  },
  userName: {marginLeft: wp('2'), fontWeight: 'bold'},
  inputView: isImgs => ({
    width: wp('95'),
    // height: isImgs ? hp('7') : hp('40'),
    // alignItems: 'center',
    // justifyContent: 'center',
    alignSelf: 'center',
    marginTop: hp('2'),
  }),
  textInput: {
    flex: 1,
    color: 'black',
    fontSize: hp('2'),
  },
  imgMainView: istrue => ({
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wp('100'),
    paddingHorizontal: istrue ? wp('1') : 0,
    marginTop: hp('2'),
  }),
  bgImg: isTrue => ({
    marginVertical: hp('0.5'),
    width: wp('47'),
    height: hp('30'),
    overflow: 'hidden',
    marginHorizontal: isTrue ? wp('1') : 0,
  }),
  crossIcon: isTrue => ({
    width: wp('15'),
    height: hp('7'),
    left: isTrue ? wp('33') : wp('87'),
  }),
  createBtnStyle: {
    width: wp('90'),
    alignSelf: 'center',
    position: 'absolute',
    bottom: hp('5'),
  },
});
