import {useQuery} from '@tanstack/react-query';
import useReduxStore from '../../Hooks/UseReduxStore';
import API from '../../Utils/helperFunc';
import {getEventsCommentUrl, getPostCommentUrl} from '../../Utils/Urls';
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import useFriendServices from '../../Services/FriendServices';

const useCommentScreen = ({navigate}, {params}) => {
  const {queryClient, getState} = useReduxStore();

  const [message, setMessage] = useState(null);
  const [isComment, setIsComment] = useState(false);

  const {postComment, addCommentOnPost} = useFriendServices();

  const {data, error, refetch, isLoading} = useQuery({
    queryKey: [params?.isPost ? 'postComments' : 'eventComment'],
    queryFn: () =>
      API.get(
        (params?.isPost ? getPostCommentUrl : getEventsCommentUrl) + params?.id,
      ),
    staleTime: 0, // 👈 Treat data as stale immediately
    cacheTime: 0, // 👈 Don't cache the data
  });

  const onRefresh = useCallback(() => {
    queryClient.fetchQuery({
      queryKey: [params?.isPost ? 'postComments' : 'eventComment'],
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
      if (params?.isPost) {
        await addCommentOnPost.mutateAsync({
          post_id: params?.id,
          text: message,
        });
      } else {
        await postComment.mutateAsync({
          event_id: params?.id,
          text: message,
        });
      }
      setMessage(null);
      setIsComment(true);
      refetch();
      if (params?.refetechKeys) {
        params?.refetechKeys.map(res => {
          queryClient.invalidateQueries([res]); // Refetch data
        });
      }
      params?.functionToUpdateComment(params?.index, true);
      params?.refetch();
      // queryClient.invalidateQueries(['comments']); // Refetch data
    }
  };

  useEffect(() => {
    return () => {
      if (params?.functionToUpdateComment)
        setTimeout(() => {
          params?.functionToUpdateComment(params?.index, isComment);
        }, 200);
    };
  }, []);

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
    isLoading,
  };
};

export default useCommentScreen;
