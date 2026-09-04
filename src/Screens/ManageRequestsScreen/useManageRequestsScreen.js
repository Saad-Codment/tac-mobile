import {useState, useCallback} from 'react';
import {Alert} from 'react-native';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {tripRequestsUrl, requestDecisionUrl} from '../../Utils/Urls';
import {successMessage, errorMessage} from '../../Config/NotificationMessage';

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'rejected', 'cancelled'];

const useManageRequestsScreen = (navigation, route) => {
  const {tripId} = route?.params ?? {};
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [rejectingRequest, setRejectingRequest] = useState(null); // the request object being rejected

  const {data, isLoading, refetch} = useQuery({
    queryKey: ['tripRequests', tripId, statusFilter],
    queryFn: () =>
      API.get(
        `${tripRequestsUrl(tripId)}${
          statusFilter !== 'all' ? `?status=${statusFilter}` : ''
        }`,
      ),
  });

  // FIXED — was data?.data (one level short). This is a collection
  // endpoint like /trips, /events/{id}/trips, /vehicles — all of which
  // needed the extra .data level. This was very likely showing you a
  // wrong/empty list from the start, not just "not updating on accept."
  const requests = data?.data?.data ?? [];
  console.log(
    'requestsrequestsrequestsrequestsrequestsrequestsrequests',
    requests,
    'dataaaaaaaaaaaa',
    data?.data,
  );
  // No manual object patching anywhere here — every update below comes
  // from an awaited refetch/invalidation, never a locally reconstructed
  // copy.
  const syncAfterDecision = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({queryKey: ['tripRequests', tripId]}),
      queryClient.invalidateQueries({queryKey: ['tripDetail', tripId]}),
      queryClient.invalidateQueries({queryKey: ['tripsList']}),
    ]);
  }, [tripId, queryClient]);

  const {mutate: decisionMutate, isLoading: isDeciding} = useMutation({
    mutationFn: ({participantId, body}) =>
      API.patch(requestDecisionUrl(tripId, participantId), body),
    onSuccess: async ({ok, data: resData}) => {
      if (ok) {
        successMessage(resData?.message || 'Request updated');
        await syncAfterDecision();
      } else {
        // FIXED — removed the `status === 409` branch. Your API wrapper's
        // convention has consistently been just {ok, data}, not a third
        // `status` field, so that check was almost certainly never true —
        // a 409 (trip fully occupied) was silently falling through to a
        // generic error instead of a clear message. The server's own
        // message (e.g. "This trip is fully occupied...") is shown here
        // for ANY failure now, 409 or otherwise, since that's the one
        // thing we can actually rely on regardless of status code.
        Alert.alert(
          'Unable to Update Request',
          resData?.message || 'Please try again.',
        );
      }
    },
    onError: e => {
      const message =
        e?.data?.message || e?.message || 'Error updating request';
      Alert.alert('Unable to Update Request', message);
    },
  });

  const acceptRequest = useCallback(
    participantId => {
      decisionMutate({participantId, body: {decision: 'confirmed'}});
    },
    [decisionMutate],
  );

  const openRejectModal = useCallback(
    request => setRejectingRequest(request),
    [],
  );
  const closeRejectModal = useCallback(() => setRejectingRequest(null), []);

  const submitReject = useCallback(
    declineReason => {
      if (!rejectingRequest) return;
      decisionMutate({
        participantId: rejectingRequest.id,
        body: {
          decision: 'rejected',
          decline_reason: declineReason || undefined,
        },
      });
      setRejectingRequest(null);
    },
    [rejectingRequest, decisionMutate],
  );

  return {
    tripId,
    requests,
    isLoading,
    statusFilter,
    setStatusFilter,
    STATUS_FILTERS,
    acceptRequest,
    rejectingRequest,
    openRejectModal,
    closeRejectModal,
    submitReject,
    isDeciding,
  };
};

export default useManageRequestsScreen;
