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

  const {data, error, refetch} = useQuery({
    queryKey: [params?.isPost ? 'postComments' : 'eventComment'],
    queryFn: () =>
      API.get(
        (params?.isPost ? getPostCommentUrl : getEventsCommentUrl) + params?.id,
      ),
  });

  const onRefresh = useCallback(() => {
    queryClient.fetchQuery({
      queryKey: [params?.isPost ? 'postComments' : 'eventComment'],
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
      params?.functionToUpdateComment(params?.index);
      refetch();
      params?.refetch();
      // queryClient.invalidateQueries(['comments']); // Refetch data
      if (params?.refetechKeys) {
        params?.refetechKeys.map(res => {
          queryClient.invalidateQueries([res]); // Refetch data
        });
      }
    }
  };

  useEffect(() => {
    return () => {
      setTimeout(() => {
        params?.functionToUpdateComment(params?.index);
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
  };
};

export default useCommentScreen;
