import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import {getMyFriendsUrl} from '../../Utils/Urls';
import API from '../../Utils/helperFunc';
import {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import useReduxStore from '../../Hooks/UseReduxStore';

const useFriendLists = ({navigation, route}, {params}) => {
  const {getState} = useReduxStore();
  const queryClient = useQueryClient();
  const {userData} = getState('Auth');

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: [params?.key],
    queryFn: async ({pageParam = 1}) => {
      return API.get(`${params?.url}page=${pageParam}`);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      // Implement proper pagination logic here
      // Example: return lastPage.data.nextPage ?? undefined;
      return (pages?.length ?? 0) + 1;
    },
    // Consider adding staleTime and cacheTime options
  });

  // Clear specific query when component unmounts
  useEffect(() => {
    return () => {
      queryClient.removeQueries({queryKey: [params?.key]});
    };
  }, [params?.key, queryClient]);

  // Refetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
      // Optionally reset to first page when refocusing
      // queryClient.resetQueries({queryKey: [params?.key]});
    }, [refetch]),
  );
  console.log(
    'datadatadatadatadatadatadatadata',
    data?.pages?.flatMap(page => page.data?.data),
  );
  const list =
    data?.pages?.flatMap(page => {
      return page.data?.data;
    }) || [];

  return {
    friendListData: list.filter(res => res != undefined),
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    refetch,
    userData,
    params,
    isLoading,
    url: params?.url,
  };
};

export default useFriendLists;
