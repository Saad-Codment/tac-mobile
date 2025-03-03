import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {getMyFriendsUrl} from '../../Utils/Urls';
import API from '../../Utils/helperFunc';
import {useCallback} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';

const useFriendLists = ({navigate}, {params}) => {
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
      API.get(`${params?.url}?page=${pageParam}`),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => pages.length + 1,
    refetchOnWindowFocus: true,
  });

  const list = data?.pages.flatMap(page => page.data?.data) || [];

  console.log('skjdvbjkbsdkvbklsdbvksdbvbsdklvbsdkvbsndv', list);

  return {
    friendListData: list,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    refetch,
    userData,
  };
};

export default useFriendLists;
