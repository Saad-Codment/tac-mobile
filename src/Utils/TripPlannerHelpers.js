/**
 * The backend wants NAIVE local wall-clock time ("YYYY-MM-DD HH:mm:ss")
 * PLUS a separate top-level `timezone` (IANA name). It does the UTC
 * conversion itself — do NOT send ISO/UTC strings for planned/actual
 * datetime fields on Trip endpoints.
 */
// export const deviceTimeZone = getTimeZone();

export const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const toWallClockString = date => {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return null;
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

/**
 * Builds the `stops` array for POST /trips (and POST /trips/{id}/stops)
 * from your local `stops` state.
 *
 * Per the authoritative API doc, only the DEPARTURE stop sends
 * `etd_planned` (when you leave), and only EVENT stops send
 * `eta_planned` (when you arrive) — plus, optionally, their own
 * `etd_planned` if the user wants to record when they plan to leave
 * that event before continuing the trip.
 *
 * @param {object} currentLocation - {latitude, longitude} - becomes the
 *   true seq_order:1 / stop_type:"departure" stop.
 * @param {array} stops - local stops array (events), in display order.
 * @param {string} departureAddress - human readable address for the
 *   departure point (reverse-geocode it if you have one, otherwise a
 *   placeholder like "Current Location" is fine).
 * @param {object} departureSchedule - {etdPlanned: Date|null} — user's
 *   chosen planned departure time from their current location.
 * @param {object} stopSchedules - {[stopId]: {etaPlanned, etdPlanned}}
 *   — user's chosen (or auto-defaulted) planned times per event stop.
 */
export const buildTripStopsPayload = (
  currentLocation,
  stops,
  departureAddress = 'Current Location',
  departureSchedule = {},
  stopSchedules = {},
) => {
  const payload = [];

  // seq_order 1 — the real departure point (device GPS location)
  payload.push({
    seq_order: 1,
    stop_type: 'departure',
    name: departureAddress,
    address: departureAddress,
    latitude: currentLocation?.latitude,
    longitude: currentLocation?.longitude,
    etd_planned: toWallClockString(departureSchedule?.etdPlanned) || undefined,
    notes: 'Departure point',
  });

  // seq_order 2..N — your event stops, in the order they're already sorted
  stops.forEach((stop, idx) => {
    const schedule = stopSchedules?.[stop?.id] ?? {};
    payload.push({
      seq_order: idx + 2,
      stop_type: 'event',
      event_id: stop?.id,
      eta_planned: toWallClockString(schedule.etaPlanned) || undefined,
      etd_planned: toWallClockString(schedule.etdPlanned) || undefined,
      notes: stop?.notes || undefined,
    });
  });

  return payload;
};

/**
 * Builds the `legs` array for POST /trips from a Mapbox Directions API
 * response. Mapbox returns one `legs[]` entry per pair of consecutive
 * waypoints, which lines up positionally with your stops.
 * legs.length must equal stops.length - 1.
 */
export const buildTripLegsPayload = mapboxRoute => {
  if (!mapboxRoute?.legs?.length) return undefined;
  return mapboxRoute.legs.map(leg => ({
    distance_planned_meters: Math.round(leg.distance),
    duration_planned_seconds: Math.round(leg.duration),
  }));
};
