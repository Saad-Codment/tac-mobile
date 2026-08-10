import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';

export const styles = StyleSheet.create({
  screenContainer: {flex: 1, backgroundColor: '#F8FAFC'},
  scrollContent: {padding: wp('4'), paddingBottom: hp('10')},

  sectionLabel: {
    fontSize: hp('1.5'),
    fontWeight: '700',
    color: '#111827',
    marginTop: hp('2'),
    marginBottom: hp('1'),
  },

  imageRow: {flexDirection: 'row', flexWrap: 'wrap', gap: wp('2.5')},
  imageThumbWrapper: {position: 'relative'},
  imageThumb: {
    width: wp('20'),
    height: wp('20'),
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  imageRemoveBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: wp('5.5'),
    height: wp('5.5'),
    borderRadius: wp('2.75'),
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageRemoveBtnText: {fontSize: hp('1.1'), color: 'white', fontWeight: '700'},
  imageAddBtn: {
    width: wp('20'),
    height: wp('20'),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageAddBtnText: {fontSize: hp('3'), color: '#94A3B8'},

  fieldWrapper: {marginBottom: hp('1.4')},
  fieldLabel: {
    fontSize: hp('1.25'),
    color: '#374151',
    fontWeight: '600',
    marginBottom: hp('0.5'),
  },
  fieldInput: {
    height: hp('5.2'),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: wp('3.5'),
    fontSize: hp('1.4'),
    color: '#111827',
    backgroundColor: 'white',
  },

  // NEW — dropdown-style field (Vehicle Type)
  fieldSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldSelectTextFilled: {fontSize: hp('1.4'), color: '#111827'},
  fieldSelectTextEmpty: {fontSize: hp('1.4'), color: '#9CA3AF'},
  fieldSelectChevron: {fontSize: hp('1.4'), color: '#94A3B8'},

  // NEW — Carries Horses toggle row
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1'),
    marginBottom: hp('0.5'),
  },
  toggleHint: {fontSize: hp('1.1'), color: '#94A3B8', marginTop: hp('0.15')},

  row: {flexDirection: 'row', gap: wp('3')},
  halfField: {flex: 1},

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
  saveBtn: {height: hp('5.4'), borderRadius: 12},
});
