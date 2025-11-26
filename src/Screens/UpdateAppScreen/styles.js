import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  mealInner: {
    // marginTop: hp('-10'),
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: wp('4'),
    alignItems: 'center',
  },
  noDataImage: {
    width: wp('35'),
    height: hp('12.5'),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: hp('2'),
  },
  noDataTitle: {
    fontSize: hp('2'),
    textAlign: 'center',
    fontWeight: 600,
    color: Colors.primaryColor,
  },
  noDataSubTitle: {
    fontSize: hp('1.5'),
    textAlign: 'center',
    color: Colors.textGray,
    marginBottom: hp('6'),
    marginTop: hp('1'),
  },
  btnStyles: {
    width: wp('50'),
    height: hp('5'),
  },
});
