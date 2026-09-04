import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';

export const styles = StyleSheet.create({
  screenContainer: {flex: 1, backgroundColor: '#F8FAFC'},
  scrollContent: {padding: wp('4'), paddingBottom: hp('10')},

  mapCard: {
    height: hp('26'),
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: hp('2'),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  map: {flex: 1},
  mapMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  mapMarkerText: {fontSize: hp('1.2'), color: 'white', fontWeight: '700'},

  // NEW — participant "Track Live" banner
  trackLiveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5'),
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: wp('4'),
    paddingVertical: hp('1.2'),
    marginBottom: hp('2'),
  },
  trackLivePulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F59E0B',
  },
  trackLiveText: {
    flex: 1,
    fontSize: hp('1.3'),
    fontWeight: '700',
    color: '#92400E',
  },
  trackLiveArrow: {fontSize: hp('1.4'), color: '#92400E', fontWeight: '700'},

  // NEW — organizer "Next Leg" banner: identifies which leg is next
  // (or already underway) and lets them jump straight into it, instead
  // of having to work out which connector in the itinerary to tap.
  nextLegBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: wp('4'),
    marginBottom: hp('2'),
  },
  nextLegBannerLabel: {
    fontSize: hp('1.15'),
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: hp('0.5'),
  },
  nextLegBannerRoute: {
    fontSize: hp('1.55'),
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: hp('0.3'),
  },
  nextLegBannerMeta: {
    fontSize: hp('1.2'),
    color: '#475569',
    marginBottom: hp('1.2'),
  },
  nextLegBannerBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: hp('1.2'),
    alignItems: 'center',
  },
  nextLegBannerBtnText: {
    fontSize: hp('1.35'),
    fontWeight: '700',
    color: 'white',
  },

  headerCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: wp('4'),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: wp('2'),
  },
  tripName: {flex: 1, fontSize: hp('2'), fontWeight: '700', color: '#111827'},
  statusBadge: {
    paddingHorizontal: wp('2.5'),
    paddingVertical: hp('0.4'),
    borderRadius: 999,
  },
  statusBadgeText: {fontSize: hp('1.15'), fontWeight: '700'},
  tripAddress: {fontSize: hp('1.3'), color: '#64748B', marginTop: hp('0.6')},
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('4'),
    marginTop: hp('1.2'),
  },
  statText: {fontSize: hp('1.3'), fontWeight: '600', color: '#1F2937'},

  capacityRow: {
    marginTop: hp('1'),
    paddingHorizontal: wp('3'),
    paddingVertical: hp('0.8'),
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
  },
  capacityText: {fontSize: hp('1.25'), color: '#166534', fontWeight: '600'},

  tripSpanRow: {
    marginTop: hp('1.2'),
    paddingTop: hp('1'),
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  tripSpanText: {fontSize: hp('1.25'), color: '#3B82F6', fontWeight: '600'},

  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('1'),
    paddingTop: hp('1'),
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  participantsText: {fontSize: hp('1.25'), color: '#111827', fontWeight: '600'},
  participantsLink: {fontSize: hp('1.2'), color: '#3B82F6', fontWeight: '700'},

  sectionLabel: {
    fontSize: hp('1.5'),
    fontWeight: '700',
    color: '#111827',
    marginTop: hp('2.2'),
    marginBottom: hp('1'),
  },
  // NEW — small hint shown to organizer above the itinerary during an active trip
  legsHint: {
    fontSize: hp('1.1'),
    color: '#94A3B8',
    marginTop: hp('-0.6'),
    marginBottom: hp('1'),
  },

  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: wp('3'),
    gap: wp('3'),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  vehicleCardImgWrapper: {borderRadius: 12, overflow: 'hidden'},
  vehicleCardImg: {width: wp('18'), height: wp('18'), borderRadius: 12},
  vehicleCardImgPlaceholder: {backgroundColor: '#F1F5F9'},
  vehicleCardBody: {flex: 1, gap: hp('0.3')},
  vehicleCardTitle: {fontSize: hp('1.5'), fontWeight: '700', color: '#111827'},
  vehicleCardNumber: {fontSize: hp('1.2'), color: '#3B82F6', fontWeight: '600'},
  vehicleCardMeta: {fontSize: hp('1.1'), color: '#64748B'},

  stopsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: wp('4'),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  stopRow: {flexDirection: 'row', gap: wp('3')},
  stopTimeline: {alignItems: 'center', width: wp('4')},
  stopDot: {
    width: wp('3'),
    height: wp('3'),
    borderRadius: wp('1.5'),
    backgroundColor: '#3B82F6',
    marginTop: hp('0.4'),
  },
  stopDotDeparture: {backgroundColor: '#22C55E'},
  stopLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E2E8F0',
    marginTop: hp('0.4'),
  },
  stopContent: {flex: 1, paddingBottom: hp('1')},
  stopTitle: {fontSize: hp('1.5'), fontWeight: '600', color: '#111827'},
  stopAddress: {fontSize: hp('1.15'), color: '#64748B', marginTop: hp('0.1')},
  stopMeta: {fontSize: hp('1.15'), color: '#64748B', marginTop: hp('0.3')},
  stopMetaDone: {
    fontSize: hp('1.15'),
    color: '#22C55E',
    fontWeight: '600',
    marginTop: hp('0.3'),
  },
  stopActionsRow: {flexDirection: 'row', gap: wp('2'), marginTop: hp('0.8')},
  stopActionBtn: {
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    paddingHorizontal: wp('3.5'),
    paddingVertical: hp('0.6'),
  },
  stopActionBtnText: {
    fontSize: hp('1.15'),
    color: '#3B82F6',
    fontWeight: '700',
  },

  legConnector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('4') + wp('1.5'),
    marginBottom: hp('1'),
    gap: wp('1.5'),
  },
  legConnectorLine: {width: 2, height: hp('1.5'), backgroundColor: '#E2E8F0'},
  legConnectorText: {fontSize: hp('1.1'), color: '#94A3B8'},

  // NEW — leg status badge shown inline on the connector (organizer only)
  legStatusBadge: {
    paddingHorizontal: wp('2'),
    paddingVertical: hp('0.2'),
    borderRadius: 999,
    marginLeft: wp('1'),
  },
  legStatusBadgeText: {fontSize: hp('1'), fontWeight: '700'},

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: wp('3'),
    backgroundColor: 'white',
    paddingHorizontal: wp('4'),
    paddingVertical: hp('1.5'),
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionBtnSecondary: {
    flex: 1,
    height: hp('4.5'),
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionBtnSecondaryText: {
    fontSize: hp('1.5'),
    color: '#1F2937',
    fontWeight: '600',
  },
  actionBtnPrimary: {flex: 1, height: hp('4.5'), borderRadius: 12},
  actionBtnPrimaryFull: {flex: 1, height: hp('4.5'), borderRadius: 12},
});
