import {Platform, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors, FontSize} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    height: hp('10'),
    marginTop: hp('5'),
  },
  innerCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  boldText: {
    fontWeight: 'bold',
    color: Colors.backgroundTheme,
  },
  icon: {
    resizeMode: 'contain',
    height: hp('5'),
    width: wp('7'),
  },
});
