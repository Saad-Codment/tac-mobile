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
  bottomView: {
    paddingTop: hp('1.5'),
    paddingBottom: hp('1'),
    height: hp('15'),
    marginTop: hp('2'),
  },
  //  Modal Style

  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalData: {
    // height: tripType ? hp('40') : hp('30'),
    backgroundColor: Colors.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 10,
    },
    shadowOpacity: 3,
    shadowRadius: 7.68,
    elevation: 20,
    width: wp('100'),
    paddingHorizontal: wp('5'),
    maxHeight: hp('90'),
    height: 'auto',
    alignSelf: 'center',
    marginBottom: hp('-2.5'),
    // height: hp('40'),
  },
  upperIconView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  divider: {width: wp('15'), height: hp('5'), left: wp('40'), top: hp('1')},
  cancelIcon: {
    alignSelf: 'flex-end',
    tintColor: 'black',
    width: wp('5'),
    height: hp('4'),
  },
  headingText: {
    fontWeight: 'bold',
    fontSize: hp('2'),
    textAlign: 'center',
    marginBottom: hp('2'),
  },
  addIcon: {
    position: 'absolute',
    right: wp('12'),
    height: hp('6'),
    top: hp('12'),
  },
  whiteCircle: {
    // height: hp('22'),
    // width: wp('32'),
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('90'),
    marginTop: hp('10'),
  },
  modalScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wp('90'),
  },
  inputView: {
    width: wp('90'),
    height: hp('6'),
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: Colors.dkBorderColor,
    paddingHorizontal: wp('3'),
    marginBottom: hp('5'),
  },
  ageViewModal: {
    width: wp('90'),
    marginBottom: hp('20'),
    marginTop: hp('3'),
  },
  modalBtn: {
    width: wp('93'),
    alignSelf: 'center',
    marginTop: hp('2'),
    marginBottom: hp('2'),
  },
});
