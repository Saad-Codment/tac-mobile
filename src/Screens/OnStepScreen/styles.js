import {Dimensions, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors, FontSize} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    resizeMode: 'contain',
    width: wp('100'),
    height: hp('40'),
  },
  stepCirclesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS == 'ios' ? hp('5') : 0,
  },
  circleContainer: {
    alignItems: 'center',
  },
  circle: {
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    width: wp('16.5'),
    height: hp('0.6'),
  },
  activeCircle: {
    backgroundColor: Colors.primaryColor,
  },
  circleText: {
    fontSize: hp('3'),
    fontWeight: '800',
    color: 'white',
  },
  activeLine: {
    backgroundColor: Colors.primaryColor,
  },
  nonActiveLine: {
    flex: 1,
    height: hp('.6'),
    backgroundColor: 'gray',
    position: 'absolute',
    left: 30,
    right: 20,
    top: 18,
    width: wp('10'),
    zIndex: 0,
  },

  horse: {
    resizeMode: 'contain',
    width: wp('8'),
    height: hp('8'),
    alignSelf: 'center',
    marginRight: wp('3'),
    marginTop: Platform.OS == 'ios' && hp('5'),
  },
  mainContent: {
    width: wp('100'),
    paddingHorizontal: wp('4'),
  },
  tagline: {
    color: Colors.black,
    paddingTop: hp('30'),
    // paddingHorizontal: wp('8'),
    textAlign: 'center',
    marginBottom: hp('3'),
    fontSize: FontSize.scale30,
    fontWeight: 700,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('100'),
    paddingHorizontal: wp('5'),
    position: 'absolute',
    bottom: 50,
  },
  pickerStyle: {
    width: wp('90'),
    height: hp('6.2'),
    alignItems: 'center',
    alignSelf: 'center',
    verticalAlign: 'middle',
    justifyContent: 'center',
    color: 'transparent',
  },
  pickerStyleIOS: {
    width: wp('80'),
    alignSelf: 'center',
  },
  content: {
    marginBottom: hp('2'),
  },
  gender: selectedGender => ({
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: selectedGender ? Colors.themeGreen : '#525252',
    borderRadius: 20,
    width: wp('92'),
    paddingHorizontal: wp('4'),
    paddingVertical: hp('2'),
    alignItems: 'center',
    marginBottom: hp('3.5'),
    backgroundColor: selectedGender ? Colors.themeGreen : 'transparent',
  }),
  genderTitle: selectedGender => ({
    fontSize: hp('2.2'),
    color: selectedGender ? 'white' : '#525252',
  }),
  catImage: selectedGender => ({
    width: wp('12'),
    height: hp('6'),
    resizeMode: 'contain',
    alignSelf: 'center',
    tintColor: selectedGender ? 'white' : null,
    marginRight: wp('6'),
  }),
  content: {
    marginBottom: hp('2'),
  },
});
