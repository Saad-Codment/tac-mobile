import {useMutation} from '@tanstack/react-query';
import API from '../Utils/helperFunc';
import {
  acceptFriendReqUrl,
  acceptRejectFriendReqUrl,
  addCommentOnPostUrl,
  likeUnlikeUrl,
  postCommentUrl,
  postLikeUrl,
  rejectFriendReqUrl,
  removeFriendUrl,
  sendFriendReqUrl,
} from '../Utils/Urls';
import {errorMessage, successMessage} from '../Config/NotificationMessage';

const useFriendServices = () => {
  /* This code snippet is defining a `useMutation` hook called `sendFriendReq` that will handle making a
POST request to the `sendFriendReqUrl` endpoint with the provided data. */
  const sendFriendReq = useMutation({
    mutationFn: data => {
      return API.post(sendFriendReqUrl + data, {});
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage('Request sent!');
      } else {
        errorMessage(data?.message);
      }
    },
    onError: () => {
      errorMessage('Network request failed.');
    },
  });

  /* This code snippet is defining a `useMutation` hook called `acceptFriendReq` that will handle making
a POST request to the `acceptFriendReqUrl` endpoint with the provided data. */
  const acceptFriendReq = useMutation({
    mutationFn: data => {
      return API.post(acceptFriendReqUrl + data, {});
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage(data?.message);
      } else {
        errorMessage(data?.message);
      }
    },
    onError: () => {
      errorMessage('Network request failed.');
    },
  });

  /* This code snippet is defining a `useMutation` hook called `rejectFriendReq` that will handle making
a POST request to the `rejectFriendReqUrl` endpoint with the provided data. */
  const rejectFriendReq = useMutation({
    mutationFn: data => {
      return API.post(rejectFriendReqUrl + data, {});
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage(data?.message);
      } else {
        errorMessage(data?.message);
      }
    },
    onError: () => {
      errorMessage('Network request failed.');
    },
  });

  /* The `const likeAndDisLikeEvent` is defining a `useMutation` hook that handles making a POST
  request to the `likeUnlikeUrl` endpoint with the provided data. */
  const likeAndDisLikeEvent = useMutation({
    mutationFn: data => {
      return API.post(likeUnlikeUrl, {id: data});
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage(data?.message);
      } else {
        console.log('jkdsbkljsdbvklsdbvklsbklvsvd', data);
        errorMessage(data?.message);
      }
    },
    onError: () => {
      errorMessage('Network request failed.');
    },
  });

  /* The `const postComment` is defining a `useMutation` hook that handles making a POST request to the
  `postCommentUrl` endpoint with the provided data. */
  const postComment = useMutation({
    mutationFn: data => {
      return API.post(postCommentUrl, data);
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage(data?.message);
      } else {
        console.log('jkdsbkljsdbvklsdbvklsbklvsvd', data);
        errorMessage(data?.message);
      }
    },
    onError: () => {
      errorMessage('Network request failed.');
    },
  });

  /* The `const removeFriend` is defining a `useMutation` hook that handles making a POST request to
  the `removeFriendUrl` endpoint with the provided data. */
  const removeFriend = useMutation({
    mutationFn: data => {
      return API.post(removeFriendUrl + data, {});
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage(data?.message);
      } else {
        console.log('jkdsbkljsdbvklsdbvklsbklvsvd', data);
        errorMessage(data?.message);
      }
    },
    onError: () => {
      errorMessage('Network request failed.');
    },
  });

  /* The `const addLikeOnPost` is defining a `useMutation` hook that handles making a POST request to
  the `postLikeUrl` endpoint with the provided data. */
  const addLikeOnPost = useMutation({
    mutationFn: data => {
      return API.post(postLikeUrl, {id: data});
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage(data?.message);
      } else {
        console.log('jkdsbkljsdbvklsdbvklsbklvsvd', data);
        errorMessage(data?.message);
      }
    },
    onError: () => {
      errorMessage('Network request failed.');
    },
  });

  /* The `const addCommentOnPost` is defining a `useMutation` hook that handles making a POST request
  to the `postLikeUrl` endpoint with the provided data. */
  const addCommentOnPost = useMutation({
    mutationFn: data => {
      return API.post(addCommentOnPostUrl, data);
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage(data?.message);
      } else {
        console.log('jkdsbkljsdbvklsdbvklsbklvsvd', data);
        errorMessage(data?.message);
      }
    },
    onError: () => {
      errorMessage('Network request failed.');
    },
  });

  return {
    sendFriendReq,
    acceptFriendReq,
    rejectFriendReq,
    likeAndDisLikeEvent,
    postComment,
    removeFriend,
    addLikeOnPost,
    addCommentOnPost,
  };
};

// Ensure you are using this hook inside a component
export default useFriendServices;
