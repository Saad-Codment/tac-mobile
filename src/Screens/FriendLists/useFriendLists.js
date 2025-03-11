import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {getMyFriendsUrl} from '../../Utils/Urls';
import API from '../../Utils/helperFunc';
import {useCallback, useEffect} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';

const useFriendLists = ({navigate, addListener}, {params}) => {
  const {getState} = useReduxStore();

  const {userData} = getState('Auth');

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: [params?.key],
    queryFn: async ({pageParam = 1}) =>
      API.get(`${params?.url}page=${pageParam}`),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => (pages?.length ?? 0) + 1,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const event = addListener('focus', () => {
      refetch();
    });
    return event;
  });

  const list = data?.pages.flatMap(page => page.data?.data) || [];

  console.log('kladhvlksdbvklsbdklvbsdklvbklsdbvlsd', list, params);

  return {
    friendListData: list,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    refetch,
    userData,
    params,
  };
};

export default useFriendLists;
