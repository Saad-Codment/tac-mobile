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
// NEW — offline map region download/status/removal for this trip.
// Self-contained component; only these two lines touch this file.
import OfflineMapButton from '../../Components/OfflineMapButton';
// NEW — weather at the next upcoming stop. WeatherCard/useStopWeather
// handle their own loading/unavailable states; this screen only decides
// *which* stop to ask about.
import WeatherCard from '../../Components/WeatherCard';
import {useStopWeather} from '../../Services/Weather/useStopWeather';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

const LEG_STATUS_META = {
  pending: {label: 'Not Started', color: '#6B7280'},
  active: {label: 'In Progress', color: '#F59E0B'},
  paused: {label: 'Paused', color: '#3B82F6'},
  completed: {label: 'Completed', color: '#22C55E'},
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

// CHANGED — leg connector is now tappable for the organizer, opening
// Leg Navigation, and shows the leg's live status (Not Started / In
// Progress / Paused / Completed) alongside its distance/duration.
const LegConnector = ({leg, isOrganizer, onPress}) => {
  if (!leg) return null;
  const km = (leg.distance_planned_meters / 1000).toFixed(1);
  const statusMeta = LEG_STATUS_META[leg.status] ?? {
    label: leg.status,
    color: '#6B7280',
  };

  const content = (
    <View style={styles.legConnector}>
      <View style={styles.legConnectorLine} />
      <TextComponent
        text={`🛣 ${km} km • ⏱ ${formatDuration(leg.duration_planned_seconds)}`}
        fade
        styles={styles.legConnectorText}
      />
      {isOrganizer && (
        <View
          style={[
            styles.legStatusBadge,
            {backgroundColor: statusMeta.color + '18'},
          ]}>
          <TextComponent
            text={statusMeta.label + ' →'}
            styles={[styles.legStatusBadgeText, {color: statusMeta.color}]}
            size={hp('1.5')}
          />
        </View>
      )}
    </View>
  );

  if (!isOrganizer) return content;

  return <Touchable onPress={() => onPress(leg)}>{content}</Touchable>;
};

const StopRow = ({
  stop,
  isLast,
  onArrive,
  onDepart,
  tripStatus,
  leg,
  canManage,
  onLegPress,
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
      {!isLast && (
        <LegConnector leg={leg} isOrganizer={canManage} onPress={onLegPress} />
      )}
    </>
  );
};

// NEW — participant/viewer banner shown when a leg is currently active
// or paused, entry point to the read-only Live Tracking screen.
const TrackLiveBanner = ({onPress}) => (
  <Touchable onPress={onPress} style={styles.trackLiveBanner}>
    <View style={styles.trackLivePulseDot} />
    <TextComponent
      text={'Trip is on the move — Track Live'}
      styles={styles.trackLiveText}
    />
    <TextComponent text={'→'} styles={styles.trackLiveArrow} />
  </Touchable>
);

// NEW — organizer-only "what's next" callout. Reads entirely off the
// backend-fetched trip/leg data (no local nav state): once a leg is
// completed and this screen refetches, this banner and its target leg
// update on their own. Distinguishes "already underway, jump back in"
// from "not started yet, start it" purely from the leg's own status.
const NextLegBanner = ({leg, startStop, endStop, onPress}) => {
  if (!leg) return null;
  const isResumable = leg.status === 'active' || leg.status === 'paused';
  const label = isResumable ? 'Leg In Progress' : 'Next Leg';
  const buttonTitle = isResumable ? 'Resume Navigation' : 'Start Next Leg';
  const km = leg.distance_planned_meters
    ? (leg.distance_planned_meters / 1000).toFixed(1)
    : null;

  return (
    <View style={styles.nextLegBanner}>
      <TextComponent text={label} styles={styles.nextLegBannerLabel} />
      <TextComponent
        text={`${startStop?.name ?? 'Departure'} → ${endStop?.name ?? 'Stop'}`}
        styles={styles.nextLegBannerRoute}
        numberOfLines={1}
      />
      {km && (
        <TextComponent
          text={`🛣 ${km} km • ⏱ ${formatDuration(
            leg.duration_planned_seconds,
          )}`}
          styles={styles.nextLegBannerMeta}
        />
      )}
      <Touchable
        onPress={() => onPress(leg)}
        style={styles.nextLegBannerBtn}>
        <TextComponent
          text={buttonTitle}
          styles={styles.nextLegBannerBtnText}
        />
      </Touchable>
    </View>
  );
};

const TripDetailScreen = ({navigation, route}) => {
  const {
    trip,
    isLoading,
    routeGeoJSON,
    mapBounds,
    legByStartStopId,
    nextLeg,
    nextLegStops,
    startTrip,
    completeTrip,
    confirmCancelTrip,
    markStopArrived,
    markStopDeparted,
    isUpdatingStatus,
    isOrganizer,
    participantsSummary,
    hasActiveLeg,
    goToManageRequests,
    goToRequestToJoin,
    goToLegNavigation,
    goToLiveTracking,
  } = useTripDetailScreen(navigation, route);

  // NEW — weather at the next upcoming stop (the next leg's destination,
  // or the first stop nobody has arrived at yet if no leg is underway).
  // Called unconditionally, before the loading early-return below, so
  // hook order stays stable across renders; useStopWeather itself is a
  // no-op (enabled: false) until it has real coordinates.
  const upcomingStop =
    nextLegStops?.endStop ??
    (trip?.stops ?? []).find(s => !s?.ata_actual) ??
    null;
  const stopWeather = useStopWeather(upcomingStop);

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

  const statusMeta = TRIP_STATUS_META[trip?.status] ?? {
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
        headerTitle={'Trip Detail'}
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

        {/* NEW — offline map download/status for this trip's region.
            Placed right after the map, ahead of everything else, since
            it's most useful decided early, before setting off. */}
        <View style={{marginBottom: hp('2')}}>
          <OfflineMapButton
            tripId={trip.id}
            stops={stops}
            routeGeoJSON={routeGeoJSON}
          />
        </View>

        {/* NEW — participant "Track Live" entry point */}
        {!isOrganizer && hasActiveLeg && (
          <TrackLiveBanner onPress={goToLiveTracking} />
        )}

        {/* NEW — organizer "what's next" callout. Only while the trip is
            actually underway — before that, Start Trip below is the next
            action, not any individual leg. */}
        {isOrganizer && trip.status === 'in_progress' && nextLeg && (
          <NextLegBanner
            leg={nextLeg}
            startStop={nextLegStops?.startStop}
            endStop={nextLegStops?.endStop}
            onPress={goToLegNavigation}
          />
        )}

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
                size={hp('1.5')}
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

        {/* NEW — weather at the next upcoming stop. Shown to organizer
            and participants alike; WeatherCard renders its own
            loading/unavailable states rather than hiding when there's
            nothing to show, since "unavailable" is itself real info. */}
        {upcomingStop && (
          <WeatherCard
            title={`Weather at ${upcomingStop.name ?? 'next stop'}`}
            isConfigured={stopWeather.isConfigured}
            isLoading={stopWeather.isLoading}
            current={stopWeather.current}
            forecast={stopWeather.forecast}
          />
        )}

        <TextComponent text={'Itinerary'} styles={styles.sectionLabel} />
        {isOrganizer && trip.status === 'in_progress' && (
          <TextComponent
            text={'Tap a leg below to navigate it'}
            fade
            styles={styles.legsHint}
          />
        )}
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
              onLegPress={goToLegNavigation}
            />
          ))}
        </View>
      </ScrollView>

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
            textStyle={{fontSize: hp('1.5')}}
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
            textStyle={{fontSize: hp('1.5')}}
          />
        </View>
      )}

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
