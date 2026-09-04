import {useEffect, useRef, useState} from 'react';
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
import {formatDateToYMD} from '../../Services/GlobalFunctions';

// Removes duplicate records (matched by id) before they ever reach the UI —
// a safety net in case a refetch race ever slips duplicate pages through.
const dedupeById = arr => {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  const result = [];
  for (const item of arr) {
    if (item == null) continue;
    const key = item?.id ?? item?._id ?? JSON.stringify(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
};

const useGloabalSearchScreen = () => {
  const {getState, dispatch, queryClient} = useReduxStore();

  const {userData} = getState('Auth');
  const [searchVal, setSearchVal] = useState(null); // raw, live-typed value — drives the input only
  // FIX: the value actually used for fetching/caching. Only updates when a
  // search is explicitly submitted, so a distinct search term always gets
  // its own cache slot instead of sharing one with "no search"/other terms
  // — that sharing was why old search results would flash back on return
  // to this screen before silently being replaced.
  const [committedSearchVal, setCommittedSearchVal] = useState(null);
  const [modal, setModal] = useState(null); // Flag to check if more data exists
  const [selectedVal, setSelectedVal] = useState({
    name: 'Events',
    id: 'Events',
  });
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Combined list of events
  var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const commitSearch = () => {
    setCommittedSearchVal(searchVal);
  };

  const {data: maxPriceVal} = useQuery({
    queryKey: ['getMinMaxPriceUrl'],
    queryFn: () => API.get(getMinMaxPriceUrl),
  });

  const [filterVal, setFilterVal] = useState({
    location: [],
    minPrice: '0',
    maxPrice:
      Math.floor(Number(maxPriceVal?.data?.max_price))?.toString() ?? 9999999,
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

  // Keeps refetchWhenParams reading the *current* isParams value even
  // though the function reference it's called through can be captured
  // once (handed to another screen via navigation params) and invoked
  // much later.
  const isParamsRef = useRef(isParams);
  useEffect(() => {
    isParamsRef.current = isParams;
  }, [isParams]);

  const selectUrl = {
    Users: globalSearchUsersUrl,
    Posts: globalSearchPostsUrl,
    Events: globalSearchEventsUrl,
  };

  const {data, refetch} = useQuery({
    // FIX: cache key now includes the committed search term, so returning to
    // this screen with a reset search never shows a previous search's
    // leftover cached results.
    queryKey: ['globalSearchUrlForAllData', committedSearchVal],
    queryFn: async () => API.get(globalSearchUrl + (committedSearchVal ?? '')),
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
      // FIX: same reasoning as above — scope the cache by the committed
      // search term so a fresh/reset search never inherits an old one's
      // cached page(s).
      committedSearchVal,
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
      const pageParams = `page=${pageParam}`;
      const searchKeyword =
        committedSearchVal != null ? `keyword=${committedSearchVal}` : '';
      const locationParams = buildLocationParams(location);
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
        locationParams,
        searchKeyword,
        fromDateParams,
        toDateParams,
        timeZoneParams,
        pageParams,
      ]
        .filter(Boolean)
        .join('&'); // Remove empty strings and join with &

      const url = isParams
        ? `${globalSearchEventsWithFilterUrl}${queryParams}`
        : `${selectUrl[selectedVal?.id]}${
            committedSearchVal ?? ''
          }&per_page=10&page=${pageParam}`;
      return API.get(url);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Number(lastPage?.data?.total_pages) || undefined;
      const nextPage = (allPages?.length ?? 0) + 1;
      if (totalPages && nextPage > totalPages) return undefined;
      return nextPage;
    },
    enabled: true,
  });

  const refetchWhenParams = async () => {
    if (isParamsRef.current) {
      setIsLoading(true);
      await allDataRefetch();
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      setTimeout(() => {
        setSelectedVal({name: '', id: ''});
        setSelectedVal({name: 'Events', id: 'Events'});
      }, 1000);
    }
  };

  useEffect(() => {
    if (maxPriceVal?.data?.max_price) {
      setFilterVal(prev => ({
        ...prev,
        maxPrice: Math.floor(Number(maxPriceVal?.data?.max_price))?.toString(),
      }));
    }
  }, [maxPriceVal?.data]);

  const list = dedupeById(
    allData?.pages?.flatMap(page => page?.data?.data ?? []) ?? [],
  );

  return {
    selectedVal,
    setSelectedVal,
    searchVal,
    setSearchVal,
    commitSearch,
    onSearch: refetch,
    allSearchData: data?.data
      ? {
          ...data.data,
          users: dedupeById(data.data.users),
          posts: dedupeById(data.data.posts),
          events: dedupeById(data.data.events),
        }
      : data?.data,
    isFetching,
    isPending,
    refetch,
    modal,
    setModal,
    selectTabAllData: list,
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
    setPages,
    refetchWhenParams,
    isLoading,
    setIsLoading,
    totalPages: allData?.pages?.[0]?.data?.total_pages,
    pages,
  };
};
export default useGloabalSearchScreen;
