import {StyleSheet} from 'react-native';
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
  },
});
