import React, {memo} from 'react';
import {View, ScrollView, ActivityIndicator, Image} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {Touchable} from '../../Components/Touchable';
import ThemeButton from '../../Components/ThemeButton';
import {Colors, TRIP_STATUS_META} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import {imageUrl, MAPBOX_TOKEN} from '../../Utils/Urls';
import useTripDetailScreen from './useTripDetailScreen';
import {styles} from './styles';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

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

const formatDateShort = str => {
  if (!str) return '—';
  const d = new Date(str);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
};

const formatDuration = seconds => {
  if (seconds == null) return '—';
  const totalMin = Math.round(seconds / 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m}m`;
};

const MARKER_COLORS = [
  '#22C55E',
  '#3B82F6',
  '#F59E0B',
  '#8B5CF6',
  '#06B6D4',
  '#EF4444',
];
const getMarkerColor = (index, total) => {
  if (index === 0) return MARKER_COLORS[0];
  if (index === total - 1) return MARKER_COLORS[5];
  return MARKER_COLORS[(index % 4) + 1];
};

const TripMapMarker = ({stop, index, total}) => {
  const lat = parseFloat(stop?.latitude);
  const lng = parseFloat(stop?.longitude);
  if (isNaN(lat) || isNaN(lng)) return null;
  const color = getMarkerColor(index, total);
  return (
    <MapboxGL.MarkerView coordinate={[lng, lat]}>
      <View style={[styles.mapMarker, {backgroundColor: color}]}>
        <TextComponent
          text={stop?.stop_type === 'departure' ? '🚩' : String(index)}
          styles={styles.mapMarkerText}
        />
      </View>
    </MapboxGL.MarkerView>
  );
};

const TripRouteMap = ({routeGeoJSON, mapBounds, stops}) => (
  <View style={styles.mapCard}>
    <MapboxGL.MapView
      style={styles.map}
      styleURL={MapboxGL.StyleURL.Street}
      logoEnabled={false}
      attributionEnabled={false}
      scrollEnabled={true}
      zoomEnabled={true}>
      <MapboxGL.Camera
        defaultSettings={{
          bounds: mapBounds
            ? {
                ne: mapBounds.ne,
                sw: mapBounds.sw,
                paddingLeft: 50,
                paddingRight: 50,
                paddingTop: 50,
                paddingBottom: 50,
              }
            : undefined,
          zoomLevel: mapBounds ? undefined : 8,
        }}
      />
      {routeGeoJSON && (
        <MapboxGL.ShapeSource id="tripRouteSource" shape={routeGeoJSON}>
          <MapboxGL.LineLayer
            id="tripRouteLine"
            style={{
              lineColor: '#3B82F6',
              lineWidth: 5,
              lineJoin: 'round',
              lineCap: 'round',
            }}
          />
        </MapboxGL.ShapeSource>
      )}
      {stops.map((stop, index) => (
        <TripMapMarker
          key={`trip-map-stop-${stop.id}`}
          stop={stop}
          index={index}
          total={stops.length}
        />
      ))}
    </MapboxGL.MapView>
  </View>
);

const VehicleCard = ({vehicle}) => {
  if (!vehicle) return null;
  const firstImage = vehicle.images?.[0];
  return (
    <>
      <TextComponent text={'Vehicle'} styles={styles.sectionLabel} />
      <View style={styles.vehicleCard}>
        <View style={styles.vehicleCardImgWrapper}>
          {firstImage ? (
            <Image
              source={{uri: imageUrl(firstImage)}}
              style={styles.vehicleCardImg}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[styles.vehicleCardImg, styles.vehicleCardImgPlaceholder]}
            />
          )}
        </View>
        <View style={styles.vehicleCardBody}>
          <TextComponent
            text={vehicle.title}
            styles={styles.vehicleCardTitle}
            numberOfLines={1}
          />
          <TextComponent
            text={`#${vehicle.vehicle_number}`}
            styles={styles.vehicleCardNumber}
          />
          <TextComponent
            text={`🐴 ${vehicle.horse_stalls} stalls • 👤 ${vehicle.human_seats} seats • ⚙ ${vehicle.axle_count} axles`}
            fade
            styles={styles.vehicleCardMeta}
          />
        </View>
      </View>
    </>
  );
};

const LegConnector = ({leg}) => {
  if (!leg) return null;
  const km = (leg.distance_planned_meters / 1000).toFixed(1);
  return (
    <View style={styles.legConnector}>
      <View style={styles.legConnectorLine} />
      <TextComponent
        text={`🛣 ${km} km • ⏱ ${formatDuration(leg.duration_planned_seconds)}`}
        fade
        styles={styles.legConnectorText}
      />
    </View>
  );
};

const StopRow = ({
  stop,
  isLast,
  onArrive,
  onDepart,
  tripStatus,
  leg,
  canManage,
}) => {
  const isDeparture = stop.stop_type === 'departure';
  return (
    <>
      <View style={styles.stopRow}>
        <View style={styles.stopTimeline}>
          <View
            style={[styles.stopDot, isDeparture && styles.stopDotDeparture]}
          />
          {!isLast && <View style={styles.stopLine} />}
        </View>
        <View style={styles.stopContent}>
          <TextComponent
            text={isDeparture ? 'Departure' : stop?.name ?? 'Stop'}
            styles={styles.stopTitle}
          />
          {!!stop?.address && (
            <TextComponent
              text={stop.address}
              fade
              styles={styles.stopAddress}
              numberOfLines={1}
            />
          )}

          {isDeparture ? (
            stop?.etd_planned && (
              <TextComponent
                text={`Planned departure: ${formatDateTime(stop.etd_planned)}`}
                fade
                styles={styles.stopMeta}
              />
            )
          ) : (
            <>
              {stop?.eta_planned && (
                <TextComponent
                  text={`Planned arrival: ${formatDateTime(stop.eta_planned)}`}
                  fade
                  styles={styles.stopMeta}
                />
              )}
              {stop?.etd_planned && (
                <TextComponent
                  text={`Planned departure: ${formatDateTime(
                    stop.etd_planned,
                  )}`}
                  fade
                  styles={styles.stopMeta}
                />
              )}
            </>
          )}

          {stop?.ata_actual && (
            <TextComponent
              text={`✅ Arrived: ${formatDateTime(stop.ata_actual)}`}
              styles={styles.stopMetaDone}
            />
          )}
          {stop?.atd_actual && (
            <TextComponent
              text={`🚚 Departed: ${formatDateTime(stop.atd_actual)}`}
              styles={styles.stopMetaDone}
            />
          )}

          {canManage && tripStatus === 'in_progress' && (
            <View style={styles.stopActionsRow}>
              {!stop?.ata_actual && (
                <Touchable
                  onPress={() => onArrive(stop.id)}
                  style={styles.stopActionBtn}>
                  <TextComponent
                    text={'Mark Arrived'}
                    styles={styles.stopActionBtnText}
                  />
                </Touchable>
              )}
              {stop?.ata_actual && !stop?.atd_actual && (
                <Touchable
                  onPress={() => onDepart(stop.id)}
                  style={styles.stopActionBtn}>
                  <TextComponent
                    text={'Mark Departed'}
                    styles={styles.stopActionBtnText}
                  />
                </Touchable>
              )}
            </View>
          )}
        </View>
      </View>
      {!isLast && <LegConnector leg={leg} />}
    </>
  );
};

const TripDetailScreen = ({navigation, route}) => {
  const {
    trip,
    isLoading,
    routeGeoJSON,
    mapBounds,
    legByStartStopId,
    startTrip,
    completeTrip,
    confirmCancelTrip,
    markStopArrived,
    markStopDeparted,
    isUpdatingStatus,
    isOrganizer,
    participantsSummary,
    goToManageRequests,
    goToRequestToJoin,
  } = useTripDetailScreen(navigation, route);

  if (isLoading || !trip) {
    return (
      <View style={styles.screenContainer}>
        <HeaderComponent
          headerTitle={'Trip Detail'}
          isBack
          goBack={() => navigation.goBack()}
        />
        <ActivityIndicator
          size="large"
          color={Colors.primaryColor}
          style={{marginTop: hp('6')}}
        />
      </View>
    );
  }

  const statusMeta = TRIP_STATUS_META[trip.status] ?? {
    label: trip.status,
    color: '#6B7280',
  };
  const distanceKm = trip.total_distance_planned
    ? (trip.total_distance_planned / 1000).toFixed(1)
    : null;
  const stops = trip.stops ?? [];
  const hasDwellTime =
    trip.estimated_departure_at &&
    trip.estimated_arrival_at &&
    formatDateShort(trip.estimated_departure_at) !==
      formatDateShort(trip.estimated_arrival_at);

  const isJoinable =
    trip.status === 'confirmed' || trip.status === 'in_progress';
  const isFullyBooked =
    (trip.seats_left ?? 0) === 0 && (trip.hauls_left ?? 0) === 0;

  return (
    <View style={styles.screenContainer}>
      <HeaderComponent
        headerTitle={trip.name}
        isBack
        goBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <TripRouteMap
          routeGeoJSON={routeGeoJSON}
          mapBounds={mapBounds}
          stops={stops}
        />

        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <TextComponent
              text={trip.name}
              styles={styles.tripName}
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
            styles={styles.tripAddress}
          />

          <View style={styles.statsRow}>
            {distanceKm && (
              <TextComponent
                text={`🛣 ${distanceKm} km driving`}
                styles={styles.statText}
              />
            )}
            {trip.total_duration_planned != null && (
              <TextComponent
                text={`⏱ ${formatDuration(
                  trip.total_duration_planned,
                )} driving`}
                styles={styles.statText}
              />
            )}
            <TextComponent
              text={`🛑 ${stops.length} stops`}
              styles={styles.statText}
            />
          </View>

          {/* NEW — capacity, visible to everyone */}
          {(trip.seats_left != null || trip.hauls_left != null) && (
            <View style={styles.capacityRow}>
              <TextComponent
                text={`👤 ${trip.seats_left ?? 0} seats left  •  🐴 ${
                  trip.hauls_left ?? 0
                } hauls left`}
                styles={styles.capacityText}
              />
            </View>
          )}

          {trip.estimated_departure_at && (
            <View style={styles.tripSpanRow}>
              <TextComponent
                text={
                  hasDwellTime
                    ? `📅 Trip span: ${formatDateShort(
                        trip.estimated_departure_at,
                      )} → ${formatDateShort(trip.estimated_arrival_at)}`
                    : `📅 ${formatDateTime(trip.estimated_departure_at)}`
                }
                styles={styles.tripSpanText}
              />
            </View>
          )}

          {/* NEW — organizer-only participants summary */}
          {isOrganizer && participantsSummary && (
            <Touchable
              onPress={goToManageRequests}
              style={styles.participantsRow}>
              <TextComponent
                text={`👥 ${participantsSummary.total} participant${
                  participantsSummary.total === 1 ? '' : 's'
                }${
                  participantsSummary.pending > 0
                    ? ` · ${participantsSummary.pending} pending`
                    : ''
                }`}
                styles={styles.participantsText}
              />
              <TextComponent
                text={'Manage →'}
                styles={styles.participantsLink}
              />
            </Touchable>
          )}
        </View>

        <VehicleCard vehicle={trip.vehicle} />

        <TextComponent text={'Itinerary'} styles={styles.sectionLabel} />
        <View style={styles.stopsCard}>
          {stops.map((stop, idx) => (
            <StopRow
              key={stop.id}
              stop={stop}
              isLast={idx === stops.length - 1}
              onArrive={markStopArrived}
              onDepart={markStopDeparted}
              tripStatus={trip.status}
              leg={legByStartStopId[stop.id]}
              canManage={isOrganizer}
            />
          ))}
        </View>
      </ScrollView>

      {/* Organizer: trip-management actions (unchanged from before) */}
      {isOrganizer && trip.status === 'confirmed' && (
        <View style={styles.bottomBar}>
          <ThemeButton
            title={'Cancel Trip'}
            style={styles.actionBtnSecondary}
            textStyle={styles.actionBtnSecondaryText}
            onPress={confirmCancelTrip}
          />
          <ThemeButton
            title={isUpdatingStatus ? 'Starting...' : 'Start Trip'}
            isYellowTheme
            disabled={isUpdatingStatus}
            style={styles.actionBtnPrimary}
            onPress={startTrip}
          />
        </View>
      )}
      {isOrganizer && trip.status === 'in_progress' && (
        <View style={styles.bottomBar}>
          <ThemeButton
            title={'Cancel Trip'}
            style={styles.actionBtnSecondary}
            textStyle={styles.actionBtnSecondaryText}
            onPress={confirmCancelTrip}
          />
          <ThemeButton
            title={isUpdatingStatus ? 'Completing...' : 'Complete Trip'}
            isYellowTheme
            disabled={isUpdatingStatus}
            style={styles.actionBtnPrimary}
            onPress={completeTrip}
          />
        </View>
      )}

      {/* NEW — joiner: Request to Join */}
      {!isOrganizer && isJoinable && (
        <View style={styles.bottomBar}>
          <ThemeButton
            title={isFullyBooked ? 'Fully Booked' : 'Request to Join'}
            isYellowTheme={!isFullyBooked}
            disabled={isFullyBooked}
            style={
              isFullyBooked
                ? styles.actionBtnSecondary
                : styles.actionBtnPrimaryFull
            }
            textStyle={
              isFullyBooked ? styles.actionBtnSecondaryText : undefined
            }
            onPress={goToRequestToJoin}
          />
        </View>
      )}
    </View>
  );
};

export default memo(TripDetailScreen);
