import {Dimensions, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors, FontSize} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchComponent: {
    marginTop: hp('-10'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: Colors.white,
    height: hp('7.5'),
    width: wp('100'),
    paddingHorizontal: wp('2'),
  },
  upperBtn: {
    width: wp('80'),
    borderRadius: 30,
    height: hp('6'),
    borderWidth: 0.5,
    borderColor: Colors.grayBorder,
  },
  imgStyle: {marginRight: wp('0.2'), width: wp('7')},
  searchStyle: {
    resizeMode: 'contain',
    width: wp('4'),
    marginRight: wp('1'),
  },
  searchsetting: {
    resizeMode: 'contain',
    width: wp('8'),
    height: hp('5'),
  },
  textInputContainer: {
    alignItems: 'flex-start',
    width: wp('70'),
    justifyContent: 'center',
    height: hp('7'),
  },
  textStyle: {
    color: Colors.primaryColor,
    fontSize: FontSize.scale15,
    paddingHorizontal: wp('25'),
    textAlign: 'center',
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  searchTextStyle: {
    fontSize: FontSize.scale15,
    fontWeight: '500',
    color: Colors.textGray,
    alignSelf: 'flex-start',
    height: hp('5'),
    width: wp('64'),
  },
  upcoming: {
    fontSize: FontSize.scale16,
    fontWeight: '600',
    color: Colors.white,
  },
  viewall: {
    fontSize: FontSize.scale12,
    fontWeight: '400',
  },
  upcoming: {
    fontSize: FontSize.scale16,
    fontWeight: '600',
  },
  viewall: {
    fontSize: FontSize.scale12,
    fontWeight: '400',
  },
  upcomingHeader: {
    borderRadius: 10,
    backgroundColor: 'red',
  },
  card: {
    borderRadius: 10,
    padding: 15,
    margin: 10,
    width: wp('80%'),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },

  icon: {
    width: wp('5'),
    height: hp('4'),
    marginRight: 5,
    resizeMode: 'contain',
  },
  lock: {
    position: 'absolute',
    right: wp('1'),
    top: hp('1'),
    width: wp('10'),
    height: hp('5'),
    marginRight: 5,
    resizeMode: 'contain',
  },
  userName: {
    fontSize: FontSize.scale14,
    fontWeight: '400',
    color: Colors.textGray,
  },

  eventTitle: {
    fontSize: FontSize.scale20,
    fontWeight: '600',
    color: Colors.black,
    alignSelf: 'center',
    width: wp('55'),
  },
  eventCategory: {
    fontSize: FontSize.scale14,
    fontWeight: '400',
    color: Colors.primaryColor,
    alignSelf: 'center',
    width: wp('45'),
  },
  eventDetails: {
    marginBottom: 10,
  },
  eventDate: {
    fontSize: FontSize.scale14,
    color: Colors.textGray,
  },
  eventTime: {
    fontSize: FontSize.scale14,
    color: Colors.textGray,
  },
  eventLocation: {
    fontSize: FontSize.scale14,
    color: Colors.textGray,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    alignItems: 'center',
  },

  likes: {
    fontSize: FontSize.scale14,
    color: Colors.textGray,
  },
  association: {
    fontSize: FontSize.scale14,
    color: Colors.textGray,
  },
  circuits: {
    fontSize: FontSize.scale14,
    color: Colors.textGray,
    marginLeft: wp('-10'),
  },
  dot: {
    borderRadius: 50,
    width: wp('1.2'),
    height: hp('0.6'),
    backgroundColor: Colors.textGray,
    marginLeft: wp('-10'),
  },
  mutual: {
    fontSize: FontSize.scale12,
    fontWeight: '400',
    color: Colors.black,
    alignSelf: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    marginTop: hp('2'),
    paddingBottom: hp('30'),
  },
  innerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'center',
  },
});
