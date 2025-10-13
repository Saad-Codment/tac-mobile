import {useQuery} from '@tanstack/react-query';
import useReduxStore from '../../Hooks/UseReduxStore';
import useFriendServices from '../../Services/FriendServices';
import API from '../../Utils/helperFunc';
import {getAllNotificationsUrl} from '../../Utils/Urls';
import {useCallback, useEffect, useLayoutEffect} from 'react';
import {types} from '../../Redux/types';

const useNotificationScreen = () => {
  const {queryClient, dispatch} = useReduxStore();
  const {sendFriendReq, acceptFriendReq, rejectFriendReq} = useFriendServices();

  const {data, error, refetch, isLoading} = useQuery({
    queryKey: ['allNotifications'],
    queryFn: () => API.get(getAllNotificationsUrl),
    cacheTime: 0,
  });

  const onRefresh = useCallback(() => {
    queryClient.fetchQuery({
      queryKey: ['allNotifications'],
      staleTime: 1000,
    });
  }, []);

  const clearNotification = () => {
    dispatch({type: types.isNotifyFalse});
  };

  useEffect(() => {
    setTimeout(() => {
      clearNotification();
    }, 1000);
  }, []);

  return {
    notificationsList: data?.data?.data ?? [],
    onRefresh,
    isLoading,
    acceptReq: async id => {
      console.log('jkdsvbklsdbvklsdbklvbsdklvsd', id);
      await acceptFriendReq.mutateAsync(id);
      refetch();
      // queryClient.invalidateQueries({queryKey: ['allNotifications']});
      queryClient.invalidateQueries({queryKey: ['friendRequests']});
    },
    declineReq: async id => {
      await rejectFriendReq.mutateAsync(id);
      refetch();
      // queryClient.invalidateQueries({queryKey: ['allNotifications']});
      queryClient.invalidateQueries({queryKey: ['friendRequests']});
    },
  };
};

export default useNotificationScreen;
