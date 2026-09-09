// Single source of truth for turning a TAC vehicle's stored dimensions into
// Mapbox Directions vehicle-restriction query params.
//
// Before this file existed, this logic was hand-copied in two places
// (EventMapScreen's trip-planner preview and LegTrackingHelpers' leg
// routing) and had to be kept in sync manually. Every routing call site —
// Trip Planner preview, initial leg route, active-navigation routing, and
// automatic rerouting — should import from here instead of rebuilding its
// own restriction string, so the four can never silently drift apart.

// ── Product decision (confirmed) — ferry/unpaved are route PREFERENCES,
// not trailer constraints ───────────────────────────────────────────────
// height/width/weight come from the vehicle's actual physical dimensions
// and are always applied when known. `exclude=ferry` and `exclude=unpaved`
// are a different kind of thing — route preferences, not hard constraints
// — and a prior pass found no TAC requirement backing either being
// automatic. Per the current product decision, BOTH are OFF by default.
// They're kept here (not deleted) specifically so they can become
// user-selectable preferences later without restructuring this file
// again — flip the flag, or wire it to a real per-user/per-vehicle
// setting, once TAC has one. Until then, nothing calls
// `excludes.push(...)` for either.
export const FERRY_EXCLUSION_ENABLED = false; // route preference, not a trailer constraint — off until user-selectable
export const UNPAVED_EXCLUSION_ENABLED = false; // route preference, not a trailer constraint — off until user-selectable
export const UNPAVED_EXCLUSION_WEIGHT_KG_THRESHOLD = 7000; // only consulted if UNPAVED_EXCLUSION_ENABLED is ever turned on

export const vehicleHasDimensions = vehicle =>
  !!(vehicle?.height_cm && vehicle?.width_cm && vehicle?.weight_kg);

// Returns the pieces needed both to build a Directions URL and to drive
// "trailer-aware routing applied" UI indicators, without ever building the
// URL itself (callers already have their own coordinate/token handling).
export const buildVehicleRouteRestrictions = vehicle => {
  const hasDimensions = vehicleHasDimensions(vehicle);
  if (!hasDimensions) {
    return {
      hasDimensions: false,
      usedRestrictions: false,
      restrictionParams: '',
    };
  }

  const heightM = (parseFloat(vehicle.height_cm) / 100).toFixed(2);
  const widthM = (parseFloat(vehicle.width_cm) / 100).toFixed(2);
  const weightTons = (parseFloat(vehicle.weight_kg) / 1000).toFixed(2);
  const weightKg = parseFloat(vehicle.weight_kg);

  const excludes = [];
  if (FERRY_EXCLUSION_ENABLED) excludes.push('ferry');
  if (UNPAVED_EXCLUSION_ENABLED && weightKg > UNPAVED_EXCLUSION_WEIGHT_KG_THRESHOLD) {
    excludes.push('unpaved');
  }
  const excludeParam = excludes.length ? `&exclude=${excludes.join(',')}` : '';

  const restrictionParams =
    `${excludeParam}` +
    `&max_height=${heightM}` +
    `&max_width=${widthM}` +
    `&max_weight=${weightTons}`;

  // Vehicle length (length_cm, if/when stored) is intentionally never
  // mapped to a Mapbox Directions parameter — no such parameter exists in
  // the Mapbox Directions API. Keep it stored on the vehicle record only;
  // do not invent a mapping here or anywhere else.

  return {
    hasDimensions: true,
    usedRestrictions: true,
    heightM,
    widthM,
    weightTons,
    weightKg,
    excludes,
    restrictionParams,
  };
};

// ── Vehicle length — advisory only, never a Mapbox routing parameter ──
// There is no supported Mapbox Directions `max_length` parameter, so
// length can never be "applied to routing" the way height/width/weight
// are. Instead of leaving `length_cm` a captured-but-unused field, this
// turns it into a genuinely useful, honestly-labeled advisory: a rig
// length shown in the routing profile UI, in route/navigation context,
// and when evaluating trailer-parking/horse-facility suitability — see
// getRigLengthInfo's callers in EventMapScreen, LegNavigationScreen, and
// TripDetailScreen.
export const cmToFeetLabel = cm => {
  const value = parseFloat(cm);
  if (!value || isNaN(value) || value <= 0) return null;
  const feet = value / 30.48;
  return `${Math.round(feet)} ft`;
};

export const getRigLengthInfo = vehicle => {
  const lengthLabel = cmToFeetLabel(vehicle?.length_cm);
  return {hasLength: !!lengthLabel, lengthLabel};
};

export const LENGTH_ROUTING_ADVISORY_TEXT =
  'Length-specific road limits may not be available in routing.';
export const LENGTH_ROUTE_CONTEXT_TEXT =
  'Length-specific restrictions may vary by road. Check posted restrictions when needed.';
export const LENGTH_PLACE_SUITABILITY_TEXT =
  'Space and access can vary — calling ahead is recommended.';

// Builds a full Mapbox Directions request URL for a driving profile, with
// vehicle restrictions applied when the vehicle has real dimensions.
// `coords` is the already-formatted "lng,lat;lng,lat;..." path segment.
export const buildDirectionsUrl = ({coords, vehicle, token, steps = false}) => {
  const {restrictionParams, usedRestrictions} =
    buildVehicleRouteRestrictions(vehicle);
  const stepsParam = steps ? '&steps=true' : '';
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}` +
    `?geometries=geojson&overview=full${stepsParam}${restrictionParams}` +
    `&access_token=${token}`;
  return {url, usedRestrictions};
};
