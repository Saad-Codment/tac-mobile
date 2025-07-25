import {useQuery} from '@tanstack/react-query';
import {blockUserUrl, getBlockedUserUrl} from '../../Utils/Urls';
import API from '../../Utils/helperFunc';

const useBlockUSerScreen = () => {
  const {data, refetch, isLoading} = useQuery({
    queryKey: ['homeUpcomingEvents'],
    queryFn: () => API.get(getBlockedUserUrl),
  });
  console.log('datadatadatadatadatadatadatadata', data);
  return {
    blockUserList: data?.data?.data,
    refetch,
    isLoading,
  };
};
export default useBlockUSerScreen;
