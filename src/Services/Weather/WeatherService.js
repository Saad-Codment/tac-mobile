// Public weather API for the rest of the app. Screens/components import
// ONLY from here (never from WeatherProvider directly), and only ever see
// normalized shapes — provider-specific fields, URLs, and error codes stay
// inside WeatherProvider.js.
//
// Every function resolves to one of:
//   {unavailable: true, reason}   — never fabricated; reason is one of
//                                    'not_configured' | 'network' | 'http_xxx'
//   {unavailable: false, ...data}
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

// ── Current conditions at a single point (e.g. a stop) ──────────────────
export const getCurrentWeather = async ({lat, lon, unit = 'metric'}) => {
  if (lat == null || lon == null) {
    return {unavailable: true, reason: 'not_configured'};
  }
  const result = await Provider.fetchCurrent({lat, lon, unit});
  if (result.unavailable) return result;

  const raw = result.raw;
  return {
    unavailable: false,
    temp: raw?.main?.temp ?? null,
    feelsLike: raw?.main?.feels_like ?? null,
    humidity: raw?.main?.humidity ?? null,
    windSpeed: raw?.wind?.speed ?? null,
    description: raw?.weather?.[0]?.description ?? null,
    icon: raw?.weather?.[0]?.icon ?? null,
    unit,
    fetchedAt: Date.now(),
  };
};

// ── Short forecast at a single point (upcoming stop planning) ───────────
// OpenWeatherMap's /forecast returns 3-hour steps for 5 days; we surface
// the next few entries only — this is meant for "what's it doing when I
// get there", not a full 5-day browsing UI.
export const getUpcomingForecast = async (
  {lat, lon, unit = 'metric'},
  {count = 4} = {},
) => {
  if (lat == null || lon == null) {
    return {unavailable: true, reason: 'not_configured'};
  }
  const result = await Provider.fetchForecast({lat, lon, unit});
  if (result.unavailable) return result;

  const entries = (result.raw?.list ?? []).slice(0, count).map(entry => ({
    time: entry.dt ? entry.dt * 1000 : null,
    temp: entry.main?.temp ?? null,
    description: entry.weather?.[0]?.description ?? null,
    icon: entry.weather?.[0]?.icon ?? null,
    precipChance: entry.pop != null ? Math.round(entry.pop * 100) : null,
  }));

  return {unavailable: false, unit, entries};
};

// ── Real hazard/alert data — requires the separate One Call 3.0
// subscription (see WeatherProvider.fetchAlerts). Never invents a hazard;
// an empty `hazards` array means the provider reported none, not that we
// don't know. ────────────────────────────────────────────────────────────
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

// ── Route weather — samples a handful of points along the route geometry
// (same sampling shape as fetchPOIsAlongRoute in LegTrackingHelpers.js) and
// reports current conditions at each, plus a simple derived "possible
// hazard" flag from the conditions themselves (high wind / heavy
// precipitation keywords) since alert data needs the separate
// subscription above. This derived flag is explicitly NOT the same thing
// as an authoritative weather-alert feed — callers must not present it as
// one. ────────────────────────────────────────────────────────────────────
const SEVERE_KEYWORDS = ['thunderstorm', 'heavy', 'snow', 'blizzard', 'tornado', 'hail'];
const HIGH_WIND_MS = 15; // ~54 km/h

export const getRouteWeather = async (routeCoordinates, unit = 'metric') => {
  if (!routeCoordinates?.length) return {unavailable: true, reason: 'not_configured'};
  if (!isWeatherConfigured()) return {unavailable: true, reason: 'not_configured'};

  const sampleIndices = [
    0,
    Math.floor(routeCoordinates.length / 2),
    routeCoordinates.length - 1,
  ];
  const samplePoints = [...new Set(sampleIndices)].map(i => routeCoordinates[i]);

  const samples = await Promise.all(
    samplePoints.map(async ([lng, lat]) => {
      const current = await getCurrentWeather({lat, lon: lng, unit});
      return {lat, lon: lng, current};
    }),
  );

  const possibleHazards = samples
    .filter(s => !s.current.unavailable)
    .filter(
      s =>
        SEVERE_KEYWORDS.some(kw => s.current.description?.includes(kw)) ||
        (s.current.windSpeed ?? 0) > HIGH_WIND_MS,
    )
    .map(s => ({lat: s.lat, lon: s.lon, description: s.current.description}));

  return {unavailable: false, samples, possibleHazards};
};
