import {Dimensions, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  // appHeadingView: {
  //   flexDirection: 'row',
  //   width: wp('55'),
  //   justifyContent: 'space-between',
  // },
  // redColorText: {color: Colors.red, fontSize: hp('4'), fontWeight: 'bold'},
  // dotList: {
  //   flexDirection: 'row',
  //   width: wp('18'),
  //   height: hp('3'),
  //   justifyContent: 'space-between',

  //   // marginTop: hp('/2'),
  // },
  // getStart: {
  //   width: wp('15'),
  //   // justifyContent: 'center',
  //   // alignItems: 'center',
  //   // height: hp('6.5'),
  //   // borderRadius: 60,
  //   // marginTop: hp('3'),
  //   // marginBottom: hp('5'),
  //   alignSelf: 'center',
  //   borderWidth: 0,
  //   backgroundColor: 'transparent',
  // },
  // centerMainView: {
  //   width: wp('100'),
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   alignSelf: 'center',
  //   textAlign: 'center',
  // },
  // centerHeading: {
  //   fontSize: hp('4'),
  //   fontWeight: '600',
  //   color: 'red',
  //   textAlign: 'center',
  //   marginTop: hp('58.5'),
  //   paddingHorizontal: wp('13'),
  // },
  // descStyle: {
  //   textAlign: 'center',
  //   marginTop: hp('1'),
  //   fontSize: hp('2.1'),
  //   paddingHorizontal: wp('16'),
  //   marginTop: hp('2'),
  //   marginBottom: hp('5'),
  // },
  // centerDes: {
  //   fontSize: hp('2'),
  //   color: Colors.gray,
  //   width: wp('93'),
  //   textAlign: 'center',
  // },
  // dot: (currentIndex, index) => ({
  //   borderRadius: Math.round(
  //     Dimensions.get('window').width + Dimensions.get('window').height,
  //   ),
  //   height: Dimensions.get('window').width * 0.03,
  //   width:
  //     currentIndex == index
  //       ? Dimensions.get('window').width * 0.06
  //       : Dimensions.get('window').width * 0.03,
  //   backgroundColor: currentIndex == index ? '#212759' : Colors.white,
  //   borderWidth: currentIndex == index ? 0 : 1,
  // }),
  // bannerImg: {
  //   height: hp('100'),
  //   width: wp('100'),
  //   // backgroundColor: 'red',
  // },
  // arrStyle: {
  //   width: wp('100'),
  //   height: hp('6'),
  // },

  // ----
  dotList: {
    flexDirection: 'row',
    width: wp('25'),
    // height: hp('15'),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'flex-start',
    // marginTop: hp('0'),
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingRight: wp('3'),
    marginHorizontal: wp('4'),
    position: 'absolute',
    bottom: hp('3'),
    zIndex: 2,
  },
  centerMainView: {
    width: wp('100'),
    alignItems: 'center',
    paddingHorizontal: wp('4'),
    marginTop: hp('0'),
  },
  centerHeading: {
    fontSize: hp('4.4'),
    paddingHorizontal: wp('4'),
    width: wp('100'),
    textAlign: 'center',
    color: Colors.white,
    fontWeight: '700',
  },
  centerText: {
    fontSize: hp('2.2'),
    // fontFamily: fontFamily.regular,
    paddingHorizontal: wp('5'),
    width: wp('100'),
    textAlign: 'center',
    color: Colors.white,
    lineHeight: hp('4'),
  },
  dot: (currentIndex, index) => ({
    borderRadius: Math.round(
      Dimensions.get('window').width + Dimensions.get('window').height,
    ),
    height: Dimensions.get('window').width * 0.016,
    width:
      currentIndex == index
        ? Dimensions.get('window').width * 0.09
        : Dimensions.get('window').width * 0.04,
    backgroundColor: currentIndex == index ? Colors.themeOrg : 'transparent',
    borderWidth: currentIndex == index ? 1 : 1,
    borderColor: currentIndex == index ? Colors.themeOrg : Colors.white,
  }),
  bannerImg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    // height: hp('95'),
    width: wp('100'),
    // aspectRatio: 1,
    paddingBottom: hp('20')
  },
  btnArrow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp('25'),
    backgroundColor: Colors.themeOrg,
    borderRadius: 25,
    paddingHorizontal: wp('4'),
  },
  arrowText: {
    // fontFamily: fontFamily.medium,
    fontSize: hp('1.8'),
    paddingRight: wp('1'),
    color: Colors.white,
    lineHeight: 16,
  },
  hdStyle: {
    fontSize: hp('3.5'),
    fontWeight: '700',
    marginVertical: hp('2'),
    color: Colors.white,
    textAlign: 'center'
  },
  descStyle: {
    textAlign: 'center',
    fontSize: hp('1.8'),
    lineHeight: 20,
    paddingHorizontal: wp('4'),
    color: Colors.white
  },
  splashImg: {
    width: wp('60'),
    height: hp('30'),
    marginBottom: hp('1'),
  },
});
