import {Dimensions, Platform, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors, FontSize} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: Colors.backgroundTheme,
    paddingBottom: hp('1'),

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
    backgroundColor: Colors.headerBg,

    paddingHorizontal: wp('4'),
    paddingVertical: hp('1'),
    height: hp('40'),
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
    width: wp('2'),
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
  plan: {
    fontSize: FontSize.scale16,
    fontWeight: '600',
    color: Colors.black,
    marginLeft: wp('4'),
    marginTop: hp('4'),
  },
  upperWhiteView: {
    backgroundColor: 'white',
    width: wp('90'),
    height: hp('63.5'),
    borderRadius: 20,
    marginTop: hp('10'),
    paddingTop: hp('10'),
    alignItems: 'center',
  },
  imgView: {
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
    top: hp('-9'),
  },
});
