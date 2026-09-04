import React, {memo, useState, useRef, useEffect} from 'react';
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Switch,
  TextInput,
  Animated,
  PanResponder,
  Keyboard,
  Platform,
  Dimensions,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';
import {Touchable} from '../../Components/Touchable';
import {editProfileBlack} from '../../Assets';
import ThemeButton from '../../Components/ThemeButton';
import useEventMapScreen from './useEventMapScreen';
import {imageUrl, MAPBOX_TOKEN} from '../../Utils/Urls';
import {styles} from './styles';
import StopScheduleModal from '../../Components/StopScheduleModal';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

// ── Drag / snap constants — no library, just plain pixel math ──────────────
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SNAP_PEEK = SCREEN_HEIGHT * 0.12;
const SNAP_DEFAULT = SCREEN_HEIGHT * 0.45;
const SNAP_EXPANDED = SCREEN_HEIGHT * 0.92;
const SNAP_POINTS = [SNAP_PEEK, SNAP_DEFAULT, SNAP_EXPANDED];

// ── Helpers ─────────────────────────────────────────────────────────────────
const parseDate = str => (str ? new Date(str.replace(' ', 'T')) : null);

const formatDate = str => {
  const d = parseDate(str);
  if (!d) return '—';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = str => {
  const d = parseDate(str);
  if (!d) return '—';
  return d.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
};

const formatScheduleDateTime = d => {
  if (!d) return null;
  const dt = d instanceof Date ? d : new Date(d);
  if (isNaN(dt.getTime())) return null;
  return dt.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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

// ── Markers ────────────────────────────────────────────────────────────────
const NearbyPin = ({event, onPress}) => (
  <MapboxGL.MarkerView
    coordinate={[parseFloat(event?.longitude), parseFloat(event?.latitude)]}>
    <Touchable onPress={() => onPress(event)} style={styles.nearbyPin}>
      <TextComponent text={'📍'} styles={styles.nearbyPinText} />
    </Touchable>
  </MapboxGL.MarkerView>
);

const StopMarker = ({stop, index, total, onPress}) => {
  const color = getMarkerColor(index, total);
  return (
    <MapboxGL.MarkerView
      coordinate={[parseFloat(stop?.longitude), parseFloat(stop?.latitude)]}>
      <Touchable
        onPress={() => onPress(stop, index)}
        style={[styles.stopMarker, {backgroundColor: color}]}>
        <TextComponent
          text={index === 0 ? '🚩' : String(index)}
          styles={styles.stopMarkerText}
        />
      </Touchable>
    </MapboxGL.MarkerView>
  );
};

const CurrentLocationMarker = ({coordinate}) => (
  <MapboxGL.MarkerView coordinate={[coordinate.longitude, coordinate.latitude]}>
    <View style={styles.currentLocationContainer}>
      <View style={styles.currentLocationPulse} />
      <View style={styles.currentLocationDot} />
    </View>
  </MapboxGL.MarkerView>
);

// ── Cards ───────────────────────────────────────────────────────────────────
const StopCard = ({
  stop,
  index,
  total,
  onRemove,
  isEditing,
  schedule,
  onEditSchedule,
}) => {
  const color = getMarkerColor(index, total);
  const isFirst = index === 0;

  const eta = schedule?.etaPlanned;
  const etd = schedule?.etdPlanned;
  let scheduleSummary;
  if (eta && etd) {
    scheduleSummary = `Arrive ${formatScheduleDateTime(
      eta,
    )} • Leave ${formatScheduleDateTime(etd)}`;
  } else if (eta) {
    scheduleSummary = `Arrive ${formatScheduleDateTime(eta)}`;
  } else if (etd) {
    scheduleSummary = `Leave ${formatScheduleDateTime(etd)}`;
  } else {
    scheduleSummary = 'Tap to set your planned time';
  }

  return (
    <View style={styles.stopCard}>
      <View style={[styles.stopColorBar, {backgroundColor: color}]} />
      <View style={styles.stopCardContent}>
        <View style={styles.stopCardHeader}>
          <View
            style={[
              styles.stopIndexBubble,
              {backgroundColor: color + '15', borderColor: color},
            ]}>
            <TextComponent
              text={isFirst ? '🚩' : String(index)}
              styles={[styles.stopIndexText, {color}]}
            />
          </View>
          <View style={styles.stopCardTitleWrapper}>
            <TextComponent
              text={isFirst ? 'Departure' : stop?.title ?? `Stop ${index}`}
              styles={styles.stopCardTitle}
              numberOfLines={1}
            />
            <TextComponent
              text={stop?.address ?? '—'}
              fade
              styles={styles.stopCardAddress}
              numberOfLines={2}
            />
          </View>
          {isEditing && !isFirst && (
            <Touchable
              onPress={() => onRemove(index)}
              style={styles.removeStopBtn}>
              <TextComponent text={'✕'} styles={styles.removeStopBtnText} />
            </Touchable>
          )}
        </View>

        {!isFirst && (
          <View style={styles.stopMeta}>
            <TextComponent
              text={`📅 ${formatDate(stop?.from_date)}`}
              fade
              styles={styles.stopMetaText}
            />
            <TextComponent
              text={`⏰ ${formatTime(stop?.start_time)} – ${formatTime(
                stop?.end_time,
              )}`}
              fade
              styles={styles.stopMetaText}
            />
          </View>
        )}

        {onEditSchedule && (
          <Touchable
            onPress={() => onEditSchedule(stop)}
            style={styles.stopScheduleRow}>
            <TextComponent text={'🕒'} styles={styles.stopScheduleIcon} />
            <TextComponent
              text={scheduleSummary}
              fade
              styles={styles.stopScheduleText}
            />
            <TextComponent text={'Edit'} styles={styles.stopScheduleEditText} />
          </Touchable>
        )}
      </View>
    </View>
  );
};

const NearbyEventCard = ({item, onAdd}) => (
  <View style={styles.nearbyCard}>
    <View style={styles.nearbyCardImgContainer}>
      {item?.images ? (
        <Image
          source={{uri: imageUrl(JSON.parse(item.images)[0])}}
          style={styles.nearbyCardImg}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.nearbyCardImg, styles.nearbyCardImgPlaceholder]}>
          <Image
            source={editProfileBlack}
            style={styles.nearbyCardPlaceholderIcon}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
    <View style={styles.nearbyCardBody}>
      <TextComponent
        text={item?.title ?? '—'}
        styles={styles.nearbyCardTitle}
        numberOfLines={1}
      />
      <TextComponent
        text={item?.address ?? '—'}
        fade
        styles={styles.nearbyCardAddress}
        numberOfLines={1}
      />
      <View style={{flexDirection: 'row', alignItems: 'center', gap: wp('2')}}>
        <TextComponent
          text={`📅 ${formatDate(item?.from_date)}`}
          fade
          styles={styles.nearbyCardDate}
        />
        {item?.distance_miles != null && (
          <TextComponent
            text={`• ${item.distance_miles} mi`}
            fade
            styles={styles.nearbyCardDate}
          />
        )}
      </View>
    </View>
    <Touchable onPress={() => onAdd(item)} style={styles.nearbyAddBtn}>
      <TextComponent text={'+ Add'} styles={styles.nearbyAddBtnText} />
    </Touchable>
  </View>
);

const NearbySourceToggle = ({nearbySource, onChange}) => (
  <View style={styles.nearbySourceRow}>
    <Touchable
      onPress={() => onChange('current')}
      style={[
        styles.nearbySourceChip,
        nearbySource === 'current' && styles.nearbySourceChipActive,
      ]}>
      <TextComponent
        text={'📍 Near Me'}
        styles={[
          styles.nearbySourceChipText,
          nearbySource === 'current' && styles.nearbySourceChipTextActive,
        ]}
      />
    </Touchable>
    <Touchable
      onPress={() => onChange('event')}
      style={[
        styles.nearbySourceChip,
        nearbySource === 'event' && styles.nearbySourceChipActive,
      ]}>
      <TextComponent
        text={'🎯 Near Event'}
        styles={[
          styles.nearbySourceChipText,
          nearbySource === 'event' && styles.nearbySourceChipTextActive,
        ]}
      />
    </Touchable>
  </View>
);

const DepartureTimeRow = ({etdPlanned, onPress}) => (
  <Touchable onPress={onPress} style={styles.departureTimeRow}>
    <View style={styles.departureTimeLeft}>
      <TextComponent
        text={'🚗 Departure Time'}
        styles={styles.departureTimeLabel}
      />
      <TextComponent
        text={'When you plan to leave your current location'}
        fade
        styles={styles.departureTimeHint}
      />
    </View>
    <TextComponent
      text={formatScheduleDateTime(etdPlanned) ?? 'Set time'}
      styles={styles.departureTimeValue}
    />
  </Touchable>
);

// Real vehicles from GET /trucking/v1/vehicles — field names match the
// authoritative backend doc: vehicle_number, weight_kg (not weight_cm).
// CHANGED — restores the See More Vehicles action. hasMoreVehicles and
// onSeeMore were already being returned by useEventMapScreen.js and the
// styles already existed in styles.js — neither was ever wired into
// this component, which is exactly why vehicles beyond the first 10
// became unreachable. Two additions only: the two new props, and the
// button rendered right after the vehicle list.
const VehicleSheet = ({
  vehicles,
  isLoading,
  vehicle,
  onSelect,
  onClose,
  onAddNew,
  hasMoreVehicles,
  onSeeMore,
}) => (
  <ScrollView style={styles.vehicleSheet} showsVerticalScrollIndicator={false}>
    <TextComponent text={'Select Vehicle'} styles={styles.sheetTitle} />
    <TextComponent
      text={'Your vehicle specs affect the route optimization.'}
      fade
      styles={styles.sheetSubtitle}
    />

    {isLoading ? (
      <ActivityIndicator
        size="small"
        color={Colors.primaryColor}
        style={{marginVertical: hp('2')}}
      />
    ) : vehicles.length === 0 ? (
      <TextComponent
        text={'No vehicles saved yet.'}
        fade
        styles={styles.sheetEmpty}
      />
    ) : (
      vehicles.map(v => (
        <Touchable
          key={v.id}
          onPress={() => onSelect(v)}
          style={[
            styles.vehicleItem,
            vehicle?.id === v.id && styles.vehicleItemSelected,
          ]}>
          <View style={styles.vehicleItemLeft}>
            <TextComponent text={v.title} styles={styles.vehicleItemTitle} />
            <TextComponent
              text={`#${v.vehicle_number} • H: ${v.height_cm}cm • W: ${v.weight_kg}kg • Axles: ${v.axle_count}`}
              fade
              styles={styles.vehicleItemMeta}
            />
          </View>
          {vehicle?.id === v.id && <View style={styles.vehicleSelectedDot} />}
        </Touchable>
      ))
    )}

    {hasMoreVehicles && (
      <Touchable onPress={onSeeMore} style={styles.seeMoreVehiclesBtn}>
        <TextComponent
          text={'See More Vehicles'}
          styles={styles.seeMoreVehiclesBtnText}
        />
        <TextComponent text={'→'} styles={styles.seeMoreVehiclesBtnArrow} />
      </Touchable>
    )}

    <Touchable onPress={onAddNew} style={styles.addVehicleBtn}>
      <TextComponent
        text={'+ Add New Vehicle'}
        styles={styles.addVehicleBtnText}
      />
    </Touchable>

    <Touchable onPress={onClose} style={styles.sheetCloseBtn}>
      <TextComponent text={'Done'} styles={styles.sheetCloseBtnText} />
    </Touchable>
  </ScrollView>
);

// ── Main Screen ─────────────────────────────────────────────────────────────
const EventMapScreen = ({navigation, route}) => {
  const {
    stops,
    nearbyEvents,
    routeGeoJSON,
    isLoadingRoute,
    isLoadingNearby,
    isLoadingVehicles,
    isConfirmingTrip,
    routeInfo,
    usedRestrictions,
    vehicle,
    vehicles,
    currentLocation,
    tripName,
    setTripName,
    showNearbyOnMap,
    showListView,
    activeSheet,
    cameraRef,
    mapRef,
    setActiveSheet,
    setShowNearbyOnMap,
    setShowListView,
    addStop,
    removeStop,
    selectStop,
    selectVehicle,
    confirmTrip,
    continuePlanning,
    nearbySource,
    setNearbySource,
    departureSchedule,
    updateDepartureSchedule,
    stopSchedules,
    updateStopSchedule,
    // NEW — was already returned by the hook, just never consumed here
    hasMoreVehicles,
    goToAllVehicles,
  } = useEventMapScreen(navigation, route);

  // ── draggable sheet, built with core RN Animated + PanResponder
  // (no reanimated, no gesture-handler, no @gorhom/bottom-sheet) ─────────
  const sheetHeight = useRef(new Animated.Value(SNAP_DEFAULT)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const currentSnapRef = useRef(SNAP_DEFAULT);

  const snapTo = value => {
    currentSnapRef.current = value;
    Animated.spring(sheetHeight, {
      toValue: value,
      useNativeDriver: false, // height isn't supported by the native driver
      bounciness: 4,
    }).start();
  };

  const findClosestSnap = value =>
    SNAP_POINTS.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev,
    );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 4,
      onPanResponderGrant: () => {
        // capture the exact current value in case a spring was still settling
        sheetHeight.stopAnimation(value => {
          currentSnapRef.current = value;
        });
      },
      onPanResponderMove: (_, gesture) => {
        const next = currentSnapRef.current - gesture.dy;
        const clamped = Math.max(SNAP_PEEK, Math.min(SNAP_EXPANDED, next));
        sheetHeight.setValue(clamped);
      },
      onPanResponderRelease: (_, gesture) => {
        // small velocity bias so a quick flick jumps a snap point even on
        // a short drag, not just a slow deliberate one
        const projected = currentSnapRef.current - gesture.dy - gesture.vy * 60;
        snapTo(findClosestSnap(projected));
      },
    }),
  ).current;

  // CHANGED — Android-only early return added. Android's own
  // android:windowSoftInputMode="adjustResize" (set on MainActivity)
  // already shrinks the window when the keyboard opens, which means
  // anything anchored to the bottom (like this sheet) already rises
  // above the keyboard automatically — for free, at the OS level. Adding
  // our own manual shift on top of that double-counts it on Android.
  // iOS has no equivalent automatic behavior, so it still needs this.
  useEffect(() => {
    if (Platform.OS === 'android') return undefined;

    const showEvent = 'keyboardWillShow';
    const hideEvent = 'keyboardWillHide';

    const showSub = Keyboard.addListener(showEvent, e => {
      const kbHeight = e?.endCoordinates?.height ?? 0;
      Animated.timing(keyboardOffset, {
        toValue: kbHeight,
        duration: e?.duration ?? 250,
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, e => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: e?.duration ?? 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [keyboardOffset]);

  const [editingScheduleFor, setEditingScheduleFor] = useState(null);
  const editingIsDeparture = editingScheduleFor === 'departure';
  const editingStop = editingIsDeparture ? null : editingScheduleFor;
  const editingStopSchedule = editingStop
    ? stopSchedules?.[editingStop.id] ?? {}
    : {};

  const closeScheduleModal = () => setEditingScheduleFor(null);

  const saveSchedule = ({eta, etd}) => {
    if (editingIsDeparture) {
      updateDepartureSchedule({etdPlanned: etd});
    } else if (editingStop) {
      updateStopSchedule(editingStop.id, {etaPlanned: eta, etdPlanned: etd});
    }
    closeScheduleModal();
  };

  const SheetTabs = () => (
    <View style={styles.sheetTabs}>
      {['stops', 'nearby', 'vehicle'].map((tab, idx) => (
        <Touchable
          key={tab}
          style={[
            styles.sheetTab,
            activeSheet === tab && styles.sheetTabActive,
          ]}
          onPress={() => setActiveSheet(activeSheet === tab ? null : tab)}>
          <TextComponent
            text={['🛑 Stops', '📍 Nearby', '🚛 Vehicle'][idx]}
            styles={[
              styles.sheetTabText,
              activeSheet === tab && styles.sheetTabTextActive,
            ]}
          />
        </Touchable>
      ))}
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <HeaderComponent
        headerTitle={'Trip Planner'}
        isBack
        goBack={() => navigation.goBack()}
      />

      <MapboxGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        logoEnabled={false}
        attributionEnabled={false}>
        <MapboxGL.Camera ref={cameraRef} zoomLevel={8} />

        {routeGeoJSON && (
          <MapboxGL.ShapeSource id="routeSource" shape={routeGeoJSON}>
            <MapboxGL.LineLayer
              id="routeLine"
              style={{
                lineColor: '#3B82F6',
                lineWidth: 5.5,
                lineJoin: 'round',
                lineCap: 'round',
              }}
            />
          </MapboxGL.ShapeSource>
        )}

        {currentLocation && (
          <CurrentLocationMarker coordinate={currentLocation} />
        )}

        {stops.map((stop, index) => (
          <StopMarker
            key={`stop-${index}`}
            stop={stop}
            index={index}
            total={stops.length}
            onPress={selectStop}
          />
        ))}

        {showNearbyOnMap &&
          nearbyEvents.map(event => (
            <NearbyPin
              key={`nearby-${event?.id}`}
              event={event}
              onPress={addStop}
            />
          ))}
      </MapboxGL.MapView>

      {isLoadingRoute && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={Colors.primaryColor} />
          <TextComponent
            text={'Calculating route from your location...'}
            styles={styles.loadingText}
          />
        </View>
      )}

      <View style={styles.topControls}>
        <View style={styles.topControlChip}>
          <TextComponent
            text={'Nearby on map'}
            fade
            styles={styles.topControlChipText}
          />
          <Switch
            value={showNearbyOnMap}
            onValueChange={setShowNearbyOnMap}
            trackColor={{false: '#E5E7EB', true: '#3B82F688'}}
            thumbColor={showNearbyOnMap ? '#3B82F6' : '#F3F4F6'}
          />
        </View>
        <Touchable
          onPress={() => setShowListView(!showListView)}
          style={styles.topControlChip}>
          <TextComponent
            text={showListView ? '🗺 Map' : '📋 List'}
            styles={styles.topControlChipText}
          />
        </Touchable>
      </View>

      {routeInfo && (
        <View style={styles.routeInfoStrip}>
          <TextComponent
            text={`🛣 ${routeInfo.totalDistance} km`}
            styles={styles.routeInfoText}
          />
          <View style={styles.routeInfoSep} />
          <TextComponent
            text={`⏱ ${routeInfo.totalDuration} min`}
            styles={styles.routeInfoText}
          />
          <View style={styles.routeInfoSep} />
          <TextComponent
            text={`🛑 ${stops.length} stops`}
            styles={styles.routeInfoText}
          />
        </View>
      )}

      {/* NEW — mirrors the "trailer-aware routing applied" badge already
          shown on LegNavigationScreen, so the planner discloses the same
          thing before the trip is even confirmed. Deliberately doesn't
          claim guaranteed safety/compliance — just that the dimensions
          were sent to the router. */}
      {routeInfo && usedRestrictions && (
        <View style={styles.restrictionsBadge}>
          <TextComponent text={'🛡️'} styles={styles.restrictionsBadgeIcon} />
          <TextComponent
            text={'Trailer-aware routing applied to this preview'}
            styles={styles.restrictionsBadgeText}
          />
        </View>
      )}

      {showListView && (
        <View style={styles.listViewOverlay}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp('2')}}>
            <TextComponent text={'Trip Stops'} styles={styles.listViewHeader} />
            {stops.map((stop, index) => (
              <StopCard
                key={`list-stop-${index}`}
                stop={stop}
                index={index}
                total={stops.length}
                onRemove={removeStop}
                isEditing={true}
                schedule={stopSchedules?.[stop?.id]}
                onEditSchedule={setEditingScheduleFor}
              />
            ))}
            {nearbyEvents.length > 0 && (
              <>
                <TextComponent
                  text={'Nearby Events'}
                  styles={styles.listViewHeader}
                />
                {nearbyEvents.map(item => (
                  <NearbyEventCard
                    key={`nearby-list-${item?.id}`}
                    item={item}
                    onAdd={addStop}
                  />
                ))}
              </>
            )}
          </ScrollView>
        </View>
      )}

      <Animated.View
        style={[
          styles.bottomSheet,
          {height: sheetHeight, bottom: keyboardOffset},
        ]}>
        <View {...panResponder.panHandlers}>
          <View style={styles.sheetHandle} />
          <SheetTabs />
        </View>

        {activeSheet === 'stops' && (
          <>
            <TextInput
              style={styles.tripNameInput}
              placeholder="Trip name"
              placeholderTextColor="#9CA3AF"
              value={tripName}
              onChangeText={setTripName}
            />
            <DepartureTimeRow
              etdPlanned={departureSchedule?.etdPlanned}
              onPress={() => setEditingScheduleFor('departure')}
            />
            <FlatList
              data={stops}
              keyExtractor={(item, i) => `sheet-stop-${i}`}
              style={styles.sheetList}
              renderItem={({item, index}) => (
                <StopCard
                  stop={item}
                  index={index}
                  total={stops.length}
                  onRemove={removeStop}
                  isEditing={true}
                  schedule={stopSchedules?.[item?.id]}
                  onEditSchedule={setEditingScheduleFor}
                />
              )}
            />
          </>
        )}

        {activeSheet === 'nearby' && (
          <>
            <NearbySourceToggle
              nearbySource={nearbySource}
              onChange={setNearbySource}
            />
            {isLoadingNearby ? (
              <ActivityIndicator
                size="large"
                color={Colors.primaryColor}
                style={styles.sheetLoader}
              />
            ) : (
              <FlatList
                data={nearbyEvents}
                keyExtractor={item => `nearby-${item?.id}`}
                style={styles.sheetList}
                ListEmptyComponent={
                  <TextComponent
                    text={'No nearby events found.'}
                    fade
                    styles={styles.sheetEmpty}
                  />
                }
                renderItem={({item}) => (
                  <NearbyEventCard item={item} onAdd={addStop} />
                )}
              />
            )}
          </>
        )}

        {activeSheet === 'vehicle' && (
          <VehicleSheet
            vehicles={vehicles}
            isLoading={isLoadingVehicles}
            vehicle={vehicle}
            onSelect={selectVehicle}
            onClose={() => setActiveSheet(null)}
            onAddNew={() => navigation.navigate('VehicleFormScreen')}
            hasMoreVehicles={hasMoreVehicles}
            onSeeMore={goToAllVehicles}
          />
        )}

        <View style={styles.actionRow}>
          <ThemeButton
            title={'Continue Planning'}
            style={styles.actionBtnSecondary}
            textStyle={styles.actionBtnSecondaryText}
            onPress={continuePlanning}
          />
          <ThemeButton
            title={isConfirmingTrip ? 'Confirming...' : 'Confirm Trip'}
            isYellowTheme
            disabled={isConfirmingTrip}
            style={styles.actionBtnPrimary}
            textStyle={styles.actionBtnPrimaryText}
            onPress={confirmTrip}
          />
        </View>
      </Animated.View>

      <StopScheduleModal
        visible={!!editingScheduleFor}
        title={
          editingIsDeparture
            ? 'Departure Time'
            : editingStop?.title ?? 'Stop Schedule'
        }
        subtitle={
          editingIsDeparture
            ? 'When do you plan to leave your current location?'
            : undefined
        }
        showEta={!editingIsDeparture}
        showEtd={true}
        initialEta={editingIsDeparture ? null : editingStopSchedule?.etaPlanned}
        initialEtd={
          editingIsDeparture
            ? departureSchedule?.etdPlanned
            : editingStopSchedule?.etdPlanned
        }
        onSave={saveSchedule}
        onClose={closeScheduleModal}
      />
    </View>
  );
};

export default memo(EventMapScreen);
