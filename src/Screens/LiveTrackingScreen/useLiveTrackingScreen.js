import {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import {useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {tripDetailsUrl} from '../../Utils/Urls';
import {legLocationUrl} from '../../Utils/Urls';
import {formatStaleness, isStale} from '../../Utils/LegTrackingHelpers';

const LOCATION_POLL_MS = 12000; // 12s — within the doc's recommended 10-15s
const TRIP_REFRESH_MS = 45000; // leg statuses change far less often than position

const useLiveTrackingScreen = (navigation, route) => {
  const {tripId, legId: legIdParam} = route?.params ?? {};

  const [organizerLocation, setOrganizerLocation] = useState(null); // {latitude, longitude, updated_at}
  const [now, setNow] = useState(Date.now()); // ticks every second so "Xs ago" stays live

  const pollRef = useRef(null);
  const tickRef = useRef(null);

  const {data, refetch} = useQuery({
    queryKey: ['tripDetail', tripId],
    queryFn: () => API.get(`${tripDetailsUrl}${tripId}`),
    enabled: !!tripId,
  });

  const trip = data?.data?.data;
  const legs = useMemo(() => trip?.legs ?? [], [trip]);

  // If no specific legId was passed (e.g. arriving from a LEG_STARTED
  // notification, which does give one), fall back to whichever leg is
  // currently active or paused.
  const activeLeg = useMemo(() => {
    if (legIdParam) return legs.find(l => l.id === legIdParam) ?? null;
    return (
      legs.find(l => l.status === 'active' || l.status === 'paused') ?? null
    );
  }, [legs, legIdParam]);

  const startStop = useMemo(
    () => trip?.stops?.find(s => s.id === activeLeg?.start_stop_id),
    [trip, activeLeg],
  );
  const endStop = useMemo(
    () => trip?.stops?.find(s => s.id === activeLeg?.end_stop_id),
    [trip, activeLeg],
  );

  // ── Poll organizer position ─────────────────────────────────────
  useEffect(() => {
    if (!tripId || !activeLeg?.id) return undefined;

    const poll = async () => {
      const {ok, data: resData} = await API.get(
        legLocationUrl(tripId, activeLeg.id),
      );
      if (ok && resData?.data) {
        setOrganizerLocation(resData.data);
      }
    };

    poll();
    pollRef.current = setInterval(poll, LOCATION_POLL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [tripId, activeLeg?.id]);

  // ── Periodically refresh trip/leg statuses ──────────────────────
  useEffect(() => {
    if (!tripId) return undefined;
    const interval = setInterval(() => refetch(), TRIP_REFRESH_MS);
    return () => clearInterval(interval);
  }, [tripId, refetch]);

  // ── "Xs ago" ticking clock ───────────────────────────────────────
  useEffect(() => {
    tickRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tickRef.current);
  }, []);

  const stalenessLabel = useMemo(() => {
    if (!organizerLocation?.updated_at) return null;
    return formatStaleness(organizerLocation.updated_at);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizerLocation, now]);

  const positionIsStale = organizerLocation?.updated_at
    ? isStale(organizerLocation.updated_at)
    : false;

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  return {
    trip,
    legs,
    activeLeg,
    startStop,
    endStop,
    organizerLocation,
    stalenessLabel,
    positionIsStale,
    goBack,
  };
};

export default useLiveTrackingScreen;
