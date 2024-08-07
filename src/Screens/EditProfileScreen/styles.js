import {Dimensions, StyleSheet, Platform} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors, FontSize} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'relative ',
    zIndex: 1, // Make sure header has a lower zIndex than the image
    backgroundColor: Colors.backgroundTheme,
    paddingBottom: hp('50'),
    paddingTop: Platform.OS == 'ios' ? hp('9') : hp('5'),
  },
  proImageContainer: {
    position: 'absolute',
    top: -hp('12'), // Adjust the position to fit correctly
    alignSelf: 'center',
    zIndex: 2,
  },
  midContainer: {
    position: 'absolute',
    top: hp('26'),
    width: wp('80'),
    backgroundColor: 'white',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
    zIndex: 2, // Ensure midContainer has a higher zIndex than the header
  },
  proImage: {
    borderRadius: Math.round(
      Dimensions.get('window').width + Dimensions.get('window').height,
    ),
    width: Dimensions.get('window').width * 0.35,
    height: Dimensions.get('window').width * 0.35,
    alignSelf: 'center',
    borderWidth: 5,
    borderColor: 'white',
    zIndex: 3, // Ensure image has the highest zIndex
  },
  proName: {
    fontSize: FontSize.scale30,
    fontWeight: '600',
    color: Colors.backgroundTheme,
    textAlign: 'center',
    marginTop: hp('5'), // Add margin to separate text from the image
  },
  proEmail: {
    fontSize: FontSize.scale14,
    fontWeight: '400',
    color: Colors.textGray,
    textAlign: 'center',
  },
  listBtn: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  listInner: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderColor: Colors.grayFaded,
    paddingVertical: hp('2'),
  },
  iconGreen: {
    resizeMode: 'contain',
    width: wp('5'),
    height: hp('3'),
    marginRight: wp('2'),
  },
  arrowRight: {
    width: wp('2'),
    resizeMode: 'contain',
    height: hp('2.4'),
  },
  title: {
    fontSize: FontSize.scale16,
    fontWeight: 400,
    color: Colors.black,
  },
  change: {
    fontSize: FontSize.scale12,
    fontWeight: 400,
    color: Colors.textGray,
  },
  botText: {
    fontSize: FontSize.scale25,
    fontWeight: 600,
    color: Colors.backgroundTheme,
    textAlign: 'center',
    marginTop: hp('3'),
  },
  upload: {
    position: 'relative',
    bottom: hp('7'),
    left: wp('50'),
    resizeMode: 'contain',
    width: wp('12'),
    height: hp('8'),
  },
  edit: {
    backgroundColor: 'white',
    borderColor: Colors.textGray,
    marginBottom: hp('15'),
    marginTop: hp('-5'),
  },
  editText: {
    color: Colors.black,
  },
  line: {
    width: wp('10'),
    borderWidth: 2,
    borderRadius: 10,
    alignSelf: 'center',
  },
});
