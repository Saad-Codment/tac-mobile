import {useMutation, useQuery} from '@tanstack/react-query';
import {
  blockUserUrl,
  getReasonsUrl,
  getUserPostsUrl,
  getUserProfileUrl,
} from '../../Utils/Urls';
import {useCallback, useState} from 'react';
import API from '../../Utils/helperFunc';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import useFriendServices from '../../Services/FriendServices';
import useReduxStore from '../../Hooks/UseReduxStore';
import {loadingFalse} from '../../Redux/Action/isloadingAction';

const useFriendProfileScreen = ({navigate, goBack}, {params}) => {
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
  const [isHitFirstTime, setIsHitFirstTime] = useState(false);

  const {isFetching, isRefetching, refetch} = useQuery({
    queryKey: ['profilePosts', page],
    queryFn: async () => {
      const response = await API.get(
        `${getUserPostsUrl + params?.id}?page=${page}`,
      );
      setIsHitFirstTime(true);
      if (response.ok) {
        setTotalPages(response?.data?.total_pages);
        if (page == response?.data?.total_pages) {
          setEventsList(response?.data?.data);
        } else {
          // setEventsList(response?.data?.data);
          setEventsList(prev => [...prev, ...response?.data?.data]);
          setHasNextPage(response?.data?.total_pages); // Assuming the API provides this flag
        }
      } else errorMessage('Error on fetching data!');
      return response?.data;
    },
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
  const functionToUpdateFollow = index => {
    setEventsList(prev => {
      console.log(
        'weoiropweuropweurpouewporuweuoruweporuwpeurpowe',
        prev[index],
      );
      prev[index].is_followed = prev[index].is_followed == 0 ? 1 : 0;
      return prev;
    });
  };
  const functionToUpdateComment = (index, isComment) => {
    console.log('index', index, 'isComment', isComment);
    if (isComment)
      setEventsList(prev =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                comments_count: item.comments_count + 1,
              }
            : item,
        ),
      );
  };
  const functionToDelete = index => {
    setEventsList(prev => {
      return prev.filter((_, i) => i !== index);
    });
  };

  const openBottomSheet = () => {};

  console.log('skldvklsbdklvbskdlvbklsdbvbksd', eventsList);

  const {mutate} = useMutation({
    mutationFn: data => {
      return API.post(blockUserUrl, {user_id: params?.id});
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage('User blocked succesfully');
        goBack();
      } else {
        errorMessage(data?.message);
      }
    },
    onError: () => {
      errorMessage('Network request failed.');
    },
  });

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
    functionToDelete,
    functionToUpdateComment,
    isHitFirstTime,
    blockUser: () => mutate(),
    functionToUpdateFollow,
  };
};

export default useFriendProfileScreen;
