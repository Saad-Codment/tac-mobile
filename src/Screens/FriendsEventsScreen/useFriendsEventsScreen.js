import {useQuery} from '@tanstack/react-query';
import {useState, useCallback} from 'react';
import API from '../../Utils/helperFunc';
import {allFriendEventsUrl} from '../../Utils/Urls';
import {errorMessage} from '../../Config/NotificationMessage';
import useReduxStore from '../../Hooks/UseReduxStore';
import useFriendServices from '../../Services/FriendServices';

const useFriendsEventsScreen = ({params}) => {
  const {queryClient} = useReduxStore();
  const [page, setPage] = useState(1); // Current page for pagination
  const [eventsList, setEventsList] = useState([]); // Combined list of events
  const [hasNextPage, setHasNextPage] = useState(true); // Flag to check if more data exists
  const [modal, setModal] = useState(null); // Flag to check if more data exists
  const {likeAndDisLikeEvent} = useFriendServices();

  const {isFetching, isRefetching} = useQuery({
    queryKey: ['allFriendsEvents', page],
    queryFn: async () => {
      const response = await API.get(`${allFriendEventsUrl}?page=${page}`);
      if (response.ok) {
        if (page == response?.data?.total_pages) {
          setEventsList(response?.data?.data);
        } else {
          setEventsList(prev => [...prev, ...response?.data?.data]);
          console.log('lisdhvlbsdlvblsdbvlsd', response?.data);
          setHasNextPage(response?.data?.total_pages); // Assuming the API provides this flag
        }
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
    queryClient.invalidateQueries(['allFriendsEvents']); // Refetch data
  }, [queryClient]);

  return {
    eventsList,
    loadMoreData,
    onRefresh,
    isFetching,
    isRefetching,
    title: params?.title,
    modal,
    setModal,
    likePost: async id => {
      await likeAndDisLikeEvent.mutateAsync(id);
      queryClient.invalidateQueries(['allFriendsEvents']); // Refetch data
    },
  };
};

export default useFriendsEventsScreen;
