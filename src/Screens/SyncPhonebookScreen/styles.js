import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  upperView: {
    width: wp('100'),
    backgroundColor: 'rgba(245, 245, 245, 1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('2'),
    paddingHorizontal: wp('2'),
  },
  synView: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('60'),
    width: wp('90'),
    alignSelf: 'center',
  },
  synHeading: {
    fontWeight: 'bold',
    fontSize: hp('3'),
    marginVertical: hp('2'),
  },
  tabMain: {
    flex: 1,
  },
  tabBarIndicatorStyle: {
    backgroundColor: Colors.backgroundTheme,
    height: hp('0.5'),
  },
  upComingFlatlistView: {
    paddingBottom: hp('15'),
    flexGrow: 1,
    // paddingTop: hp('2'),
    alignItems: 'center',
    marginTop: hp('2'),
    // alignSelf: 'center',
  },
});
