import {useEffect, useState} from 'react';
import Schemas from '../../Utils/Validation';
import useFormHook from '../../Hooks/UseFormHooks';
import {useFieldArray, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import RNCalendarEvents from 'react-native-calendar-events';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
  createEventUrl,
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
  formatDateToCustomFormat,
  getCalenderPerComfirm,
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

  const {data} = useQuery({
    queryKey: ['eventDetailForEdit'],
    queryFn: async () => {
      const allProps = await API.get(getEventDetailsUrl + event?.id);
      if (allProps?.ok) {
        const res = allProps.data;

        setValue('eventTitle', res?.title || '');
        setValue(
          'eventImg',
          res?.images
            ? {
                uri: JSON.parse(res.images)[0],
                type: 'image/jpeg',
                name: JSON.parse(res.images)[0].split('/').pop(),
                isEdit: true,
              }
            : {},
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
          res?.from_date ? new Date(res.from_date) : new Date(),
        );
        setValue(
          'eventStartTime',
          res?.start_time ? new Date(res.start_time) : new Date(),
        );
        setValue(
          'eventEndDate',
          isFutureOrNow(res?.to_date) ? new Date(res.to_date) : nextDay,
        );
        setValue(
          'eventEndTime',
          isFutureOrNow(res?.end_time) ? new Date(res.end_time) : nextDay,
        );
      }
      return allProps;
    },
  });

  console.log('jkdbflksfblksblksblkdfklbnlkdfnbkldfnklbndfb', data?.data);

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
    eventStartDate: new Date(data?.data?.from_date) ?? currentDate,
    eventStartTime: new Date(data?.data?.start_time) ?? currentDate,
    eventEndDate: new Date(data?.data?.to_date) ?? nextDay,
    eventEndTime: new Date(data?.data?.end_time) ?? nextDay,
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
    console.log('slkdklsdbklv');
    try {
      const body = {
        title: eventTitle,
        from_date: convertDateFormat(eventStartDate),
        start_time: convertDateString(eventStartTime),
        to_date: convertDateFormat(eventEndDate),
        end_time: convertDateString(eventEndTime),
        latitude: eventLocation.coords.latitude,
        longitude: eventLocation.coords.longitude,
        address: eventLocation.locationName,
        event_type_ids: getIdsFromArry(eventType, 'id'),
        association_ids: getIdsFromArry(eventAssociation, 'id'),
        circuit_ids: getIdsFromArry(eventCircuit, 'id'),
        tour_id: evnetTour,
        private: privateEvent ? 1 : 0,
        is_confirmed: eventConfirm ? 1 : 0,
        'images[]': isEditEvnet
          ? !eventImg.isEdit
            ? eventImg
            : null
          : eventImg,
        timezone: timeZone,
        added_money: eventPrice,
        images_array: eventImg.isEdit ? JSON.stringify(eventImg?.uri) : null,
        // 'performances[]':
        //   fields.length > 0
        //     ? fields.map(res => ({
        //         title: res?.title,
        //         date: convertDateFormat(res?.date),
        //         start_time: convertDateString(res?.startTime),
        //         end_time: convertDateString(res?.endTime),
        //       }))
        //     : null,
      };
      console.log('After hit api ', JSON.stringify(body));
      const {ok, data} = await formDataFunc(
        isEditEvnet ? updateEventUrl + event?.id : createEventUrl,
        body,
        'images[]',
      );
      if (ok) {
        if (eventSync) {
          await RNCalendarEvents.checkPermissions();
          await RNCalendarEvents.requestPermissions();
          await getCalenderPerComfirm();
          const pro = await RNCalendarEvents.saveEvent(
            {title: eventTitle},
            {
              calendarId: data?.id,
              startDate: eventStartDate.toISOString(),
              endDate: eventEndDate.toISOString(),
              location: eventLocation.locationName,
              notes: eventLocation.locationName,
              timeZone,
            },
            {exceptionDate: data?.from_date},
          );
          console.log('propropropropropropro', pro);
        }
        reset();
        if (isEditEvnet) queryClient.invalidateQueries(['profilePosts']);
        queryClient.invalidateQueries({queryKey: ['getEventDate']});
        successMessage(
          isEditEvnet
            ? 'Event updated successfully'
            : 'Event created successfully',
        );
        goBack();
      } else
        errorMessage(
          isEditEvnet ? 'rror on updating event' : 'Error on creating event',
        );
    } catch (error) {
      console.log('lsidgvlkbsdklvbsdklbvklsdbkvlsdbklvbsdkl', error);
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
