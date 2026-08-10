import {useState, useCallback} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {eventTripsUrl} from '../../Utils/Urls';

const PER_PAGE = 15;

const useTripsForEventListScreen = (navigation, route) => {
  const {eventId} = route?.params ?? {};
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['eventTrips', eventId],
    queryFn: ({pageParam = 1}) =>
      API.get(
        `${eventTripsUrl(eventId)}?per_page=${PER_PAGE}&page=${pageParam}`,
      ),
    getNextPageParam: (lastPage, allPages) => {
      // FIXED — was lastPage?.data (returns the {message,data,total_pages}
      // envelope, not the array). Needs one more .data to reach the array,
      // matching the fix you already made in useEventMapScreen.js.
      const items = lastPage?.data?.data ?? [];
      return items.length >= PER_PAGE ? allPages.length + 1 : undefined;
    },
    enabled: !!eventId,
  });

  // FIXED — same one-level-short bug as above.
  const trips = (data?.pages ?? []).flatMap(page => page?.data?.data ?? []);

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

  return {
    trips,
    isLoading,
    refreshing,
    onRefresh,
    onLoadMore,
    isFetchingNextPage,
    openTrip,
  };
};

export default useTripsForEventListScreen;
