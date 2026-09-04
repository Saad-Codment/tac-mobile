import {useState, useCallback} from 'react';
import {Alert} from 'react-native';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {successMessage, errorMessage} from '../../Utils/helperFunc'; // adjust path if these live elsewhere
import {getVehicleUrl, deleteVehicleUrl} from '../../Utils/Urls';

const PER_PAGE = 15;

const useVehicleListScreen = (navigation, route) => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  // NEW — when opened from the trip planner's "See More Vehicles," tapping
  // a vehicle selects it and returns to EventMapScreen instead of opening
  // it for editing. Default (no param) behaves exactly as before.
  const selectMode = route?.params?.selectMode === true;

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
      API.get(`${getVehicleUrl}?per_page=${PER_PAGE}&page=${pageParam}`),
    getNextPageParam: (lastPage, allPages) => {
      // FIXED — was lastPage?.data (the {message,data,total_pages}
      // envelope, not the array). Same collection-endpoint bug found on
      // the other list screens.
      const items = lastPage?.data?.data ?? [];
      return items.length >= PER_PAGE ? allPages.length + 1 : undefined;
    },
  });

  // FIXED — same one-level-short bug as above.
  const vehicles = (data?.pages ?? []).flatMap(page => page?.data?.data ?? []);

  console.log(
    'vehiclesvehiclesvehiclesvehiclesvehiclesvehiclesvehiclesvehiclesvehicles',
    vehicles,
  );

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

  // CHANGED — branches on selectMode. Default behavior (edit) is
  // completely unchanged; selectMode is new.
  const goToEditVehicle = useCallback(
    vehicle => {
      if (selectMode) {
        // Return the picked vehicle to EventMapScreen and pop back to it.
        navigation.navigate({
          name: 'EventMapScreen',
          params: {selectedVehicle: vehicle},
          merge: true,
        });
      } else {
        navigation.navigate('VehicleFormScreen', {vehicle});
      }
    },
    [navigation, selectMode],
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
    // NEW
    selectMode,
  };
};

export default useVehicleListScreen;
