import {useCallback, useMemo} from 'react';
import {Alert} from 'react-native';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {successMessage, errorMessage} from '../../Utils/helperFunc'; // adjust path if these live elsewhere
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
import useReduxStore from '../../Hooks/UseReduxStore';

const useTripDetailScreen = (navigation, route) => {
  const {tripId} = route?.params ?? {};
  const {dispatch, getState, queryClient} = useReduxStore();

  const {data, isLoading, refetch} = useQuery({
    queryKey: ['tripDetail', tripId],
    queryFn: () => API.get(`${tripDetailsUrl}${tripId}`),
    enabled: !!tripId,
  });

  const trip = data?.data?.data;

  // NEW — organizer vs joiner/viewer detection. Trip Detail is now a
  // shared screen: the organizer sees trip-management actions +
  // participants; anyone else sees "Request to Join" instead.
  // ⚠️ Verify the exact shape once you send it — assuming
  // getState('Auth').userData.id is the logged-in user's id.
  const {userData} = getState('Auth');
  const currentUserId = userData?.id;
  const isOrganizer = !!trip && trip.organizer_id === currentUserId;

  // NEW — compact participants summary for the organizer, e.g.
  // "4 participants · 2 pending". participants[] is only present in the
  // response at all when the viewer is the organizer (per the API doc).
  const participantsSummary = useMemo(() => {
    const list = trip?.participants;
    if (!isOrganizer || !list) return null;
    const total = list.length;
    const pending = list.filter(p => p.status === 'pending').length;
    return {total, pending};
  }, [trip, isOrganizer]);

  const invalidateAll = () => {
    queryClient.invalidateQueries({queryKey: ['tripDetail', tripId]});
    queryClient.invalidateQueries({queryKey: ['tripsList']});
  };

  const applyTripUpdate = useCallback(
    patch => {
      if (!patch) return;
      queryClient.setQueryData(['tripDetail', tripId], old => {
        if (!old?.data) return old;
        return {...old, data: {...old.data, ...patch}};
      });
      queryClient.setQueryData(['tripsList'], old => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            data: (page?.data ?? []).map(t =>
              t.id === tripId ? {...t, ...patch} : t,
            ),
          })),
        };
      });
    },
    [tripId, queryClient],
  );

  const applyStopUpdate = useCallback(
    (stopId, patch) => {
      if (!patch) return;
      queryClient.setQueryData(['tripDetail', tripId], old => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            stops: (old.data.stops ?? []).map(s =>
              s.id === stopId ? {...s, ...patch} : s,
            ),
          },
        };
      });
    },
    [tripId, queryClient],
  );

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

  const {mutate: updateStatusMutate, isLoading: isUpdatingStatus} = useMutation(
    {
      mutationFn: body => API.patch(tripStatusUrl(tripId), body),
      onSuccess: ({ok, data: resData}, variables) => {
        if (ok) {
          console.log(
            'sldvblskdbvlksdbvklbsdlkvbklsdblvslkdbvlskdv',
            ok,
            resData,
          );
          successMessage(resData?.message || 'Trip updated');
          applyTripUpdate(resData?.data ?? {status: resData?.data?.status});
          invalidateAll();
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
        onPress: () => {
          API.delete(tripCancelUrl(tripId)).then(({ok, data: resData}) => {
            if (ok) {
              successMessage(resData?.message || 'Trip cancelled');
              applyTripUpdate({status: 'cancelled'});
              invalidateAll();
              navigation.goBack();
            } else {
              errorMessage(resData?.message || 'Error cancelling trip');
            }
          });
        },
      },
    ]);
  }, [tripId, navigation, applyTripUpdate]);

  const {mutate: updateStopMutate, isLoading: isUpdatingStop} = useMutation({
    mutationFn: ({stopId, body}) =>
      API.patch(tripStopUpdateUrl(tripId, stopId), body),
    onSuccess: ({ok, data: resData}, variables) => {
      if (ok) {
        successMessage(resData?.message || 'Stop updated');
        applyStopUpdate(
          variables.stopId,
          resData?.data ?? variables.fallbackPatch,
        );
        invalidateAll();
      } else {
        errorMessage(resData?.message || 'Error updating stop');
      }
    },
    onError: () => errorMessage('Error updating stop'),
  });

  const markStopArrived = useCallback(
    stopId => {
      const now = new Date();
      updateStopMutate({
        stopId,
        body: {ata_actual: toWallClockString(now), timezone: deviceTimeZone},
        fallbackPatch: {ata_actual: now.toISOString()},
      });
    },
    [updateStopMutate],
  );

  const markStopDeparted = useCallback(
    stopId => {
      const now = new Date();
      updateStopMutate({
        stopId,
        body: {atd_actual: toWallClockString(now), timezone: deviceTimeZone},
        fallbackPatch: {atd_actual: now.toISOString()},
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

  return {
    trip,
    isLoading,
    refetch,
    routeGeoJSON,
    mapBounds,
    legByStartStopId,
    startTrip,
    completeTrip,
    confirmCancelTrip,
    markStopArrived,
    markStopDeparted,
    isUpdatingStatus,
    isUpdatingStop,
    // NEW
    isOrganizer,
    participantsSummary,
    goToManageRequests,
    goToRequestToJoin,
  };
};

export default useTripDetailScreen;
