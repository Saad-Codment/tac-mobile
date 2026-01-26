import {useQuery} from '@tanstack/react-query';
import useReduxStore from '../../Hooks/UseReduxStore';
import API from '../../Utils/helperFunc';
import {
  getEventsCommentRepliesUrl,
  getEventsCommentUrl,
  getPostCommentRepliesUrl,
  getPostCommentUrl,
} from '../../Utils/Urls';
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import useFriendServices from '../../Services/FriendServices';

const useCommentScreen = ({navigate}, {params}) => {
  const {queryClient, getState} = useReduxStore();

  const [message, setMessage] = useState(null);
  const [isComment, setIsComment] = useState(false);

  const {
    postComment,
    addCommentOnPost,
    addReplyOnCommentOnPost,
    addLikeOnCommentPost,
    addLikeOnCommentEvent,
    addReplyOnCommentOnEvent,
  } = useFriendServices();

  const {data, error, refetch, isLoading, isSuccess} = useQuery({
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
        // await addCommentOnPost.mutateAsync({
        //   post_id: params?.id,
        //   text: message,
        // });

        if (commentReply?.id) {
          await addReplyOnCommentOnPost.mutateAsync({
            comment_id: commentReply?.id,
            text: message,
          });
          // setMessage(null);
          // refetch();
          await getPostCommentReplies.refetch();
          setCommentReply(null);
        } else {
          await addCommentOnPost.mutateAsync({
            post_id: params?.id,
            text: message,
          });

          // setMessage(null);
          // functionToUpdateComment(index, true);
          // refetch();
        }
      } else {
        if (commentReply?.id) {
          await addReplyOnCommentOnEvent.mutateAsync({
            comment_id: commentReply?.id,
            text: message,
          });
          // setMessage(null);
          // refetch();
          await getPostCommentReplies.refetch();
          setCommentReply(null);
        } else {
          await postComment.mutateAsync({
            event_id: params?.id,
            text: message,
          });
        }
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

  // new test api

  const [postReplyId, setPostReplyId] = useState(null);

  const [commentReply, setCommentReply] = useState(null);

  const getPostCommentReplies = useQuery({
    queryKey: ['postCommentReplies' + postReplyId],
    queryFn: () => API.get(getPostCommentRepliesUrl + postReplyId),
    staleTime: 0, // 👈 Treat data as stale immediately
    cacheTime: 0, // 👈 Don't cache the data
    enabled: false,
  });
  const getEventCommentReplies = useQuery({
    queryKey: ['eventCommentReplies' + postReplyId],
    queryFn: () => API.get(getEventsCommentRepliesUrl + postReplyId),
    staleTime: 0, // 👈 Treat data as stale immediately
    cacheTime: 0, // 👈 Don't cache the data
    enabled: false,
  });

  // const sendMessage = async comment => {
  //   if (commentReply?.id) {
  //     await addReplyOnCommentOnPost.mutateAsync({
  //       comment_id: commentReply?.id,
  //       text: message,
  //     });
  //     setMessage(null);
  //     refetch();
  //     getPostCommentReplies.refetch();
  //     setCommentReply(null);
  //   } else {
  //     if (message.trim()) {
  //       await addCommentOnPost.mutateAsync({
  //         post_id: id,
  //         text: message,
  //       });

  //       setMessage(null);
  //       functionToUpdateComment(index, true);
  //       refetch();
  //     }
  //   }
  // };

  // const renderItem = useCallback(
  //   ({item, index}) => {
  //     return (
  //       <CommentComp
  //         item={item}
  //         replyArry={
  //           Boolean(
  //             item?.id == getPostCommentReplies.data?.data?.data[0]?.parent_id,
  //           )
  //             ? getPostCommentReplies.data?.data?.data
  //             : []
  //         }
  //         onSwipeRight={() => setCommentReply(item)}
  //         onCommentLikePress={async () => {
  //           await addLikeOnCommentPost.mutateAsync({comment_id: item?.id});
  //           refetch();
  //         }}
  //         onReplyPress={() => {
  //           setPostReplyId(item?.id);
  //           setTimeout(() => {
  //             getPostCommentReplies.refetch();
  //           }, 1000);
  //         }}
  //       />
  //     );
  //   },
  //   [getPostCommentReplies.data?.data?.data, data?.data],
  // );

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
    setPostReplyId,
    postReplyId,
    getPostCommentReplies,
    setCommentReply,
    commentReply,
    addLikeOnCommentPost,
    addLikeOnCommentEvent,
    refetch,
    getEventCommentReplies,
    isLoading,
    isSuccess,
  };
};

export default useCommentScreen;
