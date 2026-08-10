import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';

export const styles = StyleSheet.create({
  screenContainer: {flex: 1, backgroundColor: '#F8FAFC'},
  listContent: {padding: wp('4')},

  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: hp('1.4'),
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: wp('4'),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: wp('2'),
  },
  cardTitle: {
    flex: 1,
    fontSize: hp('1.6'),
    fontWeight: '700',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: wp('2.5'),
    paddingVertical: hp('0.4'),
    borderRadius: 999,
  },
  statusBadgeText: {fontSize: hp('1.1'), fontWeight: '700'},
  cardAddress: {fontSize: hp('1.25'), color: '#64748B', marginTop: hp('0.5')},
  cardMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('3'),
    marginTop: hp('1'),
  },
  cardMetaText: {fontSize: hp('1.15'), color: '#64748B'},

  // NEW — pending join requests badge
  requestsBadge: {
    alignSelf: 'flex-start',
    marginTop: hp('1'),
    paddingHorizontal: wp('3'),
    paddingVertical: hp('0.6'),
    borderRadius: 999,
    backgroundColor: '#FEF3C7',
  },
  requestsBadgeText: {
    fontSize: hp('1.15'),
    color: '#92400E',
    fontWeight: '700',
  },

  emptyState: {marginTop: hp('10'), alignItems: 'center'},
  emptyText: {fontSize: hp('1.5'), color: '#6B7280'},
});
