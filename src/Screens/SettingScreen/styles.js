import {Dimensions, Platform, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: Colors.primaryColor,
    paddingBottom: hp('12'),
    borderBottomRightRadius: 35,
    borderBottomLeftRadius: 35,
    paddingTop: Platform.OS == 'ios' ? hp('5') : 0,
  },
  topHd: {
    fontSize: hp('2.3'),
    fontWeight: 500,
    color: Colors.white,
    textAlign: 'center',
    paddingVertical: hp('2'),
  },
  ProfileImage: {
    // aspectRatio: 2,
    alignSelf: 'center',
    position: 'relative',
    // resizeMode: 'contain',
    borderRadius: Math.round(
      Dimensions.get('window').width + Dimensions.get('window').height,
    ),
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').width * 0.3,
  },
  blurMain: {
    marginTop: hp('-10'),
    overflow: 'hidden',
    borderRadius: Math.round(
      Dimensions.get('window').width + Dimensions.get('window').height,
    ),
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').width * 0.3,
    alignSelf: 'center',
  },
  name: {
    fontSize: hp('2.5'),
    fontWeight: 600,
    color: Colors.primaryColor,
    textAlign: 'center',
    marginTop: hp('1'),
  },
  email: {
    fontSize: hp('1.8'),
    fontWeight: 400,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: hp('2'),
  },
  mainBtn: {
    backgroundColor: '#fcf8e9',
    marginHorizontal: wp('4'),
    paddingHorizontal: wp('4'),
    paddingVertical: hp('1'),
    marginVertical: hp('1.5'),
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  listBtn: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  listInner: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderColor: Colors.lightBorder,
    paddingVertical: hp('2'),
  },
  iconGreen: {
    resizeMode: 'contain',
    width: wp('7'),
    height: hp('3'),
    marginRight: wp('2'),
  },
  arrowRight: {
    width: wp('5'),
    resizeMode: 'contain',
    height: hp('2.4'),
  },
  title: {
    fontSize: hp('1.8'),
    fontWeight: 400,
    color: Colors.black,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  bottomSpace: {
    marginBottom: hp('3'),
  },
});
