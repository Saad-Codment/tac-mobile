import {StyleSheet, Platform} from 'react-native';
import {hp, isIOS, wp} from '../../Config/responsive';
import {Colors, FontSize, fontFamily} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    height: hp('100'),
    width: wp('100'),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'lightblue',
  },
  btnStyle: {
    marginBottom: Platform.OS == 'ios' ? hp('3') : hp('5'),
    width: wp('80'),
    textAlign: 'center',
    backgroundColor: Colors.backgroundTheme,
  },

  btnTextStyle: {
    color: Colors.white,
    fontSize: FontSize.scale18,
    textTransform: 'capitalize',
  },
  currentLocation: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    padding: 15,
    backgroundColor: Colors.primaryColor,
    right: 20,
    bottom: 100,
  },
  dropDown: {
    alignSelf: 'center',
    width: wp('8'),
    height: hp('3.5'),
  },

  ///
  inner: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: wp('3'),
    paddingVertical: hp('5'),
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  mainHeader: {
    height: 'auto',
    width: wp('100'),
  },
  Bgimage: {},
  userName: {
    color: Colors.white,
    fontSize: hp('2.8'),
    // fontFamily: fontFamily.bold,
    textAlign: 'left',
  },
  searchText: {
    color: Colors.white,
    fontSize: hp('2'),
    // fontFamily: fontFamily.medium,
    // marginTop: hp(''),
  },
  textContainer: {
    width: wp('60'),
  },
  iconStyle1: {
    resizeMode: 'contain',
    width: wp('6'),
  },
  iconStyle: {
    padding: 5,
    resizeMode: 'contain',
    width: wp('6'),
    marginLeft: wp('3'),
  },
  iconInner: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    width: wp('16'),
  },
  backHeaderContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: hp('2'),
  },
  backInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('95'),
    alignItems: 'center',
  },
  backContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },

  backBtn: {
    width: wp('15'),
    color: Colors.white,
    fontSize: FontSize.scale18,
    // fontFamily: fontFamily.medium,
  },
  centerText: {
    width: wp('44'),
    textAlign: 'center',
    color: Colors.white,
    fontSize: FontSize.scale24,
    // fontFamily: fontFamily.medium,
  },
  cancelText: {
    width: wp('23'),
    color: Colors.themeRed,
    fontSize: FontSize.scale18,
    // fontFamily: fontFamily.medium,
    textAlign: 'right',
  },

  autocompleteContainer: {
    color: Colors.themeRed,

    width: wp('90'),
    marginTop: hp('1'),
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  textInputContainer: {
    color: Colors.themeRed,

    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRadius: 10,
  },
  textInput: {
    color: Colors.themeRed,

    height: hp('5'),
    fontSize: FontSize.scale16,
    borderRadius: 10,
    marginTop: hp('0.5'),
    placeholderTextColor: 'blue', //
    color: Colors.primaryColor,
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  addressContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  address: {
    fontSize: FontSize.scale16,
  },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2'),
  },
});
