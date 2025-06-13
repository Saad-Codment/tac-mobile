import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('100'),
    alignSelf: 'center',
    paddingVertical: hp('2'),
    backgroundColor: 'white',
    paddingHorizontal: wp('4'),
  },
  statItem: {
    paddingHorizontal: wp('2'),
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.grayBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    width: wp('3'),
    height: hp('2.5'),
  },
  statTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: wp('2'),
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: hp('1.2'),
  },
  statLabel: {
    fontSize: hp('1.2'),
  },
  upComingFlatlistView: {
    paddingBottom: hp('15'),
    flexGrow: 1,
    // paddingTop: hp('2'),
    alignItems: 'center',
    // paddingTop: hp('1'),
    // backgroundColor: '#fff',

    // alignSelf: 'center',
  },
  modalHeading: {alignSelf: 'center', fontWeight: 'bold'},
  innerHeading: {fontWeight: 'bold', marginVertical: hp('5')},
  viewFlex: {flexDirection: 'row'},
  textStyle: {fontSize: hp('1.5')},
  leftViewImg: {width: wp('7'), height: hp('5')},
  reportMessStyle: {
    fontSize: hp('1.5'),
    marginLeft: wp('2'),
    maxWidth: wp('80'),
  },
  iconMainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  iconContainer: {
    alignSelf: 'center',
  },
  icon: {
    width: wp('30 '),
    height: hp('20'),
    resizeMode: 'contain',
  },
  title: {
    fontSize: hp('3.2'),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  description: {
    fontSize: hp('1.2'),
    color: '#666',
    textAlign: 'center',
  },
});
