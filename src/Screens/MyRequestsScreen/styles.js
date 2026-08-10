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
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: wp('2'),
  },
  cardTitle: {
    flex: 1,
    fontSize: hp('1.55'),
    fontWeight: '700',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: wp('2.5'),
    paddingVertical: hp('0.4'),
    borderRadius: 999,
  },
  statusBadgeText: {fontSize: hp('1.1'), fontWeight: '700'},
  cardMeta: {fontSize: hp('1.15'), color: '#64748B', marginTop: hp('0.5')},
  routeText: {
    fontSize: hp('1.3'),
    color: '#111827',
    fontWeight: '600',
    marginTop: hp('0.4'),
  },

  declineBox: {
    marginTop: hp('0.8'),
    padding: wp('2.5'),
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  declineText: {fontSize: hp('1.1'), color: '#B91C1C'},

  cancelBtn: {
    marginTop: hp('1'),
    alignSelf: 'flex-start',
    paddingHorizontal: wp('3.5'),
    paddingVertical: hp('0.7'),
    borderRadius: 999,
    backgroundColor: '#FEE2E2',
  },
  cancelBtnText: {fontSize: hp('1.15'), color: '#EF4444', fontWeight: '700'},

  emptyState: {marginTop: hp('10'), alignItems: 'center'},
  emptyText: {fontSize: hp('1.5'), color: '#6B7280'},
});
