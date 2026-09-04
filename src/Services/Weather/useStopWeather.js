// Small React Query wrapper around WeatherService for "weather at this
// stop" — the shared piece behind any screen that needs to show current
// conditions + a short forecast for one lat/lon. Kept here (not in a
// screen's own hook) so Trip Detail and any future screen use the exact
// same caching/loading behavior.
import {useQuery} from '@tanstack/react-query';
import {
  getCurrentWeather,
  getUpcomingForecast,
  isWeatherConfigured,
} from './WeatherService';

const STALE_TIME_MS = 10 * 60 * 1000; // weather doesn't need to be second-fresh

export const useStopWeather = stop => {
  const lat = stop?.latitude != null ? parseFloat(stop.latitude) : null;
  const lon = stop?.longitude != null ? parseFloat(stop.longitude) : null;
  const enabled = lat != null && !isNaN(lat) && lon != null && !isNaN(lon);

  const currentQuery = useQuery({
    queryKey: ['stopWeatherCurrent', lat, lon],
    queryFn: () => getCurrentWeather({lat, lon}),
    enabled,
    staleTime: STALE_TIME_MS,
  });

  const forecastQuery = useQuery({
    queryKey: ['stopWeatherForecast', lat, lon],
    queryFn: () => getUpcomingForecast({lat, lon}),
    enabled,
    staleTime: STALE_TIME_MS,
  });

  return {
    isConfigured: isWeatherConfigured(),
    isLoading: enabled && (currentQuery.isLoading || forecastQuery.isLoading),
    current: currentQuery.data,
    forecast: forecastQuery.data,
  };
};
