import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: 'white',
    width: wp('100'),
    marginBottom: hp('1'),
  },
  searchInputWrapper: {
    width: wp('95'),
    alignSelf: 'center',
    height: hp('4'),
    borderRadius: 10,
    marginVertical: hp('1'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3'),
    paddingVertical: hp('0.5'),
    backgroundColor: Colors.bgGray,
  },
  searchIcon: {
    width: wp('3'),
    height: hp('2'),
    tintColor: Colors.textGray,
  },
  searchInput: {
    flex: 1,
    marginLeft: wp('2'),
    color: 'black',
    fontSize: hp('1.3'),
  },
  innerView: {alignItems: 'center', marginTop: hp('0')},
  heading: {
    fontSize: hp('2'),
    fontWeight: 'bold',
    marginVertical: hp('2'),
    marginLeft: wp('4'),
  },
});
