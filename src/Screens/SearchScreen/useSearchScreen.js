import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {useState} from 'react';
import {searchDataUrl, searchScreenDataUrl} from '../../Utils/Urls';
import API from '../../Utils/helperFunc';
import useReduxStore from '../../Hooks/UseReduxStore';

const useSearchScreen = ({navigate}) => {
  const {getState} = useReduxStore();

  const {userData} = getState('Auth');
  const [searchVal, setSearchVal] = useState(null);

  const [selectedVal, setSelectedVal] = useState({
    name: 'Your Friends',
    id: 'YourFriends',
  });

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['searchScreenData'],
    queryFn: async () => API.get(searchScreenDataUrl),
  });

  const afterSearch = () => {
    navigate('FriendLists', {
      url: searchDataUrl + searchVal + '&',
      key: 'searchResults',
      title: 'Search Friends',
    });
    // setSearchVal(null);
  };

  return {
    selectedVal,
    onSelectVal: e => setSelectedVal(e),
    listData: data?.data,
    refetch,
    userData,
    setSearchVal,
    searchVal,
    afterSearch,
  };
};

export default useSearchScreen;
