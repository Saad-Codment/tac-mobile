import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    resizeMode: 'contain',
    width: wp('100'),
    height: hp('40'),
  },
  des: {
    marginLeft: wp('5'),
    marginVertical: hp('2'),
    fontSize: hp('1.2'),
    color: 'gray',
  },

  logInMain: {
    paddingHorizontal: wp('3.5'),
    flex: 1,
  },
  backMain: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: hp('2.5'),
  },
  backBtn: {
    marginLeft: wp('3'),
    color: 'rgba(45, 45, 45, 0.5)',
  },
  heading: {
    fontSize: hp('4'),
    fontWeight: '600',
    color: 'red',
    textAlign: 'center',
    marginTop: hp('6'),
  },
  createAcc: {
    textAlign: 'center',
    marginTop: hp('1'),
    fontSize: hp('2.1'),
  },
  codeFieldRoot: {marginTop: hp('6'), width: wp('90'), alignSelf: 'center'},
  cell: {
    width: wp('10'),
    height: hp('5'),
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
    color: 'black',
  },
  focusCell: {
    borderColor: '#000',
    color: 'black',
  },
  verificationBtn: {
    // flexDirection: 'row',
    width: wp('90'),
    justifyContent: 'space-between',
    bottom: hp('2'),
    position: 'absolute',
    left: wp('5'),
    height: hp('12'),
  },
  otpSendView: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: wp('65'),
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: hp('2'),
  },
  OtpTextStyle: {
    fontSize: hp('1.5'),
    color: Colors.primaryColor,
    fontWeight: '500',
    letterSpacing: 0.25,
  },
});
