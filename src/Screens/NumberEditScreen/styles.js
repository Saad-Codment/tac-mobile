import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';

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
  fieldView: {
    marginLeft: wp('5'),
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    width: wp('90'),
    borderWidth: 0.5,
    height: hp('6'),
  },
  numberView: {
    width: wp('89'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('2'),
    paddingHorizontal: wp('2'),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    alignSelf: 'center',
    marginTop: hp('5'),
  },
  btnView: {
    width: wp('90'),
    justifyContent: 'space-between',
    bottom: hp('5'),
    position: 'absolute',
    left: wp('5'),
    height: hp('12'),
  },
});
