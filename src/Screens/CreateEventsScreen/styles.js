import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  scrollView: {flexGrow: 1, paddingBottom: hp('15')},
  inputStyle: {flex: 1, color: 'black'},
  uploadImg: {
    width: wp('100'),
    height: hp('17.5'),
    paddingHorizontal: 0,
    marginLeft: wp('-5'),
    marginBottom: hp('2'),
  },
  viewFlex: {flexDirection: 'row'},
  textStyle: {fontSize: hp('1.5')},
  leftViewImg: {width: wp('7'), height: hp('5')},
  divider: {marginVertical: hp('1'), width: wp('85')},
  perInnerView: {flexDirection: 'row', justifyContent: 'space-between'},
  perInnerText: {
    fontSize: hp('1.5'),
    width: wp('40'),
    borderRadius: 10,
    borderWidth: 0.2,
    paddingVertical: hp('1'),
    textAlign: 'center',
  },
  perInnerOuterView: {
    height: 'auto',
    paddingVertical: hp('1'),
  },
  addMoreView: {
    width: wp('40'),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addMoreImg: {width: wp('5'), height: hp('3')},
  addMoreTxt: {fontSize: hp('1.5'), marginLeft: wp('2')},
  createBtnStyle: {width: wp('90'), alignSelf: 'center', borderRadius: 30},

  // Component View

  mainView: {
    backgroundColor: 'white',
    paddingHorizontal: hp('2.3'),
    marginBottom: hp('1'),
  },
  compTitle: {
    fontSize: hp('1.5'),
    marginVertical: hp('1'),
  },
  innerView: {
    width: wp('90'),
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.dkBorderColor,
    backgroundColor: Colors.lightInnerColor,
    height: hp('5'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('2'),
    marginBottom: hp('2'),
  },
});
