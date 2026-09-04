import {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {Alert, Platform, PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Tts from 'react-native-tts';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {tripDetailsUrl} from '../../Utils/Urls';
import {
  legStartUrl,
  legPauseUrl,
  legResumeUrl,
  legCompleteUrl,
  legLocationUrl,
} from '../../Utils/Urls';
import {
  haversineDistanceMeters,
  fetchPOIsAlongRoute,
  fetchPOIDetails,
  isOffRoute,
  advanceStepIndex,
  computeRemaining,
} from '../../Utils/LegTrackingHelpers';
import {successMessage, errorMessage} from '../../Config/NotificationMessage';
import {getFuelPrice} from '../../Services/FuelPriceService';
import {getWeighStationStatus} from '../../Services/WeighStationService';
import {
  getRouteWeather,
  isWeatherConfigured,
} from '../../Services/Weather/WeatherService';
// NEW — routes calls through the engine seam (currently the same
// Mapbox-Directions-backed logic as before, just named/indirected so a
// future native navigation engine can be swapped in without touching
// this screen again — see NavigationEngine.js).
import {
  getActiveNavigationEngine,
  getNativeNavigationEngine,
} from '../../Services/Navigation/NavigationEngine';

const PING_INTERVAL_MS = 12000;
const OFF_ROUTE_THRESHOLD_METERS = 60;
const REROUTE_COOLDOWN_MS = 20000;

// CHANGED — was every POI category on by default, which meant fuel,
// hotel, rest, weigh, parking, and horse markers could all be showing on
// the map simultaneously. Route-critical categories for a trailer trip
// stay on by default; the two more browsing-oriented ones (hotels, rest
// stops) start off and are still one tap away via the existing toggle
// row (POILayerControls) — nothing was removed, just decluttered by
// default.
const DEFAULT_VISIBLE_POI_CATEGORIES = ['fuel', 'weigh', 'parking', 'horse'];

const useLegNavigationScreen = (navigation, route) => {
  const {tripId, legId} = route?.params ?? {};
  const navigationEngine = getActiveNavigationEngine();
  const nativeEngine = getNativeNavigationEngine();
  const queryClient = useQueryClient();

  const {data, isLoading} = useQuery({
    queryKey: ['tripDetail', tripId],
    queryFn: () => API.get(`${tripDetailsUrl}${tripId}`),
    enabled: !!tripId,
  });

  const trip = data?.data?.data;
  const leg = useMemo(
    () => trip?.legs?.find(l => l.id === legId),
    [trip, legId],
  );
  const startStop = useMemo(
    () => trip?.stops?.find(s => s.id === leg?.start_stop_id),
    [trip, leg],
  );
  const endStop = useMemo(
    () => trip?.stops?.find(s => s.id === leg?.end_stop_id),
    [trip, leg],
  );

  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [poisByCategory, setPoisByCategory] = useState({});
  const [visiblePOICategories, setVisiblePOICategories] = useState(
    () => new Set(DEFAULT_VISIBLE_POI_CATEGORIES),
  );
  const [organizerPosition, setOrganizerPosition] = useState(null);
  const [liveDistanceMeters, setLiveDistanceMeters] = useState(0);
  const [distanceInput, setDistanceInput] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [remaining, setRemaining] = useState({
    distanceMeters: 0,
    durationSeconds: 0,
  });
  const [isRerouting, setIsRerouting] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const [usedRestrictions, setUsedRestrictions] = useState(false);
  const [routeWarning, setRouteWarning] = useState(null);
  // NEW — route-level weather hazard indicator (Step 7). Derived from
  // current conditions at a few sampled points along the route (see
  // WeatherService.getRouteWeather) — a real signal, but explicitly NOT
  // an authoritative weather-alert feed (that needs the separate One
  // Call 3.0 subscription — see WeatherProvider.fetchAlerts). Only
  // populated when a weather provider key is actually configured, so
  // this stays silent (no banner at all) rather than showing an
  // "unavailable" state mid-drive — that would be clutter, not useful
  // information, while navigating.
  const [weatherHazardWarning, setWeatherHazardWarning] = useState(null);

  // NEW — native Navigation SDK guidance (Step 9). When `nativeEngine` is
  // available, it becomes the SINGLE source of remaining distance/
  // duration/maneuver text and off-route/reroute detection for this leg —
  // the JS haversine-based computation further below (`advanceStepIndex`,
  // `computeRemaining`, `isOffRoute`) is skipped whenever this is active,
  // rather than both running and disagreeing. It does NOT replace route
  // LINE rendering (still the HTTP engine's `routeGeoJSON`/`steps` — see
  // NavigationEngine.js's own note on why) or TAC's Trip/Leg backend
  // lifecycle (Arrived/Confirm Arrival/Complete Leg below is unchanged).
  const [nativeGuidanceActive, setNativeGuidanceActive] = useState(false);
  const [nativeRemaining, setNativeRemaining] = useState(null);
  const [nativeManeuver, setNativeManeuver] = useState(null);

  // NEW — POI tap-to-detail. selectedPOI is the marker that was
  // tapped (immediately available: name/category/coords already in
  // memory from the search results); poiDetails is the richer Places
  // Details response, fetched on demand so we're not calling Details
  // for every marker up front, only the one actually opened.
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [poiDetails, setPoiDetails] = useState(null);
  const [isLoadingPOIDetails, setIsLoadingPOIDetails] = useState(false);
  // NEW — the real integration points for live fuel price / weigh-station
  // status. Both currently resolve to {unavailable: true, reason:
  // 'not_configured'} (see FuelPriceService/WeighStationService), fetched
  // the same way poiDetails is rather than left as static UI copy, so a
  // future provider only has to change the service, not this screen.
  const [poiFuelPrice, setPoiFuelPrice] = useState(null);
  const [poiWeighStatus, setPoiWeighStatus] = useState(null);

  const lastPositionRef = useRef(null);
  const watchIdRef = useRef(null);
  const pingIntervalRef = useRef(null);
  const lastAnnouncedStepRef = useRef(-1);
  const lastRerouteAtRef = useRef(0);

  useEffect(() => {
    Tts.getInitStatus()
      .then(() => {
        Tts.setDefaultRate(0.5);
        Tts.setDucking?.(true);
      })
      .catch(err => console.log('TTS init error (non-fatal):', err));
  }, []);

  const speak = useCallback(
    text => {
      if (!voiceEnabled || !text) return;
      Tts.stop();
      Tts.speak(text);
    },
    [voiceEnabled],
  );

  const toggleVoice = useCallback(() => {
    setVoiceEnabled(prev => {
      if (prev) Tts.stop();
      return !prev;
    });
  }, []);

  useEffect(() => {
    if (leg?.current_route_token && !routeGeoJSON) {
      setRouteGeoJSON({type: 'Feature', geometry: leg.current_route_token});
    }
  }, [leg, routeGeoJSON]);

  useEffect(() => {
    if (steps.length > 0) return;
    if (leg?.status !== 'active' && leg?.status !== 'paused') return;
    if (!startStop || !endStop) return;

    navigationEngine
      .calculateRoute({startStop, endStop, vehicle: trip?.vehicle})
      .then(async result => {
        if (!result?.geometry) return;
        setRouteGeoJSON({type: 'Feature', geometry: result.geometry});
        setSteps(result.steps ?? []);
        setUsedRestrictions(!!result.usedRestrictions);

        // NEW — starts real native guidance for the SAME route just
        // calculated above (navigationEngine IS nativeEngine whenever the
        // native module is linked — see NavigationEngine.js's engine-
        // selection rule — so this is not a second, separate route
        // request). Only for an 'active' leg, not 'paused'. Kept here
        // (not a separate effect keyed on routeGeoJSON) specifically so a
        // later native reroute — which also updates routeGeoJSON via
        // onRouteUpdated below — never re-triggers this block or
        // restarts guidance.
        if (nativeEngine && leg?.status === 'active') {
          await nativeEngine.startActiveGuidance({
            startStop,
            endStop,
            startLegIndex: 0,
          });
          setNativeGuidanceActive(true);
        }
      });
  }, [leg?.status, startStop, endStop, trip?.vehicle, steps.length, navigationEngine, nativeEngine]);

  // NEW — subscribes to native guidance events for exactly as long as
  // nativeGuidanceActive is true (flipped above once startActiveGuidance
  // succeeds, and reset to false below on leg end/unmount). Deliberately
  // does NOT depend on routeGeoJSON: onRouteUpdated here calls
  // setRouteGeoJSON/setSteps on every native reroute, and if this effect
  // also depended on routeGeoJSON it would tear down and resubscribe (and
  // the cleanup below would stop guidance) every time that happens.
  useEffect(() => {
    if (!nativeEngine || !nativeGuidanceActive) return undefined;

    const unsubscribe = nativeEngine.subscribeToEvents({
      onRouteProgress: progress => {
        setNativeRemaining({
          distanceMeters: progress?.distanceRemainingMeters ?? 0,
          durationSeconds: progress?.durationRemainingSeconds ?? 0,
        });
        setNativeManeuver({
          distance: progress?.maneuverDistanceRemainingMeters ?? 0,
          maneuver: {instruction: progress?.maneuverInstruction ?? null},
        });
      },
      onRerouting: () => {
        setRouteWarning(null);
        speak('Rerouting');
      },
      // Closes the "native reroute -> new geometry -> map updates" chain
      // (Step 8). Fired by the SDK's own RerouteController whenever it
      // replaces the active route, reroute included — not just on the
      // initial calculateRoute. Updates the SAME routeGeoJSON/steps state
      // the route line and turn-by-turn banner already render from, so
      // the map is never left drawing a stale route while instructions
      // follow a new one.
      onRouteUpdated: ({geometry, steps: updatedSteps}) => {
        if (!geometry) return;
        setRouteGeoJSON({type: 'Feature', geometry});
        setSteps(updatedSteps ?? []);
        setCurrentStepIndex(0);
        lastAnnouncedStepRef.current = -1;
      },
    });

    return () => unsubscribe();
  }, [nativeEngine, nativeGuidanceActive, speak]);

  // Stops native guidance when the leg stops being active (paused,
  // completed, or navigated away from). The cleanup is registered on the
  // run WHERE leg.status is 'active', so it fires exactly when that
  // status changes away — not on every render — and, like the two
  // effects above, never depends on routeGeoJSON.
  useEffect(() => {
    if (leg?.status !== 'active') {
      setNativeGuidanceActive(false);
      return undefined;
    }
    return () => {
      setNativeGuidanceActive(false);
      if (nativeEngine) nativeEngine.stopGuidance();
    };
  }, [nativeEngine, leg?.status]);

  useEffect(() => {
    const coords = routeGeoJSON?.geometry?.coordinates;
    if (!coords?.length) return;
    fetchPOIsAlongRoute(coords).then(setPoisByCategory);
  }, [routeGeoJSON]);

  useEffect(() => {
    const coords = routeGeoJSON?.geometry?.coordinates;
    if (!coords?.length || !isWeatherConfigured()) return;
    getRouteWeather(coords).then(result => {
      if (result?.unavailable) return;
      const hazard = result.possibleHazards?.[0];
      setWeatherHazardWarning(
        hazard ? `Weather along route: ${hazard.description}.` : null,
      );
    });
  }, [routeGeoJSON]);

  const dismissWeatherHazardWarning = useCallback(
    () => setWeatherHazardWarning(null),
    [],
  );

  const togglePOICategory = useCallback(key => {
    setVisiblePOICategories(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // NEW — open the detail sheet for a tapped POI, then fetch its
  // richer details in the background.
  const selectPOI = useCallback(poi => {
    setSelectedPOI(poi);
    setPoiDetails(null);
    setPoiFuelPrice(null);
    setPoiWeighStatus(null);
    setIsLoadingPOIDetails(true);
    fetchPOIDetails(poi?.id)
      .then(setPoiDetails)
      .finally(() => setIsLoadingPOIDetails(false));

    if (poi?.category === 'fuel') {
      getFuelPrice(poi).then(setPoiFuelPrice);
    } else if (poi?.category === 'weigh') {
      getWeighStationStatus(poi).then(setPoiWeighStatus);
    }
  }, []);

  const closePOIDetails = useCallback(() => {
    setSelectedPOI(null);
    setPoiDetails(null);
    setPoiFuelPrice(null);
    setPoiWeighStatus(null);
  }, []);

  const ensureLocationPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === 'granted';
    }
    return true;
  }, []);

  const reroute = useCallback(
    async currentPos => {
      if (!currentPos || !endStop || isRerouting) return;
      setIsRerouting(true);
      speak('Rerouting');
      const fakeStartStop = {
        latitude: currentPos.latitude,
        longitude: currentPos.longitude,
      };
      // Trailer constraints (max_height/max_width/max_weight) travel
      // through unchanged on reroute — same `vehicle` object, same
      // engine, so a reroute can never silently drop them.
      const result = await navigationEngine.reroute({
        currentPosition: fakeStartStop,
        endStop,
        vehicle: trip?.vehicle,
      });
      if (result?.geometry) {
        setRouteGeoJSON({type: 'Feature', geometry: result.geometry});
        setSteps(result.steps ?? []);
        setCurrentStepIndex(0);
        lastAnnouncedStepRef.current = -1;
        setUsedRestrictions(!!result.usedRestrictions);
        setRouteWarning(null);
      } else {
        setRouteWarning(
          result?.message ||
            'Could not recalculate the route. Continuing on the previous route.',
        );
      }
      lastRerouteAtRef.current = Date.now();
      setIsRerouting(false);
    },
    [endStop, trip?.vehicle, isRerouting, speak, navigationEngine],
  );

  const dismissRouteWarning = useCallback(() => setRouteWarning(null), []);

  useEffect(() => {
    if (leg?.status !== 'active') {
      if (watchIdRef.current != null) {
        Geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    watchIdRef.current = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const current = {latitude, longitude};
        setOrganizerPosition(current);

        if (lastPositionRef.current) {
          const segment = haversineDistanceMeters(
            lastPositionRef.current.latitude,
            lastPositionRef.current.longitude,
            latitude,
            longitude,
          );
          if (segment > 5) {
            setLiveDistanceMeters(prev => prev + segment);
          }
        }
        lastPositionRef.current = current;

        // CHANGED — skipped whenever native guidance is active: that
        // engine already does its own off-route detection + automatic
        // rerouting internally (its RerouteController), and its progress
        // events (subscribed above) already drive `nativeRemaining`/
        // `nativeManeuver`. Running both this haversine-based computation
        // AND the native one at the same time would just produce two
        // independent, possibly-disagreeing progress sources for the same
        // leg — this keeps native as the single source once it's active,
        // per the migration note on nativeGuidanceActive above.
        if (!nativeGuidanceActive) {
          if (steps.length > 0) {
            setCurrentStepIndex(prevIndex => {
              const nextIndex = advanceStepIndex(steps, prevIndex, current);
              if (nextIndex !== lastAnnouncedStepRef.current) {
                const nextStep = steps[nextIndex];
                const instruction = nextStep?.maneuver?.instruction;
                if (instruction) speak(instruction);
                lastAnnouncedStepRef.current = nextIndex;
              }
              setRemaining(computeRemaining(steps, nextIndex, current));
              return nextIndex;
            });
          }

          const coords = routeGeoJSON?.geometry?.coordinates;
          const cooledDown =
            Date.now() - lastRerouteAtRef.current > REROUTE_COOLDOWN_MS;
          if (coords?.length && cooledDown && !isRerouting) {
            if (isOffRoute(current, coords, OFF_ROUTE_THRESHOLD_METERS)) {
              reroute(current);
            }
          }
        }
      },
      error => console.log('watchPosition error:', error),
      {enableHighAccuracy: true, distanceFilter: 10},
    );

    return () => {
      if (watchIdRef.current != null) {
        Geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leg?.status, steps, routeGeoJSON, isRerouting, nativeGuidanceActive]);

  useEffect(() => {
    if (leg?.status !== 'active' || !tripId || !legId) {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
      return;
    }

    const sendPing = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          API.post(legLocationUrl(tripId, legId), {latitude, longitude}).catch(
            err => console.log('Location ping failed (non-fatal):', err),
          );
        },
        err => console.log('getCurrentPosition error:', err),
        {enableHighAccuracy: true, timeout: 10000},
      );
    };

    sendPing();
    pingIntervalRef.current = setInterval(sendPing, PING_INTERVAL_MS);

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
    };
  }, [leg?.status, tripId, legId]);

  const invalidateTripDetail = useCallback(() => {
    queryClient.invalidateQueries({queryKey: ['tripDetail', tripId]});
    queryClient.invalidateQueries({queryKey: ['tripsList']});
  }, [tripId, queryClient]);

  const {mutate: startLegMutate, isLoading: isStarting} = useMutation({
    mutationFn: body => API.post(legStartUrl(tripId, legId), body),
    onSuccess: async ({ok, data: resData}) => {
      if (ok) {
        successMessage(resData?.message || 'Leg started');
        await invalidateTripDetail();
      } else {
        errorMessage(resData?.message || 'Error starting leg');
      }
    },
    onError: () => errorMessage('Error starting leg'),
  });

  const startLeg = useCallback(async () => {
    const hasPermission = await ensureLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Location Needed',
        'Location permission is required to start a leg.',
      );
      return;
    }
    if (!startStop || !endStop) {
      Alert.alert(
        'Missing Stops',
        "Could not determine this leg's start/end stops.",
      );
      return;
    }

    const result = await navigationEngine.calculateRoute({
      startStop,
      endStop,
      vehicle: trip?.vehicle,
    });

    const proceedWithoutRoute = () => {
      setUsedRestrictions(false);
      startLegMutate({});
    };

    if (result?.geometry) {
      setRouteGeoJSON({type: 'Feature', geometry: result.geometry});
      setSteps(result.steps ?? []);
      setCurrentStepIndex(0);
      lastAnnouncedStepRef.current = -1;
      setUsedRestrictions(!!result.usedRestrictions);

      startLegMutate({
        route_geometry: result.geometry,
        distance_planned_meters: result.distanceMeters
          ? Math.round(result.distanceMeters)
          : undefined,
        duration_planned_seconds: result.durationSeconds
          ? Math.round(result.durationSeconds)
          : undefined,
      });
      return;
    }

    // CHANGED — "Start Anyway" read as if the leg would still get some
    // kind of route. It won't: proceedWithoutRoute starts the leg with no
    // route data at all, and TAC never falls back to calculating an
    // unrestricted (non trailer-aware) route in its place. The copy now
    // says that explicitly, and the action name matches what actually
    // happens instead of hiding it behind a generic "Anyway".
    Alert.alert(
      'Trailer-Aware Route Not Available',
      (result?.message ||
        "TAC couldn't calculate a route for this leg that fits your vehicle's dimensions.") +
        ' You can start the leg without turn-by-turn navigation and drive it manually, or cancel and check the vehicle/stops.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Start Leg Without Navigation',
          style: 'destructive',
          onPress: proceedWithoutRoute,
        },
      ],
    );
  }, [
    startStop,
    endStop,
    trip,
    startLegMutate,
    ensureLocationPermission,
    navigationEngine,
  ]);

  const {mutate: pauseLegMutate, isLoading: isPausing} = useMutation({
    mutationFn: () => API.patch(legPauseUrl(tripId, legId)),
    onSuccess: async ({ok, data: resData}) => {
      if (ok) {
        successMessage(resData?.message || 'Leg paused');
        await invalidateTripDetail();
      } else {
        errorMessage(resData?.message || 'Error pausing leg');
      }
    },
    onError: () => errorMessage('Error pausing leg'),
  });

  const {mutate: resumeLegMutate, isLoading: isResuming} = useMutation({
    mutationFn: () => API.patch(legResumeUrl(tripId, legId)),
    onSuccess: async ({ok, data: resData}) => {
      if (ok) {
        successMessage(resData?.message || 'Leg resumed');
        await invalidateTripDetail();
      } else {
        errorMessage(resData?.message || 'Error resuming leg');
      }
    },
    onError: () => errorMessage('Error resuming leg'),
  });

  const pauseLeg = useCallback(() => pauseLegMutate(), [pauseLegMutate]);
  const resumeLeg = useCallback(() => resumeLegMutate(), [resumeLegMutate]);

  const {mutate: completeLegMutate, isLoading: isCompleting} = useMutation({
    mutationFn: body => API.patch(legCompleteUrl(tripId, legId), body),
    onSuccess: async ({ok, data: resData}) => {
      if (ok) {
        successMessage(resData?.message || 'Leg completed');
        setShowCompleteModal(false);
        Tts.stop();
        await invalidateTripDetail();
        navigation.goBack();
      } else {
        errorMessage(resData?.message || 'Error completing leg');
      }
    },
    onError: () => errorMessage('Error completing leg'),
  });

  const openCompleteModal = useCallback(() => {
    setDistanceInput((liveDistanceMeters / 1000).toFixed(1));
    setShowCompleteModal(true);
  }, [liveDistanceMeters]);

  const confirmComplete = useCallback(() => {
    const km = parseFloat(distanceInput);
    if (isNaN(km) || km <= 0) {
      Alert.alert(
        'Invalid Distance',
        'Please enter the actual distance driven.',
      );
      return;
    }
    completeLegMutate({distance_actual_meters: Math.round(km * 1000)});
  }, [distanceInput, completeLegMutate]);

  return {
    trip,
    leg,
    startStop,
    endStop,
    isLoading,
    routeGeoJSON,
    organizerPosition,
    poisByCategory,
    visiblePOICategories,
    togglePOICategory,
    liveDistanceMeters,
    distanceInput,
    setDistanceInput,
    showCompleteModal,
    openCompleteModal,
    closeCompleteModal: () => setShowCompleteModal(false),
    confirmComplete,
    startLeg,
    pauseLeg,
    resumeLeg,
    isStarting,
    isPausing,
    isResuming,
    isCompleting,
    steps,
    // Prefer native guidance's own maneuver/remaining data once it's
    // active — see the nativeGuidanceActive effect above for why. The
    // shape matches what steps[currentStepIndex] already looked like
    // ({distance, maneuver: {instruction}}), so the UI (TurnByTurnBanner
    // etc.) reads either source identically without its own changes.
    currentStep: nativeGuidanceActive
      ? nativeManeuver
      : steps[currentStepIndex] ?? null,
    nextStep: nativeGuidanceActive ? null : steps[currentStepIndex + 1] ?? null,
    remaining: nativeGuidanceActive && nativeRemaining ? nativeRemaining : remaining,
    nativeGuidanceActive,
    isRerouting,
    voiceEnabled,
    toggleVoice,
    usedRestrictions,
    routeWarning,
    dismissRouteWarning,
    weatherHazardWarning,
    dismissWeatherHazardWarning,
    // NEW
    selectedPOI,
    poiDetails,
    isLoadingPOIDetails,
    poiFuelPrice,
    poiWeighStatus,
    selectPOI,
    closePOIDetails,
  };
};

export default useLegNavigationScreen;
