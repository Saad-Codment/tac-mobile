import {useCallback, useRef, useState} from 'react';
import {TextComponent} from '../../Components/TextComponent';
import useReduxStore from '../../Hooks/UseReduxStore';
import useFriendServices from '../../Services/FriendServices';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {
  allUpComingEventsUrl,
  homeSuggestedFriendsUrl,
  homeTimeLineUrl,
  homeUpcomingEventsUrl,
} from '../../Utils/Urls';
import {loadingFalse} from '../../Redux/Action/isloadingAction';

const HomeScreen = ({navigate}) => {
  const [search, setSearch] = useState('');

  const {queryClient, getState, dispatch} = useReduxStore();
  const [page, setPage] = useState(1); // Current page for pagination
  const [modal, setModal] = useState(null); // Flag to check if more data exists
  const [refesh, setRefresh] = useState(false);
  const [
    isEndReachedCalledDuringMomentum,
    setIsEndReachedCalledDuringMomentum,
  ] = useState(false);

  const {userData} = getState('Auth');

  console.log('userDatauserDatauserData', userData);

  const {sendFriendReq, acceptFriendReq, rejectFriendReq} = useFriendServices();

  const suggestedFriends = useQuery({
    queryKey: ['homeSuggestedFriends'],
    queryFn: () => API.get(homeSuggestedFriendsUrl),
  });
  const upComingEvents = useQuery({
    queryKey: ['homeUpcomingEvents'],
    queryFn: () => API.get(homeUpcomingEventsUrl),
  });

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    isRefetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['homeTimeLine'],
    queryFn: async ({pageParam = 1}) => {
      setTimeout(() => {
        dispatch(loadingFalse());
      }, 100);
      return API.get(`${homeTimeLineUrl}${pageParam}`);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => (pages?.length ?? 0) + 1,
  });

  // useEffect(() => {
  //   const event = addListener('focus', () => {
  //     refetch();
  //   });
  //   return event;
  // });
  console.log('ljskdvhjklsdbvjkbsdkvbsdkjvbksdbvsdbjk', data?.pages);

  const list = data?.pages?.flatMap(page => page.data?.data) || [];

  const onRefresh = useCallback(() => {
    setRefresh(true);
    refetch();
    upComingEvents.refetch();
    suggestedFriends.refetch();
    setRefresh(false);
  }, []);

  const loadMoreData = useCallback(
    isCurrent => {
      if (!isFetching && hasNextPage) {
        if (isCurrent) null;
        else setPage(prev => prev + 1); // Increment the page number
      }
    },
    [isFetching, hasNextPage],
  );

  const dynamicRoute = (routeName, params) => navigate(routeName, params);

  return {
    search,
    setSearch,
    dynamicRoute,
    onRefresh,
    suggestedFriends: suggestedFriends?.data?.data ?? [],
    userData,
    homeTimeLine: list ?? [],
    upcommingEvents: upComingEvents?.data?.data ?? [],
    loadMoreData,
    isRefetching,
    isFetching,
    refetchKey: ['homeTimeLine'],
    hasMoreData: Boolean(1 == page + 1),
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    refetch,
    modal,
    setModal,
    refreshing: refesh,
    isEndReachedCalledDuringMomentum,
    setIsEndReachedCalledDuringMomentum,
    sendReq: async id => {
      await sendFriendReq.mutateAsync(id);
      queryClient.invalidateQueries({queryKey: ['myFriends']});
      queryClient.invalidateQueries({queryKey: ['homeSuggestedFriends']});
    },
  };
};

export default HomeScreen;
