import {useQuery} from '@tanstack/react-query';
import useReduxStore from '../../Hooks/UseReduxStore';
import API from '../../Utils/helperFunc';
import {getFriendReqUrl} from '../../Utils/Urls';
import {useCallback} from 'react';
import useFriendServices from '../../Services/FriendServices';

const useFriendReqScreen = () => {
  const {queryClient} = useReduxStore();
  const {acceptFriendReq, rejectFriendReq} = useFriendServices();

  const {data, error, refetch, isSuccess} = useQuery({
    queryKey: ['friendRequests'],
    queryFn: () => API.get(getFriendReqUrl),
  });
  console.log('ljskdvhjklsdbvjkbsdkvbsdkjvbksdbvsdbjk', data?.data);

  const onRefresh = useCallback(() => {
    queryClient.fetchQuery({
      queryKey: ['friendRequests'],
      staleTime: 1000,
    });
  }, []);
  return {
    friendList: data?.data?.friendRequests,
    acceptReq: async id => {
      await acceptFriendReq.mutateAsync(id);
      refetch();
      queryClient.invalidateQueries({queryKey: ['friendRequests']});
    },
    declineReq: async id => {
      await rejectFriendReq.mutateAsync(id);
      refetch();
      queryClient.invalidateQueries({queryKey: ['friendRequests']});
    },
    onRefresh,
    refetch,
    isSuccess,
  };
};

export default useFriendReqScreen;
