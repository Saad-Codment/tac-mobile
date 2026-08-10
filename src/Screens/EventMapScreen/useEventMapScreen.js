import {useState, useRef, useCallback, useEffect} from 'react';
import {Alert, Platform, PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {globalSearchEventsWithFilterUrl, MAPBOX_TOKEN} from '../../Utils/Urls';
import {getVehicleUrl, nearbyEventsUrl, tripsUrl} from '../../Utils/Urls';
import {
  deviceTimeZone,
  buildTripStopsPayload,
  buildTripLegsPayload,
} from '../../Utils/TripPlannerHelpers';
import {successMessage, errorMessage} from '../../Config/NotificationMessage';

const eventToStop = (event, isFirst = false) => ({
  id: event?.id,
  title: event?.title,
  address: event?.address,
  latitude: event?.latitude,
  longitude: event?.longitude,
  from_date: event?.from_date,
  to_date: event?.to_date,
  start_time: event?.start_time,
  end_time: event?.end_time,
  images: event?.images,
  isDeparture: isFirst, // UI label only — does not affect API payload, see useEventMapScreen notes
});

// NEW — safe date parser for defaulting planned arrival/departure times
// from an event's own from_date/to_date/start_time/end_time fields.
const parseDateSafe = str => (str ? new Date(str.replace(' ', 'T')) : null);

// Full Mapbox route (kept as an object, not just geometry) so we can
// pull per-leg distance/duration for the `legs` payload on Confirm Trip.
const fetchMapboxRoute = async points => {
  if (!points || points.length < 2) return null;
  try {
    const coords = points
      .map(p => `${parseFloat(p.longitude)},${parseFloat(p.latitude)}`)
      .join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;

    const res = await fetch(url);
    const json = await res.json();
    const route = json?.routes?.[0];

    if (!route) return null;

    return {
      geoJSON: {type: 'Feature', geometry: route.geometry},
      totalDistanceKm: (route.distance / 1000).toFixed(1),
      totalDurationMin: Math.ceil(route.duration / 60),
      totalDistanceMeters: route.distance,
      totalDurationSeconds: route.duration,
      legs: route.legs, // [{distance, duration, ...}] — one per stop-to-stop hop
      raw: route,
    };
  } catch (err) {
    console.log('Route error:', err);
    return null;
  }
};

const useEventMapScreen = (navigation, route) => {
  const {event, events} = route?.params ?? {};
  const queryClient = useQueryClient();

  const cameraRef = useRef(null);
  const mapRef = useRef(null);

  const [stops, setStops] = useState([]);
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null); // {totalDistance, totalDuration} in km/min for display
  const [mapboxRoute, setMapboxRoute] = useState(null); // full route object, used to build payload
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [departureAddress, setDepartureAddress] = useState('Current Location');
  const [vehicle, setVehicle] = useState(null);
  const [tripName, setTripName] = useState('');
  const [showNearbyOnMap, setShowNearbyOnMap] = useState(true);
  const [showListView, setShowListView] = useState(false);
  const [activeSheet, setActiveSheet] = useState('stops');

  // ── NEW: which point should "Nearby Events" search around ─────────
  // 'current' = user's live GPS location, 'event' = the trip's event stop
  const [nearbySource, setNearbySource] = useState('current');
  const [hasAskedNearbySource, setHasAskedNearbySource] = useState(false);

  // ── NEW: planned schedule (etd_planned / eta_planned) ──────────────
  // departureSchedule.etdPlanned -> the TRUE trip departure stop's
  // etd_planned (seq_order 1, stop_type "departure" — your current GPS
  // location). stopSchedules[eventId] -> {etaPlanned, etdPlanned} for
  // each event stop (seq_order 2+). Defaults are auto-filled from the
  // event's own from_date/start_time (arrival) and to_date/end_time
  // (departure) the first time a stop appears, but the user can edit
  // or clear them via the schedule modal at any time.
  const [departureSchedule, setDepartureSchedule] = useState({
    etdPlanned: null,
  });
  const [stopSchedules, setStopSchedules] = useState({});

  useEffect(() => {
    setStopSchedules(prev => {
      let changed = false;
      const next = {...prev};
      stops.forEach(stop => {
        if (!stop?.id || next[stop.id]) return;
        next[stop.id] = {
          etaPlanned: parseDateSafe(stop.start_time || stop.from_date),
          etdPlanned: parseDateSafe(stop.end_time || stop.to_date),
        };
        changed = true;
      });
      return changed ? next : prev;
    });
  }, [stops]);

  const updateDepartureSchedule = useCallback(patch => {
    setDepartureSchedule(prev => ({...prev, ...patch}));
  }, []);

  const updateStopSchedule = useCallback((stopId, patch) => {
    setStopSchedules(prev => ({
      ...prev,
      [stopId]: {...prev[stopId], ...patch},
    }));
  }, []);

  // ── Current Location ──────────────────────────────────────────────
  const getCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({latitude, longitude});
      },
      error => {
        console.log('Location error:', error);
        Alert.alert(
          'Location',
          'Unable to get current location. Please enable GPS.',
        );
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(granted => {
        if (granted === 'granted') getCurrentLocation();
      });
    } else {
      getCurrentLocation();
    }
  }, [getCurrentLocation]);

  // ── Initial Stops (from navigation params) ─────────────────────────
  useEffect(() => {
    let initialStops = [];
    if (events && Array.isArray(events) && events.length > 0) {
      initialStops = [...events]
        .sort((a, b) => new Date(a.from_date) - new Date(b.from_date))
        .map((e, i) => eventToStop(e, i === 0));
    } else if (event) {
      initialStops = [eventToStop(event, true)];
    }
    setStops(initialStops);
  }, [event, events]);

  // ── Build Full Route from Current Location (Mapbox, mobile-side) ──
  const buildRoute = async () => {
    if (!currentLocation || stops.length === 0) return;

    setIsLoadingRoute(true);
    const allPoints = [
      {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      },
      ...stops,
    ];

    const result = await fetchMapboxRoute(allPoints);
    if (result) {
      setRouteGeoJSON(result.geoJSON);
      setRouteInfo({
        totalDistance: result.totalDistanceKm,
        totalDuration: result.totalDurationMin,
      });
      setMapboxRoute(result);
      fitCamera();
    }
    setIsLoadingRoute(false);
  };

  useEffect(() => {
    if (currentLocation && stops.length > 0) buildRoute();
  }, [currentLocation, stops]);

  const fitCamera = useCallback(() => {
    if (!cameraRef.current || stops.length === 0) return;
    const allPoints = [currentLocation, ...stops].filter(Boolean);
    const lngs = allPoints.map(p => parseFloat(p.longitude));
    const lats = allPoints.map(p => parseFloat(p.latitude));

    cameraRef.current.fitBounds(
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
      [60, 60, 60, 60],
      1000,
    );
  }, [currentLocation, stops]);

  // ── NEW: ask the user, the first time they open Nearby, which point
  // to search around. They can still change it anytime via the toggle
  // chips rendered in the Nearby tab (setNearbySource is returned below).
  useEffect(() => {
    if (activeSheet === 'nearby' && !hasAskedNearbySource) {
      setHasAskedNearbySource(true);
      Alert.alert(
        'Find Nearby Events',
        "Search for nearby events around your current location, or around the event you're heading to?",
        [
          {
            text: 'My Current Location',
            onPress: () => setNearbySource('current'),
          },
          {text: 'The Event Location', onPress: () => setNearbySource('event')},
        ],
      );
    }
  }, [activeSheet, hasAskedNearbySource]);

  // NEW: the actual lat/lng used for the nearby search, based on nearbySource.
  // 'event' uses the trip's first stop (the event you're heading to).
  const eventLocationStop = stops?.[0];
  const nearbyReferenceLocation =
    nearbySource === 'event' &&
    eventLocationStop?.latitude &&
    eventLocationStop?.longitude
      ? {
          lat: parseFloat(eventLocationStop.latitude),
          lng: parseFloat(eventLocationStop.longitude),
        }
      : currentLocation
      ? {lat: currentLocation.latitude, lng: currentLocation.longitude}
      : null;

  // ── Nearby Events (real API) ───────────────────────────────────────
  // const nearbyEventsQuery = useQuery({
  //   queryKey: [
  //     'nearbyEvents',
  //     currentLocation?.latitude,
  //     currentLocation?.longitude,
  //   ],
  //   queryFn: () =>
  //     API.get(
  //       `${nearbyEventsUrl}?lat=${currentLocation.latitude}&lng=${currentLocation.longitude}&radius=100&per_page=10`,
  //     ),
  //   enabled: !!currentLocation,
  // });

  const nearbyEventsQuery = useQuery({
    queryKey: [
      'NearByEventsList',
      nearbySource,
      nearbyReferenceLocation?.lat,
      nearbyReferenceLocation?.lng,
    ],
    queryFn: () =>
      API.get(
        `${globalSearchEventsWithFilterUrl}latitude=${nearbyReferenceLocation?.lat}&longitude=${nearbyReferenceLocation?.lng}`,
      ),
    enabled: !!nearbyReferenceLocation,
  });

  useEffect(() => {
    if (nearbyEventsQuery?.data?.data?.data) {
      setNearbyEvents(nearbyEventsQuery?.data?.data?.data);
    }
  }, [nearbyEventsQuery.data]);

  const isLoadingNearby =
    nearbyEventsQuery.isLoading || nearbyEventsQuery.isFetching;

  // ── Vehicles (real API) ────────────────────────────────────────────
  const vehiclesQuery = useQuery({
    queryKey: ['vehiclesList'],
    queryFn: () => API.get(`${getVehicleUrl}?per_page=15`),
    enabled: activeSheet === 'vehicle',
  });
  const vehicles = vehiclesQuery.data?.data?.data ?? [];
  const isLoadingVehicles = vehiclesQuery.isLoading;

  // ── Stop Management ────────────────────────────────────────────────
  const addStop = useCallback(newEvent => {
    setStops(prev => {
      if (prev.find(s => s.id === newEvent.id)) {
        Alert.alert('Already Added', 'This event is already in your trip.');
        return prev;
      }
      const newStop = eventToStop(newEvent, false);
      const updated = [...prev, newStop].sort(
        (a, b) => new Date(a.from_date) - new Date(b.from_date),
      );
      updated[0].isDeparture = true;
      return updated;
    });
    setActiveSheet('stops');
  }, []);

  const removeStop = useCallback(index => {
    setStops(prev => {
      if (index === 0) {
        Alert.alert('Cannot Remove', 'Departure stop cannot be removed.');
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const selectStop = useCallback((stop, index) => {
    cameraRef.current?.setCamera({
      centerCoordinate: [parseFloat(stop.longitude), parseFloat(stop.latitude)],
      zoomLevel: 12,
      animationDuration: 600,
    });
  }, []);

  const selectVehicle = useCallback(v => setVehicle(v), []);

  // ── Confirm Trip (POST /trucking/v1/trips) ─────────────────────────
  const {mutate: confirmTripMutate, isLoading: isConfirmingTrip} = useMutation({
    mutationFn: body => API.post(tripsUrl, body),
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage(data?.message || 'Trip confirmed successfully');
        queryClient.invalidateQueries({queryKey: ['tripsList']});
        navigation.goBack();
      } else {
        errorMessage(data?.message || 'Error confirming trip');
      }
    },
    onError: e => {
      console.log('Confirm trip error:', e);
      errorMessage('Error confirming trip');
    },
  });

  const confirmTrip = useCallback(() => {
    if (stops.length < 1) {
      return Alert.alert('Add Stops', 'Please add at least one stop.');
    }
    if (!currentLocation) {
      return Alert.alert(
        'Location Needed',
        'Waiting for your current location. Please try again in a moment.',
      );
    }

    const body = {
      name: tripName || undefined, // backend defaults to "Trip {date}" if omitted
      vehicle_id: vehicle?.id,
      timezone: deviceTimeZone,
      full_path: mapboxRoute?.geoJSON ?? undefined,
      total_distance_planned: mapboxRoute?.totalDistanceMeters
        ? Math.round(mapboxRoute.totalDistanceMeters)
        : undefined,
      total_duration_planned: mapboxRoute?.totalDurationSeconds
        ? Math.round(mapboxRoute.totalDurationSeconds)
        : undefined,
      stops: buildTripStopsPayload(
        currentLocation,
        stops,
        departureAddress,
        departureSchedule,
        stopSchedules,
      ),
      legs: buildTripLegsPayload(mapboxRoute),
    };

    confirmTripMutate(body);
  }, [
    stops,
    currentLocation,
    tripName,
    vehicle,
    mapboxRoute,
    departureAddress,
    departureSchedule,
    stopSchedules,
    confirmTripMutate,
  ]);

  const continuePlanning = useCallback(() => {
    setActiveSheet('nearby');
    setShowNearbyOnMap(true);
  }, []);

  return {
    stops,
    nearbyEvents,
    routeGeoJSON,
    isLoadingRoute,
    isLoadingNearby,
    isLoadingVehicles,
    isConfirmingTrip,
    routeInfo,
    vehicle,
    vehicles,
    currentLocation,
    tripName,
    setTripName,
    departureAddress,
    setDepartureAddress,
    showNearbyOnMap,
    showListView,
    activeSheet,
    cameraRef,
    mapRef,
    setActiveSheet,
    setShowNearbyOnMap,
    setShowListView,
    addStop,
    removeStop,
    selectStop,
    selectVehicle,
    confirmTrip,
    continuePlanning,
    // NEW
    nearbySource,
    setNearbySource,
    // NEW — planned schedule
    departureSchedule,
    updateDepartureSchedule,
    stopSchedules,
    updateStopSchedule,
  };
};

export default useEventMapScreen;
