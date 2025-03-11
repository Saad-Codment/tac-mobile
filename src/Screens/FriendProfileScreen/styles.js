import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';

export const styles = StyleSheet.create({
  upComingFlatlistView: {
    paddingBottom: hp('15'),
    flexGrow: 1,
    // paddingTop: hp('2'),
    alignItems: 'center',
    paddingTop: hp('2'),
    // alignSelf: 'center',
  },
  modalHeading: {alignSelf: 'center', fontWeight: 'bold'},
  innerHeading: {fontWeight: 'bold', marginVertical: hp('5')},
  viewFlex: {flexDirection: 'row'},
  textStyle: {fontSize: hp('1.5')},
  leftViewImg: {width: wp('7'), height: hp('5')},
  reportMessStyle: {
    fontSize: hp('1.5'),
    marginLeft: wp('2'),
    maxWidth: wp('80'),
  },
});
