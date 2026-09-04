import MapboxGL from '@rnmapbox/maps';
import {haversineDistanceMeters} from './LegTrackingHelpers';

/**
 * OFFLINE MAPS — region download/management only.
 * ────────────────────────────────────────────────────────────────
 * Offline MAP DISPLAY (tiles cached on-device), NOT offline ROUTING —
 * see the earlier note in this file's history. That distinction is
 * unchanged by this fix.
 *
 * CHANGED (tile-limit fix) — estimates tile count before downloading
 * and automatically narrows the zoom range to stay under Mapbox's
 * hard 750-tile cap. See the previous version's notes for the full
 * explanation and the math verification behind it.
 *
 * CHANGED (this fix) — self-healing cleanup for orphaned packs. The
 * tile-limit rejection from before left behind a registered pack
 * entry for that trip even though the actual download never
 * completed — Mapbox's getPacks() still returns it, but calling
 * .status() on it fails with "Does not exist, could not find groupID
 * for identifier..." because there's no real native region behind it.
 * That was already being caught safely (no crash), but nothing
 * cleaned it up, so it recurred on every single visit to this screen.
 * Now, the moment that specific failure is detected, the broken entry
 * is deleted automatically — the next status check (or the very next
 * app launch) comes back clean.
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

const MAX_SAFE_TILES = 700;

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

export const estimateTileCount = (bounds, minZoom, maxZoom) => {
  let total = 0;
  for (let z = minZoom; z <= maxZoom; z++) total += tileCountAtZoom(bounds, z);
  return total;
};

const pickSafeZoomRange = (bounds, minZoom, maxZoom) => {
  let effectiveMax = maxZoom;
  while (
    effectiveMax > minZoom &&
    estimateTileCount(bounds, minZoom, effectiveMax) > MAX_SAFE_TILES
  ) {
    effectiveMax -= 1;
  }

  let effectiveMin = minZoom;
  while (
    effectiveMin < effectiveMax &&
    estimateTileCount(bounds, effectiveMin, effectiveMax) > MAX_SAFE_TILES
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

export const downloadTripRegion = ({
  tripId,
  bounds,
  requestedMinZoom = 8,
  requestedMaxZoom = 16,
  onProgress,
  onComplete,
  onError,
  onZoomAdjusted,
}) => {
  if (!bounds) {
    onError?.(
      new Error('No stops with coordinates to build a download region from.'),
    );
    return;
  }

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

  const options = {
    name: regionNameForTrip(tripId),
    styleURL: MapboxGL.StyleURL.Street,
    bounds,
    minZoom,
    maxZoom,
  };

  MapboxGL.offlineManager.createPack(
    options,
    (region, status) => {
      onProgress?.(status);
      if (status?.percentage >= 100) {
        onComplete?.(region, {minZoom, maxZoom, wasAdjusted});
      }
    },
    (region, err) => {
      console.log('Offline pack error:', err);
      onError?.(err);
    },
  );
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
