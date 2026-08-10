import {useState, useCallback} from 'react';
import {Alert} from 'react-native';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {successMessage, errorMessage} from '../../Utils/helperFunc'; // adjust path if these live elsewhere
import {vehiclesUrl, deleteVehicleUrl} from '../../Utils/Urls';

const PER_PAGE = 15;

const useVehicleListScreen = navigation => {
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
    queryKey: ['vehiclesList'],
    queryFn: ({pageParam = 1}) =>
      API.get(`${vehiclesUrl}?per_page=${PER_PAGE}&page=${pageParam}`),
    getNextPageParam: (lastPage, allPages) => {
      const items = lastPage?.data ?? [];
      return items.length >= PER_PAGE ? allPages.length + 1 : undefined;
    },
  });

  const vehicles = (data?.pages ?? []).flatMap(page => page?.data ?? []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const onLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const {mutate: deleteVehicleMutate} = useMutation({
    mutationFn: id => API.delete(`${deleteVehicleUrl}${id}`),
    onSuccess: ({ok, data: resData}, id) => {
      if (ok) {
        successMessage(resData?.message || 'Vehicle deleted successfully');
        queryClient.invalidateQueries({queryKey: ['vehiclesList']});
      } else {
        errorMessage(resData?.message || 'Error deleting vehicle');
      }
    },
    onError: () => errorMessage('Error deleting vehicle'),
  });

  const confirmDeleteVehicle = useCallback(
    vehicle => {
      Alert.alert(
        'Delete Vehicle',
        `Are you sure you want to delete "${vehicle.title}"?`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteVehicleMutate(vehicle.id),
          },
        ],
      );
    },
    [deleteVehicleMutate],
  );

  const goToAddVehicle = useCallback(
    () => navigation.navigate('VehicleFormScreen'),
    [navigation],
  );
  const goToEditVehicle = useCallback(
    vehicle => navigation.navigate('VehicleFormScreen', {vehicle}),
    [navigation],
  );

  return {
    vehicles,
    isLoading,
    refreshing,
    onRefresh,
    onLoadMore,
    isFetchingNextPage,
    confirmDeleteVehicle,
    goToAddVehicle,
    goToEditVehicle,
  };
};

export default useVehicleListScreen;
