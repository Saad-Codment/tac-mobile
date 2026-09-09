// Real fuel-price integration via Google Places API (New) `fuelOptions` —
// the same Google Maps/Places key TAC already uses (MapAPIKey), no new
// provider. Google supplies fuel prices as part of Place Details for
// stations it has current data for; it does NOT have it for every
// station, so this never guesses a price — a station with no Google fuel
// data shows the same honest "not listed right now" state as a station
// this project genuinely can't reach.
//
// `place` is the POI object (has `.id`, the Google Place ID). Details are
// only ever fetched when a caller actually opens that station's detail
// sheet (see useLegNavigationScreen's selectPOI) — never for a whole
// route's worth of fuel markers, and the `fuelOptions` field is only ever
// requested for the `fuel` category (see PlacesDetailsService).
import {fetchPlaceDetails} from './Places/PlacesDetailsService';

export const isFuelPriceConfigured = () => true; // same Google key as Places search — always available once that key works

// Priority order TAC cares about most for a trailer/truck audience;
// anything Google returns outside this list is still shown, just after
// these, with a readable fallback label rather than hidden.
const FUEL_TYPE_META = {
  TRUCK_DIESEL: {label: 'Truck Diesel', priority: 0},
  DIESEL: {label: 'Diesel', priority: 1},
  REGULAR_UNLEADED: {label: 'Regular', priority: 2},
  UNLEADED: {label: 'Regular', priority: 2},
  MIDGRADE: {label: 'Midgrade', priority: 3},
  PREMIUM: {label: 'Premium', priority: 4},
};

const titleCaseFuelType = type =>
  String(type)
    .toLowerCase()
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

// Google's Money-style price object: {currencyCode, units, nanos}.
const priceToAmount = price => {
  if (!price) return null;
  const units = Number(price.units ?? 0);
  const nanos = Number(price.nanos ?? 0);
  return units + nanos / 1e9;
};

const formatPrice = (amount, currencyCode) => {
  if (amount == null) return null;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
    }).format(amount);
  } catch (err) {
    // Hermes without full ICU data (or an exotic currency code) can throw
    // here — fall back to a plain, still-correct rendering rather than
    // crashing the detail sheet.
    const symbol = !currencyCode || currencyCode === 'USD' ? '$' : `${currencyCode} `;
    return `${symbol}${amount.toFixed(2)}`;
  }
};

// "Last updated recently / Updated [time]" freshness copy — mirrors the
// visual language already used elsewhere in TAC (see formatStaleness in
// LegTrackingHelpers.js) rather than inventing a second style.
export const formatFuelPriceFreshness = updateTimeIso => {
  if (!updateTimeIso) return null;
  const updated = new Date(updateTimeIso);
  if (isNaN(updated.getTime())) return null;
  const minutes = Math.floor((Date.now() - updated.getTime()) / 60000);
  if (minutes < 60) return 'Updated recently';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours} hr${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Updated ${days} day${days === 1 ? '' : 's'} ago`;
  return `Updated ${updated.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}`;
};

export const getFuelPrice = async place => {
  const result = await fetchPlaceDetails(place?.id, 'fuel');
  if (result.unavailable) return result;

  const fuelPrices = result.raw?.fuelOptions?.fuelPrices ?? [];
  if (!fuelPrices.length) {
    return {unavailable: true, reason: 'no_data'};
  }

  const prices = fuelPrices
    .map(entry => {
      const meta = FUEL_TYPE_META[entry.type] ?? {
        label: titleCaseFuelType(entry.type),
        priority: 99,
      };
      const amount = priceToAmount(entry.price);
      return {
        fuelType: entry.type,
        label: meta.label,
        priority: meta.priority,
        amount,
        currencyCode: entry.price?.currencyCode ?? 'USD',
        formatted: formatPrice(amount, entry.price?.currencyCode),
        updateTime: entry.updateTime ?? null,
      };
    })
    .sort((a, b) => a.priority - b.priority);

  const latestUpdateTime = prices.reduce(
    (latest, p) =>
      p.updateTime && (!latest || p.updateTime > latest) ? p.updateTime : latest,
    null,
  );

  return {
    unavailable: false,
    prices,
    freshnessLabel: formatFuelPriceFreshness(latestUpdateTime),
  };
};

export const describeFuelPriceUnavailable = reason => {
  switch (reason) {
    case 'network':
      return 'Could not check fuel prices — check your connection and try again.';
    default:
      // Covers 'no_data', 'not_enabled', 'not_configured', and any other
      // provider-side state — TAC never shows raw technical reasons to
      // the driver, just the one honest, polished outcome: no real price
      // to show.
      return 'Fuel prices aren’t listed for this location right now.';
  }
};
