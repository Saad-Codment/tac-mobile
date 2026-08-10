import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TextComponent} from './TextComponent';
import {Touchable} from './Touchable';
import {hp, wp} from '../Config/responsive';

/**
 * Drop this into your existing Event Detail screen, wherever the
 * "See active trips" section should appear. Pass the `event` object as
 * returned by GET /api/events/{event} — it now includes trips_count and
 * trips_preview (see doc §4).
 *
 * Usage:
 *   <TripsPreviewSection event={event} navigation={navigation} />
 */
const formatDateShort = str => {
  if (!str) return '—';
  const d = new Date(str);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
};

const TripPreviewCard = ({trip, onPress}) => (
  <Touchable onPress={() => onPress(trip)} style={S.card}>
    <TextComponent text={trip.name} styles={S.cardTitle} numberOfLines={1} />
    <TextComponent
      text={trip.departure_address}
      fade
      styles={S.cardAddress}
      numberOfLines={1}
    />
    <TextComponent
      text={formatDateShort(trip.estimated_departure_at)}
      fade
      styles={S.cardDate}
    />
    <View style={S.capacityRow}>
      <TextComponent
        text={`👤 ${trip.seats_left ?? 0} • 🐴 ${trip.hauls_left ?? 0}`}
        styles={S.capacityText}
      />
    </View>
  </Touchable>
);

const TripsPreviewSection = ({event, navigation}) => {
  const tripsCount = event?.trips_count ?? 0;
  const tripsPreview = event?.trips_preview ?? [];

  if (tripsCount === 0) return null;

  const goToList = () =>
    navigation.navigate('TripsForEventListScreen', {eventId: event.id});
  const goToTrip = trip =>
    navigation.navigate('TripDetailScreen', {tripId: trip.id});

  return (
    <View style={S.section}>
      <Touchable onPress={goToList} style={S.headerBtn}>
        <TextComponent
          text={`See Active Trips (${tripsCount})`}
          styles={S.headerBtnText}
        />
        <TextComponent text={'→'} styles={S.headerBtnArrow} />
      </Touchable>

      {tripsPreview.length > 0 && (
        <View style={S.previewRow}>
          {tripsPreview.slice(0, 3).map(trip => (
            <TripPreviewCard key={trip.id} trip={trip} onPress={goToTrip} />
          ))}
        </View>
      )}
    </View>
  );
};

const S = StyleSheet.create({
  section: {marginTop: hp('2')},
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingHorizontal: wp('4'),
    paddingVertical: hp('1.4'),
  },
  headerBtnText: {fontSize: hp('1.4'), fontWeight: '700', color: '#1E40AF'},
  headerBtnArrow: {fontSize: hp('1.4'), color: '#1E40AF', fontWeight: '700'},

  previewRow: {flexDirection: 'row', gap: wp('3'), marginTop: hp('1.2')},
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: wp('3'),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardTitle: {fontSize: hp('1.25'), fontWeight: '700', color: '#111827'},
  cardAddress: {fontSize: hp('1.05'), color: '#64748B', marginTop: hp('0.3')},
  cardDate: {fontSize: hp('1.05'), color: '#94A3B8', marginTop: hp('0.2')},
  capacityRow: {marginTop: hp('0.6')},
  capacityText: {fontSize: hp('1.05'), color: '#166534', fontWeight: '600'},
});

export default TripsPreviewSection;
