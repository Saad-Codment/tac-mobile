import {useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {getSuggestedFriendsUrl} from '../../Utils/Urls';
import {useCallback} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';

const useAllSuggestedFriendsScreen = ({navigate}) => {
  const {queryClient} = useReduxStore();

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

  return {friendListData: data?.data, onRefresh};
};

export default useAllSuggestedFriendsScreen;
