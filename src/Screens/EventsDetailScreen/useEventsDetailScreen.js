import {useMutation, useQuery} from '@tanstack/react-query';
import {followEventsUrl, getEventDetailsUrl} from '../../Utils/Urls';
import API from '../../Utils/helperFunc';
import {useCallback} from 'react';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import useReduxStore from '../../Hooks/UseReduxStore';

const useEventDetailScreen = ({navigate}, {params}) => {
  const {getState} = useReduxStore();

  const {userData} = getState('Auth');

  const {id} = params;
  const {data, error, refetch} = useQuery({
    queryKey: ['eventDetail'],
    queryFn: () => API.get(getEventDetailsUrl + id),
  });

  const onRefresh = useCallback(() => {
    queryClient.fetchQuery({
      queryKey: ['eventDetail'],
      staleTime: 1000,
    });
  }, []);

  const {mutate, mutateAsync} = useMutation({
    mutationFn: data => {
      return API.post(data?.url, {event_id: data?.id});
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
    eventData: data?.data,
    onRefresh,
    userData,
    followUnFollowEvent: async id => {
      await mutateAsync({id, url: followEventsUrl});
      refetch();
    },
  };
};

export default useEventDetailScreen;
