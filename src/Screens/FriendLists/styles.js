import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors, FontSize} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    zIndex: 1, // Make sure header has a lower zIndex than the image
    backgroundColor: Colors.backgroundTheme,
    paddingBottom: hp('3'),
    paddingTop: Platform.OS == 'ios' ? hp('9') : hp('5'),
  },
  view: {
    borderRadius: 10,
    padding: 5,
    backgroundColor: Colors.white,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blurImage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('12'),
    height: Platform.OS == 'ios' ? hp('6') : hp('6.5'),
    borderRadius: 10,
    backgroundColor: 'red',
  },
  circle: {
    resizeMode: 'cover',
    width: wp('15'),
    height: hp('10'),
    // overflow: 'hidden',
  },
  title: {
    fontSize: FontSize.scale18,
    color: Colors.backgroundTheme,
    fontWeight: 600,
    marginLeft: wp('1'),
    marginTop: hp('0.5'),
  },
  des: {
    fontSize: FontSize.scale14,
    color: Colors.textGray,
    fontWeight: 400,
  },
  detbtn: {
    fontSize: FontSize.scale14,
    color: Colors.primaryColor,
    fontWeight: 500,
  },
  r8: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introImage: {
    aspectRatio: 3 / 2,
    width: wp('4'),
    tintColor: Colors.primaryColor,
  },
  chatView: {
    backgroundColor: Colors.primaryColor,
    padding: 10,
    flexDirection: 'row',
    borderRadius: 10,
  },
  chat: {
    resizeMode: 'contain',
    height: hp('2'),
    width: wp('5'),
  },
  chatTxt: {
    fontSize: FontSize.scale16,
    color: Colors.white,
    fontWeight: 500,
  },
});
