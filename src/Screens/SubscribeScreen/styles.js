import {Platform, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors, FontSize} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  subsCon: {
    paddingTop: hp(Platform.OS === 'ios' ? '8' : '1'),
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginBottom: hp('3'),
  },
  subs: {
    fontWeight: '600',
    fontSize: FontSize.scale18,
    color: Colors.black,
    marginBottom: hp('2'),
  },
  subsDes: {
    fontWeight: '400',
    fontSize: FontSize.scale12,
    color: Colors.textGray,
    width: wp('65'),
    textAlign: 'center',
  },
  upperCont: {
    width: wp('92'),
    // height: hp('52'),
    marginTop: hp('2'),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 20,
    paddingBottom: hp('2'),
  },

  midCont: {
    backgroundColor: Colors.backgroundTheme,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: hp('10'),
  },
  innerCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2'),
    marginLeft: hp('1.5'),
  },
  icon: {
    resizeMode: 'contain',
    height: hp('6'),
    width: wp('12'),
  },
  monthlyText: {
    fontWeight: '600',
    fontSize: FontSize.scale18,
    color: Colors.white,
    textAlign: 'left',
  },
  monthlyTextBold: {
    fontWeight: 'bols',
    fontSize: FontSize.scale18,
    color: Colors.white,
  },
  textDes: {
    fontWeight: '400',
    fontSize: FontSize.scale12,
    color: Colors.textGray,
    textAlign: 'center',
  },
  tickCircle: {
    resizeMode: 'contain',
    height: hp('3.5'),
    width: wp('4.5'),
    marginLeft: wp('1.5'),
  },
  packText: {
    fontWeight: '400',
    fontSize: FontSize.scale13,
    marginLeft: wp('1.5'),
  },
  buyCont: {
    width: wp('35'),
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf: 'center',
    marginTop: hp('2'),
    marginLeft: wp('-0.7'),
    height: hp('4'),
  },
  buyPlan: {
    fontSize: FontSize.scale12,
    fontWeight: '500',
  },
  boldText: {
    fontWeight: 'bold',
    color: Colors.backgroundTheme,
  },
});
