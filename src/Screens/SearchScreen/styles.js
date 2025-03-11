import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';

export const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp('3'),
    paddingVertical: hp('1.5'),
    backgroundColor: 'white',
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp('4'),
    paddingVertical: hp('1'),
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  titleText: {fontWeight: 'bold', fontSize: hp('2.5')},
  upComingFlatlistView: {
    paddingBottom: hp('15'),
    flexGrow: 1,
    alignSelf: 'center',
    paddingTop: hp('2'),
    backgroundColor: 'transparent',
  },
});
