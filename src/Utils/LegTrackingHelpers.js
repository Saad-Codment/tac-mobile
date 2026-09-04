import {MAPBOX_TOKEN, MapAPIKey} from '../Utils/Urls';
import {buildDirectionsUrl, vehicleHasDimensions} from './RouteRestrictions';

// ── Distance math ────────────────────────────────────────────────────
export const haversineDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth radius, meters
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = deg => (deg * Math.PI) / 180;

const metersPerDegree = lat => ({
  lat: 111320,
  lng: 111320 * Math.cos(toRad(lat)),
});

const pointToSegmentDistanceMeters = (pLat, pLng, aLat, aLng, bLat, bLng) => {
  const m = metersPerDegree(pLat);
  const px = pLng * m.lng,
    py = pLat * m.lat;
  const ax = aLng * m.lng,
    ay = aLat * m.lat;
  const bx = bLng * m.lng,
    by = bLat * m.lat;

  const dx = bx - ax,
    dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  let t = lengthSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));
  const closestX = ax + t * dx,
    closestY = ay + t * dy;
  return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);
};

export const isOffRoute = (
  position,
  routeCoordinates,
  thresholdMeters = 60,
) => {
  if (!position || !routeCoordinates?.length || routeCoordinates.length < 2)
    return false;
  let minDist = Infinity;
  for (let i = 0; i < routeCoordinates.length - 1; i++) {
    const [aLng, aLat] = routeCoordinates[i];
    const [bLng, bLat] = routeCoordinates[i + 1];
    const dist = pointToSegmentDistanceMeters(
      position.latitude,
      position.longitude,
      aLat,
      aLng,
      bLat,
      bLng,
    );
    if (dist < minDist) minDist = dist;
    if (minDist < thresholdMeters) break;
  }
  return minDist > thresholdMeters;
};

export const advanceStepIndex = (
  steps,
  currentIndex,
  position,
  arriveThresholdMeters = 40,
) => {
  if (!steps?.length || !position) return currentIndex;
  let index = currentIndex;
  while (index < steps.length - 1) {
    const step = steps[index];
    const [lng, lat] = step?.maneuver?.location ?? [];
    if (lng == null || lat == null) break;
    const dist = haversineDistanceMeters(
      position.latitude,
      position.longitude,
      lat,
      lng,
    );
    if (dist < arriveThresholdMeters) {
      index += 1;
    } else {
      break;
    }
  }
  return index;
};

export const computeRemaining = (steps, currentIndex, position) => {
  if (!steps?.length) return {distanceMeters: 0, durationSeconds: 0};

  let distance = 0;
  let duration = 0;

  const currentStep = steps[currentIndex];
  const [lng, lat] = currentStep?.maneuver?.location ?? [];
  if (lng != null && lat != null && position) {
    const partial = haversineDistanceMeters(
      position.latitude,
      position.longitude,
      lat,
      lng,
    );
    distance += partial;
    const stepDist = currentStep?.distance ?? 0;
    const stepDur = currentStep?.duration ?? 0;
    duration += stepDist > 0 ? stepDur * Math.min(1, partial / stepDist) : 0;
  }

  for (let i = currentIndex + 1; i < steps.length; i++) {
    distance += steps[i]?.distance ?? 0;
    duration += steps[i]?.duration ?? 0;
  }

  return {distanceMeters: distance, durationSeconds: duration};
};

export const maneuverIcon = step => {
  const type = step?.maneuver?.type;
  const modifier = step?.maneuver?.modifier ?? '';
  if (type === 'arrive') return '🏁';
  if (type === 'depart') return '🚗';
  if (type === 'roundabout' || type === 'rotary') return '🔄';
  if (modifier.includes('left')) return '⬅️';
  if (modifier.includes('right')) return '➡️';
  if (modifier === 'uturn') return '🔄';
  return '⬆️';
};

// ── Mapbox route for a single leg ───────────────────────────────────
export const fetchLegRoute = async (startStop, endStop, vehicle) => {
  if (!startStop?.latitude || !endStop?.latitude) {
    return {
      error: 'missing_stops',
      message: 'This leg is missing a start or end location.',
    };
  }

  const hasDimensions = vehicleHasDimensions(vehicle);

  try {
    const coords = `${parseFloat(startStop.longitude)},${parseFloat(
      startStop.latitude,
    )};${parseFloat(endStop.longitude)},${parseFloat(endStop.latitude)}`;

    // Restriction construction (max_height/max_width/max_weight, and the
    // exclude= flags) lives in one shared place now — see
    // RouteRestrictions.js. Every routing call site (this one, the trip
    // planner preview, and rerouting — which all funnel through this same
    // function) builds its URL the same way, so they can't drift apart.
    const {url} = buildDirectionsUrl({
      coords,
      vehicle,
      token: MAPBOX_TOKEN,
      steps: true,
    });

    const res = await fetch(url);
    const json = await res.json();
    const route = json?.routes?.[0];

    if (!route) {
      return {
        error: 'no_route',
        message: hasDimensions
          ? json?.message ||
            'No route could be found that fits this vehicle\u2019s dimensions in this area.'
          : json?.message || 'No route could be found.',
      };
    }

    return {
      geometry: route.geometry,
      distanceMeters: route.distance,
      durationSeconds: route.duration,
      steps: route.legs?.[0]?.steps ?? [],
      usedRestrictions: hasDimensions,
    };
  } catch (err) {
    console.log('Leg route error:', err);
    return {
      error: 'network',
      message:
        'Could not reach the routing service. Check your connection and try again.',
    };
  }
};

// ── POI overlay (fuel, hotels, rest stops, weigh stations, parking,
// horse/equine locations) ────────────────────────────────────────────
// CHANGED — added `parking`, a rule-based "trailer-friendly" category.
// Google Places has no such attribute directly, so this searches with
// keywords specific to truck/RV-capable parking ("truck stop", "RV
// parking") rather than generic "parking" — a real filter, not a
// relabeling of ordinary parking. Every result is still described in
// the UI as "likely truck/RV accessible" (see LegNavigationScreen.js),
// never asserted as verified.
//
// NEW — `horse`, the committed horse-related-location layer. Google
// Places has no "horse-friendly" attribute either, so this runs the same
// keyword-search approach as `parking`: targeted terms for equestrian
// centers, horse boarding, and equine veterinary care, rather than one
// generic search. Results carry the same "verify before relying on it"
// caveat as parking (see POIDetailSheet in LegNavigationScreen/index.js)
// — nothing here claims a location is a verified horse-friendly
// facility. `verifiedSource: null` is a deliberate placeholder: if TAC
// later curates its own verified horse-facility list, or lets
// organizers submit verified entries, that data can be merged in and
// this field flipped to identify it, without changing the POI shape
// consumers already rely on.
export const POI_CATEGORIES = [
  {
    key: 'fuel',
    label: 'Fuel',
    icon: '⛽',
    color: '#F59E0B',
    type: 'gas_station',
  },
  {
    key: 'hotel',
    label: 'Hotels',
    icon: '🏨',
    color: '#8B5CF6',
    type: 'lodging',
  },
  {
    key: 'rest',
    label: 'Rest Stops',
    icon: '🚻',
    color: '#22C55E',
    keyword: 'rest area',
  },
  {
    key: 'weigh',
    label: 'Weigh Stations',
    icon: '⚖️',
    color: '#3B82F6',
    keyword: 'weigh station',
  },
  {
    key: 'parking',
    label: 'Trailer Parking',
    icon: '🅿️',
    color: '#0EA5E9',
    // Multiple keyword passes merged — Places' keyword search is not
    // boolean-OR capable in one call, so this category runs two
    // narrower searches and merges/dedupes them (see
    // fetchPOIsAlongRoute below), rather than one generic "parking"
    // search that would sweep in ordinary car parking lots.
    keywords: ['truck stop', 'RV parking'],
  },
  {
    key: 'horse',
    label: 'Horse/Equine',
    icon: '🐴',
    color: '#A855F7',
    keywords: ['equestrian center', 'horse boarding', 'equine veterinarian'],
  },
];

const searchPOICategory = async (lat, lng, category, radiusMeters = 25000) => {
  const locationParam = `location=${lat},${lng}&radius=${radiusMeters}`;

  const runOne = async filterParam => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${locationParam}&${filterParam}&key=${MapAPIKey}`;
      const res = await fetch(url);
      const json = await res.json();
      return (json?.results ?? []).map(place => ({
        id: place.place_id,
        name: place.name,
        latitude: place.geometry?.location?.lat,
        longitude: place.geometry?.location?.lng,
        category: category.key,
        // Always null today — every result here comes from a generic
        // Places keyword/type search, never a TAC-curated or
        // user-verified source. Left in the shape so a future verified
        // dataset (e.g. TAC-curated horse-friendly facilities) can be
        // merged in and flagged, without changing what consumers read.
        verifiedSource: null,
      }));
    } catch (err) {
      console.log(`POI search error (${category.key}):`, err);
      return [];
    }
  };

  if (category.keywords?.length) {
    const results = await Promise.all(
      category.keywords.map(kw => runOne(`keyword=${encodeURIComponent(kw)}`)),
    );
    return results.flat();
  }

  const filterParam = category.type
    ? `type=${category.type}`
    : `keyword=${encodeURIComponent(category.keyword)}`;
  return runOne(filterParam);
};

export const fetchPOIsAlongRoute = async routeCoordinates => {
  if (!routeCoordinates?.length) return {};

  const sampleIndices = [
    0,
    Math.floor(routeCoordinates.length / 3),
    Math.floor((routeCoordinates.length * 2) / 3),
    routeCoordinates.length - 1,
  ];
  const samplePoints = [...new Set(sampleIndices)].map(
    i => routeCoordinates[i],
  );

  const resultsByCategory = {};

  for (const category of POI_CATEGORIES) {
    const allForCategory = [];
    for (const [lng, lat] of samplePoints) {
      const found = await searchPOICategory(lat, lng, category);
      allForCategory.push(...found);
    }
    const deduped = Object.values(
      allForCategory.reduce((acc, poi) => {
        acc[poi.id] = poi;
        return acc;
      }, {}),
    );
    resultsByCategory[category.key] = deduped;
  }

  return resultsByCategory;
};

// Google Place `types` this app knows how to show as a fuel-stop
// amenity, with real, non-fabricated icon/label. Anything else Places
// returns for a station is simply not shown — never mapped to a guess.
export const FUEL_AMENITY_TYPE_LABELS = {
  convenience_store: {icon: '🏪', label: 'Convenience Store'},
  atm: {icon: '🏧', label: 'ATM'},
  restaurant: {icon: '🍔', label: 'Food'},
  meal_takeaway: {icon: '🥡', label: 'Food'},
  cafe: {icon: '☕', label: 'Coffee'},
  car_wash: {icon: '🚿', label: 'Car Wash'},
  car_repair: {icon: '🔧', label: 'Repair'},
};

// NEW — Google Places Details API, called when a marker is tapped.
// Uses the SAME MapAPIKey already in use for search/geocoding — no new
// provider or key needed for this part. Returns only fields that are
// genuinely available; nothing here is fabricated. Live fuel pricing
// and weigh-station open/closed status are NOT part of this response —
// Google Places doesn't carry either, which is why they're handled by
// their own service stubs (FuelPriceService.js, WeighStationService.js)
// as genuine external-provider dependencies, not silently left blank.
export const fetchPOIDetails = async placeId => {
  if (!placeId) return null;
  try {
    const fields = [
      'name',
      'formatted_address',
      'formatted_phone_number',
      'opening_hours',
      'website',
      'rating',
      'user_ratings_total',
      'types',
      'business_status',
    ].join(',');
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${MapAPIKey}`;
    const res = await fetch(url);
    const json = await res.json();
    const result = json?.result;
    if (!result) return null;

    // Real amenity signal, not fabricated: Places' own `types` tags for
    // this business, filtered to the ones we can label meaningfully.
    const amenities = (result.types ?? [])
      .filter(type => FUEL_AMENITY_TYPE_LABELS[type])
      .map(type => ({type, ...FUEL_AMENITY_TYPE_LABELS[type]}));

    return {
      name: result.name,
      address: result.formatted_address,
      phone: result.formatted_phone_number,
      website: result.website,
      rating: result.rating,
      ratingCount: result.user_ratings_total,
      openNow: result.opening_hours?.open_now,
      weekdayHours: result.opening_hours?.weekday_text ?? null,
      businessStatus: result.business_status ?? null,
      amenities,
    };
  } catch (err) {
    console.log('POI details error:', err);
    return null;
  }
};

// ── Staleness display ────────────────────────────────────────────────
export const formatStaleness = updatedAt => {
  if (!updatedAt) return null;
  const updated = new Date(updatedAt);
  if (isNaN(updated.getTime())) return null;
  const seconds = Math.floor((Date.now() - updated.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min ago`;
};

export const isStale = (updatedAt, thresholdSeconds = 120) => {
  if (!updatedAt) return true;
  const updated = new Date(updatedAt);
  if (isNaN(updated.getTime())) return true;
  return (Date.now() - updated.getTime()) / 1000 > thresholdSeconds;
};
