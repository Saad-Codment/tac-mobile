import {useCallback, useMemo} from 'react';
import {Alert} from 'react-native';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {useFocusEffect} from '@react-navigation/native';
import useReduxStore from '../../Hooks/UseReduxStore';
import API from '../../Utils/helperFunc';
import {
  tripDetailsUrl,
  tripStatusUrl,
  tripStopUpdateUrl,
  tripCancelUrl,
} from '../../Utils/Urls';
import {
  deviceTimeZone,
  toWallClockString,
} from '../../Utils/TripPlannerHelpers';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';

const useTripDetailScreen = (navigation, route) => {
  const {tripId} = route?.params ?? {};
  const queryClient = useQueryClient();

  const {data, isLoading, refetch} = useQuery({
    queryKey: ['tripDetail', tripId],
    queryFn: () => API.get(`${tripDetailsUrl}${tripId}`),
    enabled: !!tripId,
  });

  const trip = data?.data?.data;

  // NEW — LEG_TRACKING_API §2 explicitly calls this out: leg statuses
  // change over time as the organizer executes the trip (pending ->
  // active -> paused -> ... -> completed), so this screen needs to
  // refetch whenever it regains focus, not just on first mount (e.g.
  // navigating back from Leg Navigation or Live Tracking).
  useFocusEffect(
    useCallback(() => {
      if (tripId) refetch();
    }, [tripId, refetch]),
  );

  const {getState} = useReduxStore();
  const {userData} = getState('Auth');
  const currentUserId = userData?.id;
  const isOrganizer = !!trip && trip.organizer_id === currentUserId;

  const participantsSummary = useMemo(() => {
    const list = trip?.participants;
    if (!isOrganizer || !list) return null;
    const total = list.length;
    const pending = list.filter(p => p.status === 'pending').length;
    return {total, pending};
  }, [trip, isOrganizer]);

  // NEW — whether there's a leg currently active/paused, used to show
  // the participant-facing "Track Live" banner.
  const hasActiveLeg = useMemo(
    () =>
      (trip?.legs ?? []).some(
        l => l.status === 'active' || l.status === 'paused',
      ),
    [trip],
  );

  const syncAfterChange = useCallback(async () => {
    await Promise.all([
      refetch(),
      queryClient.invalidateQueries({queryKey: ['tripsList']}),
    ]);
  }, [refetch, queryClient]);

  const routeGeoJSON = trip?.full_path ?? null;

  const mapBounds = useMemo(() => {
    const pathCoords = trip?.full_path?.geometry?.coordinates;
    const points =
      pathCoords?.length > 0
        ? pathCoords
        : (trip?.stops ?? [])
            .map(s => [parseFloat(s.longitude), parseFloat(s.latitude)])
            .filter(([lng, lat]) => !isNaN(lng) && !isNaN(lat));

    if (!points || points.length === 0) return null;

    const lngs = points.map(p => p[0]);
    const lats = points.map(p => p[1]);
    return {
      ne: [Math.max(...lngs), Math.max(...lats)],
      sw: [Math.min(...lngs), Math.min(...lats)],
    };
  }, [trip]);

  const legByStartStopId = useMemo(() => {
    const map = {};
    (trip?.legs ?? []).forEach(leg => {
      map[leg.start_stop_id] = leg;
    });
    return map;
  }, [trip]);

  // NEW — "which leg comes next" for the Next Leg banner. There's no
  // explicit sequence field on a leg; order is implied by the stops
  // array (a leg's start_stop_id lines up with a stop). We rebuild that
  // order here rather than trusting `trip.legs`' own array order, then
  // prefer an already-started leg (active/paused — the organizer needs
  // to get back into that one) over the next not-yet-started one. This
  // reads entirely off the backend-fetched trip/leg data — no local
  // "current leg" state of our own — so it stays correct across
  // refetches (e.g. right after Complete Leg navigates back here).
  const orderedLegs = useMemo(() => {
    const stops = trip?.stops ?? [];
    const legs = trip?.legs ?? [];
    return stops
      .map(stop => legs.find(l => l.start_stop_id === stop.id))
      .filter(Boolean);
  }, [trip]);

  const nextLeg = useMemo(() => {
    if (!orderedLegs.length) return null;
    return (
      orderedLegs.find(l => l.status === 'active' || l.status === 'paused') ??
      orderedLegs.find(l => l.status === 'pending') ??
      null
    );
  }, [orderedLegs]);

  const nextLegStops = useMemo(() => {
    if (!nextLeg) return null;
    const stops = trip?.stops ?? [];
    return {
      startStop: stops.find(s => s.id === nextLeg.start_stop_id) ?? null,
      endStop: stops.find(s => s.id === nextLeg.end_stop_id) ?? null,
    };
  }, [nextLeg, trip]);

  const {mutate: updateStatusMutate, isLoading: isUpdatingStatus} = useMutation(
    {
      mutationFn: body => API.patch(tripStatusUrl(tripId), body),
      onSuccess: async ({ok, data: resData}) => {
        if (ok) {
          successMessage(resData?.message || 'Trip updated');
          await syncAfterChange();
        } else {
          errorMessage(resData?.message || 'Error updating trip status');
        }
      },
      onError: () => errorMessage('Error updating trip status'),
    },
  );

  const startTrip = useCallback(() => {
    updateStatusMutate({
      status: 'in_progress',
      actual_departure_at: toWallClockString(new Date()),
      timezone: deviceTimeZone,
    });
  }, [updateStatusMutate]);

  const completeTrip = useCallback(() => {
    updateStatusMutate({
      status: 'completed',
      actual_arrival_at: toWallClockString(new Date()),
      timezone: deviceTimeZone,
    });
  }, [updateStatusMutate]);

  const confirmCancelTrip = useCallback(() => {
    Alert.alert('Cancel Trip', 'Are you sure you want to cancel this trip?', [
      {text: 'No', style: 'cancel'},
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          const {ok, data: resData} = await API.delete(tripCancelUrl(tripId));
          if (ok) {
            successMessage(resData?.message || 'Trip cancelled');
            await syncAfterChange();
            navigation.goBack();
          } else {
            errorMessage(resData?.message || 'Error cancelling trip');
          }
        },
      },
    ]);
  }, [tripId, navigation, syncAfterChange]);

  const {mutate: updateStopMutate, isLoading: isUpdatingStop} = useMutation({
    mutationFn: ({stopId, body}) =>
      API.patch(tripStopUpdateUrl(tripId, stopId), body),
    onSuccess: async ({ok, data: resData}) => {
      if (ok) {
        successMessage(resData?.message || 'Stop updated');
        await syncAfterChange();
      } else {
        errorMessage(resData?.message || 'Error updating stop');
      }
    },
    onError: () => errorMessage('Error updating stop'),
  });

  const markStopArrived = useCallback(
    stopId => {
      updateStopMutate({
        stopId,
        body: {
          ata_actual: toWallClockString(new Date()),
          timezone: deviceTimeZone,
        },
      });
    },
    [updateStopMutate],
  );

  const markStopDeparted = useCallback(
    stopId => {
      updateStopMutate({
        stopId,
        body: {
          atd_actual: toWallClockString(new Date()),
          timezone: deviceTimeZone,
        },
      });
    },
    [updateStopMutate],
  );

  const goToManageRequests = useCallback(() => {
    navigation.navigate('ManageRequestsScreen', {tripId});
  }, [navigation, tripId]);

  const goToRequestToJoin = useCallback(() => {
    navigation.navigate('RequestToJoinScreen', {
      tripId,
      stops: trip?.stops ?? [],
    });
  }, [navigation, tripId, trip]);

  // NEW — organizer taps a leg to open Leg Navigation
  const goToLegNavigation = useCallback(
    leg => {
      navigation.navigate('LegNavigationScreen', {tripId, legId: leg.id});
    },
    [navigation, tripId],
  );

  // NEW — participant/viewer taps "Track Live"
  const goToLiveTracking = useCallback(() => {
    navigation.navigate('LiveTrackingScreen', {tripId});
  }, [navigation, tripId]);

  return {
    trip,
    isLoading,
    routeGeoJSON,
    mapBounds,
    legByStartStopId,
    nextLeg,
    nextLegStops,
    startTrip,
    completeTrip,
    confirmCancelTrip,
    markStopArrived,
    markStopDeparted,
    isUpdatingStatus,
    isUpdatingStop,
    isOrganizer,
    participantsSummary,
    hasActiveLeg,
    goToManageRequests,
    goToRequestToJoin,
    goToLegNavigation,
    goToLiveTracking,
  };
};

export default useTripDetailScreen;
