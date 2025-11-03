import {useEffect, useState} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';
import {
  getMinMaxPriceUrl,
  globalSearchEventsUrl,
  globalSearchEventsWithFilterUrl,
  globalSearchPostsUrl,
  globalSearchUrl,
  globalSearchUsersUrl,
} from '../../Utils/Urls';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {loadingFalse} from '../../Redux/Action/isloadingAction';

const useGloabalSearchScreen = () => {
  const {getState, dispatch, queryClient} = useReduxStore();

  const {userData} = getState('Auth');
  const [searchVal, setSearchVal] = useState(null);
  const [modal, setModal] = useState(null); // Flag to check if more data exists
  const [selectedVal, setSelectedVal] = useState({name: 'All', id: 'all'});
  const [pages, setPages] = useState(1);

  const {data: maxPriceVal} = useQuery({
    queryKey: ['getMinMaxPriceUrl'],
    queryFn: () => API.get(getMinMaxPriceUrl),
  });

  const [filterVal, setFilterVal] = useState({
    location: [],
    minPrice: 0,
    maxPrice: maxPriceVal?.data?.max_price ?? 99999999,
    intersetedFriends: [],
    eventTypes: [],
    assocations: [],
    circuits: [],
    isParams: false,
  });

  const {
    assocations,
    circuits,
    eventTypes,
    intersetedFriends,
    location,
    maxPrice,
    minPrice,
    isParams,
  } = filterVal;

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
    queryKey: [
      isParams
        ? `${selectUrl[selectedVal?.id]}onlyEvnts`
        : selectUrl[selectedVal?.id],
    ],
    queryFn: async ({pageParam = 1}) => {
      setTimeout(() => {
        dispatch(loadingFalse());
      }, 100);

      // Helper to convert array of objects to repeated query params
      const buildArrayParams = (array, key, paramName) => {
        if (!array || array.length === 0) return '';
        return array
          .map(
            (item, index) =>
              `${paramName}[${index}]=${encodeURIComponent(item[key])}`,
          )
          .join('&');
      };

      /* ------------------------------------------------------------------ */
      /*  Helper: latitude / longitude – one param per coordinate           */
      /* ------------------------------------------------------------------ */
      const buildLocationParams = locArray => {
        if (!locArray || locArray.length === 0) return '';

        return locArray
          .flatMap((item, idx) => {
            const {latitude, longitude} = item.coords ?? {}; // note: you wrote "longitute"
            return [
              `locations[${idx}][latitude]=${encodeURIComponent(
                latitude ?? '',
              )}`,
              `locations[${idx}][longitude]=${encodeURIComponent(
                longitude ?? '',
              )}`,
            ];
          })
          .join('&');
      };

      // Build query params
      const associationParams = buildArrayParams(
        assocations,
        'id',
        'association_ids',
      );
      const eventTypeParams = buildArrayParams(
        eventTypes,
        'id',
        'event_type_ids',
      );
      const userParams = buildArrayParams(intersetedFriends, 'id', 'user_ids');
      const circuitParams = buildArrayParams(circuits, 'id', 'circuit_ids');

      // Other params
      const priceParams = `min_price=${minPrice}&max_price=${maxPrice}`;
      const pageParams = `page=${pages}`;
      const searchKeyword = searchVal != null ? `keyword=${searchVal}` : '';
      const locationParams = buildLocationParams(location);

      // Combine all
      const queryParams = [
        associationParams,
        eventTypeParams,
        userParams,
        circuitParams,
        priceParams,
        locationParams,
        searchKeyword,
        pageParams,
      ]
        .filter(Boolean)
        .join('&'); // Remove empty strings and join with &

      const url = isParams
        ? `${globalSearchEventsWithFilterUrl}${queryParams}`
        : `${selectUrl[selectedVal?.id]}${searchVal}&per_page=10&page=${pages}`;
      console.log('dsvjksdbvjbsdjkbvdsbvjksdbvkjsdbvkjksdbjvsdkjvsbd', url);
      return API.get(url);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => (pages?.length ?? 0) + 1,
    cacheTime: 0, // 👈 Don't cache the data
    // staleTime: 1000,
  });
  const {
    data: allDataEvents,
    isFetchingNextPage: isFetchingNextPageEvents,
    fetchNextPage: fetchNextPageEvents,
    hasNextPage: hasNextPageEvents,
    isPending: isPendingEvents,
    isFetching: isFetchingEvents,
    isRefetching: isRefetchingEvnts,
    refetch: allDataRefetchEvents,
  } = useInfiniteQuery({
    queryKey: [`${selectUrl[selectedVal?.id]}onlyEvnts`],
    queryFn: async ({pageParam = 1}) => {
      setTimeout(() => {
        dispatch(loadingFalse());
      }, 100);
      // Helper to convert array of objects to repeated query params
      const buildArrayParams = (array, key, paramName) => {
        if (!array || array.length === 0) return '';
        return array
          .map(
            (item, index) =>
              `${paramName}[${index}]=${encodeURIComponent(item[key])}`,
          )
          .join('&');
      };

      /* ------------------------------------------------------------------ */
      /*  Helper: latitude / longitude – one param per coordinate           */
      /* ------------------------------------------------------------------ */
      const buildLocationParams = locArray => {
        if (!locArray || locArray.length === 0) return '';

        return locArray
          .flatMap((item, idx) => {
            const {latitude, longitude} = item.coords ?? {}; // note: you wrote "longitute"
            return [
              `locations[${idx}][latitude]=${encodeURIComponent(
                latitude ?? '',
              )}`,
              `locations[${idx}][longitude]=${encodeURIComponent(
                longitude ?? '',
              )}`,
            ];
          })
          .join('&');
      };

      // Build query params
      const associationParams = buildArrayParams(
        assocations,
        'id',
        'association_ids',
      );
      const eventTypeParams = buildArrayParams(
        eventTypes,
        'id',
        'event_type_ids',
      );
      const userParams = buildArrayParams(intersetedFriends, 'id', 'user_ids');
      const circuitParams = buildArrayParams(circuits, 'id', 'circuit_ids');

      // Other params
      const priceParams = `min_price=${minPrice}&max_price=${maxPrice}`;
      const pageParams = `page=${pages}`;
      const searchKeyword = searchVal != null ? `keyword=${searchVal}` : '';
      const locationParams = buildLocationParams(location);

      // Combine all
      const queryParams = [
        associationParams,
        eventTypeParams,
        userParams,
        circuitParams,
        priceParams,
        locationParams,
        searchKeyword,
        pageParams,
      ]
        .filter(Boolean)
        .join('&'); // Remove empty strings and join with &

      const url = `${globalSearchEventsWithFilterUrl}${queryParams}`;
      console.log('dsvjksdbvjbsdjkbvdsbvjksdbvkjsdbvkjksdbjvsdkjvsbd', url);
      return API.get(url);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => (pages?.length ?? 0) + 1,
    cacheTime: 0, // 👈 Don't cache the data
    // staleTime: 1000,
  });

  const refetchWhenParams = async () => {
    if (isParams) {
      await allDataRefetch();
      // queryClient.invalidateQueries([`${selectUrl[selectedVal?.id]}onlyEvnts`]);
      setSelectedVal({name: '', id: ''});
      setSelectedVal({name: 'Events', id: 'Events'});
    }
  };

  useEffect(() => {
    if (maxPriceVal?.data?.max_price) {
      setFilterVal(prev => ({...prev, maxPrice: maxPriceVal?.data?.max_price}));
    }
    // return () => {
    //   queryClient.removeQueries({
    //     queryKey: ['globalSearchUrlForAllData'],
    //     exact: true,
    //   });
    // };
  }, [maxPriceVal?.data]);

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
    filterVal,
    setFilterVal,
    queryClient,
    selectUrl,
    isParams,
    allDataEvents,
    isFetchingNextPageEvents,
    fetchNextPageEvents,
    hasNextPageEvents,
    isPendingEvents,
    isFetchingEvents,
    isRefetchingEvnts,
    allDataRefetchEvents,
    setPages,
    refetchWhenParams,
  };
};
export default useGloabalSearchScreen;
