import {useQuery} from '@tanstack/react-query';
import {getEventDetailsUrl} from '../../Utils/Urls';
import API from '../../Utils/helperFunc';
import {useCallback} from 'react';

const useEventDetailScreen = ({navigate}, {params}) => {
  const {id} = params;
  const {data, error} = useQuery({
    queryKey: ['eventDetail'],
    queryFn: () => API.get(getEventDetailsUrl + id),
  });

  const onRefresh = useCallback(() => {
    queryClient.fetchQuery({
      queryKey: ['eventDetail'],
      staleTime: 1000,
    });
  }, []);

  return {eventData: data?.data, onRefresh};
};

export default useEventDetailScreen;
