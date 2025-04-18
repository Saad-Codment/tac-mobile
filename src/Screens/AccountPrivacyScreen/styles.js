import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp('100'),
    paddingHorizontal: wp('2'),
    backgroundColor: Colors.lightYellowBgColor,
    paddingVertical: hp('2'),
  },
  fadeText: {
    fontSize: hp('1.8'),
    marginTop: hp('1'),
    paddingHorizontal: wp('2'),
  },
});
