/**
 * The function `useOnStepScreen` is a placeholder function that returns an empty object.
 * @returns An empty object is being returned.
 */

import {useMutation} from '@tanstack/react-query';
import {useState} from 'react';
import API from '../../Utils/helperFunc';
import {onBoardConpleteUrl} from '../../Utils/Urls';
import {types} from '../../Redux/types';
import useReduxStore from '../../Hooks/UseReduxStore';
import {errorMessage} from '../../Config/NotificationMessage';
import {getIdsFromArry} from '../../Services/GlobalFunctions';
import {Alert} from 'react-native';

const useOnStepScreen = ({navigate}) => {
  const {dispatch} = useReduxStore();

  const [step, setStep] = useState(1);

  const ageRange = Array.from({length: 23}, (_, i) => {
    const age = 18 + i;
    return {label: String(age), value: String(age)};
  });

  const {mutate} = useMutation({
    mutationFn: body => {
      return API.post(onBoardConpleteUrl, body);
    },
    onSuccess: ({ok, data}) => {
      console.log('osidbviobsdoivbsdoivbsdobvosd', data);

      if (ok) {
        dispatch({
          type: types.UpdateProfile,
          payload: data.user,
        });
      } else errorMessage(data?.message);
    },
  });

  const [onBoardData, setOnboardData] = useState({
    age: null,
    gender: null,
    sport: [],
    ageRange: null,
    transport: null,
    hearFrom: [],
    association: [],
  });
  const updateState = data => setOnboardData(prev => ({...prev, ...data}));
  const {age, gender, sport, transport, association} = onBoardData;

  const onSelectValue = (key, val) => {
    updateState({[key]: val});
  };

  const handleNextStep = () => {
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const nextStep = {
    1: () => {
      if (age == null) Alert.alert('Warning', 'Please select age');
      else handleNextStep();
    },
    2: () => {
      if (gender == null) Alert.alert('Warning', 'Please select gender');
      else handleNextStep();
    },
    3: () => {
      if (transport == null) Alert.alert('Warning', 'Please select transport');
      else handleNextStep();
    },
    4: () => {
      if (sport.length == 0)
        Alert.alert('Warning', 'Please select at least one event');
      else handleNextStep();
    },
    5: () => {
      if (association.length == 0)
        Alert.alert('Warning', 'Please select at least one association');
      else
        mutate({
          association_ids: getIdsFromArry(association, 'id'),
          event_type_ids: getIdsFromArry(sport, 'id'),
          gender: gender.toLowerCase(),
          age: age.toLowerCase(),
        });
    },

    // mutate({
    //   ...onBoardData,
    //   hearFrom: JSON.stringify(onBoardData?.hearFrom),
    //   allergies: getIdsFromArry(onBoardData?.allergies, 'id'),
    //   restrictions: getIdsFromArry(onBoardData?.restrictions, 'id'),
    // }),
  };

  const dynamicRoute = (screen, params) => navigate(screen, params);

  return {
    step,
    setStep,
    onBoardData,
    setOnboardData,
    age,
    ageRange,
    onSelectValue,
    sport,
    association,
    handlePreviousStep,
    handleNextStep: nextStep,
    transport,
    dynamicRoute,
  };
};

export default useOnStepScreen;
