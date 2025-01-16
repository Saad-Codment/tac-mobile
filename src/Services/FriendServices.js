import {useMutation} from '@tanstack/react-query';
import API from '../Utils/helperFunc';
import {
  acceptFriendReqUrl,
  acceptRejectFriendReqUrl,
  rejectFriendReqUrl,
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

  return {sendFriendReq, acceptFriendReq, rejectFriendReq};
};

// Ensure you are using this hook inside a component
export default useFriendServices;
