import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';

export const styles = StyleSheet.create({
  modalHeading: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: hp('1.8'),
    marginTop: hp('5'),
  },
  innerHeading: {
    fontWeight: 'bold',
    marginVertical: hp('3'),
    fontSize: hp('1.5'),
  },
  leftViewImg: {
    width: wp('5'),
    height: hp('3'),
  },
  reportMessStyle: {
    fontSize: hp('1.2'),
    marginLeft: wp('2'),
    maxWidth: wp('80'),
  },
  inputView: {
    width: wp('87'),
    alignSelf: 'center',
    height: hp('10'),
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'black',
    paddingVertical: hp('0.5'),
    paddingHorizontal: wp('1'),
    justifyContent: 'flex-start',
    marginTop: hp('2'),
  },
  buttonRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: wp('87'),
    justifyContent: 'space-between',
    marginTop: hp('2'),
  },
  button: {
    width: wp('40'),
    height: hp('4'),
  },
  buttonText: {
    fontSize: hp('1.2'),
  },
});
