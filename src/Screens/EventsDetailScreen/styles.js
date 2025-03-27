import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  mainView: {flexGrow: 1, backgroundColor: 'white'},
  scrollView: {flexGrow: 1, paddingBottom: hp('20')},
  imgStyle: {
    width: wp('95'),
    height: hp('20'),
    alignSelf: 'center',
    marginTop: hp('1'),
    borderRadius: 15,
    // overflow: 'hidden',
  },
  systemView: {
    width: wp('95'),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1'),
  },
  tacImg: {width: wp('10'), marginRight: wp('2')},
  followView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // width: wp('50'),
  },
  checkImg: {
    width: wp('8'),
    height: hp('3'),
    // marginRight: wp('-2'),
  },
  titleStyle: {
    fontWeight: 'bold',
    marginLeft: wp('3'),
    fontSize: hp('2.5'),
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('3'),
    marginTop: hp('2'),
  },
  eventTypeView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('3'),
    paddingVertical: hp('1.5'),
    backgroundColor: Colors.lightInnerColor,
    marginVertical: hp('2'),
  },
  typeHeading: {fontWeight: 'bold', fontSize: hp('1.5')},
  typeStyle: {fontSize: hp('1.5')},
  multiViewStyle: {
    width: wp('98'),
    backgroundColor: Colors.lightInnerColor,
    paddingVertical: hp('1.5'),
    marginTop: hp('2'),
  },
  dividerStyle: {width: wp('95'), marginLeft: wp('1.5')},
  btnStyle: {
    marginTop: hp('4'),
    width: wp('90'),
    alignSelf: 'center',
    borderRadius: 30,
  },
});
