import {useCallback, useRef, useState} from 'react';
import {TextComponent} from '../../Components/TextComponent';
import useReduxStore from '../../Hooks/UseReduxStore';
import useFriendServices from '../../Services/FriendServices';
import {useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {homeSuggestedFriendsUrl} from '../../Utils/Urls';

const HomeScreen = ({navigate}) => {
  const [search, setSearch] = useState('');

  const {queryClient, getState} = useReduxStore();

  const {userData} = getState('Auth');

  console.log('userDatauserDatauserData', userData);

  const {sendFriendReq, acceptFriendReq, rejectFriendReq} = useFriendServices();

  const {data, error} = useQuery({
    queryKey: ['homeSuggestedFriends'],
    queryFn: () => API.get(homeSuggestedFriendsUrl),
  });
  console.log('ljskdvhjklsdbvjkbsdkvbsdkjvbksdbvsdbjk', data?.data);

  const onRefresh = useCallback(() => {
    queryClient.fetchQuery({
      queryKey: ['homeSuggestedFriends'],
      staleTime: 1000,
    });
  }, []);

  const dynamicRoute = (routeName, params) => navigate(routeName, params);

  return {
    search,
    setSearch,
    dynamicRoute,
    onRefresh,
    suggestedFriends: data?.data,
    userData,
    sendReq: async id => {
      await sendFriendReq.mutateAsync(id);
      queryClient.invalidateQueries({queryKey: ['myFriends']});
      queryClient.invalidateQueries({queryKey: ['homeSuggestedFriends']});
    },
  };
};

export default HomeScreen;
