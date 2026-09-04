// Provider-specific weather fetching — the ONLY file in the app that
// knows it's talking to OpenWeatherMap. Everything above this (screens,
// components, WeatherService's own public API) works against normalized
// shapes, so swapping providers later means rewriting this file only.
//
// Why not the already-installed `react-native-weather-api` package?
// Inspected directly (node_modules/react-native-weather-api/src/weather.ts):
// its `dailyForecast()` calls OpenWeatherMap's `/data/2.5/onecall`, which
// OpenWeatherMap deprecated for new API keys in 2024 — new accounts get a
// 401 from it unless they separately subscribe to "One Call API 3.0"
// (a different product with its own opt-in, still has a free tier but is
// not the same as a basic key). Rather than ship a UI against an endpoint
// that silently 401s for a newly-created key, this talks directly to the
// two OpenWeatherMap endpoints that are still on the free/basic key today:
//   - /data/2.5/weather   (current conditions)
//   - /data/2.5/forecast  (5-day / 3-hour forecast)
// Hazard/alert data is real but does require that separate One Call 3.0
// subscription (/data/3.0/onecall's `alerts` field) — see getAlerts below.
import {WEATHER_API_KEY} from '../../Utils/Urls';

export const isConfigured = () => !!WEATHER_API_KEY;

const BASE = 'https://api.openweathermap.org/data/2.5';
const ONECALL_V3 = 'https://api.openweathermap.org/data/3.0/onecall';

export const fetchCurrent = async ({lat, lon, unit = 'metric'}) => {
  if (!isConfigured()) return {unavailable: true, reason: 'not_configured'};
  try {
    const url = `${BASE}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${WEATHER_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return {unavailable: true, reason: `http_${res.status}`};
    return {unavailable: false, raw: await res.json()};
  } catch (err) {
    console.log('WeatherProvider.fetchCurrent error:', err);
    return {unavailable: true, reason: 'network'};
  }
};

export const fetchForecast = async ({lat, lon, unit = 'metric'}) => {
  if (!isConfigured()) return {unavailable: true, reason: 'not_configured'};
  try {
    const url = `${BASE}/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${WEATHER_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return {unavailable: true, reason: `http_${res.status}`};
    return {unavailable: false, raw: await res.json()};
  } catch (err) {
    console.log('WeatherProvider.fetchForecast error:', err);
    return {unavailable: true, reason: 'network'};
  }
};

// Real hazard/alert data — but gated behind OpenWeatherMap's separately
// subscribed "One Call API 3.0" product. If the account/key isn't
// subscribed to it, OpenWeatherMap returns 401 here even though the same
// key works fine for fetchCurrent/fetchForecast above; that's reported as
// `reason: 'http_401'` rather than treated as a generic failure, so the UI
// (and this project's provider decision) can distinguish "no key at all"
// from "key works, but not for hazards".
export const fetchAlerts = async ({lat, lon, unit = 'metric'}) => {
  if (!isConfigured()) return {unavailable: true, reason: 'not_configured'};
  try {
    const url = `${ONECALL_V3}?lat=${lat}&lon=${lon}&units=${unit}&exclude=minutely,hourly,daily,current&appid=${WEATHER_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return {unavailable: true, reason: `http_${res.status}`};
    return {unavailable: false, raw: await res.json()};
  } catch (err) {
    console.log('WeatherProvider.fetchAlerts error:', err);
    return {unavailable: true, reason: 'network'};
  }
};
