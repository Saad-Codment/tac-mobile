import {Platform, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: Colors.white || '#1C2526', // Fallback dark gray
  },
  listMain: {
    flex: 1,
    width: wp('100'),
    paddingTop: hp('1'), // Slight top padding for better flow
    // backgroundColor: 'red',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('2'),
    paddingHorizontal: wp('4'),
    backgroundColor: Colors.white || '#FFFFFF',
    borderRadius: 12,
    marginVertical: hp('0.5'),
    marginHorizontal: wp('2'),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  chatInfo: {
    flex: 1,
    marginLeft: wp('3'),
    justifyContent: 'center',
    paddingRight: wp('2'), // Prevent text from touching edge
  },
  userName: {
    fontSize: hp('2'),
    fontWeight: '600',
    color: Colors.black || '#000000',
    marginBottom: hp('0.3'),
  },
  lastMessage: {
    fontSize: hp('1.7'),
    color: Colors.gray || '#757575',
    maxWidth: wp('60'), // Prevent overflow
    flexWrap: 'wrap',
  },
  typingText: {
    fontSize: hp('1.7'),
    color: Colors.green || '#4CAF50',
    fontStyle: 'italic',
  },
  unreadBadge: {
    backgroundColor: Colors.primaryColor || '#6200EE', // Fallback purple
    borderRadius: 20,
    minWidth: wp('6'),
    height: hp('3'),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('1.5'),
    marginLeft: wp('2'),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  unreadText: {
    color: Colors.white || '#FFFFFF',
    fontSize: hp('1.6'),
    fontWeight: 'bold',
  },
  backRightBtnRight: {
    backgroundColor: '#EA4335',
    // flexGrow: 1,
    height: Platform.OS == 'ios' ? hp('8.9') : hp('9.9'),
    // borderTopRightRadius: 15,
    // borderBottomRightRadius: 15,
    alignItems: 'flex-end',
    // paddingTop: hp('2'),
    paddingRight: wp('3'),
    borderRadius: 15,
    marginVertical: hp('0.5'),
    // marginHorizontal: wp('3.5'),
    justifyContent: 'center',
  },
  trashIcon: {
    width: wp('4'),
    height: hp('4'),
  },
});
