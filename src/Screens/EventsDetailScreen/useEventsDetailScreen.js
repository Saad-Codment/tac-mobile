import {useMutation, useQuery} from '@tanstack/react-query';
import {
  followEventsUrl,
  getEventDetailsUrl,
  imageUrl,
  unFollowEventsUrl,
} from '../../Utils/Urls';
import API from '../../Utils/helperFunc';
import {useCallback, useRef, useState} from 'react';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import useReduxStore from '../../Hooks/UseReduxStore';
import * as Calendar from '@shadahmad7/react-native-calendar';
import {Alert} from 'react-native';
import branch from 'react-native-branch';

const useEventDetailScreen = ({navigate, goBack}, {params}) => {
  console.log('ksadbkjsbdkbkjsdbvjbsdkjbvkjsdbkjvbksbdvsdkjvbsd', params);

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
    refetch();
  }, [refetch]);

  const {mutateAsync} = useMutation({
    mutationFn: data => {
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
      } else {
        errorMessage(data?.message);
      }
    },
  });

  // ================== OFFICIAL API FROM @shadahmad7/react-native-calendar ==================
  const requestCalendarPermissions = async () => {
    const {status} = await Calendar.requestCalendarPermission();
    return status === 'granted';
  };

  const AaddtToMyDeviceCalendar = async () => {
    if (!data?.data) {
      console.log('Event data not available yet');
      return;
    }

    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Calendar permission is required to add events.',
      );
      return;
    }

    try {
      // Get default calendar
      let defaultCalendar = await Calendar.getDefaultCalendar();

      // Fallback
      if (!defaultCalendar) {
        const calendars = await Calendar.getCalendars();
        defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];
      }

      if (!defaultCalendar) {
        Alert.alert('Error', 'No calendar found on device');
        return;
      }

      const eventToSave = {
        title: data.data.title,
        startDate: new Date(data.data.from_date).toISOString(),
        endDate: new Date(data.data.to_date).toISOString(),
        location: data.data.address || '',
        notes: data.data.description || data.data.address || '',
        allDay: false,
      };

      // ✅ Correct method according to package
      const eventId = await Calendar.saveEvent(eventToSave);

      if (eventId) {
        console.log('Event added successfully with ID:', eventId);
        recordIdRef.current = eventId;
        calendarIdRef.current = defaultCalendar.id;

        await mutateAsync({
          id: data.data.id,
          calendarId: defaultCalendar.id,
          recordId: eventId,
        });
      }
    } catch (error) {
      console.log('Error adding to calendar:', error);
      Alert.alert(
        'Failed',
        'Could not add event to calendar. Please try again.',
      );
    }
  };

  const removeCalendarEvent = async () => {
    Alert.alert(
      'Remove from Device Calendar',
      'Please open your Calendar app and delete the event manually.',
      [{text: 'OK'}],
    );
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
          isCalender: isChecked ? 1 : 0,
        });
        if (isChecked) await removeCalendarEvent();
        refetch();
      } else {
        await mutateAsync({id});
        await refetch();
        if (isChecked) {
          await AaddtToMyDeviceCalendar();
        }
        Alert.alert('Done!', "You've successfully add the event to calender.", [
          {
            text: 'OK',
            onPress: goBack,
          },
        ]);
      }
    },
  };
};

export default useEventDetailScreen;
