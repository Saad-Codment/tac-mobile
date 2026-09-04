import {useQuery} from '@tanstack/react-query';
import useReduxStore from '../../Hooks/UseReduxStore';
import useFriendServices from '../../Services/FriendServices';
import API from '../../Utils/helperFunc';
import {getAllNotificationsUrl} from '../../Utils/Urls';
import {useCallback, useEffect, useLayoutEffect} from 'react';
import {types} from '../../Redux/types';
import notifee from '@notifee/react-native';
// ⚠️ ADJUST if tripDetailsUrl actually lives in your main Utils/Urls.js
// now instead — same situation as eventTripsUrl earlier.
import {tripDetailsUrl} from '../../Utils/Urls';

const useNotificationScreen = navigation => {
  // CHANGED — added getState (confirmed available from useReduxStore,
  // same as it's used in useEventsDetailScreen.js) for the
  // TRIP_DEPARTURE_REMINDER organizer-check below. queryClient/dispatch
  // usage elsewhere in this file is untouched.
  const {queryClient, dispatch, getState} = useReduxStore();
  const {sendFriendReq, acceptFriendReq, rejectFriendReq} = useFriendServices();

  const {data, error, refetch, isLoading} = useQuery({
    queryKey: ['allNotifications'],
    queryFn: () => API.get(getAllNotificationsUrl),
    cacheTime: 0,
  });

  const onRefresh = useCallback(() => {
    queryClient.fetchQuery({
      queryKey: ['allNotifications'],
      staleTime: 1000,
    });
  }, []);

  const clearNotification = () => {
    dispatch({type: types.isNotifyFalse});
  };

  const clearAppBadge = async () => {
    try {
      await notifee.setBadgeCount(0);
      console.log('Badge cleared successfully');
    } catch (e) {
      console.log('Failed to clear badge:', e);
    }
  };

  useEffect(() => {
    clearAppBadge();
    setTimeout(() => {
      clearNotification();
    }, 1000);
  }, []);

  // NEW — everything below is additive. Handles the 7 notification
  // types from LEG_TRACKING_API.md §6. Existing friend-request
  // notifications key off notification_type_id (numeric) and never set
  // notification_type (string), so they fall through to the default
  // case here and get no navigation — same as today, unchanged.
  const handleNotificationPress = useCallback(
    async item => {
      const type = item?.notification_type;
      const data = item?.data;
      if (!navigation || !type) return;

      switch (type) {
        case 'JOIN_REQUEST_ACCEPTED':
        case 'JOIN_REQUEST_REJECTED':
          navigation.navigate('MyRequestsScreen');
          break;

        case 'TRIP_STARTED':
        case 'TRIP_COMPLETED':
          navigation.navigate('TripDetailScreen', {tripId: data});
          break;

        case 'JOIN_REQUEST_SUBMITTED':
        case 'LEG_STARTED':
          // ⚠️ Known gap, flagged when this module was built — there's
          // no documented endpoint to resolve a bare participant_id
          // (JOIN_REQUEST_SUBMITTED) or leg_id (LEG_STARTED) back to its
          // trip. Falls back to a screen you can navigate from manually
          // until a resolve endpoint exists; swap for a direct
          // navigate() once it does.
          navigation.navigate('TripListScreen');
          break;

        case 'TRIP_DEPARTURE_REMINDER': {
          // Same `data` field means trip_id (organizer) or
          // participant_id (participant) depending only on who received
          // it — nothing in the notification itself says which. Try it
          // as a trip_id first; if you're that trip's organizer,
          // navigate there. Otherwise treat it as a participant_id.
          try {
            const {ok, data: tripRes} = await API.get(
              `${tripDetailsUrl}${data}`,
            );
            const {userData} = getState('Auth');
            if (ok && tripRes?.data?.organizer_id === userData?.id) {
              navigation.navigate('TripDetailScreen', {tripId: data});
              return;
            }
          } catch (e) {
            // not a trip_id (or request failed) — fall through below
          }
          navigation.navigate('MyRequestsScreen');
          break;
        }

        default:
          break; // unrecognized/legacy types — no navigation, as today
      }
    },
    [navigation, getState],
  );

  return {
    notificationsList: data?.data?.data ?? [],
    onRefresh,
    isLoading,
    acceptReq: async id => {
      console.log('jkdsvbklsdbvklsdbklvbsdklvsd', id);
      await acceptFriendReq.mutateAsync(id);
      refetch();
      // queryClient.invalidateQueries({queryKey: ['allNotifications']});
      queryClient.invalidateQueries({queryKey: ['friendRequests']});
    },
    declineReq: async id => {
      await rejectFriendReq.mutateAsync(id);
      refetch();
      // queryClient.invalidateQueries({queryKey: ['allNotifications']});
      queryClient.invalidateQueries({queryKey: ['friendRequests']});
    },
    // NEW
    handleNotificationPress,
  };
};

export default useNotificationScreen;
