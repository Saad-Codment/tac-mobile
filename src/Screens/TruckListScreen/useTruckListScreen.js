import {useState} from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {deleteVehiclesUrl, getVehicleUrl} from '../../Utils/Urls';

const useTruckListScreen = (navigation, route) => {
  const queryClient = useQueryClient();
  const [pages, setPages] = useState(1);

  // ── Paginated Fetch ──
  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['getTrucks'],
    queryFn: async ({pageParam = 1}) => {
      setPages(pageParam);
      return API.get(`${getVehicleUrl}?page=${pageParam}&per_page=15`);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return (pages?.length ?? 0) + 1;
    },
  });

  // Flatten all pages into a single array for FlatList
  const trucks = data?.pages?.flatMap(page => page?.data?.data ?? []) ?? [];

  // ── Delete ──
  const {mutate: deleteTruck} = useMutation({
    mutationFn: id => API.delete(deleteVehiclesUrl + id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getTrucks']});
      successMessage('Truck deleted successfully');
    },
    onError: () => {
      errorMessage('Error deleting truck');
    },
  });

  console.log('truckstruckstruckstruckstruckstruckstruckstrucks', trucks);

  return {
    trucks,
    isLoading,
    isFetching,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    deleteTruck,
  };
};

export default useTruckListScreen;
