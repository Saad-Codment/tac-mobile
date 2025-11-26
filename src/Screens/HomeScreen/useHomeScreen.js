import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {TextComponent} from '../../Components/TextComponent';
import useReduxStore from '../../Hooks/UseReduxStore';
import useFriendServices from '../../Services/FriendServices';
import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {
  allUpComingEventsUrl,
  checkVersionUrl,
  globalSearchEventsWithFilterUrl,
  homeSuggestedFriendsUrl,
  homeTimeLineUrl,
  homeUpcomingEventsUrl,
} from '../../Utils/Urls';
import {loadingFalse} from '../../Redux/Action/isloadingAction';
import {hp} from '../../Config/responsive';
import {debounce} from 'lodash'; // or your preferred debounce utility
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Geolocationios from '@react-native-community/geolocation';
import DeviceInfo from 'react-native-device-info';
import {types} from '../../Redux/types';
import GeolocationAndroid from 'react-native-geolocation-service';

const HomeScreen = ({navigate}) => {
  const [search, setSearch] = useState('');

  const [locationCoords, setLocationCoords] = useState({lat: null, lng: null});

  const {queryClient, getState, dispatch} = useReduxStore();
  const [page, setPage] = useState(1); // Current page for pagination
  const [modal, setModal] = useState(null); // Flag to check if more data exists
  const [refesh, setRefresh] = useState(false);
  const [
    isEndReachedCalledDuringMomentum,
    setIsEndReachedCalledDuringMomentum,
  ] = useState(false);

  const {userData} = getState('Auth');

  console.log('userDatauserDatauserData', userData);

  const {sendFriendReq, acceptFriendReq, rejectFriendReq} = useFriendServices();

  const suggestedFriends = useQuery({
    queryKey: ['homeSuggestedFriends'],
    queryFn: () => API.get(homeSuggestedFriendsUrl),
  });

  const upComingEvents = useQuery({
    queryKey: ['homeUpcomingEvents'],
    queryFn: () => API.get(homeUpcomingEventsUrl),
  });
  const nearByEvents = useQuery({
    queryKey: ['homeNearByEvents'],
    queryFn: () =>
      API.get(
        `${globalSearchEventsWithFilterUrl}latitude=${locationCoords?.lat}&longitude=${locationCoords?.lng}`,
      ),
    enabled: false,
  });

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocationios.requestAuthorization();
      const requestLocationPermission = async () => {
        try {
          // Retrieve the current location once permission is granted
          Geolocation.getCurrentPosition(
            position => {
              const {latitude, longitude} = position.coords;
              setLocationCoords({
                lat: latitude,
                lng: longitude,
              });
            },
            error => {
              console.log('Error getting location:', error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        } catch (err) {
          console.warn('Error requesting location permission:', err);
        }
      };

      requestLocationPermission();
    }
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  };

  const getCurrentLocation = async () => {
    await requestLocationPermission();
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        async position => {
          // const locationName = await getLocationName(
          //   position.coords.latitude,
          //   position.coords.longitude,
          // );
          setLocationCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          resolve({ok: true, description: 'locationName'});
        },
        error => {
          console.log('Error getting location:', error);
          reject({ok: false, description: error});
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0,
          forceLocationManager: true,
        },
      );
    });
  };

  useEffect(() => {
    if (Platform.OS == 'android') {
      const requestLocationPermission = async () => {
        try {
          if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location Permission',
                message: 'This app needs access to your location.',
                buttonPositive: 'OK',
              },
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              console.log('Location permission denied');
              return;
            }
          }

          // Retrieve the current location once permission is granted
          Geolocation.getCurrentPosition(
            position => {
              const {latitude, longitude} = position.coords;
              setLocationCoords({
                lat: latitude,
                lng: longitude,
              });
            },
            error => {
              console.log('Error getting location:', error.message);
            },
            {enableHighAccuracy: true, maximumAge: 10000},
          );
        } catch (err) {
          console.warn('Error requesting location permission:', err);
        }
      };

      requestLocationPermission();

      return () => {
        Geolocation.clearWatch();
      };
    }
  }, []);

  useEffect(() => {
    if (locationCoords?.lat && locationCoords?.lng) {
      console.log('locationCoordslocationCoords', locationCoords);
      nearByEvents.refetch();
    }
  }, [locationCoords]);

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    isRefetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['homeTimeLine'],
    queryFn: async ({pageParam = 1}) => {
      setTimeout(() => {
        dispatch(loadingFalse());
      }, 100);
      return API.get(`${homeTimeLineUrl}${pageParam}`);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => (pages?.length ?? 0) + 1,
    cacheTime: 0, // 👈 Don't cache the data
  });

  // useEffect(() => {
  //   const event = addListener('focus', () => {
  //     refetch();
  //   });
  //   return event;
  // });

  const list = data?.pages?.flatMap(page => page.data?.data) || [];
  console.log('ljskdvhjklsdbvjkbsdkvbsdkjvbksdbvsdbjk', list[2]);

  const onRefresh = useCallback(() => {
    setRefresh(true);
    refetch();
    upComingEvents.refetch();
    suggestedFriends.refetch();
    nearByEvents.refetch();
    setRefresh(false);
  }, []);

  const loadMoreData = useCallback(
    isCurrent => {
      if (!isFetching && hasNextPage) {
        if (isCurrent) null;
        else setPage(prev => prev + 1); // Increment the page number
      }
    },
    [isFetching, hasNextPage],
  );

  const dynamicRoute = (routeName, params) => navigate(routeName, params);

  const [hasMoreData, setHasMoreData] = useState(true);

  // Inside your fetch function:
  const fetchData = async () => {
    if (!hasMoreData || isFetchingNextPage) return;

    const newData = await fetchNextPage();
    if (newData.length === 0) {
      setHasMoreData(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isNearEnd, setIsNearEnd] = useState(false);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    // Double lock to prevent duplicates
    if (isRefetching || list.length < 9) return;
    else await fetchNextPage();
  };

  useEffect(() => {
    AsyncStorage.setItem('userData', JSON.stringify(userData));
  }, []);

  // useEffect(() => {
  //   handleLoadMore();
  // }, [isNearEnd]); // React to scroll position changes

  const handleScroll = nativeEvent => {
    console.log('Full nativeEvent:', nativeEvent);
    // const {contentOffset, contentSize, layoutMeasurement} = nativeEvent;

    // // Calculate distance from end in PIXELS
    // const distanceFromEnd =
    //   contentSize.height - (contentOffset.y + layoutMeasurement.height);

    // // Trigger only if <30% from end, not already fetching, and data exists
    // if (distanceFromEnd < paddingToBottom && !isFetching && list.length > 0) {
    //   isFetching.current = true;
    //   console.log('Fetching next page!');
    //   fetchNextPage();
    // }
  };

  // 2. Debounced version (Instagram's secret sauce)
  const loadMoreDebounced = useMemo(
    () => debounce(handleLoadMore, 50), // 50ms delay after scrolling stops
    [handleLoadMore],
  );

  useEffect(() => {
    return () => {
      loadMoreDebounced.cancel(); // Important!
    };
  }, [loadMoreDebounced]);

  const isVersionLower = (v1, v2) => {
    const a = v1.split('.').map(Number);
    const b = v2.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      if ((a[i] || 0) < (b[i] || 0)) return true;
      if ((a[i] || 0) > (b[i] || 0)) return false;
    }
    return false;
  };

  const {mutate} = useMutation({
    mutationFn: data => {
      return API.post(checkVersionUrl, {
        platform: Platform.OS,
        current_version: DeviceInfo.getVersion(),
      });
    },
    onSuccess: ({ok, data}) => {
      const currentVersion = DeviceInfo.getVersion();
      if (ok) {
        console.log('version check data', data);

        const optionalUpdate = isVersionLower(
          currentVersion,
          data?.latest_version,
        );
        if (data?.force_update) {
          dispatch({
            type:
              data?.force_update == true
                ? types.isUpdateNeedTrue
                : types.isUpdateNeedFalse,
          });
        }
        if (!data?.force_update && optionalUpdate) {
          Alert.alert('New Version Available', data?.optional_update_message, [
            {text: 'Later', style: 'cancel'},
            {
              text: 'Update Now',
              onPress: () => {
                if (Platform.OS == 'ios') {
                  Linking.openURL(
                    'https://apps.apple.com/us/app/tac-the-app-for-cowboys/id6738097899',
                  );
                } else {
                  Linking.openURL('market://details?id=com.tac.codment');
                }
              },
            },
          ]);
        }
      }
    },
    onError: () => {},
  });
  useEffect(() => {
    mutate();
  }, []);

  return {
    search,
    setSearch,
    dynamicRoute,
    onRefresh,
    suggestedFriends: suggestedFriends?.data?.data ?? [],
    userData,
    homeTimeLine: list ?? [],
    upcommingEvents: upComingEvents?.data?.data?.suggested_events ?? [],
    loadMoreData,
    isRefetching,
    isFetching,
    refetchKey: ['homeTimeLine'],
    hasMoreData: Boolean(1 == page + 1),
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    refetch,
    modal,
    setModal,
    refreshing: refesh,
    isEndReachedCalledDuringMomentum,
    setIsEndReachedCalledDuringMomentum,
    fetchData,
    handleLoadMore,
    isLoading,
    handleScroll,
    isRefetching,
    loadMoreDebounced,
    hasNextPage,
    locationCoords,
    nearByEvents: nearByEvents?.data?.data?.data ?? [],
    nearByEventsRefetch: nearByEvents?.refetch,
    sendReq: async id => {
      await sendFriendReq.mutateAsync(id);
      queryClient.invalidateQueries({queryKey: ['myFriends']});
      queryClient.invalidateQueries({queryKey: ['homeSuggestedFriends']});
    },
  };
};

export default HomeScreen;
