import {useState} from 'react';
import Schemas from '../../Utils/Validation';
import useFormHook from '../../Hooks/UseFormHooks';
import {useFieldArray, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

const useCreateEventsScreen = ({navigate}) => {
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
  } = useFormHook(Schemas.eventCreate);

  // Initialize useFieldArray for perfEventList
  const {fields, append, remove} = useFieldArray({
    control,
    name: 'perfEventList',
  });

  const onSubmit = data => {
    console.log(data);
  };
  const currentDate = new Date();

  const [datePicker, setDateRikcer] = useState({
    alertVal: false,
    stateName: null,
    modalType: 'date',
    index: null,
  });

  const toggleDate = (stateName, modalType, index) =>
    setDateRikcer({
      alertVal: !datePicker.alertVal,
      stateName,
      modalType: modalType ?? 'date',
      index,
    });

  const [formDataState, setFormDataState] = useState({
    eventTitle: '',
    eventImg: null,
    eventStartDate: null,
    eventStartTime: null,
    eventEndDate: null,
    eventEndTime: null,
    eventCoords: {
      locationName: null,
      coords: {},
    },
    eventLocation: null,
    perfEventList: [
      {
        title: null,
        date: null,
        time: null,
      },
    ],
    eventType: null,
    privateEvent: null,
    eventAssociation: null,
    eventCircuit: null,
    evnetTour: null,
    evnetConfirm: null,
  });

  const {
    eventAssociation,
    eventCircuit,
    eventCoords,
    eventEndDate,
    eventImg,
    eventLocation,
    eventStartDate,
    eventStartTime,
    eventTitle,
    eventType,
    evnetConfirm,
    evnetTour,
    perfEventList,
    privateEvent,
    eventEndTime,
  } = formDataState;

  const updateState = data => setFormDataState(prev => ({...prev, ...data}));

  const onSelectValue = (key, val) => {
    updateState({[key]: val});
  };

  const dynamicRoute = (screenName, screenData) =>
    navigate(screenName, screenData);

  const onSelectValueInList = (index, key, val) => {
    setFormDataState(prevState => {
      const updatedPerfEventList = [...prevState.perfEventList];
      updatedPerfEventList[index] = {
        ...updatedPerfEventList[index],
        [key]: val,
      };

      return {
        ...prevState,
        perfEventList: updatedPerfEventList,
      };
    });
  };

  return {
    currentDate,
    dynamicRoute,
    onSelectValue,
    formDataState,
    datePicker,
    toggleDate,
    onSelectValueInList,
    perfEventListArry: fields,
    register,
    errors,
    setValue,
    getFieldState,
    control,
  };
};
export default useCreateEventsScreen;
