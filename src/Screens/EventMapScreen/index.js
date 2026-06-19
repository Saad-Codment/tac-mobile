import React, {memo} from 'react';
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Switch,
  Alert,
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

// ── Mapbox Token ──
MapboxGL.setAccessToken(MAPBOX_TOKEN);

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

// ── Marker Colors ──
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

// Current Location Marker (Pulsing Effect)
const CurrentLocationMarker = ({coordinate}) => (
  <MapboxGL.MarkerView coordinate={[coordinate.longitude, coordinate.latitude]}>
    <View style={styles.currentLocationContainer}>
      <View style={styles.currentLocationPulse} />
      <View style={styles.currentLocationDot} />
    </View>
  </MapboxGL.MarkerView>
);

// ── Cards ───────────────────────────────────────────────────────────────────
const StopCard = ({stop, index, total, onRemove, isEditing}) => {
  const color = getMarkerColor(index, total);
  const isFirst = index === 0;

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
      <TextComponent
        text={`📅 ${formatDate(item?.from_date)}`}
        fade
        styles={styles.nearbyCardDate}
      />
    </View>
    <Touchable onPress={() => onAdd(item)} style={styles.nearbyAddBtn}>
      <TextComponent text={'+ Add'} styles={styles.nearbyAddBtnText} />
    </Touchable>
  </View>
);

const VehicleSheet = ({vehicle, onSelect, onClose}) => (
  <ScrollView style={styles.vehicleSheet} showsVerticalScrollIndicator={false}>
    <View style={styles.sheetHandle} />
    <TextComponent text={'Select Vehicle'} styles={styles.sheetTitle} />
    <TextComponent
      text={'Your vehicle specs affect the route optimization.'}
      fade
      styles={styles.sheetSubtitle}
    />

    {[
      {
        id: 1,
        title: 'Big Red Hauler',
        height_cm: 380,
        weight_cm: 8500,
        axle_count: 3,
      },
      {
        id: 2,
        title: 'Silver Stallion',
        height_cm: 420,
        weight_cm: 11000,
        axle_count: 4,
      },
    ].map(v => (
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
            text={`H: ${v.height_cm}cm • W: ${v.weight_cm}cm • Axles: ${v.axle_count}`}
            fade
            styles={styles.vehicleItemMeta}
          />
        </View>
        {vehicle?.id === v.id && <View style={styles.vehicleSelectedDot} />}
      </Touchable>
    ))}

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
    routeInfo,
    vehicle,
    currentLocation,
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
  } = useEventMapScreen(navigation, route);

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

      {/* Map */}
      <MapboxGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        logoEnabled={false}
        attributionEnabled={false}>
        <MapboxGL.Camera ref={cameraRef} zoomLevel={8} />

        {/* Navigation Route: Current Location → Stops */}
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

        {/* Current Location */}
        {currentLocation && (
          <CurrentLocationMarker coordinate={currentLocation} />
        )}

        {/* Stop Markers */}
        {stops.map((stop, index) => (
          <StopMarker
            key={`stop-${index}`}
            stop={stop}
            index={index}
            total={stops.length}
            onPress={selectStop}
          />
        ))}

        {/* Nearby Event Pins */}
        {showNearbyOnMap &&
          nearbyEvents.map(event => (
            <NearbyPin
              key={`nearby-${event?.id}`}
              event={event}
              onPress={addStop}
            />
          ))}
      </MapboxGL.MapView>

      {/* Loading */}
      {isLoadingRoute && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={Colors.primaryColor} />
          <TextComponent
            text={'Calculating route from your location...'}
            styles={styles.loadingText}
          />
        </View>
      )}

      {/* Top Controls */}
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

      {/* Route Info */}
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

      {/* List View Overlay */}
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

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <SheetTabs />

        {activeSheet === 'stops' && (
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
              />
            )}
          />
        )}

        {activeSheet === 'nearby' &&
          (isLoadingNearby ? (
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
          ))}

        {activeSheet === 'vehicle' && (
          <VehicleSheet
            vehicle={vehicle}
            onSelect={selectVehicle}
            onClose={() => setActiveSheet(null)}
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
            title={'Confirm Trip'}
            isYellowTheme
            style={styles.actionBtnPrimary}
            textStyle={styles.actionBtnPrimaryText}
            onPress={confirmTrip}
          />
        </View>
      </View>
    </View>
  );
};

export default memo(EventMapScreen);
