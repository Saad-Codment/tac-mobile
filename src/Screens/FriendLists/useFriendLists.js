import {useQuery} from '@tanstack/react-query';
import {getMyFriendsUrl} from '../../Utils/Urls';
import API from '../../Utils/helperFunc';
import {useCallback} from 'react';

const useFriendLists = ({navigate}) => {
  const {data, error} = useQuery({
    queryKey: ['myFriends'],
    queryFn: () => API.get(getMyFriendsUrl),
  });
  console.log('ljskdvhjklsdbvjkbsdkvbsdkjvbksdbvsdbjk', data?.data);
  const onRefresh = useCallback(() => {
    queryClient.fetchQuery({
      queryKey: ['myFriends'],
      staleTime: 1000,
    });
  }, []);
  return {friendListData: data?.data?.friendList, onRefresh};
};

export default useFriendLists;
