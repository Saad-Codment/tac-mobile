import MapboxGL from '@rnmapbox/maps';
import {haversineDistanceMeters} from './LegTrackingHelpers';

/**
 * OFFLINE MAPS — region download/management only.
 * ────────────────────────────────────────────────────────────────
 * Offline MAP DISPLAY (tiles cached on-device), NOT offline ROUTING —
 * see the earlier note in this file's history. That distinction is
 * unchanged by this fix.
 *
 * CHANGED (750-tile-pack fix) — the previous version's "~700 tile"
 * precheck (`estimateTileCount`/`pickSafeZoomRange`, still present below)
 * computes ordinary XYZ slippy-map tile counts. Mapbox Maps SDK v11's
 * real offline limit is a cumulative cap of 750 unique TILE PACKS across
 * every downloaded region — a different accounting system (vector tiles,
 * raster, sprite, glyphs, and any other sources a style pulls in, bundled
 * per style/zoom/tile-coordinate) that a plain XYZ-tile formula does not
 * reproduce, and which also depends on what's already been downloaded for
 * OTHER trips. That's why a request the old precheck considered "safe"
 * (~660 estimated tiles) could still be rejected by the real SDK at 800
 * actual tile packs. The precheck is kept ONLY as a coarse, non-authoritative
 * heuristic for picking a starting profile (see chooseInitialProfile) — the
 * real SDK response is now the actual source of truth, handled by
 * detecting the specific tile-pack-limit rejection and retrying once with
 * an optimized, lower-max-zoom profile (see downloadTripRegion).
 *
 * CHANGED (750-tile-pack fix) — offline map downloads were bounded by a
 * bounding box over the trip's STOPS (boundsForTripStops), with a fixed
 * 0.15° margin regardless of trip length. For a long trip (stops far
 * apart) that box can cover a huge area unrelated to the actual route.
 * boundsForRoute now derives a tighter box from the trip's own route
 * geometry (trip.full_path) when available, with a much smaller margin —
 * still just a bounding box (rnmapbox's createPack only accepts
 * `bounds`, not a polygon/corridor — verified against
 * OfflineCreatePackOptions.ts, which has no geometry field), but a box
 * around the actual path instead of a box that has to contain every stop
 * regardless of how they're arranged. Falls back to the stops-based box
 * only when no route geometry exists yet (e.g. trip not yet routed).
 *
 * CHANGED (750-tile-pack fix) — self-healing cleanup for orphaned packs. The
 * tile-limit rejection from before left behind a registered pack
 * entry for that trip even though the actual download never
 * completed — Mapbox's getPacks() still returns it, but calling
 * .status() on it fails with "Does not exist, could not find groupID
 * for identifier..." because there's no real native region behind it.
 * That was already being caught safely (no crash), but nothing
 * cleaned it up, so it recurred on every single visit to this screen.
 * Now, the moment that specific failure is detected, the broken entry
 * is deleted automatically — the next status check (or the very next
 * app launch) comes back clean. downloadTripRegion also now proactively
 * deletes any existing pack of the same name before every create
 * attempt (first download, manual retry, or the automatic optimized
 * retry below), so a stale/failed entry can never block or duplicate a
 * fresh one.
 *
 * NEW — reconcileOfflineRegions(). The self-healing above only ever
 * ran reactively, when that specific trip's OfflineMapButton happened
 * to mount and call getTripRegionStatus. A broken pack for a trip the
 * user hasn't reopened stuck around indefinitely. This sweeps every
 * tac-trip-* pack Mapbox knows about (not scoped to one trip) and
 * applies the same orphaned-pack check to each, so stale/broken
 * regions get cleaned up on a regular cadence (intended call site:
 * once per app launch) rather than only when someone happens to visit
 * that exact trip again. It only ever deletes packs that are already
 * broken (status() throws) — a complete, healthy download for a trip
 * is never touched here, regardless of that trip's current status.
 */

// Coarse, non-authoritative budget used only to pick a starting profile
// (see chooseInitialProfile) and to narrow zoom within whichever profile
// is in use (pickSafeZoomRange). This is ordinary XYZ tile math, NOT
// Mapbox's real tile-pack count — do not treat it as an accurate
// predictor of whether the SDK will accept a request. The real,
// authoritative limit is Mapbox's own rejection, handled in
// downloadTripRegion via isTileLimitError.
const HEURISTIC_TILE_BUDGET = 700;
// The real, documented Mapbox Maps SDK v11 cumulative tile-pack cap —
// kept here only for reference/messaging, never for client-side math
// (a client can't reproduce the SDK's own per-style tile-pack
// accounting, and the cap is cumulative across every downloaded region,
// not just the one being requested).
export const MAPBOX_TILE_PACK_LIMIT = 750;

const TRIP_PACK_PREFIX = 'tac-trip-';
const regionNameForTrip = tripId => `${TRIP_PACK_PREFIX}${tripId}`;

const toRad = deg => (deg * Math.PI) / 180;

const lng2tileX = (lng, zoom) =>
  Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));

const lat2tileY = (lat, zoom) => {
  const latRad = toRad(lat);
  return Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      Math.pow(2, zoom),
  );
};

const tileCountAtZoom = (bounds, zoom) => {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  const minX = lng2tileX(minLng, zoom);
  const maxX = lng2tileX(maxLng, zoom);
  const minY = lat2tileY(maxLat, zoom);
  const maxY = lat2tileY(minLat, zoom);
  return (Math.abs(maxX - minX) + 1) * (Math.abs(maxY - minY) + 1);
};

// Coarse XYZ-tile estimate — see HEURISTIC_TILE_BUDGET note above.
export const estimateTileCount = (bounds, minZoom, maxZoom) => {
  let total = 0;
  for (let z = minZoom; z <= maxZoom; z++) total += tileCountAtZoom(bounds, z);
  return total;
};

const pickSafeZoomRange = (bounds, minZoom, maxZoom) => {
  let effectiveMax = maxZoom;
  while (
    effectiveMax > minZoom &&
    estimateTileCount(bounds, minZoom, effectiveMax) > HEURISTIC_TILE_BUDGET
  ) {
    effectiveMax -= 1;
  }

  let effectiveMin = minZoom;
  while (
    effectiveMin < effectiveMax &&
    estimateTileCount(bounds, effectiveMin, effectiveMax) > HEURISTIC_TILE_BUDGET
  ) {
    effectiveMin += 1;
  }

  return {minZoom: effectiveMin, maxZoom: effectiveMax};
};

export const boundsForTripStops = (stops, marginDegrees = 0.15) => {
  const points = (stops ?? [])
    .map(s => [parseFloat(s.longitude), parseFloat(s.latitude)])
    .filter(([lng, lat]) => !isNaN(lng) && !isNaN(lat));

  if (!points.length) return null;

  const lngs = points.map(p => p[0]);
  const lats = points.map(p => p[1]);

  return [
    [Math.min(...lngs) - marginDegrees, Math.min(...lats) - marginDegrees],
    [Math.max(...lngs) + marginDegrees, Math.max(...lats) + marginDegrees],
  ];
};

// Flattens a route GeoJSON's coordinates regardless of LineString vs
// MultiLineString (Mapbox Directions geometry for a multi-leg trip is
// typically a LineString, but this stays defensive rather than assuming).
const flattenRouteCoordinates = routeGeoJSON => {
  const geometry = routeGeoJSON?.geometry ?? routeGeoJSON;
  if (!geometry) return [];
  if (geometry.type === 'LineString') return geometry.coordinates ?? [];
  if (geometry.type === 'MultiLineString') {
    return (geometry.coordinates ?? []).flat();
  }
  return [];
};

// NEW — a bounding box around the trip's actual route path, not around
// whatever spread the stops happen to have. Meaningfully tighter than
// boundsForTripStops for a long trip, since it follows the path rather
// than having to contain every stop regardless of layout. Note: this is
// still a bounding BOX — rnmapbox's offlineManager.createPack only
// accepts `bounds` (see OfflineCreatePackOptions.ts), not a polygon/
// corridor, so a true route-hugging corridor isn't available through
// this API; this is the closest "route-focused" approximation it
// actually supports.
export const boundsForRoute = (routeGeoJSON, marginDegrees = 0.08) => {
  const coords = flattenRouteCoordinates(routeGeoJSON);
  if (!coords.length) return null;

  const lngs = coords.map(c => c[0]);
  const lats = coords.map(c => c[1]);

  return [
    [Math.min(...lngs) - marginDegrees, Math.min(...lats) - marginDegrees],
    [Math.max(...lngs) + marginDegrees, Math.max(...lats) + marginDegrees],
  ];
};

// NEW — prefers the route-derived box (tighter, route-focused); falls
// back to the stops-derived box only when there's no route geometry yet
// (e.g. the trip hasn't been routed). `profile` selects the margin used
// for whichever source is available.
const PROFILE_MARGINS = {
  normal: {route: 0.08, stops: 0.15},
  optimized: {route: 0.05, stops: 0.08},
};

export const boundsForTripOrRoute = (routeGeoJSON, stops, profile = 'normal') => {
  const margins = PROFILE_MARGINS[profile] ?? PROFILE_MARGINS.normal;
  return (
    boundsForRoute(routeGeoJSON, margins.route) ??
    boundsForTripStops(stops, margins.stops)
  );
};

// NEW — the actual profiles. `maxZoom: 16` (normal) sits in Mapbox's
// high-detail 15–16 tile-pack range; `maxZoom: 14` (optimized) drops out
// of that range while still keeping road/town-level detail — the
// zoom level at which street names and minor roads are still legible,
// just below the highest building-level detail tier.
const PROFILE_MAX_ZOOM = {normal: 16, optimized: 14};
const MIN_ZOOM = 8;

// Coarse, upfront choice of starting profile from the (non-authoritative)
// tile heuristic — long/large trips start with the optimized profile
// directly rather than always trying "normal" first and predictably
// failing. This does NOT replace the real dynamic retry below; it only
// saves one guaranteed-to-fail round trip for obviously-large trips.
export const chooseInitialProfile = bounds => {
  if (!bounds) return 'normal';
  const estimated = estimateTileCount(bounds, MIN_ZOOM, PROFILE_MAX_ZOOM.normal);
  return estimated > HEURISTIC_TILE_BUDGET ? 'optimized' : 'normal';
};

// NEW — the real, authoritative signal. Mapbox's tile-pack-limit
// rejection has a distinctive, stable message shape regardless of the
// exact counts involved: "...can't be loaded because it would increase
// the number of Maps tiles to <N>, which is beyond the maximum allowed
// <M> tiles." Matched on the stable "beyond the maximum allowed" phrase
// rather than the specific numbers, which vary per request.
export const isTileLimitError = err =>
  /beyond the maximum allowed/i.test(err?.message ?? '');

// NEW — translates a download failure into polished, non-technical
// copy. Never surfaces raw Mapbox text, tile IDs, or the 750/800 counts.
export const describeOfflineMapError = (err, {wasOptimized = false} = {}) => {
  if (isTileLimitError(err)) {
    return wasOptimized
      ? {
          title: 'Offline map needs more space',
          message:
            'This trip is larger than the available offline map capacity, even at the optimized detail level. Remove an older downloaded trip’s offline map from that trip’s page to free up space, then try again.',
          canRetry: true,
        }
      : {
          title: 'Offline map needs more space',
          message:
            'This trip is larger than the available offline map capacity. Try again to use the optimized map, or remove an older downloaded trip.',
          canRetry: true,
        };
  }
  return {
    title: 'Could not download offline map',
    message:
      'Could not download this map region. Try again, or check your connection.',
    canRetry: true,
  };
};

export const downloadTripRegion = ({
  tripId,
  bounds,
  profile,
  onProgress,
  onComplete,
  onError,
  onZoomAdjusted,
  _isRetry = false, // internal — caps automatic retry to a single attempt
}) => {
  if (!bounds) {
    onError?.(
      new Error('No stops with coordinates to build a download region from.'),
    );
    return;
  }

  const chosenProfile = profile ?? chooseInitialProfile(bounds);
  const requestedMinZoom = MIN_ZOOM;
  const requestedMaxZoom = PROFILE_MAX_ZOOM[chosenProfile] ?? PROFILE_MAX_ZOOM.normal;

  const {minZoom, maxZoom} = pickSafeZoomRange(
    bounds,
    requestedMinZoom,
    requestedMaxZoom,
  );
  const wasAdjusted =
    minZoom !== requestedMinZoom || maxZoom !== requestedMaxZoom;

  if (wasAdjusted) {
    onZoomAdjusted?.({
      requestedMinZoom,
      requestedMaxZoom,
      actualMinZoom: minZoom,
      actualMaxZoom: maxZoom,
      estimatedTiles: estimateTileCount(bounds, minZoom, maxZoom),
    });
  }

  const name = regionNameForTrip(tripId);
  const options = {
    name,
    styleURL: MapboxGL.StyleURL.Street,
    bounds,
    minZoom,
    maxZoom,
  };

  // Always start from a clean slate: delete any existing pack under this
  // name first (best-effort — a "doesn't exist" rejection here is
  // expected and fine) so a fresh download, a manual retry, or the
  // automatic optimized retry below never collides with a stale/failed/
  // duplicate entry from a previous attempt.
  const cleanSlate = MapboxGL.offlineManager.deletePack(name).catch(() => {});

  cleanSlate.then(() => {
    MapboxGL.offlineManager.createPack(
      options,
      (region, status) => {
        onProgress?.(status);
        if (status?.percentage >= 100) {
          onComplete?.(region, {
            minZoom,
            maxZoom,
            wasAdjusted,
            profile: chosenProfile,
            wasOptimizedRetry: _isRetry,
          });
        }
      },
      (region, err) => {
        console.log('Offline pack error:', err);

        if (isTileLimitError(err) && !_isRetry && chosenProfile !== 'optimized') {
          // The real SDK rejected it — the local heuristic either wasn't
          // used or underestimated actual tile-pack usage. Clean up the
          // failed registration and retry exactly once with the
          // optimized profile (narrower bounds, maxZoom capped to 14).
          MapboxGL.offlineManager
            .deletePack(name)
            .catch(() => {})
            .then(() => {
              downloadTripRegion({
                tripId,
                bounds,
                profile: 'optimized',
                onProgress,
                onComplete,
                onError,
                onZoomAdjusted,
                _isRetry: true,
              });
            });
          return;
        }

        // Give up: clean up any partial/broken registration so it can't
        // linger as an orphaned pack, then surface a translated error —
        // never the raw Mapbox message.
        MapboxGL.offlineManager.deletePack(name).catch(() => {});
        onError?.(err, {
          tileLimit: isTileLimitError(err),
          wasOptimized: _isRetry || chosenProfile === 'optimized',
        });
      },
    );
  });
};

// CHANGED — separates "couldn't even list packs" from "found a pack
// entry, but it's broken," since only the second case is something we
// can and should self-heal from.
export const getTripRegionStatus = async tripId => {
  const name = regionNameForTrip(tripId);

  let pack;
  try {
    const packs = await MapboxGL.offlineManager.getPacks();
    pack = packs?.find(p => p.name === name);
  } catch (err) {
    console.log('getTripRegionStatus (getPacks) error:', err);
    return {exists: false, error: err};
  }

  if (!pack) return {exists: false};

  try {
    const status = await pack.status();
    return {
      exists: true,
      complete: status?.percentage >= 100,
      percentage: status?.percentage ?? 0,
    };
  } catch (err) {
    // A pack entry exists but Mapbox can't find its actual native
    // region — almost always leftover metadata from a download that
    // never completed (e.g. the tile-limit rejection). Clean it up now
    // so it doesn't keep recurring on every future visit, and so a
    // fresh download attempt isn't blocked by a stale same-name entry.
    console.log(
      'getTripRegionStatus: orphaned pack detected, cleaning up:',
      err?.message,
    );
    try {
      await MapboxGL.offlineManager.deletePack(name);
    } catch (cleanupErr) {
      console.log('Orphaned pack cleanup failed (non-fatal):', cleanupErr);
    }
    return {exists: false};
  }
};

export const deleteTripRegion = async tripId => {
  try {
    await MapboxGL.offlineManager.deletePack(regionNameForTrip(tripId));
    return true;
  } catch (err) {
    console.log('deleteTripRegion error:', err);
    return false;
  }
};

// NEW — proactive reconciliation, meant to run once per app launch (not
// scoped to a single trip screen). Sweeps every tac-trip-* pack and
// deletes only the ones that are genuinely broken (a registered pack
// entry with no working native region behind it) — the same failure
// getTripRegionStatus already self-heals reactively, just applied to all
// packs up front instead of waiting for someone to revisit that trip.
// A complete/healthy pack is never removed here, no matter how old.
export const reconcileOfflineRegions = async () => {
  let packs;
  try {
    packs = await MapboxGL.offlineManager.getPacks();
  } catch (err) {
    console.log('reconcileOfflineRegions (getPacks) error:', err);
    return {checked: 0, removed: 0};
  }

  const tripPacks = (packs ?? []).filter(p =>
    p?.name?.startsWith(TRIP_PACK_PREFIX),
  );

  let removed = 0;
  await Promise.all(
    tripPacks.map(async pack => {
      try {
        await pack.status();
      } catch (err) {
        console.log(
          `reconcileOfflineRegions: orphaned pack "${pack.name}", removing:`,
          err?.message,
        );
        try {
          await MapboxGL.offlineManager.deletePack(pack.name);
          removed += 1;
        } catch (cleanupErr) {
          console.log(
            'reconcileOfflineRegions cleanup failed (non-fatal):',
            cleanupErr,
          );
        }
      }
    }),
  );

  return {checked: tripPacks.length, removed};
};

// NEW — the geometry `downloadNavigationRegion` actually downloads for
// offline routing. A bare LineString (the route itself, zero width) would
// give ~no coverage for an offline reroute the moment the driver leaves
// the exact path; Mapbox's own guides don't document a corridor/buffer
// primitive for this specific case (500m IS their documented default for
// the separate, live "predictive caching while driving" mechanism —
// PredictiveCacheLocationConfig.routeBufferRadius — reused here as the
// closest sourced, non-arbitrary number rather than inventing one).
// Builds a MultiPolygon of small square buffers around a sampled subset
// of the route's coordinates (roughly every 2km of route distance, not
// every raw point — keeps the tile-covering geometry, and so the
// download size, bounded for a long route) rather than one giant bounding
// box over the whole route extent, which could be enormous for a long or
// winding leg.
//
// NOT used by the Offline Maps (map-tile) download above — that's a
// distinct, disabled-by-default native-offline-navigation feature (see
// NavigationEngine.js's NATIVE_NAVIGATION_ENGINE_ENABLED). Left entirely
// unchanged by this fix.
const NAV_CORRIDOR_BUFFER_METERS = 500; // sourced from Mapbox's own PredictiveCacheLocationConfig default
const NAV_CORRIDOR_SAMPLE_INTERVAL_METERS = 2000;

export const buildNavigationCorridorGeometry = (
  routeGeoJSON,
  bufferMeters = NAV_CORRIDOR_BUFFER_METERS,
) => {
  const coords = routeGeoJSON?.geometry?.coordinates;
  if (!coords?.length) return null;

  const sampled = [coords[0]];
  let distanceSinceLastSample = 0;
  for (let i = 1; i < coords.length; i++) {
    const [lngA, latA] = coords[i - 1];
    const [lngB, latB] = coords[i];
    distanceSinceLastSample += haversineDistanceMeters(latA, lngA, latB, lngB);
    if (distanceSinceLastSample >= NAV_CORRIDOR_SAMPLE_INTERVAL_METERS) {
      sampled.push(coords[i]);
      distanceSinceLastSample = 0;
    }
  }
  const last = coords[coords.length - 1];
  if (sampled[sampled.length - 1] !== last) sampled.push(last);

  const metersToLatDegrees = bufferMeters / 111320;

  const polygons = sampled.map(([lng, lat]) => {
    const metersToLngDegrees = bufferMeters / (111320 * Math.cos((lat * Math.PI) / 180));
    return [
      [
        [lng - metersToLngDegrees, lat - metersToLatDegrees],
        [lng + metersToLngDegrees, lat - metersToLatDegrees],
        [lng + metersToLngDegrees, lat + metersToLatDegrees],
        [lng - metersToLngDegrees, lat + metersToLatDegrees],
        [lng - metersToLngDegrees, lat - metersToLatDegrees],
      ],
    ];
  });

  return {type: 'MultiPolygon', coordinates: polygons};
};
