import {Dimensions, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: wp('4'),
    marginTop: hp('2'),
  },
  title: {
    fontSize: hp('2.5'),
    fontWeight: '700',
    color: Colors.primaryColor,
  },
  subTitle: {
    marginBottom: hp('3'),
    marginTop: hp('1'),
    fontSize: hp('1.5'),
  },
  headerMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2'),
    marginBottom: hp('5'),
  },
  arrBack: {
    resizeMode: 'contain',
    width: wp('6'),
    height: hp('3'),
  },
  saveText: {
    fontSize: hp('1.5'),
  },
  lockstyle: {
    flex: 0.3,
  },
  inputMain: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    paddingHorizontal: wp('4'),
    // paddingVertical: hp('1'),
    marginVertical: hp('1.5'),
    borderRadius: 15,
    // shadowColor: 'rgba(0, 0, 0, 1)',
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.32,
    // shadowRadius: 5.46,
    borderColor: Colors.black,
    elevation: 9,
    height: hp('5'),
  },
  passText: {
    fontSize: hp('1.5'),
    fontWeight: '600',
    color: Colors.black,
    marginTop: hp('5'),

    marginBottom: hp('.5'),
  },
  saveBtn: {
    marginTop: hp('5'),
    marginBottom: hp('2'),
    height: hp('5'),
  },
});
