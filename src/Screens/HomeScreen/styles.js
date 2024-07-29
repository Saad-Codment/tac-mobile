import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors, FontSize} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchComponent: {
    marginTop: hp('-3'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundTheme,
    borderRadius: 10,
    padding: 10,
    // marginHorizontal: wp('3'),
    height: hp('7'),
    borderColor: Colors.textGray,
    borderWidth: wp('0.2'),
  },
  searchStyle: {
    resizeMode: 'contain',
    width: wp('4'),
    marginRight: wp('1'),
  },
  textInputContainer: {
    alignItems: 'flex-start',
    width: wp('70'),
    justifyContent: 'center',
    height: hp('7'),
  },
  textStyle: {
    color: Colors.primaryColor,
    fontSize: FontSize.scale15,
    paddingHorizontal: wp('25'),
    textAlign: 'center',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});
