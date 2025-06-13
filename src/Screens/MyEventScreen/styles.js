import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';

export const styles = StyleSheet.create({
  innerView: {alignItems: 'center', marginTop: hp('2')},
  heading: {
    fontSize: hp('2'),
    fontWeight: 'bold',
    marginVertical: hp('2'),
    marginLeft: wp('4'),
  },
});
