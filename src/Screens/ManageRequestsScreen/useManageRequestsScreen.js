import {useState, useCallback} from 'react';
import {Alert} from 'react-native';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {successMessage, errorMessage} from '../../Utils/helperFunc'; // adjust path if these live elsewhere
import {tripRequestsUrl, requestDecisionUrl} from '../../Utils/Urls';

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

  const requests = data?.data ?? [];

  const invalidate = () => {
    queryClient.invalidateQueries({queryKey: ['tripRequests', tripId]});
    queryClient.invalidateQueries({queryKey: ['tripDetail', tripId]});
    queryClient.invalidateQueries({queryKey: ['tripsList']});
  };

  const {mutate: decisionMutate, isLoading: isDeciding} = useMutation({
    mutationFn: ({participantId, body}) =>
      API.patch(requestDecisionUrl(tripId, participantId), body),
    onSuccess: ({ok, data: resData, status}) => {
      if (ok) {
        successMessage(resData?.message || 'Request updated');
        invalidate();
      } else if (status === 409) {
        // TripFullyOccupiedException — surface the API's message directly
        Alert.alert(
          'No Longer Available',
          resData?.message ||
            'This trip is fully occupied on the requested segment.',
          [{text: 'OK'}],
        );
      } else {
        errorMessage(resData?.message || 'Error updating request');
      }
    },
    onError: e => {
      // If your API wrapper surfaces status codes on error too, handle 409
      // here as well — adjust based on how helperFunc formats errors.
      if (e?.status === 409) {
        Alert.alert(
          'No Longer Available',
          e?.data?.message ||
            'This trip is fully occupied on the requested segment.',
        );
      } else {
        errorMessage('Error updating request');
      }
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
