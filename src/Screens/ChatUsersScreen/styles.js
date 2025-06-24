import {Platform, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';

export const styles = StyleSheet.create({
  backRightBtnRight: {
    backgroundColor: '#EA4335',
    // flexGrow: 1,
    height: Platform.OS == 'ios' ? hp('8.9') : hp('9.9'),
    // borderTopRightRadius: 15,
    // borderBottomRightRadius: 15,
    alignItems: 'flex-end',
    // paddingTop: hp('2'),
    paddingRight: wp('3'),
    borderRadius: 15,
    marginVertical: hp('0.5'),
    // marginHorizontal: wp('3.5'),
    justifyContent: 'center',
  },
  trashIcon: {
    width: wp('4'),
    height: hp('4'),
  },
  listMain: {
    flex: 1,
    alignSelf: 'center',
  },
});
