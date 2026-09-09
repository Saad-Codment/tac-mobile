// Consolidated Google Place Details — the single place every POI detail
// sheet (fuel, weigh stations, trailer parking, horse/equine) gets its
// Place Details data from, instead of four separate/duplicated calls.
// Uses Places API (New), which is a separate Google Cloud API toggle from
// the legacy Places API this project already uses for nearby search
// (searchPOICategory in LegTrackingHelpers.js) — same Google Maps/Places
// key (MapAPIKey), no new provider or credential needed. If "Places API
// (New)" isn't enabled yet for this Google Cloud project, Google returns
// 403, surfaced below as `reason: 'not_enabled'` rather than a generic
// failure, so it's clear this is a Cloud Console toggle, not a broken key.
//
// FieldMasks are explicit and category-aware (never `*`): `fuelOptions`
// — a comparatively specialized field — is only ever requested for the
// `fuel` category, and only when a caller actually opens that station's
// detail sheet (never for a whole route's worth of markers). Every field
// requested here is one TAC's POI detail sheets genuinely display.
import {MapAPIKey} from '../../Utils/Urls';

const PLACES_NEW_BASE = 'https://places.googleapis.com/v1/places';

const BASE_FIELDS = [
  'id',
  'displayName',
  'formattedAddress',
  'internationalPhoneNumber',
  'rating',
  'userRatingCount',
  'businessStatus',
  'currentOpeningHours',
  'regularOpeningHours',
  'types',
];
const FUEL_FIELDS = ['fuelOptions'];

export const isPlacesDetailsConfigured = () => !!MapAPIKey;

const buildFieldMask = category =>
  (category === 'fuel' ? [...BASE_FIELDS, ...FUEL_FIELDS] : BASE_FIELDS).join(
    ',',
  );

// Returns {unavailable: true, reason} | {unavailable: false, raw}
export const fetchPlaceDetails = async (placeId, category) => {
  if (!placeId) return {unavailable: true, reason: 'not_configured'};
  if (!isPlacesDetailsConfigured()) {
    return {unavailable: true, reason: 'not_configured'};
  }
  try {
    const url = `${PLACES_NEW_BASE}/${placeId}`;
    const res = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': MapAPIKey,
        'X-Goog-FieldMask': buildFieldMask(category),
      },
    });
    if (!res.ok) {
      // A 403 here very often means "Places API (New) isn't enabled for
      // this Google Cloud project yet" rather than a bad key — the same
      // key already works for legacy Nearby Search. Surfaced distinctly
      // so it reads as a Cloud Console toggle, not a broken credential.
      return {
        unavailable: true,
        reason: res.status === 403 ? 'not_enabled' : `http_${res.status}`,
      };
    }
    const raw = await res.json();
    return {unavailable: false, raw};
  } catch (err) {
    console.log('PlacesDetailsService.fetchPlaceDetails error:', err);
    return {unavailable: true, reason: 'network'};
  }
};

// Google Place `types` this app knows how to show as a fuel-stop amenity,
// with a real, non-fabricated icon/label. Anything else Places returns
// for a business is simply not shown — never mapped to a guess.
export const AMENITY_TYPE_LABELS = {
  convenience_store: {icon: '🏪', label: 'Convenience Store'},
  atm: {icon: '🏧', label: 'ATM'},
  restaurant: {icon: '🍔', label: 'Food'},
  meal_takeaway: {icon: '🥡', label: 'Food'},
  cafe: {icon: '☕', label: 'Coffee'},
  car_wash: {icon: '🚿', label: 'Car Wash'},
  car_repair: {icon: '🔧', label: 'Repair'},
};

// Normalizes Places API (New) response shape into the flat fields every
// POI detail sheet already reads. `fuelOptions` is passed through raw
// (untouched) — FuelPriceService.js owns interpreting it, so this stays a
// generic Place Details normalizer, not a fuel-specific one.
export const normalizePlaceDetails = raw => {
  const amenities = (raw?.types ?? [])
    .filter(type => AMENITY_TYPE_LABELS[type])
    .map(type => ({type, ...AMENITY_TYPE_LABELS[type]}));

  return {
    name: raw?.displayName?.text ?? null,
    address: raw?.formattedAddress ?? null,
    phone: raw?.internationalPhoneNumber ?? null,
    rating: raw?.rating ?? null,
    ratingCount: raw?.userRatingCount ?? null,
    businessStatus: raw?.businessStatus ?? null, // 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY'
    openNow: raw?.currentOpeningHours?.openNow ?? null,
    weekdayDescriptions:
      raw?.currentOpeningHours?.weekdayDescriptions ??
      raw?.regularOpeningHours?.weekdayDescriptions ??
      null,
    amenities,
    fuelOptions: raw?.fuelOptions ?? null,
  };
};

// Convenience wrapper most callers actually want: fetch + normalize in
// one call, still {unavailable:true, reason} on any failure.
export const getPlaceDetails = async (placeId, category) => {
  const result = await fetchPlaceDetails(placeId, category);
  if (result.unavailable) return result;
  return {unavailable: false, ...normalizePlaceDetails(result.raw)};
};
