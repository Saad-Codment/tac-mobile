import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';

export const styles = StyleSheet.create({
  screenContainer: {flex: 1, backgroundColor: '#F8FAFC'},
  scrollContent: {padding: wp('4'), paddingBottom: hp('4')},
  sectionLabel: {
    fontSize: hp('1.5'),
    fontWeight: '700',
    color: '#111827',
    marginBottom: hp('1'),
    marginTop: hp('1'),
  },

  fieldWrapper: {marginBottom: hp('1.4')},
  fieldLabel: {
    fontSize: hp('1.25'),
    color: '#374151',
    fontWeight: '600',
    marginBottom: hp('0.5'),
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: hp('5.2'),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: wp('3.5'),
    backgroundColor: 'white',
  },
  selectFieldDisabled: {opacity: 0.5},
  selectTextFilled: {fontSize: hp('1.4'), color: '#111827'},
  selectTextEmpty: {fontSize: hp('1.4'), color: '#9CA3AF'},
  selectChevron: {fontSize: hp('1.4'), color: '#94A3B8'},

  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: wp('4'),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  divider: {height: 1, backgroundColor: '#F1F5F9', marginVertical: hp('0.5')},

  hintText: {
    fontSize: hp('1.2'),
    color: '#94A3B8',
    marginTop: hp('1.5'),
    lineHeight: hp('1.8'),
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: wp('4'),
    paddingVertical: hp('1.5'),
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  submitBtn: {height: hp('5.4'), borderRadius: 12},
});
