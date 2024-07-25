import {Platform, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors, FontSize} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  subsCon: {
    paddingTop: hp(Platform.OS === 'ios' ? '8' : '2'),
    paddingBottom: hp('5'),
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Adjust as needed
  },
  subs: {
    fontWeight: '600',
    fontSize: FontSize.scale25,
    color: Colors.black,
    marginBottom: 10, // Adjust as needed
  },
  upperCont: {
    fontWeight: '500',
    fontSize: FontSize.scale14,
    color: Colors.textGray,
    width: wp('95'),
    height: hp('63'),
    textAlign: 'center',
    marginTop: hp('4'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 25,
  },
  subsDes: {
    fontWeight: '500',
    fontSize: FontSize.scale14,
    color: Colors.textGray,
    width: wp('55'),
    textAlign: 'center',
    marginTop: hp('1'),
  },
  midCont: {
    backgroundColor: Colors.backgroundTheme,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: hp('12'),
  },
  innerCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2'),
    marginLeft: hp('2'),
  },

  boldText: {
    fontWeight: 'bold',
    color: Colors.backgroundTheme,
  },
  icon: {
    resizeMode: 'contain',
    height: hp('8'),
    width: wp('15'),
  },

  monthlyText: {
    fontWeight: '600',
    fontSize: FontSize.scale25,
    color: Colors.white,
    textAlign: 'left',
  },
  monthlyTextBold: {
    fontWeight: '500',
    fontSize: FontSize.scale14,
    color: Colors.white,
  },
  textDes: {
    fontWeight: '400',
    fontSize: FontSize.scale14,
    color: Colors.textGray,
    textAlign: 'center',
  },

  tickCircle: {
    resizeMode: 'contain',
    height: hp('5'),
    width: wp('5'),
    marginLeft: wp('2'),
  },
  packText: {
    fontWeight: '400',

    fontSize: FontSize.scale16,
    marginLeft: wp('2'),
  },
  buyCont: {
    width: wp('40'),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: hp('3'),
  },
  buyPlan: {
    alignSelf: 'center',
  },
});
