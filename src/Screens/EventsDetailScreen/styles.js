import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  mainView: {flexGrow: 1, backgroundColor: 'white'},
  scrollView: {flexGrow: 1, paddingBottom: hp('20')},

  // Carousel
  carouselContainer: {
    // marginVertical: hp('1'),
    marginBottom: hp('1'),
    // justifyContent: 'center',
    alignItems: 'center',
    // marginTop: hp('-1'),
    // backgroundColor: 'red',
  },
  imgScrollView: {
    width: wp('95'),
  },
  slide: {
    width: wp('95'),
    height: hp('25'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: wp('95'),
    height: hp('25'),
    alignSelf: 'center',
    borderRadius: 15,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('1'),
  },
  dot: {
    width: wp('2'),
    height: wp('2'),
    borderRadius: wp('1'),
    backgroundColor: '#ccc',
    marginHorizontal: wp('0.5'),
  },
  activeDot: {
    backgroundColor: '#000',
  },

  systemView: {
    width: wp('95'),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1'),
    justifyContent: 'space-between',
  },
  tacImg: {marginRight: wp('2')},

  followView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  checkImg: {
    width: wp('6'),
    height: hp('3'),
    marginRight: wp('1'),
  },
  addedMoneyText: {
    textAlign: 'right',
  },

  titleStyle: {
    fontWeight: 'bold',
    marginLeft: wp('3'),
    fontSize: hp('1.8'),
  },

  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2'),
  },

  // Status badges row
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2'),
    marginTop: hp('1'),
    justifyContent: 'space-between',
  },
  statusLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('65'),
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: wp('2'),
  },
  statusIcon: {
    width: wp('5'),
    height: hp('4'),
    marginRight: wp('1'),
  },
  viewPerformances: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrRightIcon: {
    width: wp('5'),
    height: hp('3'),
    marginRight: wp('1'),
  },

  dividerFullWidth: {
    width: wp('95'),
    marginVertical: hp('0.5'),
    alignSelf: 'center',
  },

  eventTimeViewGray: {
    paddingVertical: hp('0.5'),
    paddingHorizontal: wp('3'),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionSmallTitle: {
    fontSize: hp('1.2'),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventCallImg: {
    width: wp('5'),
    height: hp('4'),
    marginRight: wp('1'),
  },
  timeIconMarginLeft: {
    marginLeft: wp('4'),
  },
  timeText: {
    fontSize: hp('1.2'),
  },

  locationTitle: {
    fontSize: hp('1.2'),
    marginLeft: wp('2'),
    marginTop: hp('1'),
  },

  locationView: {
    flexDirection: 'row',
    width: wp('95'),
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginVertical: hp('2'),
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationImg: {
    width: wp('3.5'),
    height: hp('2'),
    marginRight: wp('2'),
  },
  addressText: {
    width: wp('60'),
    fontSize: hp('1.2'),
  },
  viewLocationLink: {
    color: Colors.lightBlueTextColor,
    fontSize: hp('1.2'),
  },

  // Categories section
  arryMainView: {
    width: wp('98'),
    marginHorizontal: wp('3'),
    marginVertical: hp('1.5'),
  },
  sectionTitle: {
    fontSize: hp('1.2'),
  },
  multiMainView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp('0.5'),
  },
  selectedValStyle: {
    paddingHorizontal: wp('2.5'),
    overflow: 'hidden',
    height: 'auto',
    paddingVertical: hp('0.5'),
    borderWidth: 1,
    borderColor: Colors.thridColor,
  },
  multiSelectText: {
    fontSize: hp('1.2'),
    color: 'black',
  },
  notSelectedText: {
    fontSize: hp('1.2'),
  },
  dividerSection: {
    width: wp('95'),
    marginVertical: hp('1'),
  },

  // Bottom button
  btnStyle: {
    marginTop: hp('4'),
    width: wp('85'),
    alignSelf: 'center',
    borderRadius: 30,
    height: hp('5'),
    // backgroundColor: 'transparent',
  },
  btnText: {
    fontSize: hp('1.5'),
    // color: Colors.primaryColor,
  },
  btnCalendarIcon: {
    tintColor: 'white',
    width: wp('5'),
  },

  // Old styles kept for compatibility (you can remove unused ones later)
  container: {marginVertical: hp('1'), marginBottom: hp('2')},
  imgStyle: {width: wp('95'), height: hp('20'), borderRadius: 20},
  systemUserName: {
    fontSize: hp('1.5'),
    width: wp('61'),
    marginLeft: wp('-5'),
  },

  // ══════════ NEW — Active Trips section ══════════
  activeTripsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp('95'),
    alignSelf: 'center',
    paddingVertical: hp('1'),
  },
  activeTripsTitle: {
    fontSize: hp('1.4'),
    fontWeight: '600',
    color: Colors.primaryColor,
  },
  tripPreviewScroll: {
    marginBottom: hp('1'),
  },
  tripPreviewScrollContent: {
    paddingHorizontal: wp('2.5'),
    gap: wp('3'),
  },
  tripPreviewCard: {
    width: wp('55'),
    borderWidth: 1,
    borderColor: Colors.thridColor,
    borderRadius: 12,
    padding: wp('3'),
  },
  tripPreviewCardTitle: {
    fontSize: hp('1.35'),
    fontWeight: '700',
    color: 'black',
  },
  tripPreviewCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5'),
  },
  tripPreviewCardIcon: {
    width: wp('3'),
    height: hp('1.6'),
    marginRight: wp('1.5'),
  },
  tripPreviewCardAddress: {
    fontSize: hp('1.1'),
    flex: 1,
  },
  tripPreviewCardCapacity: {
    fontSize: hp('1.1'),
    marginTop: hp('0.6'),
    color: '#166534',
    fontWeight: '600',
  },
});
