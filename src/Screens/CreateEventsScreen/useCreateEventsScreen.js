import {useEffect, useState} from 'react';
import Schemas from '../../Utils/Validation';
import useFormHook from '../../Hooks/UseFormHooks';
import {useFieldArray} from 'react-hook-form';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
  createEventUrl,
  followEventsUrl,
  getEventDetailsUrl,
  updateEventUrl,
} from '../../Utils/Urls';
import API, {formDataFunc} from '../../Utils/helperFunc';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {
  convertToLocalFullTime,
  formatDateToYMD,
  getFormattedTime,
  getFullLocalDate,
  getIdsFromArry,
} from '../../Services/GlobalFunctions';
import useReduxStore from '../../Hooks/UseReduxStore';
import * as Calendar from '@shadahmad7/react-native-calendar';
import {Alert} from 'react-native';

// === SAFE DATE CONVERSION ===
const parseBackendDate = dateStr => {
  if (!dateStr) return null;
  // Convert "2026-04-17 03:00:00" → proper Date object
  return new Date(dateStr.replace(' ', 'T') + 'Z');
};

const parseBackendTime = timeStr => {
  if (!timeStr) return null;
  // For time-only strings like "03:00:00" → create valid Date
  return new Date(timeStr);
};

const useCreateEventsScreen = ({navigate, goBack}, {params}) => {
  const {event} = params?.event ? params : {event: null};

  const isEditEvnet = Boolean(event?.created_at);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentDate = new Date();
  const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

  const nextDayTime = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  nextDayTime.setHours(23, 59, 0, 0);
  const defaultEndTime = new Date(nextDayTime);

  const nextDayMorning = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  nextDayMorning.setHours(8, 0, 0, 0);
  const defaultMorningTime = new Date(nextDayMorning);

  const {data} = useQuery({
    queryKey: ['eventDetailForEdit'],
    queryFn: async () => {
      const allProps = await API.get(getEventDetailsUrl + event?.id);
      if (allProps?.ok) {
        const res = allProps.data;
        console.log(
          'lksdnvklsndklvnsdklvnklsdnvklnsdkvlsdnlkvnsdklvnklsdnvlsd',
          new Date(convertToLocalFullTime(res?.start_time)),
          res,
          res?.title,
          res?.start_time,
          parseBackendTime(res.start_time),
        );

        setValue('eventTitle', res?.title || '');
        setValue(
          'eventImg',
          res?.images
            ? JSON.parse(res.images).map(img => ({
                uri: img,
                type: 'image/jpeg',
                name: img.split('/').pop(),
                isEdit: true,
              }))
            : [],
        );
        setValue('eventPrice', res?.added_money || '');

        replace(
          res?.performances
            ? res?.performances?.map(p => ({
                title: p?.title || '',
                date: p?.date ? parseBackendDate(p.date) : currentDate,
                startTime: p?.start_time
                  ? parseBackendTime(p.start_time)
                  : defaultMorningTime,
                endTime: p?.end_time
                  ? parseBackendTime(p.end_time)
                  : defaultEndTime,
              }))
            : [],
        );

        setValue('privateEvent', res?.private || 0);
        setValue('evnetTour', res?.tour?.id || 1);
        setValue('eventType', res?.event_types ?? null);
        setValue('eventAssociation', res?.associations ?? null);
        setValue('eventCircuit', res?.circuits ?? null);
        setValue('eventConfirm', res?.is_confirmed ?? null);
        setValue('eventLocation', {
          locationName: res?.address,
          coords: {
            latitude: res?.latitude,
            longitude: res?.longitude,
          },
        });

        setValue(
          'eventStartDate',
          res?.from_date ? parseBackendDate(res.from_date) : nextDay,
        );
        setValue(
          'eventStartTime',
          res?.start_time
            ? parseBackendDate(res.start_time)
            : defaultMorningTime,
        );
        setValue(
          'eventEndDate',
          res?.to_date ? parseBackendDate(res.to_date) : nextDay,
        );
        setValue(
          'eventEndTime',
          res?.end_time ? parseBackendDate(res.end_time) : defaultEndTime,
        );
      }
      return allProps;
    },
  });

  const {
    control,
    register,
    handleSubmit,
    clearErrors,
    reset,
    getFieldState,
    setValue,
    trigger,
    watch,
    errors,
  } = useFormHook(Schemas.eventCreate, {
    perfEventList: data?.data?.performances?.map(res => ({
      title: res?.title || '',
      date: res?.date ? new Date(getFullLocalDate(res.date)) : currentDate,
      startTime: res?.start_time
        ? new Date(convertToLocalFullTime(res.start_time))
        : defaultMorningTime,
      endTime: res?.end_time
        ? new Date(convertToLocalFullTime(res.end_time))
        : defaultEndTime,
    })), // Initial empty event
    eventStartDate: data?.data?.from_date
      ? new Date(data?.data?.from_date)
      : nextDay,
    eventStartTime: data?.data?.start_time
      ? new Date(data?.data?.start_time)
      : defaultMorningTime,
    eventEndDate: data?.data?.to_date ? new Date(data?.data?.to_date) : nextDay,
    eventEndTime: data?.data?.end_time
      ? new Date(data?.data?.end_time)
      : defaultEndTime,
    evnetTour: 1,
    privateEvent: 0,
  });

  const {queryClient} = useReduxStore();

  useEffect(() => {
    return () => reset();
  }, []);

  const {fields, append, remove, update, replace} = useFieldArray({
    control,
    name: 'perfEventList',
  });

  const [modalVisible, setModalVisible] = useState(false);

  const [datePicker, setDateRikcer] = useState({
    alertVal: false,
    stateName: null,
    modalType: 'date',
    index: null,
    onChange: () => {},
  });

  const toggleDate = (stateName, modalType, index, onChange) =>
    setDateRikcer({
      stateName,
      alertVal: !datePicker.alertVal,
      modalType: modalType ?? 'date',
      index,
      onChange: e => {
        setValue(stateName, e);
      },
    });

  const dynamicRoute = (screenName, screenData) =>
    navigate(screenName, screenData);

  const {mutateAsync} = useMutation({
    mutationFn: data => {
      return API.post(followEventsUrl, {
        event_id: data?.id,
        calendar_id: data?.calender_id,
        record_id: data?.record_id,
      });
    },
    onSuccess: () => {},
  });

  // ================== NEW CALENDAR FUNCTIONALITY ==================
  const requestCalendarPermissions = async () => {
    const {status} = await Calendar.requestCalendarPermission();
    return status === 'granted';
  };

  const createEventFun = async ({
    eventTitle,
    eventImg,
    eventStartDate,
    eventStartTime,
    eventEndDate,
    eventEndTime,
    eventLocation,
    eventType,
    privateEvent,
    eventAssociation,
    eventCircuit,
    evnetTour,
    eventConfirm,
    eventSync,
    perfEventList,
    eventPrice,
  }) => {
    console.log('Creating event...');
    try {
      const body = {
        title: eventTitle,
        from_date: formatDateToYMD(eventStartDate),
        start_time: getFormattedTime(eventStartTime),
        to_date: formatDateToYMD(eventEndDate),
        end_time: getFormattedTime(eventEndTime),
        latitude: eventLocation.coords.latitude,
        longitude: eventLocation.coords.longitude,
        address: eventLocation.locationName,
        event_type_ids: getIdsFromArry(eventType, 'id'),
        association_ids: getIdsFromArry(eventAssociation, 'id'),
        circuit_ids: getIdsFromArry(eventCircuit, 'id'),
        tour_id: evnetTour,
        private: privateEvent ? 1 : 0,
        is_confirmed: eventConfirm ? 1 : 0,
        '[performances]':
          perfEventList.length > 0
            ? perfEventList.map(res => ({
                title: res?.title,
                date: formatDateToYMD(res?.date),
                start_time: getFormattedTime(res?.startTime),
                end_time: getFormattedTime(res?.endTime),
              }))
            : [],
        images: isEditEvnet
          ? eventImg?.find(res => !res?.isEdit)
            ? eventImg?.filter(res => !res?.isEdit)
            : null
          : eventImg,
        timezone: timeZone,
        added_money: eventPrice,
        images_array: eventImg?.find(res => res?.isEdit)
          ? JSON.stringify(
              eventImg?.filter(res => res?.isEdit)?.map(img => img?.uri),
            )
          : null,
      };

      const {ok, data} = await formDataFunc(
        isEditEvnet ? updateEventUrl + event?.id : createEventUrl,
        body,
        'images',
        true,
        '[performances]',
      );

      if (ok) {
        // === Sync with Device Calendar using @shadahmad7/react-native-calendar ===
        if (eventSync) {
          try {
            const hasPermission = await requestCalendarPermissions();
            if (!hasPermission) {
              Alert.alert(
                'Permission Denied',
                'Calendar permission is required.',
              );
            } else {
              let defaultCalendar = await Calendar.getDefaultCalendar();

              if (!defaultCalendar) {
                const calendars = await Calendar.getCalendars();
                defaultCalendar =
                  calendars.find(cal => cal.isPrimary) || calendars[0];
              }

              if (defaultCalendar) {
                const startDateMs = new Date(eventStartDate).getTime();
                const endDateMs = new Date(eventEndDate).getTime();

                const eventToSave = {
                  title: eventTitle,
                  startDate: startDateMs.toString(),
                  endDate: endDateMs.toString(),
                  location: eventLocation.locationName,
                  notes: eventLocation.locationName || '',
                  allDay: false,
                };

                const eventId = await Calendar.saveEvent(eventToSave);

                if (eventId) {
                  await mutateAsync({
                    id: data?.id,
                    calender_id: defaultCalendar.id,
                    record_id: eventId,
                  });
                  console.log('Event synced to device calendar successfully');
                }
              }
            }
          } catch (calendarError) {
            console.log('Error syncing to calendar:', calendarError);
            // Don't block event creation if calendar fails
          }
        }

        // Post-save logic
        if (params?.functionToUpdatePostOrEvent) {
          params?.functionToUpdatePostOrEvent(data);
        }
        if (isEditEvnet) queryClient.invalidateQueries(['profilePosts']);
        queryClient.invalidateQueries({queryKey: ['getEventDate']});

        successMessage(
          isEditEvnet
            ? 'Event updated successfully'
            : 'Event created successfully',
        );
        goBack();
      } else {
        errorMessage(
          isEditEvnet ? 'Error on updating event' : 'Error on creating event',
        );
      }
    } catch (error) {
      console.log('Error creating event:', error);
    }
  };

  return {
    currentDate,
    dynamicRoute,
    datePicker,
    toggleDate,
    perfEventListArry: fields,
    register,
    errors,
    setValue,
    getFieldState,
    control,
    append,
    remove,
    handleSubmit,
    createEventFun,
    modalVisible,
    setModalVisible,
    isEditEvnet,
    defaultMorningTime,
    defaultEndTime,
  };
};

export default useCreateEventsScreen;
