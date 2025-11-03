import {Platform, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    paddingHorizontal: wp('5'),
    paddingBottom: hp('3'),
    backgroundColor: Colors.darkThemeTextColor,
    paddingTop: Platform.OS == 'ios' ? hp('7') : hp('2'),
    height: Platform.OS == 'ios' ? hp('12') : hp('8'),
    alignItems: 'center',
  },
  HeaderLeft: {
    flex: 0.2,
  },
  arrowback: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    width: wp('7'),
    tintColor: 'white',
  },
  HeaderCenter: {
    flex: 1,
    alignItems: 'center',
    height: hp('5'),
    textAlignVertical: 'center',
    flexDirection: 'row',
  },
  HeaderRight: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backMain: {
    alignItems: 'center',
    flexDirection: 'row',
    textAlign: 'left',
    alignItems: 'flex-end',
  },
  senderView: isSender => ({
    width: wp('100'),
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginVertical: hp('0.5'),
    marginLeft: isSender ? 0 : wp('2'),
  }),
  senderText: (isSender, type, isEmoji) => ({
    maxWidth: wp('80'),
    // borderWidth: isEmoji ? 0 : 0.3,
    borderColor: Colors.grayFaded,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    borderBottomEndRadius: isSender ? 0 : 15,
    borderBottomStartRadius: isSender ? 15 : 0,
    paddingVertical: type === 'text' ? hp('1.5') : hp('0.5'),
    paddingHorizontal: type === 'text' ? wp('3.5') : wp('0.5'),
    marginRight: isSender ? (isEmoji ? wp('-3') : wp('2')) : 0,
    backgroundColor: isSender
      ? isEmoji
        ? 'transparent'
        : 'rgba(41, 45, 50, 1)'
      : isEmoji
      ? 'transparent'
      : 'rgba(246, 246, 246, 1)',
    overflow: 'hidden',
    marginLeft: !isSender ? (isEmoji ? wp('-3') : wp('2')) : 0,
  }),
  mediaStyle: {
    width: wp('60'),
    height: hp('30'),
    borderRadius: 10,
  },
  msgsRecieve: {
    paddingHorizontal: wp('2'),
    alignItems: 'center',
  },
  sendIcon: {
    width: wp('3'),
    height: hp('2'),
    resizeMode: 'contain',
  },
  searchMain: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.2,
    minHeight: hp('5'),
    maxHeight: hp('14'),
    paddingHorizontal: wp('1.8'),
    overflow: 'hidden',
    borderRadius: 30,
    marginBottom: Platform.OS == 'ios' ? hp('2') : hp('0'),
    // backgroundColor: Colors.themeBlack,
    alignSelf: 'center',
    width: wp('95'),
    backgroundColor: 'white',
  },
  attachmentBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('8'),
    marginRight: wp('2'),
  },
  searchinput: {
    paddingRight: wp('3'),
    fontSize: hp('1.5'),
    flex: 1,
    color: 'black',
    marginBottom: hp('1'),
    backgroundColor: 'white',
  },
  sendBtnStyle: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: Colors.primaryColor,
    height: hp('3.5'),
    width: wp('10'),
    justifyContent: 'center',
    alignItems: 'center',
  },

  // image View

  singleImage: {
    width: wp('90'),
    height: hp('30'),
    borderRadius: wp('2'),
    // marginHorizontal: wp('1'),
    // aspectRatio: 1,
  },
  twoImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // backgroundColor: 'red',
    width: wp('72'),
    justifyContent: 'space-between',
    paddingHorizontal: wp('0.5'),
  },
  twoImage: {
    width: wp('35'),
    height: hp('20'),
    // aspectRatio: 1,
    borderRadius: wp('2'),
    backgroundColor: 'yellow',
  },
  threeImagesContainer: {
    flexDirection: 'column',
  },
  threeImage: {
    // width: '100%',
    // height: hp('20'),
    // aspectRatio: 1,
    borderRadius: wp('2'),
    marginBottom: hp('1'),
    // resizeMode: 'contain',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // backgroundColor: 'red',
    width: wp('72'),
    justifyContent: 'space-between',
    paddingHorizontal: wp('0.5'),
  },
  gridItem: {
    width: wp('35'),
    height: hp('20'),
    borderRadius: wp('2'),
    overflow: 'hidden',
    position: 'relative',
  },
  gridImage: {
    // width: '100%',
    // height: '100%',
    width: wp('35'),
    height: hp('20'),
    // aspectRatio: 1,
    borderRadius: wp('2'),
    overflow: 'hidden',
    // resizeMode: 'contain',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    top: hp('0.5'),
    overflow: 'hidden',
    borderRadius: wp('2'),
  },
  overlayText: {
    color: '#fff',
    fontSize: wp(6),
    fontWeight: 'bold',
  },

  dateHeader: {
    alignSelf: 'center',
    // backgroundColor: 'black',
    // backgroundColor: Colors.grayFaded,
    paddingVertical: hp('0.5'),
    paddingHorizontal: wp('3'),
    borderRadius: 10,
    marginVertical: hp('1'),
  },
  dateHeaderText: {
    color: '#969696',
    fontSize: hp('1.5'),
    fontWeight: '500',
  },
});
