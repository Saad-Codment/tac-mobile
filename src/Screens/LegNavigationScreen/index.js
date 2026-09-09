import React, {memo, useState, useRef} from 'react';
import {
  View,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Linking,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {Touchable} from '../../Components/Touchable';
import ThemeButton from '../../Components/ThemeButton';
import {Colors} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import {MAPBOX_TOKEN} from '../../Utils/Urls';
import {POI_CATEGORIES, maneuverIcon} from '../../Utils/LegTrackingHelpers';
import {
  getRigLengthInfo,
  LENGTH_ROUTE_CONTEXT_TEXT,
  LENGTH_PLACE_SUITABILITY_TEXT,
} from '../../Utils/RouteRestrictions';
import useLegNavigationScreen from './useLegNavigationScreen';
import {describeFuelPriceUnavailable} from '../../Services/FuelPriceService';
import {describeWeighStationStatusUnavailable} from '../../Services/WeighStationService';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

const STATUS_META = {
  pending: {label: 'Not Started', color: '#6B7280'},
  active: {label: 'In Progress', color: '#2563EB'},
  paused: {label: 'Paused', color: '#F59E0B'},
  completed: {label: 'Completed', color: '#16A34A'},
};

const formatDuration = seconds => {
  if (seconds == null) return '—';
  const totalMin = Math.round(seconds / 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}`;
  return `${h}h ${m}m`;
};

const formatDurationUnit = seconds => {
  if (seconds == null) return '';
  const totalMin = Math.round(seconds / 60);
  return totalMin >= 60 ? '' : 'min';
};

const formatArrival = seconds => {
  if (seconds == null) return null;
  const arrival = new Date(Date.now() + seconds * 1000);
  return arrival.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

// CHANGED — markers are now tappable, calling onPress(poi). This was a
// confirmed gap in the last two audits: markers rendered but nothing
// happened when tapped.
const POIMarker = ({poi, color, icon, onPress}) => {
  if (!poi?.latitude || !poi?.longitude) return null;
  return (
    <MapboxGL.MarkerView coordinate={[poi.longitude, poi.latitude]}>
      <Touchable
        onPress={() => onPress(poi)}
        style={[S.poiMarker, {borderColor: color}]}>
        <TextComponent text={icon} styles={S.poiMarkerIcon} />
      </Touchable>
    </MapboxGL.MarkerView>
  );
};

const TurnByTurnBanner = ({currentStep, nextStep}) => {
  if (!currentStep) return null;
  const distanceKm =
    currentStep.distance != null
      ? (currentStep.distance / 1000).toFixed(1)
      : null;

  return (
    <View style={S.turnBanner}>
      <View style={S.turnBannerIconWrap}>
        <TextComponent
          text={maneuverIcon(currentStep)}
          styles={S.turnBannerIcon}
        />
      </View>
      <View style={S.turnBannerTextWrap}>
        <TextComponent
          text={currentStep.maneuver?.instruction ?? 'Continue'}
          styles={S.turnBannerText}
          numberOfLines={2}
        />
        {distanceKm && (
          <TextComponent
            text={`in ${distanceKm} km`}
            styles={S.turnBannerDistance}
          />
        )}
      </View>
      {nextStep?.maneuver?.instruction && (
        <View style={S.turnBannerNextWrap}>
          <TextComponent
            text={maneuverIcon(nextStep)}
            styles={S.turnBannerNextIcon}
          />
        </View>
      )}
    </View>
  );
};

// The new "parking" category shows up here automatically — this maps
// over POI_CATEGORIES, and nothing else about this component changed.
const POILayerControls = ({visiblePOICategories, togglePOICategory}) => (
  <View style={S.poiControlStack}>
    {POI_CATEGORIES.map(category => {
      const active = visiblePOICategories.has(category.key);
      return (
        <Touchable
          key={category.key}
          onPress={() => togglePOICategory(category.key)}
          style={[
            S.poiControlBtn,
            active && {
              backgroundColor: category.color,
              borderColor: category.color,
            },
          ]}>
          <TextComponent text={category.icon} styles={S.poiControlIcon} />
        </Touchable>
      );
    })}
  </View>
);

const RecenterButton = ({onPress}) => (
  <Touchable onPress={onPress} style={S.recenterBtn}>
    <TextComponent text={'⌖'} styles={S.recenterBtnIcon} />
  </Touchable>
);

const RouteWarningBanner = ({message, onDismiss}) => (
  <View style={S.routeWarningBanner}>
    <TextComponent text={'⚠️'} styles={S.routeWarningIcon} />
    <TextComponent
      text={message}
      styles={S.routeWarningText}
      numberOfLines={2}
    />
    <Touchable onPress={onDismiss} style={S.routeWarningDismiss}>
      <TextComponent text={'✕'} styles={S.routeWarningDismissText} />
    </Touchable>
  </View>
);

// NEW — POI detail sheet. Every field is either genuinely returned by
// Google Places Details, or an honest "not available" line — nothing
// here is fabricated. Fuel/weigh-station live data specifically call
// out that they need a provider this project doesn't have yet, rather
// than silently omitting the row.
const POIDetailSheet = ({
  poi,
  details,
  isLoading,
  fuelPrice,
  weighStatus,
  vehicle,
  onClose,
}) => {
  if (!poi) return null;
  const category = POI_CATEGORIES.find(c => c.key === poi.category);
  const rigLength = getRigLengthInfo(vehicle);
  const showRigContext =
    rigLength.hasLength &&
    (category?.key === 'parking' || category?.key === 'horse');

  return (
    <View style={S.poiSheetOverlay}>
      <View style={S.poiSheetCard}>
        <View style={S.poiSheetHeader}>
          <View
            style={[
              S.poiSheetIconWrap,
              {backgroundColor: (category?.color ?? '#3B82F6') + '20'},
            ]}>
            <TextComponent
              text={category?.icon ?? '📍'}
              styles={S.poiSheetIcon}
            />
          </View>
          <View style={{flex: 1}}>
            <TextComponent
              text={poi.name ?? category?.label ?? 'Location'}
              styles={S.poiSheetTitle}
              numberOfLines={2}
            />
            <TextComponent
              text={category?.label ?? ''}
              styles={S.poiSheetCategory}
            />
          </View>
          <Touchable onPress={onClose} style={S.poiSheetCloseBtn}>
            <TextComponent text={'✕'} styles={S.poiSheetCloseText} />
          </Touchable>
        </View>

        {category?.key === 'parking' && (
          <View style={S.poiSheetCaveat}>
            <TextComponent
              text={'Trailer-accessible potential'}
              styles={S.poiSheetCaveatTitle}
            />
            <TextComponent
              text={
                'Parking and maneuvering space can vary — check ahead for your rig.'
              }
              styles={S.poiSheetCaveatText}
            />
          </View>
        )}

        {category?.key === 'horse' && (
          <View style={S.poiSheetCaveat}>
            <TextComponent
              text={'Equine-related location'}
              styles={S.poiSheetCaveatTitle}
            />
            <TextComponent
              text={
                'Amenities and trailer access may vary — calling ahead is recommended.'
              }
              styles={S.poiSheetCaveatText}
            />
          </View>
        )}

        {showRigContext && (
          <View style={S.poiSheetRigRow}>
            <TextComponent
              text={`Your rig: ${rigLength.lengthLabel}`}
              styles={S.poiSheetRigText}
            />
            <TextComponent
              text={LENGTH_PLACE_SUITABILITY_TEXT}
              fade
              styles={S.poiSheetRigNote}
            />
          </View>
        )}

        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={Colors.primaryColor}
            style={{marginVertical: hp('2')}}
          />
        ) : (
          <View style={S.poiSheetBody}>
            {details?.address && (
              <TextComponent
                text={`📍 ${details.address}`}
                styles={S.poiSheetRow}
                numberOfLines={2}
              />
            )}
            {details?.phone && (
              <Touchable
                onPress={() => Linking.openURL(`tel:${details.phone}`)}>
                <TextComponent
                  text={`📞 ${details.phone}`}
                  styles={[S.poiSheetRow, S.poiSheetLink]}
                />
              </Touchable>
            )}
            {/* Places' generic business hours are deliberately not shown
                for weigh stations -- a listing's opening_hours is not
                the same thing as a scale being open for weigh-in, and
                showing one as the other would be exactly the kind of
                fabricated-status claim this project avoids. See
                WeighStationService.js. */}
            {details?.openNow != null && category?.key !== 'weigh' && (
              <TextComponent
                text={
                  details.openNow
                    ? '\ud83d\udfe2 Open now'
                    : '\ud83d\udd34 Closed now'
                }
                styles={S.poiSheetRow}
              />
            )}
            {details?.rating != null && (
              <TextComponent
                text={`\u2b50 ${details.rating} (${
                  details.ratingCount ?? 0
                } reviews)`}
                styles={S.poiSheetRow}
              />
            )}

            {category?.key === 'fuel' && (
              <>
                {details?.amenities?.length > 0 && (
                  <View style={S.poiAmenitiesRow}>
                    {details.amenities.map(a => (
                      <View key={a.type} style={S.poiAmenityChip}>
                        <TextComponent
                          text={`${a.icon} ${a.label}`}
                          styles={S.poiAmenityChipText}
                        />
                      </View>
                    ))}
                  </View>
                )}
                {fuelPrice?.unavailable || !fuelPrice?.prices?.length ? (
                  <TextComponent
                    text={describeFuelPriceUnavailable(fuelPrice?.reason)}
                    fade
                    styles={S.poiSheetUnavailable}
                  />
                ) : (
                  <View style={S.fuelPricesBlock}>
                    {fuelPrice.prices.map(p => (
                      <View key={p.fuelType} style={S.fuelPriceRow}>
                        <TextComponent
                          text={p.label}
                          styles={S.fuelPriceLabel}
                        />
                        <TextComponent
                          text={p.formatted ?? '—'}
                          styles={S.fuelPriceValue}
                        />
                      </View>
                    ))}
                    {fuelPrice.freshnessLabel && (
                      <TextComponent
                        text={fuelPrice.freshnessLabel}
                        fade
                        styles={S.fuelPriceFreshness}
                      />
                    )}
                  </View>
                )}
              </>
            )}
            {category?.key === 'weigh' && (
              <View>
                <TextComponent
                  text={
                    weighStatus?.unavailable || !weighStatus
                      ? describeWeighStationStatusUnavailable(
                          weighStatus?.reason,
                        )
                      : `Location Status: ${weighStatus.statusLabel}`
                  }
                  styles={
                    weighStatus?.unavailable || !weighStatus
                      ? [S.poiSheetUnavailable]
                      : [S.poiSheetRow, {fontWeight: '600'}]
                  }
                  fade={weighStatus?.unavailable || !weighStatus}
                />
                {!weighStatus?.unavailable && weighStatus?.note && (
                  <TextComponent
                    text={weighStatus.note}
                    fade
                    styles={S.poiSheetUnavailable}
                  />
                )}
              </View>
            )}
            {!details && !isLoading && (
              <TextComponent
                text={'No further details available for this location.'}
                fade
                styles={S.poiSheetUnavailable}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const CompleteLegModal = ({
  visible,
  distanceInput,
  setDistanceInput,
  onConfirm,
  onClose,
  isCompleting,
}) => {
  if (!visible) return null;
  return (
    <View style={S.modalOverlay}>
      <View style={S.modalCard}>
        <TextComponent text={'Complete Leg'} styles={S.modalTitle} />
        <TextComponent
          text={
            'Confirm the actual distance driven (pre-filled from GPS tracking — adjust if needed)'
          }
          fade
          styles={S.modalSubtitle}
        />
        <View style={S.modalInputRow}>
          <TextInput
            style={S.modalInput}
            value={distanceInput}
            onChangeText={setDistanceInput}
            keyboardType="decimal-pad"
            placeholder="0.0"
          />
          <TextComponent text={'km'} styles={S.modalInputSuffix} />
        </View>
        <View style={S.modalActions}>
          <ThemeButton
            title="Cancel"
            style={S.modalCancelBtn}
            textStyle={S.modalCancelBtnText}
            onPress={onClose}
          />
          <ThemeButton
            title={isCompleting ? 'Completing...' : 'Confirm Arrival'}
            isYellowTheme
            disabled={isCompleting}
            style={S.modalConfirmBtn}
            onPress={onConfirm}
          />
        </View>
      </View>
    </View>
  );
};

const LegNavigationScreen = ({navigation, route}) => {
  const {
    vehicle,
    leg,
    startStop,
    endStop,
    isLoading,
    routeGeoJSON,
    poisByCategory,
    visiblePOICategories,
    togglePOICategory,
    liveDistanceMeters,
    distanceInput,
    setDistanceInput,
    showCompleteModal,
    openCompleteModal,
    closeCompleteModal,
    confirmComplete,
    startLeg,
    pauseLeg,
    resumeLeg,
    isStarting,
    isPausing,
    isResuming,
    isCompleting,
    currentStep,
    nextStep,
    remaining,
    isRerouting,
    voiceEnabled,
    toggleVoice,
    usedRestrictions,
    routeWarning,
    dismissRouteWarning,
    weatherHazardWarning,
    dismissWeatherHazardWarning,
    // NEW
    selectedPOI,
    poiDetails,
    isLoadingPOIDetails,
    poiFuelPrice,
    poiWeighStatus,
    selectPOI,
    closePOIDetails,
  } = useLegNavigationScreen(navigation, route);

  const cameraRef = useRef(null);
  const [isFollowing, setIsFollowing] = useState(true);

  if (isLoading || !leg) {
    return (
      <View style={S.screenContainer}>
        <HeaderComponent
          headerTitle={'Leg Navigation'}
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

  const statusMeta = STATUS_META[leg.status] ?? {
    label: leg.status,
    color: '#6B7280',
  };
  const centerLat = startStop?.latitude
    ? parseFloat(startStop.latitude)
    : 24.86;
  const centerLng = startStop?.longitude
    ? parseFloat(startStop.longitude)
    : 67.0;
  const isActive = leg.status === 'active';
  const isPaused = leg.status === 'paused';
  const isPending = leg.status === 'pending';
  const isCompleted = leg.status === 'completed';

  const heroSeconds = isPending
    ? leg.duration_planned_seconds
    : remaining.durationSeconds;
  const heroDistanceKm = isPending
    ? leg.distance_planned_meters != null
      ? (leg.distance_planned_meters / 1000).toFixed(1)
      : null
    : (remaining.distanceMeters / 1000).toFixed(1);
  const arrival = formatArrival(heroSeconds);

  const handleRecenter = () => {
    setIsFollowing(true);
    cameraRef.current?.setCamera({
      followUserLocation: true,
      followUserMode: MapboxGL.UserTrackingMode.FollowWithCourse,
      followZoomLevel: 16,
      followPitch: 45,
      animationDuration: 500,
    });
  };

  return (
    <View style={S.screenContainer}>
      <HeaderComponent
        headerTitle={'Leg Navigation'}
        isBack
        goBack={() => navigation.goBack()}
        rightIcon={voiceEnabled ? '🔊' : '🔇'}
        onRightPress={toggleVoice}
      />

      <View style={S.mapArea}>
        <MapboxGL.MapView
          style={S.map}
          styleURL={MapboxGL.StyleURL.Street}
          logoEnabled={false}
          attributionEnabled={false}
          compassEnabled={isActive}
          compassViewPosition={0}
          onRegionWillChange={feature => {
            if (feature?.properties?.isUserInteraction) {
              setIsFollowing(false);
            }
          }}>
          <MapboxGL.Camera
            ref={cameraRef}
            defaultSettings={{
              centerCoordinate: [centerLng, centerLat],
              zoomLevel: 8,
            }}
            followUserLocation={isActive && isFollowing}
            followUserMode={MapboxGL.UserTrackingMode.FollowWithCourse}
            followZoomLevel={16}
            followPitch={45}
            animationMode="easeTo"
            animationDuration={800}
            padding={{
              paddingTop: isActive ? hp('12') : 0,
              paddingBottom: hp('30'),
              paddingLeft: 0,
              paddingRight: 0,
            }}
          />

          {routeGeoJSON && (
            <MapboxGL.ShapeSource id="legRouteSource" shape={routeGeoJSON}>
              <MapboxGL.LineLayer
                id="legRouteLine"
                style={{
                  lineColor: '#2563EB',
                  lineWidth: 5,
                  lineJoin: 'round',
                  lineCap: 'round',
                }}
              />
            </MapboxGL.ShapeSource>
          )}

          {startStop?.latitude && (
            <MapboxGL.MarkerView
              coordinate={[
                parseFloat(startStop.longitude),
                parseFloat(startStop.latitude),
              ]}>
              <View style={[S.endpointMarker, {backgroundColor: '#16A34A'}]}>
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

          {isActive && (
            <MapboxGL.UserLocation
              visible
              showsUserHeadingIndicator
              androidRenderMode="gps"
              minDisplacement={5}
            />
          )}

          {POI_CATEGORIES.map(
            category =>
              visiblePOICategories.has(category.key) &&
              (poisByCategory[category.key] ?? []).map(poi => (
                <POIMarker
                  key={poi.id}
                  poi={poi}
                  color={category.color}
                  icon={category.icon}
                  onPress={selectPOI}
                />
              )),
          )}
        </MapboxGL.MapView>

        {isActive && (
          <TurnByTurnBanner currentStep={currentStep} nextStep={nextStep} />
        )}

        <POILayerControls
          visiblePOICategories={visiblePOICategories}
          togglePOICategory={togglePOICategory}
        />

        {isActive && !isFollowing && (
          <RecenterButton onPress={handleRecenter} />
        )}

        {isRerouting && (
          <View style={S.reroutingBadge}>
            <ActivityIndicator size="small" color="white" />
            <TextComponent text={'Rerouting...'} styles={S.reroutingText} />
          </View>
        )}

        {!isRerouting && routeWarning && (
          <RouteWarningBanner
            message={routeWarning}
            onDismiss={dismissRouteWarning}
          />
        )}

        {/* NEW — Step 7: route-level weather hazard, only ever shown
            when the weather provider is configured and actually reports
            something worth flagging (see useLegNavigationScreen's
            weatherHazardWarning). Reuses the same banner rather than
            adding a second visual language, and only one banner shows
            at a time (reroute warnings take priority — both are rare
            and mutually non-urgent). */}
        {!isRerouting && !routeWarning && weatherHazardWarning && (
          <RouteWarningBanner
            message={weatherHazardWarning}
            onDismiss={dismissWeatherHazardWarning}
          />
        )}

        <View style={S.bottomPanel}>
          <View style={S.bottomPanelTopRow}>
            <TextComponent
              text={`${startStop?.name ?? 'Departure'} → ${
                endStop?.name ?? 'Stop'
              }`}
              styles={S.legTitle}
              numberOfLines={1}
            />
            <View style={[S.statusDot, {backgroundColor: statusMeta.color}]} />
            <TextComponent
              text={statusMeta.label}
              styles={[S.statusLabel, {color: statusMeta.color}]}
            />
          </View>

          {!isCompleted && usedRestrictions && (
            <View style={S.restrictionsBadge}>
              <View style={S.restrictionsBadgeRow}>
                <TextComponent text={'🛡️'} styles={S.restrictionsBadgeIcon} />
                <TextComponent
                  text={'Trailer-aware route'}
                  styles={S.restrictionsBadgeText}
                />
              </View>
              <TextComponent
                text={'Height • Width • Weight considered'}
                fade
                styles={S.restrictionsBadgeSubtext}
              />
              {getRigLengthInfo(vehicle).hasLength && (
                <TextComponent
                  text={`Rig length: ${
                    getRigLengthInfo(vehicle).lengthLabel
                  } · ${LENGTH_ROUTE_CONTEXT_TEXT}`}
                  fade
                  styles={S.restrictionsBadgeSubtext}
                />
              )}
            </View>
          )}

          {isCompleted ? (
            <View style={S.completedRow}>
              <TextComponent text={'✓'} styles={S.completedCheck} />
              <View>
                <TextComponent
                  text={'Leg completed'}
                  styles={S.completedTitle}
                />
                {leg.distance_actual_meters != null && (
                  <TextComponent
                    text={`${(leg.distance_actual_meters / 1000).toFixed(
                      1,
                    )} km • ${formatDuration(leg.duration_actual_seconds)} min`}
                    styles={S.completedSub}
                  />
                )}
              </View>
            </View>
          ) : (
            <>
              <View style={S.heroRow}>
                <TextComponent
                  text={formatDuration(heroSeconds)}
                  styles={S.heroNumber}
                />
                <TextComponent
                  text={formatDurationUnit(heroSeconds) || 'min'}
                  styles={S.heroUnit}
                />
              </View>
              <TextComponent
                text={[
                  heroDistanceKm ? `${heroDistanceKm} km` : null,
                  arrival ? `arrive ${arrival}` : null,
                ]
                  .filter(Boolean)
                  .join('  ·  ')}
                styles={S.heroSubline}
              />
              {isActive && (
                <TextComponent
                  text={`${(liveDistanceMeters / 1000).toFixed(
                    1,
                  )} km driven so far`}
                  styles={S.drivenSoFar}
                />
              )}
            </>
          )}

          <View style={S.bottomPanelActions}>
            {isPending && (
              <ThemeButton
                title={isStarting ? 'Starting...' : 'Start Leg'}
                isYellowTheme
                disabled={isStarting}
                style={S.actionBtnFull}
                textStyle={S.actionBtnFullText}
                onPress={startLeg}
              />
            )}
            {isActive && (
              <>
                <ThemeButton
                  title={isPausing ? 'Pausing...' : 'Pause'}
                  disabled={isPausing}
                  style={S.actionBtnSecondary}
                  textStyle={S.actionBtnSecondaryText}
                  onPress={pauseLeg}
                />
                <ThemeButton
                  title={'Arrived'}
                  isYellowTheme
                  style={S.actionBtnPrimary}
                  textStyle={S.actionBtnFullText}
                  onPress={openCompleteModal}
                />
              </>
            )}
            {isPaused && (
              <>
                <ThemeButton
                  title={isResuming ? 'Resuming...' : 'Resume'}
                  disabled={isResuming}
                  style={S.actionBtnSecondary}
                  textStyle={S.actionBtnSecondaryText}
                  onPress={resumeLeg}
                />
                <ThemeButton
                  title={'Arrived'}
                  isYellowTheme
                  style={S.actionBtnPrimary}
                  textStyle={S.actionBtnFullText}
                  onPress={openCompleteModal}
                />
              </>
            )}
          </View>
        </View>
      </View>

      <POIDetailSheet
        poi={selectedPOI}
        details={poiDetails}
        isLoading={isLoadingPOIDetails}
        fuelPrice={poiFuelPrice}
        weighStatus={poiWeighStatus}
        vehicle={vehicle}
        onClose={closePOIDetails}
      />

      <CompleteLegModal
        visible={showCompleteModal}
        distanceInput={distanceInput}
        setDistanceInput={setDistanceInput}
        onConfirm={confirmComplete}
        onClose={closeCompleteModal}
        isCompleting={isCompleting}
      />
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

  poiMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  poiMarkerIcon: {fontSize: hp('1.1')},

  turnBanner: {
    position: 'absolute',
    top: hp('1.5'),
    left: wp('3'),
    right: wp('3'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: wp('3.2'),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  turnBannerIconWrap: {
    width: wp('11'),
    height: wp('11'),
    borderRadius: wp('5.5'),
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3'),
  },
  turnBannerIcon: {fontSize: hp('2')},
  turnBannerTextWrap: {flex: 1},
  turnBannerText: {fontSize: hp('1.55'), fontWeight: '700', color: 'white'},
  turnBannerDistance: {
    fontSize: hp('1.15'),
    color: '#94A3B8',
    marginTop: hp('0.2'),
  },
  turnBannerNextWrap: {
    width: wp('8'),
    height: wp('8'),
    borderRadius: wp('4'),
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('2'),
  },
  turnBannerNextIcon: {fontSize: hp('1.3')},

  poiControlStack: {
    position: 'absolute',
    top: hp('9'),
    right: wp('3'),
    gap: hp('1'),
  },
  poiControlBtn: {
    width: wp('10.5'),
    height: wp('10.5'),
    borderRadius: wp('5.25'),
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  poiControlIcon: {fontSize: hp('1.5')},

  recenterBtn: {
    position: 'absolute',
    bottom: hp('34'),
    right: wp('3'),
    width: wp('12'),
    height: wp('12'),
    borderRadius: wp('6'),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  recenterBtnIcon: {fontSize: hp('2.6'), color: '#2563EB', fontWeight: '700'},

  reroutingBadge: {
    position: 'absolute',
    bottom: hp('34'),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2'),
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 999,
    paddingHorizontal: wp('4'),
    paddingVertical: hp('0.8'),
  },
  reroutingText: {fontSize: hp('1.2'), color: 'white', fontWeight: '600'},

  routeWarningBanner: {
    position: 'absolute',
    bottom: hp('34'),
    left: wp('4'),
    right: wp('4'),
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
  routeWarningIcon: {fontSize: hp('1.6')},
  routeWarningText: {
    flex: 1,
    fontSize: hp('1.2'),
    color: '#92400E',
    fontWeight: '600',
  },
  routeWarningDismiss: {padding: wp('1')},
  routeWarningDismissText: {
    fontSize: hp('1.3'),
    color: '#92400E',
    fontWeight: '700',
  },

  // NEW — POI detail sheet
  poiSheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    elevation: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  poiSheetCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: wp('5'),
    paddingBottom: hp('4'),
  },
  poiSheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp('3'),
  },
  poiSheetIconWrap: {
    width: wp('11'),
    height: wp('11'),
    borderRadius: wp('5.5'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  poiSheetIcon: {fontSize: hp('2')},
  poiSheetTitle: {fontSize: hp('1.8'), fontWeight: '700', color: '#0F172A'},
  poiSheetCategory: {
    fontSize: hp('1.15'),
    color: '#64748B',
    marginTop: hp('0.2'),
  },
  poiSheetCloseBtn: {padding: wp('1')},
  poiSheetCloseText: {fontSize: hp('1.6'), color: '#94A3B8'},
  poiSheetCaveat: {
    marginTop: hp('1.4'),
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: wp('3'),
  },
  poiSheetCaveatTitle: {
    fontSize: hp('1.25'),
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: hp('0.2'),
  },
  poiSheetCaveatText: {
    fontSize: hp('1.15'),
    color: '#1E40AF',
    lineHeight: hp('1.7'),
  },
  poiSheetRigRow: {
    marginTop: hp('1'),
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: wp('3'),
  },
  poiSheetRigText: {
    fontSize: hp('1.2'),
    fontWeight: '700',
    color: '#334155',
  },
  poiSheetRigNote: {
    fontSize: hp('1.05'),
    color: '#64748B',
    marginTop: hp('0.2'),
  },
  poiSheetBody: {marginTop: hp('1.6'), gap: hp('1')},
  poiSheetRow: {fontSize: hp('1.35'), color: '#334155'},
  poiSheetLink: {color: '#2563EB', fontWeight: '600'},
  poiSheetUnavailable: {
    fontSize: hp('1.15'),
    color: '#94A3B8',
    marginTop: hp('0.4'),
  },
  // Fuel-stop amenity chips, sourced from Places' own `types`
  // (AMENITY_TYPE_LABELS in PlacesDetailsService.js), never fabricated.
  poiAmenitiesRow: {flexDirection: 'row', flexWrap: 'wrap', gap: wp('1.5')},
  poiAmenityChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    paddingHorizontal: wp('2.5'),
    paddingVertical: hp('0.4'),
  },
  poiAmenityChipText: {fontSize: hp('1.05'), color: '#334155'},
  // NEW — real Google fuel prices (Places API New `fuelOptions`),
  // prioritized by fuel type; only types Google actually returned.
  fuelPricesBlock: {marginTop: hp('0.4')},
  fuelPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('0.3'),
  },
  fuelPriceLabel: {fontSize: hp('1.2'), color: '#334155'},
  fuelPriceValue: {fontSize: hp('1.2'), fontWeight: '700', color: '#0F172A'},
  fuelPriceFreshness: {
    fontSize: hp('1.05'),
    color: '#94A3B8',
    marginTop: hp('0.4'),
  },

  bottomPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
  bottomPanelTopRow: {flexDirection: 'row', alignItems: 'center', gap: wp('2')},
  legTitle: {
    flex: 1,
    fontSize: hp('1.35'),
    fontWeight: '600',
    color: '#64748B',
  },
  statusDot: {width: 7, height: 7, borderRadius: 3.5},
  statusLabel: {fontSize: hp('1.15'), fontWeight: '700'},

  restrictionsBadge: {
    marginTop: hp('0.8'),
  },
  restrictionsBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5'),
  },
  restrictionsBadgeIcon: {fontSize: hp('1.1')},
  restrictionsBadgeText: {
    fontSize: hp('1.05'),
    color: '#166534',
    fontWeight: '600',
  },
  restrictionsBadgeSubtext: {
    fontSize: hp('1'),
    color: '#64748B',
    marginTop: hp('0.2'),
  },

  heroRow: {flexDirection: 'row', alignItems: 'flex-end', marginTop: hp('1.2')},
  heroNumber: {
    fontSize: hp('5.2'),
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: hp('5.6'),
  },
  heroUnit: {
    fontSize: hp('1.8'),
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: wp('1.5'),
    marginBottom: hp('0.8'),
  },
  heroSubline: {
    fontSize: hp('1.5'),
    color: '#475569',
    fontWeight: '500',
    marginTop: hp('0.2'),
  },
  drivenSoFar: {fontSize: hp('1.2'), color: '#94A3B8', marginTop: hp('0.8')},

  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3'),
    marginTop: hp('1.5'),
  },
  completedCheck: {
    fontSize: hp('2.6'),
    color: 'white',
    backgroundColor: '#16A34A',
    width: wp('12'),
    height: wp('12'),
    borderRadius: wp('6'),
    textAlign: 'center',
    lineHeight: wp('12'),
    overflow: 'hidden',
  },
  completedTitle: {fontSize: hp('1.7'), fontWeight: '700', color: '#0F172A'},
  completedSub: {fontSize: hp('1.3'), color: '#64748B', marginTop: hp('0.2')},

  bottomPanelActions: {
    flexDirection: 'row',
    gap: wp('3'),
    marginTop: hp('2.2'),
  },
  actionBtnFull: {flex: 1, height: hp('4.5'), borderRadius: 14},
  actionBtnFullText: {fontSize: hp('1.55'), fontWeight: '700'},
  actionBtnPrimary: {flex: 1, height: hp('4.5'), borderRadius: 14},
  actionBtnSecondary: {
    flex: 1,
    height: hp('4.5'),
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  actionBtnSecondaryText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: hp('1.55'),
  },

  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: wp('6'),
  },
  modalCard: {backgroundColor: 'white', borderRadius: 18, padding: wp('5')},
  modalTitle: {fontSize: hp('1.8'), fontWeight: '700', color: '#111827'},
  modalSubtitle: {
    fontSize: hp('1.2'),
    color: '#64748B',
    marginTop: hp('0.5'),
    lineHeight: hp('1.7'),
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2'),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: wp('3.5'),
  },
  modalInput: {
    flex: 1,
    height: hp('5.5'),
    fontSize: hp('1.8'),
    color: '#111827',
  },
  modalInputSuffix: {fontSize: hp('1.4'), color: '#64748B', fontWeight: '600'},
  modalActions: {flexDirection: 'row', gap: wp('3'), marginTop: hp('2')},
  modalCancelBtn: {
    flex: 1,
    height: hp('5.2'),
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalCancelBtnText: {color: '#1F2937', fontWeight: '600'},
  modalConfirmBtn: {flex: 1, height: hp('5.2'), borderRadius: 12},
});

export default memo(LegNavigationScreen);
