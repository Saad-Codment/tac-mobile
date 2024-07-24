/**
 * The function `useOnStepScreen` is a placeholder function that returns an empty object.
 * @returns An empty object is being returned.
 */

import {useState} from 'react';

const useOnStepScreen = ({navigate}) => {
  const [step, setStep] = useState(1);
  const [association, SetAssociation] = useState('');

  const ageRange = Array.from({length: 23}, (_, i) => {
    const age = 18 + i;
    return {label: String(age), value: String(age)};
  });

  const sports = [
    {label: 'Football', value: 'football'},
    {label: 'Basketball', value: 'basketball'},
    {label: 'Tennis', value: 'tennis'},
    {label: 'Baseball', value: 'baseball'},
    {label: 'Soccer', value: 'soccer'},
    // Add more sports as needed
  ];

  const associations = [
    {label: 'Association A', value: 'association_a'},
    {label: 'Association B', value: 'association_b'},
    {label: 'Association C', value: 'association_c'},
    // Add more associations as needed
  ];

  const [onBoardData, setOnboardData] = useState({
    age: [],
    gender: null,
    sport: [],
    ageRange: null,
    transport: [],
    hearFrom: [],
    association: null,
  });
  const updateState = data => setOnboardData(prev => ({...prev, ...data}));
  const {age, gender, sport, transport} = onBoardData;

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
      if (age == null) Alert.alert('Warning', 'Please select purpose');
      else handleNextStep();
    },
    2: () => {
      if (sport == null)
        Alert.alert('Warning', 'Please select at least one ingredient');
      else handleNextStep();
    },
    3: () => {
      if (transport == null)
        Alert.alert('Warning', 'Please select at least one allergy');
      else handleNextStep();
    },
    4: () => {
      if (sport.length == null) Alert.alert('Warning', 'Please select age');
      else handleNextStep();
    },
    5: () => {
      navigate('SubscribeScreen');
      //   mutate({
      //   ...onBoardData,
      //   hearFrom: JSON.stringify(onBoardData?.hearFrom),
      //   allergies: getIdsFromArry(onBoardData?.allergies, 'id'),
      //   restrictions: getIdsFromArry(onBoardData?.restrictions, 'id'),
      // }),
    },

    // mutate({
    //   ...onBoardData,
    //   hearFrom: JSON.stringify(onBoardData?.hearFrom),
    //   allergies: getIdsFromArry(onBoardData?.allergies, 'id'),
    //   restrictions: getIdsFromArry(onBoardData?.restrictions, 'id'),
    // }),
  };

  return {
    step,
    setStep,
    onBoardData,
    setOnboardData,
    age,
    ageRange,
    onSelectValue,
    sport,
    sports,
    associations,
    association,
    SetAssociation,
    handlePreviousStep,
    handleNextStep: nextStep,
    transport,
  };
};

export default useOnStepScreen;
