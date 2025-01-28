import {useQuery} from '@tanstack/react-query';
import useReduxStore from '../../Hooks/UseReduxStore';
import useFriendServices from '../../Services/FriendServices';
import API from '../../Utils/helperFunc';
import {getAllNotificationsUrl} from '../../Utils/Urls';
import {useCallback} from 'react';

const useNotificationScreen = () => {
  const {queryClient} = useReduxStore();
  const {sendFriendReq, acceptFriendReq, rejectFriendReq} = useFriendServices();

  const {data, error} = useQuery({
    queryKey: ['allNotifications'],
    queryFn: () => API.get(getAllNotificationsUrl),
  });
  console.log('ljskdvhjklsdbvjkbsdkvbsdkjvbksdbvsdbjk', data?.data);

  const onRefresh = useCallback(() => {
    queryClient.fetchQuery({
      queryKey: ['allNotifications'],
      staleTime: 1000,
    });
  }, []);

  return {
    notificationsList: data?.data?.notifications,
    onRefresh,
    acceptReq: async id => {
      await acceptFriendReq.mutateAsync(id);
      queryClient.invalidateQueries({queryKey: ['allNotifications']});
      queryClient.invalidateQueries({queryKey: ['friendRequests']});
    },
    declineReq: async id => {
      await rejectFriendReq.mutateAsync(id);
      queryClient.invalidateQueries({queryKey: ['allNotifications']});
      queryClient.invalidateQueries({queryKey: ['friendRequests']});
    },
  };
};

export default useNotificationScreen;
