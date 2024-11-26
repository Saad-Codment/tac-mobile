import {useState} from 'react';
import Schemas from '../../Utils/Validation';
import useFormHook from '../../Hooks/UseFormHooks';
import {useFieldArray, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import RNCalendarEvents from 'react-native-calendar-events';
import {useMutation} from '@tanstack/react-query';
import {createEventUrl} from '../../Utils/Urls';
import API, {formDataFunc} from '../../Utils/helperFunc';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {
  convertDateFormat,
  convertDateString,
  getCalenderPerComfirm,
} from '../../Services/GlobalFunctions';
import useReduxStore from '../../Hooks/UseReduxStore';

const useCreateEventsScreen = ({navigate}) => {
  var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
    privateEvent: 0,
    evnetTour: 0,
    eventStartDate: currentDate,
    eventStartTime: currentDate,
    eventEndDate: currentDate,
    eventEndTime: currentDate,
  });

  const {queryClient} = useReduxStore();

  // Initialize useFieldArray for perfEventList
  const {fields, append, remove, update} = useFieldArray({
    control,
    name: 'perfEventList',
  });

  const currentDate = new Date();

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
        event_type_id: eventType.id,
        association_id: eventAssociation.id,
        circuit_id: eventCircuit.id,
        tour_id: evnetTour,
        private: privateEvent ? 1 : 0,
        is_confirmed: eventConfirm ? 1 : 0,
        'images[]': eventImg,
        timezone: timeZone,
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
      console.log('After hit api ', JSON.stringify(eventImg));
      const {ok, data} = await formDataFunc(createEventUrl, body, 'images[]');
      if (ok) {
        if (eventSync) {
          await RNCalendarEvents.checkPermissions();
          await RNCalendarEvents.requestPermissions();
          await getCalenderPerComfirm();
          const pro = await RNCalendarEvents.saveEvent(
            eventTitle,
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
        queryClient.invalidateQueries({queryKey: ['getEventDate']});
        successMessage('Event created successfully');
      } else errorMessage('Error on creating event');
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
  };
};
export default useCreateEventsScreen;
