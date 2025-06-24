import {Platform, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';

export const styles = StyleSheet.create({
  container: {
    resizeMode: 'contain',
    width: wp('100'),
    height: hp('40'),
  },
  buttonStyle: {
    marginTop: hp('10'),
    width: wp('95'),
    alignSelf: 'center',
    borderRadius: 30,
    height: hp('5'),
  },
  skipBtn: {
    width: wp('19'),
    // alignItems: 'flex-end',
    paddingTop: Platform.OS == 'ios' ? hp('5') : hp('2'),
    paddingRight: wp('3'),
    marginLeft: wp('2'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
