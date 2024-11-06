import {useState} from 'react';

const useCreateEventsScreen = ({navigate}) => {
  const currentDate = new Date();

  const [datePicker, setDateRikcer] = useState({
    alertVal: false,
    stateName: null,
    modalType: 'date',
  });

  const toggleDate = (stateName, modalType) =>
    setDateRikcer({
      alertVal: !datePicker.alertVal,
      stateName,
      modalType: modalType ?? 'date',
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
    perfEventList: [''],
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

  return {
    currentDate,
    dynamicRoute,
    onSelectValue,
    formDataState,
    datePicker,
    toggleDate,
  };
};
export default useCreateEventsScreen;
