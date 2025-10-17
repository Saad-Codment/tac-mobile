import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: 'white',
    width: wp('100'),
    marginBottom: hp('1'),
  },
  searchInputWrapper: {
    width: wp('95'),
    alignSelf: 'center',
    height: hp('5'),
    borderRadius: 10,
    marginVertical: hp('1'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3'),
    paddingVertical: hp('0.5'),
    backgroundColor: Colors.bgGray,
  },
  searchIcon: {
    width: wp('5'),
    height: hp('2'),
    tintColor: Colors.textGray,
  },
  searchInput: {
    flex: 1,
    marginLeft: wp('2'),
    color: 'black',
  },
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp('3'),
    paddingVertical: hp('1.5'),
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: hp('1'),
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp('4'),
    paddingVertical: hp('1'),
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  titleText: {
    fontWeight: '600',
    fontSize: hp('1.3'),
  },
  seeAllText: {
    marginRight: wp('2'),
    fontSize: hp('1.2'),
  },
  upComingFlatlistView: {
    // paddingBottom: hp('15'),
    flexGrow: 1,
    alignSelf: 'center',
    paddingTop: hp('1'),
    backgroundColor: 'transparent',
  },
  dataNotFoundContainer: {
    flex: 1,
    paddingTop: hp('10'),
    width: wp('100'),
  },
  dataNotFoundBtn: {
    width: wp('85'),
  },
  dataNotFoundImg: {
    width: wp('30'),
  },
  friendCompContainer: {
    width: wp('95'),
  },
});
