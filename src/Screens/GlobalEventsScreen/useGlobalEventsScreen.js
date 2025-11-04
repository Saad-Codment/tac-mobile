import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import useReduxStore from '../../Hooks/UseReduxStore';
import API from '../../Utils/helperFunc';
import {
  getFriendReqUrl,
  getMinMaxPriceUrl,
  globalSearchEventsWithFilterUrl,
} from '../../Utils/Urls';
import {useCallback, useEffect, useState} from 'react';
import useFriendServices from '../../Services/FriendServices';
import {loadingFalse} from '../../Redux/Action/isloadingAction';
import {formatDateToYMD, getIdsFromArry} from '../../Services/GlobalFunctions';

const useGlobalEventsScreen = ({navigate, addListener}, {params}) => {
  const {queryClient, dispatch} = useReduxStore();
  const [page, setPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Current page for pagination
  const [eventsList, setEventsList] = useState(null); // Combined list of events
  const [isLoading, setIsLoading] = useState(false); // Combined list of events
  const [searchVal, setSearchVal] = useState(null);
  var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const currentDate = new Date();

  const {data: maxPriceVal} = useQuery({
    queryKey: ['getMinMaxPriceUrl'],
    queryFn: () => API.get(getMinMaxPriceUrl),
  });

  const [filterVal, setFilterVal] = useState({
    location: [],
    minPrice: 0,
    maxPrice: maxPriceVal?.data?.max_price ?? 9999999,
    intersetedFriends: [],
    eventTypes: [],
    assocations: [],
    circuits: [],
    isParams: false,
    fromDate: null,
    toDate: null,
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
    fromDate,
    toDate,
  } = filterVal;

  const [modal, setModal] = useState(null); // Flag to check if more data exists

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    isRefetching,
    refetch,
    isStale,
  } = useInfiniteQuery({
    queryKey: [params?.url],
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
      const locationParams = buildLocationParams(location);

      // Other params
      const priceParams = `min_price=${minPrice}&max_price=${maxPrice}`;
      const pageParams = `page=${pageParam}`;
      const searchKeyword = searchVal != null ? `keyword=${searchVal}` : '';
      const fromDateParams =
        fromDate != null ? `from_date=${formatDateToYMD(fromDate)}` : '';
      const toDateParams =
        toDate != null ? `to_date=${formatDateToYMD(toDate)}` : '';
      const timeZoneParams = `timeZone=${timeZone}`;

      // Combine all
      const queryParams = [
        associationParams,
        eventTypeParams,
        userParams,
        circuitParams,
        priceParams,
        searchKeyword,
        locationParams,
        fromDateParams,
        toDateParams,
        timeZoneParams,
        pageParams,
      ]
        .filter(Boolean)
        .join('&'); // Remove empty strings and join with &
      console.log(
        'kjsdbcjksbdjkvbjksdbvjkbsjdkvbjksdbkjvbsdjkbvksdbj',
        `${globalSearchEventsWithFilterUrl}${queryParams}`,
        fromDate != currentDate,
        fromDate,
        currentDate,
      );
      return API.get(`${globalSearchEventsWithFilterUrl}${queryParams}`);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => (pages?.length ?? 0) + 1,
    enabled: false,
    cacheTime: 0, // 👈 Don't cache the data
  });

  const list = data?.pages
    ? data?.pages.flatMap(page => page.data?.data) || []
    : null;

  const loadMoreData = useCallback(
    isCurrent => {
      if (!isFetching && hasNextPage) {
        if (isCurrent) null;
        else setPage(prev => prev + 1); // Increment the page number
      }
    },
    [isFetching, hasNextPage],
  );

  const onRefresh = useCallback(() => {}, [queryClient]);

  useEffect(() => {
    if (params?.isParams || isParams) refetch();
    // Cleanup: Remove query when component unmounts (i.e. user goes back)
    return () => {
      queryClient.removeQueries({
        queryKey: [params?.url],
        exact: true,
      });
    };
  }, [params, isParams, filterVal]);

  console.log('paramsparamsparamsparamsparams', params, JSON.stringify(data));

  return {
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching: isStale,
    refetch,
    eventsList: data?.pages ? list.filter(res => res != undefined) : null,
    onRefresh,
    title: params?.title,
    loadMoreData,
    isRefetching,
    isFetching,
    refetchKey: params?.key,
    hasMoreData: Boolean(totalPages == page + 1),
    afterLikeFun: () => queryClient.invalidateQueries([params?.key]),
    afterFetchNextPage: () => setEventsList(null),
    modal,
    setModal,
    searchVal,
    setSearchVal,
    filterVal,
    setFilterVal,
    isLoading,
    setIsLoading,
    likePost: async (i, id) => {
      // await likeAndDisLikeEvent.mutateAsync(id);
      // queryClient.invalidateQueries([params?.key]); // Refetch data
    },
  };
};

export default useGlobalEventsScreen;
