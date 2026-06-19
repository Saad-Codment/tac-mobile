import {useState, useRef, useCallback, useEffect} from 'react';
import {Alert, Platform, PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import API from '../../Utils/helperFunc';
import {MAPBOX_TOKEN} from '../../Utils/Urls';

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
  isDeparture: isFirst,
});

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
      totalDistance: (route.distance / 1000).toFixed(1),
      totalDuration: Math.ceil(route.duration / 60),
    };
  } catch (err) {
    console.log('Route error:', err);
    return null;
  }
};

const useEventMapScreen = (navigation, route) => {
  const {event, events} = route?.params ?? {};

  const cameraRef = useRef(null);
  const mapRef = useRef(null);

  const [stops, setStops] = useState([]);
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [showNearbyOnMap, setShowNearbyOnMap] = useState(true);
  const [showListView, setShowListView] = useState(false);
  const [activeSheet, setActiveSheet] = useState('stops');

  // Get Current Location
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

  // Request Location Permission
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

  // Build Initial Stops
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

  // Build Full Route from Current Location
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
        totalDistance: result.totalDistance,
        totalDuration: result.totalDuration,
      });
      fitCamera();
    }
    setIsLoadingRoute(false);
  };

  useEffect(() => {
    if (currentLocation && stops.length > 0) buildRoute();
  }, [currentLocation, stops]);

  const fitCamera = useCallback(() => {
    if (!cameraRef.current) return;
    if (stops.length === 0) return;

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

  // Fetch Nearby Events (Dummy)
  useEffect(() => {
    if (stops[0]) {
      setIsLoadingNearby(true);
      setTimeout(() => {
        setNearbyEvents([
          {
            id: 9001,
            title: 'Tampa Horse Show',
            address: 'Tampa, FL 33602',
            latitude: 27.9506,
            longitude: -82.4572,
            from_date: '2026-04-18 09:00:00',
          },
          {
            id: 9002,
            title: 'Orlando Rodeo Classic',
            address: 'Orlando, FL 32801',
            latitude: 28.5383,
            longitude: -81.3792,
            from_date: '2026-04-20 10:00:00',
          },
          {
            id: 9003,
            title: 'Kissimmee Livestock Fair',
            address: 'Kissimmee, FL 34741',
            latitude: 28.292,
            longitude: -81.4076,
            from_date: '2026-04-22 08:00:00',
          },
        ]);
        setIsLoadingNearby(false);
      }, 600);
    }
  }, [stops]);

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
  const confirmTrip = useCallback(() => {
    if (stops.length < 1)
      return Alert.alert('Add Stops', 'Please add at least one stop.');
    Alert.alert('Trip Confirmed! ✅', 'Your trip has been saved.');
  }, [stops]);

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
    routeInfo,
    vehicle,
    currentLocation,
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
  };
};

export default useEventMapScreen;
