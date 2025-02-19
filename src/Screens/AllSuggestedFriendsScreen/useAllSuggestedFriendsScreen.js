import {useMutation, useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {getSuggestedFriendsUrl, sendFriendReqUrl} from '../../Utils/Urls';
import {useCallback} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';
import {errorMessage} from '../../Config/NotificationMessage';
import useFriendServices, {sendFriendReq} from '../../Services/FriendServices';

const useAllSuggestedFriendsScreen = ({navigate}) => {
  const {queryClient} = useReduxStore();
  const {sendFriendReq} = useFriendServices();

  const {data, error} = useQuery({
    queryKey: ['myFriends'],
    queryFn: () => API.get(getSuggestedFriendsUrl),
  });
  console.log('ljskdvhjklsdbvjkbsdkvbsdkjvbksdbvsdbjk', data?.data);

  const onRefresh = useCallback(() => {
    queryClient.fetchQuery({
      queryKey: ['myFriends'],
      staleTime: 1000,
    });
  }, []);

  return {
    friendListData: data?.data?.data ?? [],
    onRefresh,
    sendReq: async id => {
      await sendFriendReq.mutateAsync(id);
      queryClient.invalidateQueries({queryKey: ['myFriends']});
      queryClient.invalidateQueries({queryKey: ['homeSuggestedFriends']});
    },
  };
};

export default useAllSuggestedFriendsScreen;
