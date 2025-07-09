import {Platform, StyleSheet} from 'react-native';
import {hp, isIos, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  scrollView: {flexGrow: 1, paddingBottom: hp('15')},
  inputStyle: {flex: 1, color: 'black', fontSize: hp('1.2')},
  uploadImg: {
    width: wp('90'),
    height: hp('14'),
    paddingHorizontal: 0,
    // marginLeft: wp('-5'),
    marginBottom: hp('2'),
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.dkBorderColor,
  },
  viewFlex: {flexDirection: 'row'},
  textStyle: {fontSize: hp('1.2')},
  textTouchBtn: {
    height: hp('3'),
    marginTop: hp('1.5'),
    // backgroundColor: 'blue',
    width: wp('30'),
  },
  leftViewImg: {width: wp('5'), height: hp('3')},
  divider: {
    marginVertical: isIos ? hp('1') : hp('0'),
    width: wp('85'),
    marginBottom: isIos ? hp('1') : hp('2'),
  },
  perInnerView: {flexDirection: 'row', justifyContent: 'space-between'},
  perInnerText: {
    fontSize: hp('1.5'),
    width: wp('40'),
    borderRadius: Platform.OS == 'ios' ? 10 : 4,
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
  createBtnStyle: {
    width: wp('85'),
    alignSelf: 'center',
    borderRadius: 10,
    height: hp('4.5'),
  },

  perInnerViewExtra: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    height: 'auto',
    borderWidth: 0,
  },
  perMapView: {
    backgroundColor: Colors.lightInnerColor,
    marginVertical: hp('1'),
    padding: 12,
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: Colors.dkBorderColor,
  },

  // Component View

  mainView: {
    backgroundColor: 'white',
    paddingHorizontal: hp('2.3'),
    marginBottom: hp('1'),
  },
  compTitle: {
    fontSize: hp('1.2'),
    marginVertical: hp('1'),
  },
  innerView: {
    width: wp('90'),
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.dkBorderColor,
    backgroundColor: Colors.lightInnerColor,
    height: hp('4'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('2'),
    marginBottom: hp('1'),
  },
  errorText: {
    fontSize: hp('1.2'),
    color: 'red',
    marginLeft: wp('1'),
    marginBottom: hp('1'),
  },
});
