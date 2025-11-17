import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  performanceCard: {
    backgroundColor: 'white',
    width: wp('100'),
    paddingHorizontal: wp('2'),
    paddingVertical: hp('1'),
    marginBottom: hp('1'),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1'),
    paddingTop: hp('0.5'),
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('1'),
  },
  calendarIcon: {
    width: wp('3'),
    height: hp('2'),
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('1'),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    width: wp('4'),
    height: hp('2'),
    marginRight: wp('1'),
  },
  timeText: {
    fontSize: hp('1.2'),
  },
});
