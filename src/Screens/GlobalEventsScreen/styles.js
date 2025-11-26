import {Platform, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  upComingFlatlistView: {
    paddingBottom: hp('10'),
    // flexGrow: 1,
    // backgroundColor: 'red',
    // paddingTop: hp('2'),
    // alignItems: 'center',
    // alignSelf: 'center',
  },
  searchContainer: {
    backgroundColor: 'white',
    width: wp('100'),
    // marginBottom: hp('1'),
  },
  searchInputWrapper: {
    width: wp('95'),
    alignSelf: 'center',
    height: Platform.OS == 'ios' ? hp('4') : 'auto',
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
});
