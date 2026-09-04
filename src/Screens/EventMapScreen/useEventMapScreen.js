import {useState, useRef, useCallback, useEffect} from 'react';
import {Alert, Platform, PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {
  globalSearchEventsWithFilterUrl,
  MAPBOX_TOKEN,
  MapAPIKey,
} from '../../Utils/Urls';
import {getVehicleUrl, nearbyEventsUrl, tripsUrl} from '../../Utils/Urls';
import {
  deviceTimeZone,
  buildTripStopsPayload,
  buildTripLegsPayload,
} from '../../Utils/TripPlannerHelpers';
import {
  vehicleHasDimensions,
  buildDirectionsUrl,
} from '../../Utils/RouteRestrictions';
import {successMessage, errorMessage} from '../../Config/NotificationMessage';

// NEW — how many vehicles to show in the trip planner's Vehicle tab
// before "See More" appears. The full, paginated list lives on
// VehicleListScreen, opened in selection mode.
const VEHICLE_PREVIEW_COUNT = 10;

// NEW — the actual step sequence "Continue Planning" advances through.
// Previously that button just hard-set activeSheet to 'nearby' every
// time, regardless of which tab you were already on — meaning tapping
// it a second time while already on Nearby did nothing, since it just
// set the same value again. This makes it genuinely advance one step.
const SHEET_ORDER = ['stops', 'nearby', 'vehicle'];

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

// safe date parser for defaulting planned arrival/departure times
// from an event's own from_date/to_date/start_time/end_time fields.
const parseDateSafe = str => (str ? new Date(str.replace(' ', 'T')) : null);

// reverse-geocodes a lat/lng into a human-readable address string.
// If you already have this in a shared Utils file, delete this local
// copy and import yours instead — same signature either way.
const getLocationName = async (latitude, longitude) => {
  try {
    const geocodingAPI = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MapAPIKey}`;
    const res = await fetch(geocodingAPI);
    const response = await res.json();
    if (response.results?.length > 0) {
      return response.results[0].formatted_address;
    }
    return null;
  } catch (err) {
    console.log('Reverse geocode error:', err);
    return null;
  }
};

// Full Mapbox route (kept as an object, not just geometry) so we can
// pull per-leg distance/duration for the `legs` payload on Confirm Trip.
//
// Sends max_height (m), max_width (m), max_weight (metric tons) when the
// selected vehicle has those dimensions recorded. Restriction-building
// itself lives in one shared place (RouteRestrictions.js) so this preview
// and leg/navigation routing (LegTrackingHelpers.fetchLegRoute) can never
// drift apart.
//
// Return shape distinguishes failure reasons instead of a bare null:
//   Success: {geoJSON, totalDistanceKm, totalDurationMin, totalDistanceMeters, totalDurationSeconds, legs, usedRestrictions, raw}
//   Failure: {error: 'no_route' | 'network', message}
const fetchMapboxRoute = async (points, vehicle) => {
  if (!points || points.length < 2) {
    return {
      error: 'missing_points',
      message: 'Not enough stops to calculate a route.',
    };
  }

  const hasDimensions = vehicleHasDimensions(vehicle);

  try {
    const coords = points
      .map(p => `${parseFloat(p.longitude)},${parseFloat(p.latitude)}`)
      .join(';');
    const {url} = buildDirectionsUrl({coords, vehicle, token: MAPBOX_TOKEN});

    const res = await fetch(url);
    const json = await res.json();
    const route = json?.routes?.[0];

    if (!route) {
      return {
        error: 'no_route',
        message: hasDimensions
          ? json?.message ||
            'No route could be found that fits this vehicle\u2019s dimensions for this trip.'
          : json?.message || 'No route could be found for these stops.',
      };
    }

    return {
      geoJSON: {type: 'Feature', geometry: route.geometry},
      totalDistanceKm: (route.distance / 1000).toFixed(1),
      totalDurationMin: Math.ceil(route.duration / 60),
      totalDistanceMeters: route.distance,
      totalDurationSeconds: route.duration,
      legs: route.legs,
      usedRestrictions: hasDimensions,
      raw: route,
    };
  } catch (err) {
    console.log('Route error:', err);
    return {
      error: 'network',
      message:
        'Could not reach the routing service. Check your connection and try again.',
    };
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
  const [routeInfo, setRouteInfo] = useState(null);
  const [mapboxRoute, setMapboxRoute] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [departureAddress, setDepartureAddress] = useState('Current Location');
  const [vehicle, setVehicle] = useState(null);
  const [tripName, setTripName] = useState('');
  const [showNearbyOnMap, setShowNearbyOnMap] = useState(true);
  const [showListView, setShowListView] = useState(false);
  const [activeSheet, setActiveSheet] = useState('stops');

  const [nearbySource, setNearbySource] = useState('current');
  const [hasAskedNearbySource, setHasAskedNearbySource] = useState(false);

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

  useEffect(() => {
    if (!currentLocation) return;
    let cancelled = false;

    getLocationName(currentLocation.latitude, currentLocation.longitude).then(
      name => {
        if (!cancelled && name) setDepartureAddress(name);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [currentLocation]);

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

    const result = await fetchMapboxRoute(allPoints, vehicle);
    if (result?.geoJSON) {
      setRouteGeoJSON(result.geoJSON);
      setRouteInfo({
        totalDistance: result.totalDistanceKm,
        totalDuration: result.totalDurationMin,
      });
      setMapboxRoute(result);
      fitCamera();
    } else {
      Alert.alert(
        'Route Not Available',
        result?.message || 'Could not calculate a route for these stops.',
      );
    }
    setIsLoadingRoute(false);
  };

  useEffect(() => {
    if (currentLocation && stops.length > 0) buildRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation, stops, vehicle]);

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

  const vehiclesQuery = useQuery({
    queryKey: ['vehiclesList', 'preview'],
    queryFn: () =>
      API.get(`${getVehicleUrl}?per_page=${VEHICLE_PREVIEW_COUNT}`),
    enabled: activeSheet === 'vehicle',
  });
  const vehicles = vehiclesQuery.data?.data?.data ?? [];
  const isLoadingVehicles = vehiclesQuery.isLoading;
  const hasMoreVehicles = vehicles.length >= VEHICLE_PREVIEW_COUNT;

  const goToAllVehicles = useCallback(() => {
    navigation.navigate('VehicleListScreen', {selectMode: true});
  }, [navigation]);

  useEffect(() => {
    if (route?.params?.selectedVehicle) {
      setVehicle(route.params.selectedVehicle);
      navigation.setParams({selectedVehicle: undefined});
    }
  }, [route?.params?.selectedVehicle, navigation]);

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
      name: tripName || undefined,
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

  // CHANGED — was hard-set to 'nearby' every time, so tapping this a
  // second time (already on Nearby) did nothing. Now genuinely
  // advances one step through Stops -> Nearby -> Vehicle, based on
  // whichever tab is actually active right now. Stays on Vehicle once
  // there — Confirm Trip is the real next action after that.
  const continuePlanning = useCallback(() => {
    setActiveSheet(prev => {
      const currentIndex = SHEET_ORDER.indexOf(prev);
      const nextIndex =
        currentIndex === -1
          ? 0
          : Math.min(currentIndex + 1, SHEET_ORDER.length - 1);
      return SHEET_ORDER[nextIndex];
    });
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
    // NEW — surfaces whether the previewed route actually had the
    // selected vehicle's max_height/max_width/max_weight applied, so the
    // UI can show the same "trailer-aware routing applied" disclosure
    // LegNavigationScreen already shows during active navigation.
    usedRestrictions: !!mapboxRoute?.usedRestrictions,
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
    nearbySource,
    setNearbySource,
    departureSchedule,
    updateDepartureSchedule,
    stopSchedules,
    updateStopSchedule,
    hasMoreVehicles,
    goToAllVehicles,
  };
};

export default useEventMapScreen;
