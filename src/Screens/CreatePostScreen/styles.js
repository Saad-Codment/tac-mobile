import {StyleSheet} from 'react-native';
import {wp} from '../../Config/responsive';

export const styles = StyleSheet.create({
  userView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('2'),
  },
  userName: {marginLeft: wp('2'), fontWeight: 'bold'},
});
