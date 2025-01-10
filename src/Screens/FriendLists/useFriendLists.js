import {useQuery} from '@tanstack/react-query';
import {getMyFriendsUrl} from '../../Utils/Urls';
import API from '../../Utils/helperFunc';

const useFriendLists = ({navigate}) => {
  const {data, error} = useQuery({
    queryKey: ['myFriends'],
    queryFn: () => API.get(getMyFriendsUrl),
  });
  console.log('ljskdvhjklsdbvjkbsdkvbsdkjvbksdbvsdbjk', data?.data);

  return {friendListData: data?.data?.friendList};
};

export default useFriendLists;
