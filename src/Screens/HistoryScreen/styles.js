import {Platform, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors, FontSize} from '../../Theme/Variables';

export const styles = StyleSheet.create({
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

    backgroundColor: Colors.white,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateView: {
    padding: 10,
    borderRadius: 10,
    width: wp('15'),
    backgroundColor: 'rgba(246, 246, 246, 1)',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  month: {
    fontSize: FontSize.scale14,
    color: Colors.backgroundTheme,
    fontWeight: 500,
  },
  day: {
    fontSize: FontSize.scale25,
    color: Colors.backgroundTheme,
    fontWeight: 700,
  },
  title: {
    fontSize: FontSize.scale20,
    color: Colors.backgroundTheme,
    fontWeight: 600,
  },
  des: {
    fontSize: FontSize.scale12,
    color: Colors.textGray,
    fontWeight: 400,
    marginTop: hp('0.5'),
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
});
