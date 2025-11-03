import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    paddingTop: hp('1'),
    paddingLeft: wp('3'),
    width: wp('100'),
    backgroundColor: 'white',
  },
  backIcon: {
    width: wp('6'),
    height: hp('4'),
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollViewContent: {
    // flexGrow: 1,
    // flex: 1,
    paddingBottom: hp('3'), // nice spacing
  },
  sectionContainer: {
    backgroundColor: 'white',
    paddingHorizontal: wp('3'),
    paddingBottom: hp('2'),
  },
  sectionTitle: {
    marginTop: hp('1'),
  },
  locationContainer: {
    width: wp('93'),
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.grayFaded,
    paddingVertical: hp('1.5'),
    marginTop: hp('2'),
    paddingHorizontal: wp('3'),
  },
  searchTouchable: {
    flexDirection: 'row',
    alignItem: 'center',
    // marginBottom: hp('1'),
  },
  searchIcon: {
    width: wp('4'),
    height: hp('2'),
    marginRight: wp('1'),
  },
  multiSelectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: hp('0.5'),
  },
  multiSelectText: {
    color: Colors.textGray,
    fontSize: hp('1.5'),
  },
  multiSelectButton: {
    borderColor: Colors.dkBorderColor,
    backgroundColor: Colors.bgGray,
    paddingVertical: hp('0.8'),
    paddingHorizontal: wp('1.8'),
    borderRadius: 7,
    height: 'auto',
  },
  priceSection: {
    backgroundColor: 'white',
    paddingHorizontal: wp('3'),
    paddingBottom: hp('2'),
    // marginVertical: hp('1'),
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1'),
    justifyContent: 'space-between',
  },
  priceBox: {
    width: wp('45'),
    paddingVertical: hp('1.5'),
    backgroundColor: Colors.bgGray,
    borderRadius: 10,
    paddingLeft: wp('2'),
  },
  priceLabel: {
    marginBottom: hp('0.5'),
  },
  friendsSection: {
    backgroundColor: 'white',
    paddingHorizontal: wp('3'),
    paddingVertical: hp('2'),
    marginBottom: hp('1'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radioIcon: {
    width: wp('6'),
    height: hp('3'),
  },
  eventTypeSection: {
    backgroundColor: 'white',
    paddingHorizontal: wp('3'),
    paddingVertical: hp('1'),
    // marginBottom: hp('1'),
  },
  eventTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // comp style
  allergiesBtns: {
    // backgroundColor: 'rgba(255, 255, 255, 0.3)',
    height: hp('3'),
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: wp('2'),
    marginHorizontal: wp('1'),
    marginVertical: hp('.5'),
    borderWidth: 0.5,
  },
  textStyle: {
    fontSize: hp('1.2'),
    textAlign: 'center',
    borderRadius: 15,
    borderWidth: 1,
    paddingVertical: hp('1.5'),
    backgroundColor: Colors.backgroundTheme,
    overflow: 'hidden',
    color: 'white',
  },
  btnView: {
    paddingTop: hp('5'),
    backgroundColor: 'white',
    // paddingBottom: hp('30'),
    flexGrow: 1,
  },
  btnStyle: {
    height: hp('5'),
    width: wp('90'),
    alignSelf: 'center',
  },
});
