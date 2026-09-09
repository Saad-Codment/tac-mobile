import React, {memo, useEffect, useRef} from 'react';
import {View, ScrollView, Animated, StyleSheet} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {hp, wp} from '../../Config/responsive';
import {MAPBOX_TOKEN} from '../../Utils/Urls';
import useLiveTrackingScreen from './useLiveTrackingScreen';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

const LEG_STATUS_META = {
  pending: {label: 'Upcoming', color: '#6B7280'},
  active: {label: 'In Progress', color: '#F59E0B'},
  paused: {label: 'Paused', color: '#3B82F6'},
  completed: {label: 'Done', color: '#22C55E'},
};

const LegStatusRow = ({leg, stops}) => {
  const meta = LEG_STATUS_META[leg.status] ?? {
    label: leg.status,
    color: '#6B7280',
  };
  const startStop = stops.find(s => s.id === leg.start_stop_id);
  const endStop = stops.find(s => s.id === leg.end_stop_id);
  return (
    <View style={S.legRow}>
      <View style={[S.legDot, {backgroundColor: meta.color}]} />
      <TextComponent
        text={`${startStop?.name ?? 'Stop'} → ${endStop?.name ?? 'Stop'}`}
        styles={S.legRowText}
        numberOfLines={1}
      />
      <TextComponent
        text={meta.label}
        styles={[S.legRowStatus, {color: meta.color}]}
      />
    </View>
  );
};

// Visual-only: a looping radar-style halo behind the organizer's dot, so
// a live/updating position reads as "live" on the map rather than a
// static pin. Purely presentational — no data/props from the hook are
// involved, just an Animated loop local to this component.
const OrganizerMarker = ({stale}) => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const haloScale = pulse.interpolate({inputRange: [0, 1], outputRange: [1, 2.4]});
  const haloOpacity = pulse.interpolate({inputRange: [0, 1], outputRange: [0.45, 0]});
  const haloColor = stale ? '#9CA3AF' : '#3B82F6';

  return (
    <View style={S.organizerMarkerWrap}>
      <Animated.View
        style={[
          S.organizerHalo,
          {
            backgroundColor: haloColor,
            opacity: haloOpacity,
            transform: [{scale: haloScale}],
          },
        ]}
      />
      <View style={[S.organizerDot, stale && S.organizerDotStale]} />
    </View>
  );
};

const LiveTrackingScreen = ({navigation, route}) => {
  const {
    trip,
    legs,
    activeLeg,
    startStop,
    endStop,
    organizerLocation,
    stalenessLabel,
    positionIsStale,
    goBack,
  } = useLiveTrackingScreen(navigation, route);

  const centerLat =
    organizerLocation?.latitude ??
    (startStop?.latitude ? parseFloat(startStop.latitude) : 24.86);
  const centerLng =
    organizerLocation?.longitude ??
    (startStop?.longitude ? parseFloat(startStop.longitude) : 67.0);

  return (
    <View style={S.screenContainer}>
      <HeaderComponent headerTitle={'Live Tracking'} isBack goBack={goBack} />

      <View style={S.mapArea}>
        <MapboxGL.MapView
          style={S.map}
          styleURL={MapboxGL.StyleURL.Street}
          logoEnabled={false}
          attributionEnabled={false}>
          <MapboxGL.Camera
            centerCoordinate={[centerLng, centerLat]}
            zoomLevel={organizerLocation ? 11 : 7}
            animationDuration={800}
          />

          {startStop?.latitude && (
            <MapboxGL.MarkerView
              coordinate={[
                parseFloat(startStop.longitude),
                parseFloat(startStop.latitude),
              ]}>
              <View style={[S.endpointMarker, {backgroundColor: '#22C55E'}]}>
                <TextComponent text={'🚩'} styles={S.endpointMarkerText} />
              </View>
            </MapboxGL.MarkerView>
          )}
          {endStop?.latitude && (
            <MapboxGL.MarkerView
              coordinate={[
                parseFloat(endStop.longitude),
                parseFloat(endStop.latitude),
              ]}>
              <View style={[S.endpointMarker, {backgroundColor: '#EF4444'}]}>
                <TextComponent text={'🏁'} styles={S.endpointMarkerText} />
              </View>
            </MapboxGL.MarkerView>
          )}

          {organizerLocation && (
            <MapboxGL.MarkerView
              coordinate={[
                organizerLocation.longitude,
                organizerLocation.latitude,
              ]}>
              <OrganizerMarker stale={positionIsStale} />
            </MapboxGL.MarkerView>
          )}
        </MapboxGL.MapView>

        {/* Reuses the same warning-banner visual language as
            LegNavigationScreen's routeWarningBanner — a stale position is
            a meaningful state and deserves more than a small colored
            text line. */}
        {positionIsStale && (
          <View style={S.staleBanner}>
            <TextComponent text={'⚠️'} styles={S.staleBannerIcon} />
            <TextComponent
              text={`Last updated ${stalenessLabel} — position may be outdated`}
              styles={S.staleBannerText}
              numberOfLines={2}
            />
          </View>
        )}

        <View style={S.bottomPanel}>
          {organizerLocation ? (
            <View style={S.statusRow}>
              <TextComponent text={'🚚 Organizer Location'} styles={S.statusTitle} />
              {!positionIsStale && (
                <TextComponent
                  text={`Updated ${stalenessLabel}`}
                  fade
                  styles={S.freshText}
                />
              )}
            </View>
          ) : (
            <TextComponent
              text={"Waiting for the organizer's location..."}
              fade
              styles={S.statusTitle}
            />
          )}

          <TextComponent text={'Trip Legs'} styles={S.sectionLabel} />
          <ScrollView
            style={S.legsScroll}
            showsVerticalScrollIndicator={false}>
            {legs.map(leg => (
              <LegStatusRow key={leg.id} leg={leg} stops={trip?.stops ?? []} />
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const S = StyleSheet.create({
  screenContainer: {flex: 1, backgroundColor: '#F8FAFC'},
  mapArea: {flex: 1},
  map: {...StyleSheet.absoluteFillObject},

  endpointMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  endpointMarkerText: {fontSize: hp('1.3')},

  organizerMarkerWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  organizerHalo: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  organizerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    borderWidth: 3,
    borderColor: 'white',
  },
  organizerDotStale: {backgroundColor: '#9CA3AF'},

  staleBanner: {
    position: 'absolute',
    top: hp('1.5'),
    left: wp('3'),
    right: wp('3'),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2'),
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 14,
    paddingHorizontal: wp('3.5'),
    paddingVertical: hp('1'),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  staleBannerIcon: {fontSize: hp('1.6')},
  staleBannerText: {
    flex: 1,
    fontSize: hp('1.2'),
    color: '#92400E',
    fontWeight: '600',
  },

  bottomPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: hp('42'),
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: wp('5'),
    paddingTop: hp('2'),
    paddingBottom: hp('3'),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -6},
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusTitle: {fontSize: hp('1.5'), fontWeight: '700', color: '#111827'},
  freshText: {fontSize: hp('1.15'), color: '#64748B'},

  sectionLabel: {
    fontSize: hp('1.35'),
    fontWeight: '700',
    color: '#64748B',
    marginTop: hp('1.6'),
    marginBottom: hp('0.6'),
  },
  legsScroll: {flexGrow: 0},
  legRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5'),
    paddingVertical: hp('0.9'),
  },
  legDot: {width: 10, height: 10, borderRadius: 5},
  legRowText: {
    flex: 1,
    fontSize: hp('1.3'),
    color: '#111827',
    fontWeight: '500',
  },
  legRowStatus: {fontSize: hp('1.15'), fontWeight: '700'},
});

export default memo(LiveTrackingScreen);
