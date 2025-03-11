import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import useReduxStore from '../../Hooks/UseReduxStore';
import API from '../../Utils/helperFunc';
import {getFriendReqUrl} from '../../Utils/Urls';
import {useCallback, useEffect, useState} from 'react';
import useFriendServices from '../../Services/FriendServices';
import {loadingFalse} from '../../Redux/Action/isloadingAction';

const useAllEventsScreen = ({navigate, addListener}, {params}) => {
  const {queryClient, dispatch} = useReduxStore();
  const [page, setPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Current page for pagination
  const [eventsList, setEventsList] = useState(null); // Combined list of events

  const {likeAndDisLikeEvent} = useFriendServices();

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
    queryKey: [params?.key],
    queryFn: async ({pageParam = 1}) => {
      setTimeout(() => {
        dispatch(loadingFalse());
      }, 100);
      return API.get(`${params?.url}?page=${pageParam}`);
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

  const list = data?.pages.flatMap(page => page.data?.data) || [];

  const functionToUpdateLike = index => {
    // setEventsList(list);
    // setEventsList(prev => {
    //   if (prev[index]?.is_liked || prev[index].likes_count) {
    //     prev[index].is_liked = !prev[index]?.is_liked;
    //     prev[index].likes_count = prev[index]?.is_liked
    //       ? ++prev[index].likes_count
    //       : --prev[index].likes_count;
    //     return prev;
    //   } else {
    //     return prev;
    //   }
    // });

    setEventsList(prev => {
      const updatedList = [...list]; // Create a new array to maintain immutability

      if (!list[index]) {
        return prev;
      }

      // Ensure `is_liked` and `likes_count` exist in the object
      updatedList[index].is_liked = updatedList[index]?.is_liked ?? false;
      updatedList[index].likes_count = updatedList[index]?.likes_count ?? 0;

      updatedList[index].is_liked = !updatedList[index].is_liked;
      updatedList[index].likes_count = updatedList[index].is_liked
        ? ++updatedList[index].likes_count
        : --updatedList[index].likes_count;

      return updatedList;
    });
    queryClient.invalidateQueries([params?.key]);
    // setEventsList(list);
  };

  // const functionToUpdateLike = index => {
  //   console.log('sjkldbvlksdbklvbsdklvbsd', eventsList[index]);
  //   setEventsList(list);
  // };

  // const {isFetching, isRefetching} = useQuery({
  //   queryKey: [params?.key, page],
  //   queryFn: async () => {
  //     const response = await API.get(`${params?.url}?page=${page}`);
  //     if (response.ok) {
  //       setTotalPages(response.data?.total_pages);
  //       if (page == response?.data?.total_pages) {
  //         setEventsList(response?.data?.data);
  //       } else {
  //         setEventsList(prev => [...prev, ...response?.data?.data]);
  //         console.log('lisdhvlbsdlvblsdbvlsd', response?.data);
  //         setHasNextPage(response?.data?.total_pages); // Assuming the API provides this flag
  //       }
  //     } else errorMessage('Error on fetching data!');
  //     return response?.data;
  //   },
  //   keepPreviousData: true, // Preserve old data while fetching new
  // });

  const loadMoreData = useCallback(
    isCurrent => {
      if (!isFetching && hasNextPage) {
        if (isCurrent) null;
        else setPage(prev => prev + 1); // Increment the page number
      }
    },
    [isFetching, hasNextPage],
  );

  const onRefresh = useCallback(() => {
    // setPage(1); // Reset to the first page
    // setEventsList([]); // Clear existing data
    // queryClient.invalidateQueries([`"${params?.key}"`]); // Refetch data
  }, [queryClient]);

  return {
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    refetch,
    eventsList: list,
    onRefresh,
    title: params?.title,
    loadMoreData,
    isRefetching,
    isFetching,
    refetchKey: params?.key,
    hasMoreData: Boolean(totalPages == page + 1),
    afterLikeFun: () => queryClient.invalidateQueries([params?.key]),
    functionToUpdateLike,
    afterFetchNextPage: () => setEventsList(null),
    likePost: async (i, id) => {
      // await likeAndDisLikeEvent.mutateAsync(id);
      // queryClient.invalidateQueries([params?.key]); // Refetch data
    },
  };
};

export default useAllEventsScreen;
