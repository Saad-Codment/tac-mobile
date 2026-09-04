// Seam between TAC's Trip/Leg workflow and whatever actually calculates
// and drives a route. Two engines exist:
//   - nativeEngine: the real Mapbox Navigation SDK v3 bridge
//     (TacNavigationModule.swift/.kt) — trailer-aware
//     (max_height/max_width/max_weight via maximumHeight/Width/Weight on
//     iOS, RouteOptions.Builder on Android) and online/offline-capable
//     (RoutingProviderSource.hybrid on iOS; automatic online-then-onboard
//     fallback on Android). Returns real, renderable route geometry/steps
//     (see TacNavigationModule.swift/.kt's serializeRoute) plus trip-
//     session guidance: progress/maneuver/ETA/reroute/route-update events,
//     and offline navigation-region download/status.
//   - directionsApiEngine: the original online-only Mapbox Directions
//     HTTP engine (LegTrackingHelpers.fetchLegRoute) — the compatibility
//     fallback for a build where the native module genuinely isn't linked.
//
// getActiveNavigationEngine() returns whichever ONE of these answers
// calculateRoute/reroute for the life of the app process (see the rule
// above that function below) — LegNavigationScreen/useLegNavigationScreen
// call this seam, never the native module or fetchLegRoute directly, so
// neither needs to know which engine is actually answering.
import {NativeModules, NativeEventEmitter, Platform} from 'react-native';
import {fetchLegRoute} from '../../Utils/LegTrackingHelpers';
import {vehicleHasDimensions} from '../../Utils/RouteRestrictions';
import {buildNavigationCorridorGeometry} from '../../Utils/OfflineMapManager';

const {TacNavigationEngine} = NativeModules;

// ── directionsApiEngine — unchanged fallback, online-only ────────────────
const directionsApiEngine = {
  id: 'mapbox-directions-api',
  supportsOffline: false,
  supportsNativeGuidance: false,
  supportsRegionDownload: false,
  calculateRoute: ({startStop, endStop, vehicle}) =>
    fetchLegRoute(startStop, endStop, vehicle),
  reroute: ({currentPosition, endStop, vehicle}) =>
    fetchLegRoute(currentPosition, endStop, vehicle),
  // No native trip session exists for this engine — TAC's own JS
  // GPS/progress logic in useLegNavigationScreen.js remains the single
  // source of truth for progress/maneuver/ETA/off-route detection when
  // this engine is active. These are deliberate no-ops, not stubs
  // pretending to do something they don't.
  startActiveGuidance: async () => ({unsupported: true}),
  stopGuidance: async () => ({unsupported: true}),
  subscribeToEvents: () => () => {},
  downloadNavigationRegion: async () => ({
    unavailable: true,
    reason: 'not_configured',
  }),
  cancelNavigationRegionDownload: async () => ({unavailable: true}),
  removeNavigationRegion: async () => ({unavailable: true}),
  isOfflineNavigationReady: async () => false,
};

// ── nativeEngine — Mapbox Navigation SDK v3, trailer-aware, hybrid ───────
const buildNativeEngine = () => {
  const emitter = new NativeEventEmitter(TacNavigationEngine);

  const stopLatLng = stop => ({
    lat: parseFloat(stop?.latitude),
    lng: parseFloat(stop?.longitude),
  });

  const vehiclePayload = vehicle =>
    vehicleHasDimensions(vehicle)
      ? {
          height_cm: parseFloat(vehicle.height_cm),
          width_cm: parseFloat(vehicle.width_cm),
          weight_kg: parseFloat(vehicle.weight_kg),
        }
      : null;

  // Normalizes both platforms' calculateRoute result into the same shape
  // fetchLegRoute already returns, so call sites don't need to branch on
  // which engine is active. On genuine routing failure this resolves an
  // {error, message} object — it does NOT throw and does NOT fall back
  // to the HTTP engine; see the class-doc note on why.
  const calculateRoute = async ({startStop, endStop, vehicle}) => {
    if (!startStop?.latitude || !endStop?.latitude) {
      return {
        error: 'missing_stops',
        message: 'This leg is missing a start or end location.',
      };
    }
    const origin = stopLatLng(startStop);
    const dest = stopLatLng(endStop);
    try {
      const result = await TacNavigationEngine.calculateRoute(
        origin.lat,
        origin.lng,
        dest.lat,
        dest.lng,
        vehiclePayload(vehicle),
      );
      // Both native modules now serialize the SDK's own route object
      // (geometry/steps included, same shape fetchLegRoute returns — see
      // TacNavigationModule.swift/.kt's serializeRoute) — this is the
      // real route-line/turn-by-turn data, not a placeholder.
      return {
        routeId: result?.routeId ?? null,
        distanceMeters: result?.distanceMeters,
        durationSeconds: result?.durationSeconds,
        usedRestrictions: !!result?.usedRestrictions,
        routingSource: result?.routingSource ?? null,
        geometry: result?.geometry ?? null,
        steps: result?.steps ?? [],
      };
    } catch (err) {
      return {
        error: 'no_route',
        message: err?.message || 'No route could be found.',
      };
    }
  };

  const reroute = async ({currentPosition, endStop, vehicle}) =>
    calculateRoute({startStop: currentPosition, endStop, vehicle});

  const startActiveGuidance = async ({startStop, endStop, startLegIndex = 0}) => {
    const origin = stopLatLng(startStop);
    const dest = stopLatLng(endStop);
    try {
      await TacNavigationEngine.startActiveGuidance(
        origin.lat,
        origin.lng,
        dest.lat,
        dest.lng,
        startLegIndex,
      );
      return {started: true};
    } catch (err) {
      return {started: false, error: err?.message};
    }
  };

  const stopGuidance = async () => {
    try {
      await TacNavigationEngine.stopGuidance();
      return {stopped: true};
    } catch (err) {
      return {stopped: false, error: err?.message};
    }
  };

  // Subscribes to the native engine's real-time events — route progress,
  // rerouting, ROUTE UPDATES (new geometry — fired on every reroute, see
  // TacNavigationRouteUpdated in both native modules), trip session
  // state — and normalizes each into the shape useLegNavigationScreen.js
  // already renders. Returns an unsubscribe function. This is the SINGLE
  // source of progress/maneuver/ETA/route-line data while the native
  // engine is active — it is not run alongside the JS haversine-based
  // watcher, which only drives the fallback engine. `onRouteUpdated` is
  // what closes the "reroute -> new geometry -> map updates" chain:
  // without it, turn-by-turn would follow the new route while the map
  // kept drawing the old one.
  const subscribeToEvents = ({
    onRouteProgress,
    onRerouting,
    onRouteUpdated,
    onTripSessionState,
  } = {}) => {
    const subs = [];
    if (onRouteProgress) {
      subs.push(
        emitter.addListener('TacNavigationRouteProgress', onRouteProgress),
      );
    }
    if (onRerouting) {
      subs.push(emitter.addListener('TacNavigationRerouting', onRerouting));
    }
    if (onRouteUpdated) {
      subs.push(
        emitter.addListener('TacNavigationRouteUpdated', payload =>
          onRouteUpdated({
            geometry: payload?.geometry ?? null,
            steps: payload?.steps ?? [],
          }),
        ),
      );
    }
    if (onTripSessionState) {
      subs.push(
        emitter.addListener(
          'TacNavigationTripSessionState',
          onTripSessionState,
        ),
      );
    }
    return () => subs.forEach(sub => sub.remove());
  };

  // ── Offline navigation region (distinct from OfflineMapManager.js's
  // map-tile packs — see that file and the native modules' own docs) ──
  // Downloads a CORRIDOR around the route (buildNavigationCorridorGeometry
  // — small buffers along the path, not the bare zero-width polyline and
  // not one giant bounding box), so an offline reroute has somewhere to
  // route through if the driver drifts off the exact line.
  const downloadNavigationRegion = async ({tripId, routeGeoJSON, onProgress}) => {
    const corridor = buildNavigationCorridorGeometry(routeGeoJSON);
    if (!corridor) {
      return {unavailable: true, reason: 'no_route_geometry'};
    }
    let progressSub = null;
    if (onProgress) {
      progressSub = emitter.addListener(
        'TacNavigationRegionDownloadProgress',
        payload => {
          if (payload?.tripId === tripId) onProgress(payload);
        },
      );
    }
    try {
      await TacNavigationEngine.downloadNavigationRegion(
        tripId,
        JSON.stringify(corridor),
      );
      return {unavailable: false};
    } catch (err) {
      return {unavailable: true, reason: err?.message || 'download_failed'};
    } finally {
      progressSub?.remove();
    }
  };

  const cancelNavigationRegionDownload = async tripId => {
    try {
      await TacNavigationEngine.cancelNavigationRegionDownload(tripId);
      return {cancelled: true};
    } catch (err) {
      return {cancelled: false, error: err?.message};
    }
  };

  const removeNavigationRegion = async tripId => {
    try {
      await TacNavigationEngine.removeNavigationRegion(tripId);
      return true;
    } catch (err) {
      console.log('removeNavigationRegion error:', err);
      return false;
    }
  };

  const isOfflineNavigationReady = async tripId => {
    try {
      return !!(await TacNavigationEngine.isOfflineNavigationReady(tripId));
    } catch (err) {
      return false;
    }
  };

  return {
    id: 'mapbox-navigation-sdk',
    supportsOffline: true,
    supportsNativeGuidance: true,
    supportsRegionDownload: true,
    calculateRoute,
    reroute,
    startActiveGuidance,
    stopGuidance,
    subscribeToEvents,
    downloadNavigationRegion,
    cancelNavigationRegionDownload,
    removeNavigationRegion,
    isOfflineNavigationReady,
  };
};

// NEW — the iOS Mapbox Navigation SDK v3 / SPM integration was reverted
// (persistent "No such module 'MapboxMaps'" compile failure inside the
// rnmapbox-maps pod target — a real Xcode/CocoaPods+SPM linkage issue,
// not a code bug; see the repository's own reconciliation history for
// the investigation). `TacNavigationModule.swift`/`.m` no longer exist
// on iOS, so `NativeModules.TacNavigationEngine` is simply absent there
// at runtime — this file already degrades gracefully to
// `directionsApiEngine` in that case, no change needed for iOS itself.
//
// Android's native module is still present and untouched (there's no
// evidence it can't work — the iOS failure was iOS/CocoaPods-specific).
// This constant deliberately disables it FOR NOW anyway: TAC's product
// experience is currently cross-platform, and letting Android alone
// silently gain real offline navigation while iOS has none would be an
// undocumented, accidental platform split rather than a decided one.
// Flip this on (or make it Platform-specific) once that's an explicit
// product decision — the Android native module itself is left fully
// intact so that decision doesn't require re-implementing anything.
const NATIVE_NAVIGATION_ENGINE_ENABLED = false;

const nativeEngine =
  TacNavigationEngine && NATIVE_NAVIGATION_ENGINE_ENABLED
    ? buildNativeEngine()
    : null;

if (!TacNavigationEngine) {
  console.log(
    `NavigationEngine: TacNavigationEngine native module not found on ${Platform.OS} — native guidance/offline routing are unavailable this build.`,
  );
} else if (!NATIVE_NAVIGATION_ENGINE_ENABLED) {
  console.log(
    `NavigationEngine: TacNavigationEngine is present on ${Platform.OS} but disabled by NATIVE_NAVIGATION_ENGINE_ENABLED (cross-platform consistency — see comment above). Using the Directions-HTTP engine.`,
  );
}

// ── Engine-selection rule (now that native returns real route geometry) ──
// 1. Native module linked -> ALWAYS use it, online or offline. Its own
//    RoutingProviderSource is .hybrid (iOS) / automatic online-then-
//    onboard (Android) — connectivity loss is handled INSIDE the native
//    call, not by this function switching engines. A native routing
//    failure (e.g. genuinely no route, or no downloaded coverage while
//    offline) is returned as {error, message} and is NOT retried against
//    the HTTP engine — falling back to HTTP "because native failed"
//    would defeat offline navigation the moment connectivity drops,
//    which is exactly the behavior this rule exists to prevent.
// 2. Native module NOT linked (this build genuinely doesn't have it) ->
//    directionsApiEngine, the pre-existing online-only compatibility
//    path, unchanged.
// There is no third case and no per-call decision — which engine answers
// is fixed for the life of the app process, matching `nativeEngine`
// itself being resolved once at module load above.
export const getActiveNavigationEngine = () => nativeEngine ?? directionsApiEngine;

// Escape hatch for call sites that specifically need to know whether
// native capabilities (guidance events, offline region download) exist,
// as opposed to which engine answers calculateRoute/reroute — those are
// now the same engine (see getActiveNavigationEngine), but the two
// questions are conceptually different and some callers only care about
// one of them.
export const getNativeNavigationEngine = () => nativeEngine;
