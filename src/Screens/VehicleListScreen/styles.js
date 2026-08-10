import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';

export const styles = StyleSheet.create({
  screenContainer: {flex: 1, backgroundColor: '#F8FAFC'},
  listContent: {padding: wp('4'), paddingBottom: hp('12')},

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: hp('1.4'),
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: wp('3'),
    gap: wp('3'),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImgWrapper: {borderRadius: 12, overflow: 'hidden'},
  cardImg: {width: wp('18'), height: wp('18'), borderRadius: 12},
  cardImgPlaceholder: {
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImgPlaceholderIcon: {width: wp('8'), height: wp('8'), opacity: 0.4},
  cardBody: {flex: 1, gap: hp('0.3')},
  cardTitleRow: {flexDirection: 'row', alignItems: 'center', gap: wp('2')},
  cardTitle: {fontSize: hp('1.6'), fontWeight: '700', color: '#111827'},

  // NEW — vehicle type badge
  typeBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    paddingHorizontal: wp('2'),
    paddingVertical: hp('0.2'),
  },
  typeBadgeText: {fontSize: hp('1'), color: '#475569', fontWeight: '600'},

  cardSubtitle: {fontSize: hp('1.25'), color: '#3B82F6', fontWeight: '600'},
  cardMeta: {fontSize: hp('1.1'), color: '#64748B'},

  // NEW — pricing line
  cardPricing: {
    fontSize: hp('1.1'),
    color: '#22C55E',
    fontWeight: '600',
    marginTop: hp('0.15'),
  },

  deleteBtn: {
    width: wp('9'),
    height: wp('9'),
    borderRadius: wp('4.5'),
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {fontSize: hp('1.7')},

  emptyState: {marginTop: hp('10'), alignItems: 'center'},
  emptyText: {fontSize: hp('1.5'), color: '#6B7280'},

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
  addBtn: {height: hp('5.4'), borderRadius: 12},
});
