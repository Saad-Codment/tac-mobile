import {useState, useCallback} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {tripsUrl} from '../../Utils/Urls';

const PER_PAGE = 15;

const useTripListScreen = navigation => {
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['tripsList'],
    queryFn: ({pageParam = 1}) =>
      API.get(`${tripsUrl}?per_page=${PER_PAGE}&page=${pageParam}`),
    getNextPageParam: (lastPage, allPages) => {
      // FIXED — was lastPage?.data (the {message,data,total_pages}
      // envelope, not the array itself). This is what made `trip` in
      // TripCard actually be the whole envelope object, so trip.status
      // was undefined and crashed TRIP_STATUS_META[trip.status].
      const items = lastPage?.data?.data ?? [];
      return items.length >= PER_PAGE ? allPages.length + 1 : undefined;
    },
  });

  // FIXED — same one-level-short bug as above.
  const trips = (data?.pages ?? []).flatMap(page => page?.data?.data ?? []);
  console.log('tripstripstripstripstripstripstripstripstrips', trips);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const onLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const openTrip = useCallback(
    trip => navigation.navigate('TripDetailScreen', {tripId: trip.id}),
    [navigation],
  );

  const goToManageRequests = useCallback(
    trip => navigation.navigate('ManageRequestsScreen', {tripId: trip.id}),
    [navigation],
  );

  return {
    trips,
    isLoading,
    refreshing,
    onRefresh,
    onLoadMore,
    isFetchingNextPage,
    openTrip,
    goToManageRequests,
  };
};

export default useTripListScreen;
