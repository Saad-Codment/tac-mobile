import React, {memo} from 'react';
import {View, FlatList, ActivityIndicator, RefreshControl} from 'react-native';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {Touchable} from '../../Components/Touchable';
import {Colors, TRIP_STATUS_META} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import useTripListScreen from './useTripListScreen';
import {styles} from './styles';

const formatDate = str => {
  if (!str) return '—';
  const d = new Date(str);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const TripCard = ({trip, onPress, onManageRequests}) => {
  const statusMeta = TRIP_STATUS_META[trip?.status] ?? {
    label: trip.status,
    color: '#6B7280',
  };
  const stopCount = trip?.stops?.length ?? 0;
  const distanceKm = trip?.total_distance_planned
    ? (trip.total_distance_planned / 1000).toFixed(1)
    : null;
  const pendingCount = trip?.pending_requests_count ?? 0;

  return (
    <Touchable onPress={() => onPress(trip)} style={styles.card}>
      <View style={styles.cardHeader}>
        <TextComponent
          text={trip.name}
          styles={styles.cardTitle}
          numberOfLines={1}
        />
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: statusMeta.color + '18'},
          ]}>
          <TextComponent
            text={statusMeta.label}
            styles={[styles.statusBadgeText, {color: statusMeta.color}]}
          />
        </View>
      </View>
      <TextComponent
        text={trip.departure_address}
        fade
        styles={styles.cardAddress}
        numberOfLines={1}
      />
      <View style={styles.cardMetaRow}>
        <TextComponent
          text={`📅 ${formatDate(trip.estimated_departure_at)}`}
          fade
          styles={styles.cardMetaText}
        />
        {distanceKm && (
          <TextComponent
            text={`🛣 ${distanceKm} km`}
            fade
            styles={styles.cardMetaText}
          />
        )}
        <TextComponent
          text={`🛑 ${stopCount} stops`}
          fade
          styles={styles.cardMetaText}
        />
      </View>

      {/* NEW — pending join requests badge, tap skips straight to Manage Requests */}
      {pendingCount > 0 && (
        <Touchable
          onPress={e => {
            e?.stopPropagation?.();
            onManageRequests(trip);
          }}
          style={styles.requestsBadge}>
          <TextComponent
            text={`🔔 ${pendingCount} new request${
              pendingCount === 1 ? '' : 's'
            }`}
            styles={styles.requestsBadgeText}
          />
        </Touchable>
      )}
    </Touchable>
  );
};

const TripListScreen = ({navigation}) => {
  const {
    trips,
    isLoading,
    refreshing,
    onRefresh,
    onLoadMore,
    isFetchingNextPage,
    openTrip,
    goToManageRequests,
  } = useTripListScreen(navigation);

  return (
    <View style={styles.screenContainer}>
      <HeaderComponent
        headerTitle={'My Trips'}
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
          keyExtractor={item => `trip-${item.id}`}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <TextComponent
                text={'No trips planned yet.'}
                fade
                styles={styles.emptyText}
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
          renderItem={({item}) => (
            <TripCard
              trip={item}
              onPress={openTrip}
              onManageRequests={goToManageRequests}
            />
          )}
        />
      )}
    </View>
  );
};

export default memo(TripListScreen);
