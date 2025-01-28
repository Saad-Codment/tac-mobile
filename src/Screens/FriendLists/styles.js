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
  upComingFlatlistView: {
    paddingBottom: hp('15'),
    flexGrow: 1,
    alignSelf: 'center',
    paddingTop: hp('1'),
  },
});
