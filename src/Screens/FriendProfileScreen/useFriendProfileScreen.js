import {useQuery} from '@tanstack/react-query';
import {
  getReasonsUrl,
  getUserPostsUrl,
  getUserProfileUrl,
} from '../../Utils/Urls';
import {useCallback, useState} from 'react';
import API from '../../Utils/helperFunc';
import {errorMessage} from '../../Config/NotificationMessage';
import useFriendServices from '../../Services/FriendServices';
import useReduxStore from '../../Hooks/UseReduxStore';
import {loadingFalse} from '../../Redux/Action/isloadingAction';

const useFriendProfileScreen = ({navigate}, {params}) => {
  const {data} = useQuery({
    queryKey: ['getProfileData'],
    queryFn: () => API.get(getUserProfileUrl + params?.id),
  });

  const [page, setPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(0); // Current page for pagination
  const [eventsList, setEventsList] = useState([]); // Combined list of events
  const [hasNextPage, setHasNextPage] = useState(true); // Flag to check if more data exists
  const [modal, setModal] = useState(null); // Flag to check if more data exists
  const {queryClient, getState} = useReduxStore();
  const {userData} = getState('Auth');

  const {isFetching, isRefetching, refetch} = useQuery({
    queryKey: ['profilePosts', page],
    queryFn: async () => {
      const response = await API.get(
        `${getUserPostsUrl + params?.id}?page=${page}`,
      );
      if (response.ok) {
        setTotalPages(response?.data?.total_pages);
        if (page == response?.data?.total_pages) {
          setEventsList(response?.data?.data);
        } else {
          setEventsList(prev => [...prev, ...response?.data?.data]);
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
    refetch();
    // queryClient.invalidateQueries(['profilePosts']); // Refetch data
  }, [queryClient]);

  const functionToUpdateLike = index => {
    setEventsList(prev => {
      prev[index].is_liked = !prev[index].is_liked;
      prev[index].likes_count = prev[index].is_liked
        ? ++prev[index].likes_count
        : --prev[index].likes_count;
      return prev;
    });
  };

  const openBottomSheet = () => {};

  console.log('skldvklsbdklvbskdlvbklsdbvbksd', eventsList);

  return {
    userData: data?.data,
    loadMoreData,
    isRefetching,
    isFetching,
    eventsList,
    onRefresh,
    hasMoreData: Boolean(totalPages == page + 1),
    refetch,
    functionToUpdateLike,
    myUserData: userData,
    modal,
    setModal,
    openBottomSheet,
  };
};

export default useFriendProfileScreen;
