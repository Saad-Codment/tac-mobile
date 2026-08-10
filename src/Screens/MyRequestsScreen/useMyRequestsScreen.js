import {useState, useCallback} from 'react';
import {Alert} from 'react-native';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {successMessage, errorMessage} from '../../Utils/helperFunc'; // adjust path if these live elsewhere
import {myRequestsUrl, requestDecisionUrl} from '../../Utils/Urls';

const PER_PAGE = 15;

const useMyRequestsScreen = navigation => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['myRequests'],
    queryFn: ({pageParam = 1}) =>
      API.get(`${myRequestsUrl}?per_page=${PER_PAGE}&page=${pageParam}`),
    getNextPageParam: (lastPage, allPages) => {
      const items = lastPage?.data ?? [];
      return items.length >= PER_PAGE ? allPages.length + 1 : undefined;
    },
  });

  const requests = (data?.pages ?? []).flatMap(page => page?.data ?? []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const onLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const {mutate: cancelRequestMutate} = useMutation({
    mutationFn: ({tripId, participantId}) =>
      API.delete(requestDecisionUrl(tripId, participantId)),
    onSuccess: ({ok, data: resData}) => {
      if (ok) {
        successMessage(resData?.message || 'Request cancelled');
        queryClient.invalidateQueries({queryKey: ['myRequests']});
      } else {
        errorMessage(resData?.message || 'Error cancelling request');
      }
    },
    onError: () => errorMessage('Error cancelling request'),
  });

  const confirmCancelRequest = useCallback(
    request => {
      Alert.alert(
        'Cancel Request',
        `Cancel your request to join "${request?.trip?.name}"?`,
        [
          {text: 'No', style: 'cancel'},
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: () =>
              cancelRequestMutate({
                tripId: request.trip.id,
                participantId: request.id,
              }),
          },
        ],
      );
    },
    [cancelRequestMutate],
  );

  const openTrip = useCallback(
    request =>
      navigation.navigate('TripDetailScreen', {tripId: request?.trip?.id}),
    [navigation],
  );

  return {
    requests,
    isLoading,
    refreshing,
    onRefresh,
    onLoadMore,
    isFetchingNextPage,
    confirmCancelRequest,
    openTrip,
  };
};

export default useMyRequestsScreen;
