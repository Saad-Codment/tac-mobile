import {useQuery} from '@tanstack/react-query';
import useReduxStore from '../../Hooks/UseReduxStore';
import API from '../../Utils/helperFunc';
import {getEventsCommentUrl} from '../../Utils/Urls';
import {useCallback, useLayoutEffect, useRef, useState} from 'react';
import useFriendServices from '../../Services/FriendServices';

const useCommentScreen = ({navigate}, {params}) => {
  const {queryClient, getState} = useReduxStore();

  const [message, setMessage] = useState(null);

  const {postComment} = useFriendServices();

  const {data, error} = useQuery({
    queryKey: ['comments'],
    queryFn: () => API.get(getEventsCommentUrl + params?.id),
  });
  console.log('ljskdvhjklsdbvjkbsdkvbsdkjvbksdbvssdfsfvgdfsdbjk', data?.data);

  const onRefresh = useCallback(() => {
    queryClient.fetchQuery({
      queryKey: ['comments'],
      staleTime: 1000,
    });
  }, []);

  const scrollViewRef = useRef();
  const handleAutoScroll = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: false});
    }
  };
  useLayoutEffect(() => {
    handleAutoScroll();
  }, []);

  let regexp = /^(?![\s\b]+$).+/gm;

  const sendMessage = async comment => {
    if (message.trim()) {
      await postComment.mutateAsync({
        event_id: params?.id,
        text: message,
      });
      setMessage(null);
      queryClient.invalidateQueries(['comments']); // Refetch data
      if (params?.refetechKeys) {
        params?.refetechKeys.map(res => {
          queryClient.invalidateQueries([res]); // Refetch data
        });
      }
    }
  };

  const dynamicRoute = (routeName, params) => navigate(routeName, params);
  return {
    commentsList: data?.data?.data,
    dynamicRoute,
    onRefresh,
    handleAutoScroll,
    regexp,
    scrollViewRef,
    setMessage,
    message,
    sendMessage,
  };
};

export default useCommentScreen;
