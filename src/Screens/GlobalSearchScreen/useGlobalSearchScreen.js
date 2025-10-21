import {useState} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';
import {
  globalSearchEventsUrl,
  globalSearchPostsUrl,
  globalSearchUrl,
  globalSearchUsersUrl,
} from '../../Utils/Urls';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {loadingFalse} from '../../Redux/Action/isloadingAction';

const useGloabalSearchScreen = () => {
  const {getState, dispatch} = useReduxStore();

  const {userData} = getState('Auth');
  const [searchVal, setSearchVal] = useState(null);
  const [modal, setModal] = useState(null); // Flag to check if more data exists
  const [selectedVal, setSelectedVal] = useState({name: 'All', id: 'all'});

  const selectUrl = {
    Users: globalSearchUsersUrl,
    Posts: globalSearchPostsUrl,
    Events: globalSearchEventsUrl,
  };

  const {data, refetch} = useQuery({
    queryKey: ['globalSearchUrlForAllData'],
    queryFn: async () => API.get(globalSearchUrl + searchVal),
    enabled: false,
    cacheTime: 0, // 👈 Don't cache the data
  });

  const {
    data: allData,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    isRefetching,
    refetch: allDataRefetch,
  } = useInfiniteQuery({
    queryKey: [selectUrl[selectedVal?.id]],
    queryFn: async ({pageParam = 1}) => {
      return API.get(
        `${
          selectUrl[selectedVal?.id]
        }${searchVal}&per_page=10&page=${pageParam}`,
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => (pages?.length ?? 0) + 1,
    cacheTime: 0, // 👈 Don't cache the data
    // staleTime: 1000,
  });

  const list =
    allData?.pages?.flatMap(page => {
      return page.data?.data;
    }) || [];

  return {
    selectedVal,
    setSelectedVal,
    searchVal,
    setSearchVal,
    onSearch: refetch,
    allSearchData: data?.data,
    isFetching,
    isPending,
    refetch,
    modal,
    setModal,
    selectTabAllData: list.filter(res => res != undefined) ?? [],
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isRefetching,
    allDataRefetch,
    refetchKeys: ['globalSearchUrl', selectUrl[selectedVal?.id]],
  };
};
export default useGloabalSearchScreen;
