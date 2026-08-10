import {useState, useMemo, useCallback} from 'react';
import {Alert} from 'react-native';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {successMessage, errorMessage} from '../../Utils/helperFunc'; // adjust path if these live elsewhere
import {tripJoinUrl} from '../../Utils/Urls';

const useRequestToJoinScreen = (navigation, route) => {
  const {tripId, stops = []} = route?.params ?? {};
  const queryClient = useQueryClient();

  const [pickupStopId, setPickupStopId] = useState(null);
  const [dropoffStopId, setDropoffStopId] = useState(null);
  const [humanCount, setHumanCount] = useState(0);
  const [horseCount, setHorseCount] = useState(0);

  const sortedStops = useMemo(
    () => [...stops].sort((a, b) => a.seq_order - b.seq_order),
    [stops],
  );

  const pickupOptions = useMemo(
    () =>
      sortedStops.map(s => ({
        label: s.name ?? s.address ?? `Stop ${s.seq_order}`,
        value: s.id,
      })),
    [sortedStops],
  );

  // Dropoff must come after pickup — filter to stops with a later seq_order
  const dropoffOptions = useMemo(() => {
    const pickupStop = sortedStops.find(s => s.id === pickupStopId);
    if (!pickupStop) return [];
    return sortedStops
      .filter(s => s.seq_order > pickupStop.seq_order)
      .map(s => ({
        label: s.name ?? s.address ?? `Stop ${s.seq_order}`,
        value: s.id,
      }));
  }, [sortedStops, pickupStopId]);

  const selectPickup = useCallback(
    stopId => {
      setPickupStopId(stopId);
      // reset dropoff if it's no longer valid for the new pickup
      const pickupStop = sortedStops.find(s => s.id === stopId);
      const currentDropoff = sortedStops.find(s => s.id === dropoffStopId);
      if (
        pickupStop &&
        currentDropoff &&
        currentDropoff.seq_order <= pickupStop.seq_order
      ) {
        setDropoffStopId(null);
      }
    },
    [sortedStops, dropoffStopId],
  );

  const {mutate: submitMutate, isLoading: isSubmitting} = useMutation({
    mutationFn: body => API.post(tripJoinUrl(tripId), body),
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage(
          data?.message || 'Request sent — the organizer will review it',
        );
        queryClient.invalidateQueries({queryKey: ['myRequests']});
        queryClient.invalidateQueries({queryKey: ['tripDetail', tripId]});
        navigation.replace('MyRequestsScreen');
      } else {
        errorMessage(data?.message || 'Error submitting request');
      }
    },
    onError: e => {
      // 422 business-rule violations surface here via your API wrapper's
      // error shape — adjust if your helperFunc formats errors differently
      const message =
        e?.data?.message || e?.message || 'Error submitting request';
      errorMessage(message);
    },
  });

  const submitRequest = useCallback(() => {
    if (!pickupStopId) {
      Alert.alert('Pickup Required', 'Please select a pickup stop.');
      return;
    }
    if (!dropoffStopId) {
      Alert.alert('Dropoff Required', 'Please select a dropoff stop.');
      return;
    }
    if (humanCount === 0 && horseCount === 0) {
      Alert.alert(
        'Add Seats or Horses',
        'Please request at least one seat or horse.',
      );
      return;
    }

    submitMutate({
      pickup_stop_id: pickupStopId,
      dropoff_stop_id: dropoffStopId,
      human_count: humanCount,
      horse_count: horseCount,
    });
  }, [pickupStopId, dropoffStopId, humanCount, horseCount, submitMutate]);

  return {
    pickupStopId,
    dropoffStopId,
    setDropoffStopId,
    selectPickup,
    pickupOptions,
    dropoffOptions,
    humanCount,
    setHumanCount,
    horseCount,
    setHorseCount,
    submitRequest,
    isSubmitting,
  };
};

export default useRequestToJoinScreen;
