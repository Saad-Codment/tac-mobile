import React, {memo} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {Touchable} from '../../Components/Touchable';
import {Colors} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import useTripsForEventListScreen from './useTripsForEventListScreen';

const STATUS_META = {
  confirmed: {label: 'Confirmed', color: '#3B82F6'},
  in_progress: {label: 'In Progress', color: '#F59E0B'},
};

const formatDateTime = str => {
  if (!str) return '—';
  const d = new Date(str);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const TripCard = ({trip, onPress}) => {
  const statusMeta = STATUS_META[trip?.status] ?? {
    label: trip?.status,
    color: '#6B7280',
  };
  const organizerName = `${trip?.organizer?.first_name ?? ''} ${
    trip?.organizer?.last_name ?? ''
  }`.trim();

  return (
    <Touchable onPress={() => onPress(trip)} style={S.card}>
      <View style={S.cardHeader}>
        <TextComponent
          text={trip.name}
          styles={S.cardTitle}
          numberOfLines={1}
        />
        <View
          style={[S.statusBadge, {backgroundColor: statusMeta.color + '18'}]}>
          <TextComponent
            text={statusMeta.label}
            styles={[S.statusBadgeText, {color: statusMeta.color}]}
          />
        </View>
      </View>

      <TextComponent
        text={trip.departure_address}
        fade
        styles={S.cardAddress}
        numberOfLines={1}
      />
      <TextComponent
        text={`🚗 ${formatDateTime(
          trip.estimated_departure_at,
        )} → 🏁 ${formatDateTime(trip.estimated_arrival_at)}`}
        fade
        styles={S.cardDates}
      />
      {!!organizerName && (
        <TextComponent
          text={`Organized by ${organizerName}`}
          fade
          styles={S.cardOrganizer}
        />
      )}

      <View style={S.capacityRow}>
        <TextComponent
          text={`👤 ${trip.seats_left ?? 0} seats left  •  🐴 ${
            trip.hauls_left ?? 0
          } hauls left`}
          styles={S.capacityText}
        />
      </View>
    </Touchable>
  );
};

const TripsForEventListScreen = ({navigation, route}) => {
  const {
    trips,
    isLoading,
    refreshing,
    onRefresh,
    onLoadMore,
    isFetchingNextPage,
    openTrip,
  } = useTripsForEventListScreen(navigation, route);

  return (
    <View style={S.screenContainer}>
      <HeaderComponent
        headerTitle={'Active Trips'}
        isBack
        goBack={() => navigation.goBack()}
      />

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primaryColor}
          style={{marginTop: hp('6')}}
        />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={item => `event-trip-${item.id}`}
          contentContainerStyle={S.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <View style={S.emptyState}>
              <TextComponent
                text={'No active trips for this event yet.'}
                fade
                styles={S.emptyText}
              />
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                size="small"
                color={Colors.primaryColor}
                style={{marginVertical: hp('2')}}
              />
            ) : null
          }
          renderItem={({item}) => <TripCard trip={item} onPress={openTrip} />}
        />
      )}
    </View>
  );
};

const S = StyleSheet.create({
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
  cardAddress: {fontSize: hp('1.25'), color: '#64748B', marginTop: hp('0.6')},
  cardDates: {fontSize: hp('1.15'), color: '#64748B', marginTop: hp('0.4')},
  cardOrganizer: {fontSize: hp('1.1'), color: '#94A3B8', marginTop: hp('0.3')},

  capacityRow: {
    marginTop: hp('1'),
    paddingHorizontal: wp('3'),
    paddingVertical: hp('0.7'),
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    alignSelf: 'flex-start',
  },
  capacityText: {fontSize: hp('1.15'), color: '#166534', fontWeight: '600'},

  emptyState: {marginTop: hp('10'), alignItems: 'center'},
  emptyText: {
    fontSize: hp('1.5'),
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: wp('8'),
  },
});

export default memo(TripsForEventListScreen);
