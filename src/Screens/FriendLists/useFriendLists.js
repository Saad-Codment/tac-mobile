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
  const [pages, setPages] = useState(0);

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
      setPages(pageParam);

      return API.get(`${params?.url}page=${pageParam}`);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return (pages?.length ?? 0) + 1;
    },
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
    'datadatadatadatadatadatadatadataskdjbvksdbvjksbvksbdkvbksdbvsbdjkvbsjdkbvsbvos',
    data?.pages?.flatMap(page => page.data),
  );
  const list =
    data?.pages?.flatMap(page => {
      return page.data?.data;
    }) || [];

  return {
    friendListData: list.filter(res => res != undefined) ?? [],
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
    lastPage: Boolean(data?.pages[0]?.data?.total_pages == pages),
  };
};

export default useFriendLists;
