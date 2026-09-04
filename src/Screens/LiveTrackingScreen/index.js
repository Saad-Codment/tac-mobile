import React, {memo} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {Colors} from '../../Theme/Variables';
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

      <View style={S.mapCard}>
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
              <View style={S.organizerMarkerWrap}>
                <View
                  style={[
                    S.organizerDot,
                    positionIsStale && S.organizerDotStale,
                  ]}
                />
              </View>
            </MapboxGL.MarkerView>
          )}
        </MapboxGL.MapView>
      </View>

      <ScrollView
        contentContainerStyle={S.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={S.statusCard}>
          {organizerLocation ? (
            <>
              <TextComponent
                text={'🚚 Organizer Location'}
                styles={S.statusTitle}
              />
              <TextComponent
                text={
                  positionIsStale
                    ? `⚠️ Last updated ${stalenessLabel} — position may be outdated`
                    : `Updated ${stalenessLabel}`
                }
                styles={positionIsStale ? S.staleText : S.freshText}
              />
            </>
          ) : (
            <TextComponent
              text={"Waiting for the organizer's location..."}
              fade
              styles={S.statusTitle}
            />
          )}
        </View>

        <TextComponent text={'Trip Legs'} styles={S.sectionLabel} />
        <View style={S.legsCard}>
          {legs.map(leg => (
            <LegStatusRow key={leg.id} leg={leg} stops={trip?.stops ?? []} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const S = StyleSheet.create({
  screenContainer: {flex: 1, backgroundColor: '#F8FAFC'},
  mapCard: {height: hp('38')},
  map: {flex: 1},

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

  organizerMarkerWrap: {alignItems: 'center', justifyContent: 'center'},
  organizerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    borderWidth: 3,
    borderColor: 'white',
  },
  organizerDotStale: {backgroundColor: '#9CA3AF'},

  scrollContent: {padding: wp('4'), paddingBottom: hp('4')},

  statusCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: wp('4'),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statusTitle: {fontSize: hp('1.5'), fontWeight: '700', color: '#111827'},
  freshText: {fontSize: hp('1.2'), color: '#64748B', marginTop: hp('0.4')},
  staleText: {
    fontSize: hp('1.2'),
    color: '#B45309',
    marginTop: hp('0.4'),
    fontWeight: '600',
  },

  sectionLabel: {
    fontSize: hp('1.5'),
    fontWeight: '700',
    color: '#111827',
    marginTop: hp('2'),
    marginBottom: hp('1'),
  },
  legsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: wp('4'),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
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
