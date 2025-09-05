import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
import {hp} from '../../Config/responsive';
import {debounce} from 'lodash'; // or your preferred debounce utility
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    cacheTime: 0, // 👈 Don't cache the data
  });

  // useEffect(() => {
  //   const event = addListener('focus', () => {
  //     refetch();
  //   });
  //   return event;
  // });

  const list = data?.pages?.flatMap(page => page.data?.data) || [];
  console.log('ljskdvhjklsdbvjkbsdkvbsdkjvbksdbvsdbjk', list[2]);

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

  const [hasMoreData, setHasMoreData] = useState(true);

  // Inside your fetch function:
  const fetchData = async () => {
    if (!hasMoreData || isFetchingNextPage) return;

    const newData = await fetchNextPage();
    if (newData.length === 0) {
      setHasMoreData(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isNearEnd, setIsNearEnd] = useState(false);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    // Double lock to prevent duplicates
    if (isRefetching || list.length < 9) return;
    else await fetchNextPage();
  };

  useEffect(() => {
    AsyncStorage.setItem('userData', JSON.stringify(userData));
  }, []);

  // useEffect(() => {
  //   handleLoadMore();
  // }, [isNearEnd]); // React to scroll position changes

  const handleScroll = nativeEvent => {
    console.log('Full nativeEvent:', nativeEvent);
    // const {contentOffset, contentSize, layoutMeasurement} = nativeEvent;

    // // Calculate distance from end in PIXELS
    // const distanceFromEnd =
    //   contentSize.height - (contentOffset.y + layoutMeasurement.height);

    // // Trigger only if <30% from end, not already fetching, and data exists
    // if (distanceFromEnd < paddingToBottom && !isFetching && list.length > 0) {
    //   isFetching.current = true;
    //   console.log('Fetching next page!');
    //   fetchNextPage();
    // }
  };

  // 2. Debounced version (Instagram's secret sauce)
  const loadMoreDebounced = useMemo(
    () => debounce(handleLoadMore, 50), // 50ms delay after scrolling stops
    [handleLoadMore],
  );

  useEffect(() => {
    return () => {
      loadMoreDebounced.cancel(); // Important!
    };
  }, [loadMoreDebounced]);

  return {
    search,
    setSearch,
    dynamicRoute,
    onRefresh,
    suggestedFriends: suggestedFriends?.data?.data ?? [],
    userData,
    homeTimeLine: list ?? [],
    upcommingEvents: upComingEvents?.data?.data?.suggested_events ?? [],
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
    fetchData,
    handleLoadMore,
    isLoading,
    handleScroll,
    isRefetching,
    loadMoreDebounced,
    hasNextPage,
    sendReq: async id => {
      await sendFriendReq.mutateAsync(id);
      queryClient.invalidateQueries({queryKey: ['myFriends']});
      queryClient.invalidateQueries({queryKey: ['homeSuggestedFriends']});
    },
  };
};

export default HomeScreen;
