import {useEffect, useState} from 'react';
import Schemas from '../../Utils/Validation';
import useFormHook from '../../Hooks/UseFormHooks';
import {useFieldArray, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import RNCalendarEvents from 'react-native-calendar-events';
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
  convertDateFormat,
  convertDateString,
  convertToArray,
  convertToCustomTimeFormat,
  convertToLocalFullTime,
  convertToLocalTime,
  formatDateToCustomFormat,
  formatDateToYMD,
  getCalenderPerComfirm,
  getFormattedTime,
  getFullLocalDate,
  getIdsFromArry,
  isFutureOrNow,
} from '../../Services/GlobalFunctions';
import useReduxStore from '../../Hooks/UseReduxStore';

const useCreateEventsScreen = ({navigate, goBack}, {params}) => {
  const {event} = params?.event ? params : {event: null};

  const isEditEvnet = Boolean(event?.created_at);

  var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentDate = new Date();
  const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Adds 1 day in milliseconds
  // Day after tomorrow
  const nextNextDay = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);
  const parseTimeString = timeStr => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes; // Convert to minutes since midnight for comparison
  };

  // Set default end time to 11:59 PM next day
  const nextDayTime = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // August 26, 2025
  nextDayTime.setHours(23, 59, 0, 0); // Set to 11:59 PM
  const defaultEndTime = new Date(nextDayTime); // Full Date object for August 26, 2025, 11:59 PM

  // Set another key for 8:00 AM next day
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
          'jsdbvklsdbvksdbvkjsdbkjvbsdlkvblsdkbvsdbkvklsdbvlksd',
          JSON.parse(res.images).map(img => ({
            uri: img,
            type: 'image/jpeg',
            name: img.split('/').pop(),
            isEdit: true,
          })),
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
        setValue('perfEventList', []); // set if you have event list data
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
          res?.from_date ? new Date(getFullLocalDate(res.from_date)) : nextDay,
        );
        setValue(
          'eventStartTime',
          res?.start_time
            ? new Date(convertToLocalFullTime(res.start_time))
            : defaultMorningTime,
        );
        setValue(
          'eventEndDate',
          res?.to_date ? new Date(getFullLocalDate(res.to_date)) : nextNextDay,
        );
        setValue(
          'eventEndTime',
          res?.end_time
            ? new Date(convertToLocalFullTime(res.end_time))
            : defaultEndTime,
        );
      }
      return allProps;
    },
  });

  console.log('jkdbflksfblksblksblkdfklbnlkdfnbkldfnklbndfb', defaultEndTime);

  const {
    control,
    register,
    handleSubmit,
    clearErrors,
    reset,
    getFieldState,
    getValues,
    resetField,
    setError,
    setFocus,
    setValue,
    trigger,
    unregister,
    watch,
    errors,
  } = useFormHook(Schemas.eventCreate, {
    perfEventList: [], // Initial empty event
    eventStartDate: data?.data?.from_date
      ? new Date(data?.data?.from_date)
      : nextDay,
    eventStartTime: data?.data?.start_time
      ? new Date(data?.data?.start_time)
      : defaultMorningTime,
    eventEndDate: data?.data?.to_date
      ? new Date(data?.data?.to_date)
      : nextNextDay,
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

  // Initialize useFieldArray for perfEventList
  const {fields, append, remove, update} = useFieldArray({
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
        console.log(stateName, e);
        setValue(stateName, e);
      },
    });

  const dynamicRoute = (screenName, screenData) =>
    navigate(screenName, screenData);

  const {mutateAsync} = useMutation({
    mutationFn: data => {
      console.log('Following event with data:', data);
      return API.post(followEventsUrl, {
        event_id: data?.id,
        calendar_id: data?.calender_id,
        record_id: data?.record_id,
      });
    },
    onSuccess: ({ok, data}) => {},
  });

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

      console.log('Request Body:', JSON.stringify(body));

      const {ok, data} = await formDataFunc(
        isEditEvnet ? updateEventUrl + event?.id : createEventUrl,
        body,
        'images',
        true,
        'performances',
      );

      console.log('API Response:', data);

      if (ok) {
        if (eventSync) {
          const permission = await RNCalendarEvents.checkPermissions();
          if (permission !== 'authorized') {
            await RNCalendarEvents.requestPermissions();
          }

          await getCalenderPerComfirm(); // assuming this fetches a valid calendar list

          // Get all calendars
          const calendars = await RNCalendarEvents.findCalendars();
          const modifiableCalendar = calendars.find(
            cal => cal.allowsModifications,
          );

          const calendarId = modifiableCalendar?.id || calendars[0]?.id;

          if (!calendarId) {
            console.warn('No writable calendar found.');
          }

          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

          const recordId = await RNCalendarEvents.saveEvent(eventTitle, {
            calendarId,
            startDate: new Date(eventStartDate).toISOString(),
            endDate: new Date(eventEndDate).toISOString(),
            location: eventLocation.locationName,
            notes: eventLocation.locationName,
            timeZone,
          });
          await mutateAsync({
            id: data?.id,
            calender_id: calendarId,
            record_id: recordId,
          });
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
  };
};
export default useCreateEventsScreen;
