import {useQuery} from '@tanstack/react-query';
import useReduxStore from '../../Hooks/UseReduxStore';
import API from '../../Utils/helperFunc';
import {getFriendReqUrl} from '../../Utils/Urls';
import {useCallback, useState} from 'react';
import useFriendServices from '../../Services/FriendServices';

const useAllEventsScreen = ({navigate}, {params}) => {
  const {queryClient} = useReduxStore();
  const [page, setPage] = useState(1); // Current page for pagination
  const [eventsList, setEventsList] = useState([]); // Combined list of events
  const [hasNextPage, setHasNextPage] = useState(true); // Flag to check if more data exists

  const {likeAndDisLikeEvent} = useFriendServices();

  const {isFetching, isRefetching} = useQuery({
    queryKey: [params?.key, page],
    queryFn: async () => {
      const response = await API.get(`${params?.url}?page=${page}`);
      if (response.ok) {
        console.log('lisdhvlbsdlvblsdbvlsd', response?.data);
        setEventsList(prev => [...prev, ...response?.data?.data]);
        setHasNextPage(response?.data?.total_pages); // Assuming the API provides this flag
      } else errorMessage('Error on fetching data!');
      return response?.data;
    },
    keepPreviousData: true, // Preserve old data while fetching new
  });

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
    setPage(1); // Reset to the first page
    setEventsList([]); // Clear existing data
    queryClient.invalidateQueries([params?.key]); // Refetch data
  }, [queryClient]);

  return {
    eventsList,
    onRefresh,
    title: params?.title,
    loadMoreData,
    isRefetching,
    isFetching,
    likePost: async id => {
      await likeAndDisLikeEvent.mutateAsync(id);
      loadMoreData();
    },
  };
};

export default useAllEventsScreen;
