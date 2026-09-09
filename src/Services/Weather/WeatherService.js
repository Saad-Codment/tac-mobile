// Public weather API for the rest of the app. Screens/components import
// ONLY from here (never from WeatherProvider directly), and only ever see
// normalized shapes — provider-specific fields, URLs, and error codes stay
// inside WeatherProvider.js.
//
// Every function resolves to one of:
//   {unavailable: true, reason}   — never fabricated; reason is one of
//                                    'not_configured' | 'network' | 'http_xxx'
//   {unavailable: false, ...data}
//
// Units: TAC serves US rodeo/trailer users, so every value here is
// already in US-customary units (°F, mph, inches) — WeatherProvider asks
// OpenWeatherMap for `units=imperial` directly, so nothing here does its
// own C→F/kph→mph conversion.
import * as Provider from './WeatherProvider';

export const isWeatherConfigured = Provider.isConfigured;

// Human-readable copy for each unavailable reason, so the same reason
// code can be shown consistently everywhere without re-deriving copy.
export const describeUnavailable = reason => {
  switch (reason) {
    case 'not_configured':
      return 'Weather isn’t set up yet — this needs an OpenWeatherMap API key.';
    case 'http_401':
      return 'Weather provider rejected the request — the API key may be missing a required subscription.';
    case 'network':
      return 'Could not reach the weather service. Check your connection.';
    default:
      return 'Weather is temporarily unavailable.';
  }
};

// ── Severe-condition assessment — shared by a single point (WeatherCard,
// "next stop" weather) and by the route-level advisory below. Based on
// OpenWeatherMap's own condition group (`weather[0].main`) rather than
// fragile description substring matching, plus simple, explicit
// wind/temperature thresholds. Never invents a condition: if the provider
// didn't report it, this returns null. ─────────────────────────────────
const HIGH_WIND_MPH = 25; // NWS "Wind Advisory" territory
const SEVERE_HEAT_F = 100;
const FREEZING_F = 32;

export const assessSevereCondition = current => {
  if (!current || current.unavailable) return null;
  const main = current.conditionMain;
  const id = current.conditionId;

  if (main === 'Thunderstorm') {
    return {type: 'thunderstorm', message: 'Thunderstorms in the area'};
  }
  if (id != null && [502, 503, 504, 522, 531].includes(id)) {
    return {type: 'heavy_rain', message: 'Heavy rain in the area'};
  }
  if (main === 'Snow' || (id != null && id >= 611 && id <= 616)) {
    return {
      type: 'snow_ice',
      message:
        current.temp != null && current.temp <= FREEZING_F
          ? 'Snow/ice with freezing temperatures'
          : 'Snow in the area',
    };
  }
  if (current.temp != null && current.temp <= FREEZING_F && main === 'Rain') {
    return {type: 'snow_ice', message: 'Freezing rain possible'};
  }
  if ((current.windSpeed ?? 0) > HIGH_WIND_MPH) {
    return {type: 'wind', message: 'Strong winds in the area'};
  }
  if (current.temp != null && current.temp >= SEVERE_HEAT_F) {
    return {type: 'heat', message: 'Severe heat in the area'};
  }
  return null;
};

// ── Current conditions at a single point (e.g. a stop) ──────────────────
export const getCurrentWeather = async ({lat, lon, unit = 'imperial'}) => {
  if (lat == null || lon == null) {
    return {unavailable: true, reason: 'not_configured'};
  }
  const result = await Provider.fetchCurrent({lat, lon, unit});
  if (result.unavailable) return result;

  const raw = result.raw;
  // Precipitation volume fields (`rain`/`snow`) are always in mm from
  // OpenWeatherMap regardless of the `units` param — converted to inches
  // here since every other value in this response is already imperial.
  const rainMm = raw?.rain?.['1h'] ?? raw?.rain?.['3h'] ?? null;
  const snowMm = raw?.snow?.['1h'] ?? raw?.snow?.['3h'] ?? null;

  return {
    unavailable: false,
    temp: raw?.main?.temp ?? null,
    feelsLike: raw?.main?.feels_like ?? null,
    humidity: raw?.main?.humidity ?? null,
    windSpeed: raw?.wind?.speed ?? null, // mph
    conditionMain: raw?.weather?.[0]?.main ?? null,
    conditionId: raw?.weather?.[0]?.id ?? null,
    description: raw?.weather?.[0]?.description ?? null,
    icon: raw?.weather?.[0]?.icon ?? null,
    rainIn: rainMm != null ? +(rainMm / 25.4).toFixed(2) : null,
    snowIn: snowMm != null ? +(snowMm / 25.4).toFixed(2) : null,
    unit,
    fetchedAt: Date.now(),
  };
};

// ── Short forecast at a single point (upcoming stop planning) ───────────
// OpenWeatherMap's /forecast returns 3-hour steps for 5 days; we surface
// the next few entries only — this is meant for "what's it doing when I
// get there", not a full 5-day browsing UI.
export const getUpcomingForecast = async (
  {lat, lon, unit = 'imperial'},
  {count = 4} = {},
) => {
  if (lat == null || lon == null) {
    return {unavailable: true, reason: 'not_configured'};
  }
  const result = await Provider.fetchForecast({lat, lon, unit});
  if (result.unavailable) return result;

  const entries = (result.raw?.list ?? []).slice(0, count).map(entry => {
    const rainMm = entry.rain?.['3h'] ?? null;
    const snowMm = entry.snow?.['3h'] ?? null;
    return {
      time: entry.dt ? entry.dt * 1000 : null,
      temp: entry.main?.temp ?? null,
      conditionMain: entry.weather?.[0]?.main ?? null,
      description: entry.weather?.[0]?.description ?? null,
      icon: entry.weather?.[0]?.icon ?? null,
      precipChance: entry.pop != null ? Math.round(entry.pop * 100) : null,
      rainIn: rainMm != null ? +(rainMm / 25.4).toFixed(2) : null,
      snowIn: snowMm != null ? +(snowMm / 25.4).toFixed(2) : null,
    };
  });

  return {unavailable: false, unit, entries};
};

// ── Official alerts — requires the separate One Call 3.0 subscription
// (see WeatherProvider.fetchAlerts). Never invents a hazard; an empty
// `hazards` array means the provider reported none, not that we don't
// know. Callers must label these as official alerts (e.g. "Weather
// Alert"), distinct from the derived Weather Advisory below. ───────────
export const getHazards = async ({lat, lon}) => {
  if (lat == null || lon == null) {
    return {unavailable: true, reason: 'not_configured'};
  }
  const result = await Provider.fetchAlerts({lat, lon});
  if (result.unavailable) return result;

  const hazards = (result.raw?.alerts ?? []).map(alert => ({
    event: alert.event,
    senderName: alert.sender_name,
    start: alert.start ? alert.start * 1000 : null,
    end: alert.end ? alert.end * 1000 : null,
    description: alert.description ?? null,
  }));

  return {unavailable: false, hazards};
};

// ── Route weather advisory — samples a handful of points along the route
// geometry (same sampling shape as fetchPOIsAlongRoute in
// LegTrackingHelpers.js). Prefers OFFICIAL alerts (getHazards) wherever
// the account/key supports them; only when that's unavailable for every
// sampled point does this fall back to a derived, forecast-based
// assessment (assessSevereCondition) of current conditions at those same
// points. The two are never blended into one unlabeled bucket — every
// item this returns carries `source: 'official' | 'advisory'` so callers
// can title official items "Weather Alert" and derived ones
// "Weather Advisory", never implying the latter is an official
// government/provider alert. ────────────────────────────────────────────
export const getRouteWeatherAdvisory = async routeCoordinates => {
  if (!routeCoordinates?.length || !isWeatherConfigured()) {
    return {unavailable: true, reason: 'not_configured'};
  }

  const sampleIndices = [
    0,
    Math.floor(routeCoordinates.length / 2),
    routeCoordinates.length - 1,
  ];
  const samplePoints = [...new Set(sampleIndices)].map(
    i => routeCoordinates[i],
  );

  const officialResults = await Promise.all(
    samplePoints.map(([lng, lat]) => getHazards({lat, lon: lng})),
  );
  const officialSupported = officialResults.some(r => !r.unavailable);

  if (officialSupported) {
    const items = officialResults
      .filter(r => !r.unavailable)
      .flatMap(r => r.hazards)
      .filter(h => h.event)
      .map(h => ({source: 'official', event: h.event, description: h.description}));
    return {unavailable: false, source: 'official', items};
  }

  // Fallback: derived Weather Advisory from real current-conditions data
  // at the same sample points — never fabricated, just not an official
  // alert feed (that needs the separate One Call 3.0 subscription).
  const samples = await Promise.all(
    samplePoints.map(async ([lng, lat]) => {
      const current = await getCurrentWeather({lat, lon: lng});
      return {lat, lon: lng, current};
    }),
  );

  const items = samples
    .map(s => ({s, severe: assessSevereCondition(s.current)}))
    .filter(({severe}) => !!severe)
    .map(({s, severe}) => ({
      source: 'advisory',
      event: severe.message,
      description: s.current.description ?? null,
      lat: s.lat,
      lon: s.lon,
    }));

  return {unavailable: false, source: 'advisory', items};
};
