/**
 * The function `useOnStepScreen` is a placeholder function that returns an empty object.
 * @returns An empty object is being returned.
 */

import {useState} from 'react';

const useOnStepScreen = ({navigate}) => {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState('');

  const ageRange = Array.from({length: 23}, (_, i) => {
    const age = 18 + i;
    return {label: String(age), value: String(age)};
  });

  const [onBoardData, setOnboardData] = useState({
    purpose: null,
    allergies: [],
    restrictions: [],
    ageRange: null,
    gender: null,
    hearFrom: [],
  });

  return {step, setStep, onBoardData, setOnboardData, age, setAge, ageRange};
};

export default useOnStepScreen;
