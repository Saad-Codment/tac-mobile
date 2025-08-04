import {useMutation, useQuery} from '@tanstack/react-query';
import {
  followEventsUrl,
  getEventDetailsUrl,
  unFollowEventsUrl,
} from '../../Utils/Urls';
import API from '../../Utils/helperFunc';
import {useCallback, useRef, useState} from 'react';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import useReduxStore from '../../Hooks/UseReduxStore';
import ReactNativeCalendarEvents from 'react-native-calendar-events';
import {Alert} from 'react-native';
import {getCalenderPerComfirm} from '../../Services/GlobalFunctions';

const useEventDetailScreen = ({navigate}, {params}) => {
  const {getState} = useReduxStore();

  const {userData} = getState('Auth');

  const calendarIdRef = useRef(null);
  const recordIdRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);

  const {id} = params;
  const {data, error, refetch} = useQuery({
    queryKey: ['eventDetail'],
    queryFn: () => API.get(getEventDetailsUrl + id),
  });

  const onRefresh = useCallback(() => {
    queryClient.fetchQuery({
      queryKey: ['eventDetail'],
      staleTime: 1000,
    });
  }, []);

  const {mutateAsync} = useMutation({
    mutationFn: data => {
      console.log('datkjsdbjkdbjkvbsdjkbvkjsdvjkdsa', data);
      return API.post(followEventsUrl, {
        event_id: data?.id,
        calendar_id: data?.calendarId,
        record_id: data?.recordId,
      });
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        // successMessage(data?.message);
      } else {
        console.log('jkdsbkljsdbvklsdbvklsbklvsvd', data);
        errorMessage(data?.message);
      }
    },
  });
  const unfollowEvent = useMutation({
    mutationFn: data => {
      return API.post(unFollowEventsUrl, {
        event_id: data?.id,
        remove_from_calender: data?.isCalender,
      });
    },
    onSuccess: async ({ok, data}) => {
      if (ok) {
        successMessage(data?.message);
        await refetch();

        // Alert.alert(`Want to remove this event to your calendar?`, '', [
        //   {
        //     text: 'Cancel',
        //     style: 'cancel',
        //   },
        //   {
        //     text: 'OK',
        //     onPress: async () => {
        //       console.log('Removing calendar event...', data);
        //       await removeCalendarEvent(
        //         data?.data?.calender_id,
        //         data?.data?.record_id,
        //       );
        //     },
        //   },
        // ]);
      } else {
        console.log('jkdsbkljsdbvklsdbvklsbklvsvd', data);
        errorMessage(data?.message);
      }
    },
  });

  const removeCalendarEvent = async () => {
    try {
      const permission = await ReactNativeCalendarEvents.checkPermissions();
      if (permission !== 'authorized') {
        await ReactNativeCalendarEvents.requestPermissions();
      }

      await getCalenderPerComfirm(); // assuming this fetches a valid calendar list

      console.log(
        'New Calendar IDdsdfsdfsdf:',
        newCalendarId,
        data?.data?.calender_id,
        data?.data?.record_id,
        recordIdRef.current,
        calendarIdRef.current,
      );
      // Get all calendars
      const calendars = await ReactNativeCalendarEvents.findCalendars();
      const modifiableCalendar = calendars.find(cal => cal.allowsModifications);

      const newCalendarId = modifiableCalendar?.id || calendars[0]?.id;
      // if (data?.data?.calender_id != newCalendarId) {
      //   Alert.alert(
      //     'Calendar Mismatch',
      //     'The event does not belong to the selected calendar.',
      //   );
      // }

      const success = await ReactNativeCalendarEvents.removeEvent(
        data?.data?.record_id ?? recordIdRef.current,
      );
      if (success) {
        console.log('Event removed successfully');
      } else {
        console.log('Event removal failed');
      }
    } catch (error) {
      console.log('Error removing event:', error);
    }
  };

  const AaddtToMyDeviceCalendar = async eventDate => {
    const permission = await ReactNativeCalendarEvents.checkPermissions();
    if (permission !== 'authorized') {
      await ReactNativeCalendarEvents.requestPermissions();
    }

    await getCalenderPerComfirm(); // assuming this fetches a valid calendar list

    // Get all calendars
    const calendars = await ReactNativeCalendarEvents.findCalendars();
    const modifiableCalendar = calendars.find(cal => cal.allowsModifications);

    const calendarId = modifiableCalendar?.id || calendars[0]?.id;

    if (!calendarId) {
      console.log('No writable calendar found.');
      return;
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const recordId = await ReactNativeCalendarEvents.saveEvent(
      data?.data?.title,
      {
        calendarId,
        startDate: new Date(data?.data?.from_date).toISOString(),
        endDate: new Date(data?.data?.to_date).toISOString(),
        location: data?.data.address,
        notes: data?.data?.address,
        timeZone,
      },
    );
    recordIdRef.current = recordId;
    calendarIdRef.current = calendarId;
    mutateAsync({
      id: data?.data?.id,
      calendarId,
      recordId,
    });
  };

  return {
    eventData: data?.data,
    onRefresh,
    userData,
    modalVisible,
    setModalVisible,
    isAleadyAddedToCalender: Boolean(
      data?.data?.calender_id && !data?.data?.is_followed,
    ),
    followUnFollowEvent: async (isChecked, id) => {
      setModalVisible(false);
      if (data?.data?.is_followed) {
        await unfollowEvent.mutateAsync({
          id,
          url: unFollowEventsUrl,
          isCalender: isChecked ? 1 : 0,
        });
        if (isChecked) await removeCalendarEvent();
        refetch();
      } else {
        await mutateAsync({id});
        await refetch();
        if (isChecked) await AaddtToMyDeviceCalendar();
        // Alert.alert(`Want to add this event to your calendar?`, '', [
        //   {
        //     text: 'Cancel',
        //     style: 'cancel',
        //   },
        //   {
        //     text: 'OK',
        //     onPress: async () => {
        //       await AaddtToMyDeviceCalendar();
        //     },
        //   },
        // ]);
      }
    },
  };
};

export default useEventDetailScreen;
