import {useQuery} from '@tanstack/react-query';
import {
  getMyAssociationsUrl,
  getReasonsUrl,
  getUserPostsUrl,
  getUserProfileUrl,
} from '../../Utils/Urls';
import {useCallback, useEffect, useRef, useState} from 'react';
import API from '../../Utils/helperFunc';
import {errorMessage} from '../../Config/NotificationMessage';
import useFriendServices from '../../Services/FriendServices';
import useReduxStore from '../../Hooks/UseReduxStore';
import {loadingFalse} from '../../Redux/Action/isloadingAction';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

const useMyProfileScreen = ({navigate, addListener, setParams}, {params}) => {
  const [page, setPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(0); // Current page for pagination
  const [eventsList, setEventsList] = useState([]); // Combined list of events
  const [hasNextPage, setHasNextPage] = useState(true); // Flag to check if more data exists
  const [modal, setModal] = useState(null); // Flag to check if more data exists
  const [isHitFirstTime, setIsHitFirstTime] = useState(false);
  const [afterLoadMoreHit, setAfterLoadMoreHit] = useState(false);
  const [nextScreen, setNextScreen] = useState(null);
  const [commentModal, setCommentModal] = useState(false);
  const [stateForModalData, setStateForModalData] = useState(null);
  const [modalType, setModalType] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const idParam = route?.params?.id;

  console.log('paramsparamsparamsparamsparamsparamsparams', params);

  const {queryClient, getState} = useReduxStore();
  const {userData} = getState('Auth');
  const {data} = useQuery({
    queryKey: ['getMyProfileData'],
    queryFn: () => API.get(getUserProfileUrl + userData?.id),
  });

  const {isFetching, isRefetching, refetch, isSuccess} = useQuery({
    queryKey: [`myProfilePosts${userData?.id}`, page],
    queryFn: async () => {
      const response = await API.get(
        `${getUserPostsUrl + userData?.id}?page=${page}`,
      );
      setIsHitFirstTime(true);
      if (response.ok) {
        console.log('sjkdlksdbvlksbdvklbsdklvbskldvsd', response?.data);
        setTotalPages(response?.data?.total_pages);
        if (page == response?.data?.total_pages || !afterLoadMoreHit) {
          setEventsList(response?.data?.data);
        } else {
          console.log('pppppppppp');
          setEventsList(prev => [...prev, ...response?.data?.data]);
          setHasNextPage(response?.data?.total_pages); // Assuming the API provides this flag
          setAfterLoadMoreHit(false);
        }
      }
      return response?.data;
    },
    // staleTime: 0, // 👈 Treat data as stale immediately
    cacheTime: 0, // 👈 Don't cache the data
    // enabled: false, // ❌ Disable auto-fetching
  });

  const loadMoreData = useCallback(
    isCurrent => {
      setAfterLoadMoreHit(true);
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
  const functionToUpdatePostOrEvent = (index, newItem) => {
    console.log('adjgvsjdbvsdbvkjsbdjvbsdkjvbsdbvsdbkvsd', index, newItem);
    if (newItem)
      setEventsList(prev =>
        prev.map((item, i) => (i === index ? newItem : item)),
      );
  };

  const functionToUpdateLike = index => {
    setEventsList(prev => {
      prev[index].is_liked = !prev[index].is_liked;
      prev[index].likes_count = prev[index].is_liked
        ? ++prev[index].likes_count
        : --prev[index].likes_count;
      return prev;
    });
  };

  const functionToDelete = index => {
    setEventsList(prev => {
      return prev.filter((_, i) => i !== index);
    });
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       setEventsList([]);
  //       setPage(1);
  //     };
  //   }, []),
  // );

  useFocusEffect(
    useCallback(() => {
      if (idParam) {
        setIsHitFirstTime(false);
        setEventsList([]);
        setPage(1);
        refetch();
      }

      return () => {
        setIsHitFirstTime(false);
        setEventsList([]);
        setPage(1);

        // Reset params if navigation allows
        if (navigation.setParams) {
          navigation.setParams({id: undefined});
        }
      };
    }, [idParam]),
  );
  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       setIsHitFirstTime(false);
  //       setEventsList([]);
  //       setPage(1);
  //     };
  //   }, []),
  // );

  useEffect(() => {
    const event = addListener('focus', async () => {
      queryClient.invalidateQueries({queryKey: ['getMyProfileData']});
      refetch();
      // if (params?.id) onRefresh();
    });
    return event;
  }, []);
  const openBottomSheet = () => {};

  const onPressKeyRef = useRef(null);

  const [modalVal, setModalVal] = useState(false);

  const onOpenModal = key => {
    onPressKeyRef.current = key;
    toggleModal();
  };

  const activeTags = {
    event_association: {eventAssociations: []},
  };

  const toggleModal = (modalUpdateData, isSave) => {
    setModalVal(!modalVal);
  };

  const associationsData = useQuery({
    queryKey: ['myProfileAssociations'],
    queryFn: () => API.get(getMyAssociationsUrl),
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

    setModalVal,
    activeTags,
    onPressKey: onPressKeyRef.current,
    allData: associationsData?.data?.data?.associations,
    modalVal,
    onOpenModal,
    functionToUpdatePostOrEvent,
    isSuccess,
    isHitFirstTime,
    setAfterLoadMoreHit,
    setNextScreen,
    setCommentModal,
    commentModal,
    stateForModalData,
    setStateForModalData,
    modalType,
    setModalType,
    refetchKey: [`myProfilePosts${userData?.id}`, page],
  };
};

export default useMyProfileScreen;
