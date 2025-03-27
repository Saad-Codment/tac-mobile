import {useState, useRef} from 'react';
import {parsePhoneNumberFromString, getExampleNumber} from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';
import {errorMessage} from '../../Config/NotificationMessage';
import useReduxStore from '../../Hooks/UseReduxStore';
import API from '../../Utils/helperFunc';
import {SendVerficatioUrl} from '../../Utils/Urls';
import {useMutation} from '@tanstack/react-query';

const useNumberEditScreen = ({navigate, goBack}) => {
  const {getState} = useReduxStore();
  const {userData} = getState('Auth');
  const isVerified = Boolean(userData?.verified == 1);
  const isNumber = Boolean(
    userData.original_phone == null || userData.original_phone == '',
  );

  const [alert, setAlert] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [maxLength, setMaxLength] = useState(15);
  const [PhoneNumber, setPhoneNumber] = useState({
    countryCode: 'US',
    number: userData?.original_phone || '',
    formattedNumber: userData?.original_phone || '',
    edit: isNumber,
  });

  const {countryCode, number, formattedNumber, edit} = PhoneNumber;
  const phoneInput = useRef(null);

  const updateState = data => setPhoneNumber(prev => ({...prev, ...data}));

  const getCountryMaxLength = countryCode => {
    try {
      const exampleNumber = getExampleNumber(countryCode, examples);
      return exampleNumber?.nationalNumber.length || 15;
    } catch {
      return 15;
    }
  };

  const validatePhoneNumber = (text, countryCode) => {
    const phoneNumber = parsePhoneNumberFromString(text, countryCode);

    if (!text) {
      setValidationError('Phone number is required');
      return false;
    }

    if (!phoneNumber) {
      setValidationError('Invalid phone number format');
      return false;
    }

    if (!phoneNumber.isPossible()) {
      setValidationError('Phone number is not possible for this country');
      return false;
    }

    if (!phoneNumber.isValid()) {
      setValidationError('Please enter a valid phone number');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handlePhoneNumberChange = formattedText => {
    const unformatted = formattedText.replace(/\D/g, '');
    updateState({
      number: unformatted,
      formattedNumber: formattedText,
    });
    validatePhoneNumber(formattedText, countryCode);
  };

  const handleCountryChange = country => {
    const newCountryCode = country.cca2;
    const newMaxLength = getCountryMaxLength(newCountryCode);
    setMaxLength(newMaxLength);
    updateState({countryCode: newCountryCode});
    validatePhoneNumber(formattedNumber, newCountryCode);
  };

  const awaitFunc = () => {
    navigate('VerficationScreen', {
      item: {
        ...userData,
        phone: number,
        original_phone: number,
      },
    });
  };

  const {mutate} = useMutation({
    mutationFn: data => API.post(SendVerficatioUrl, {original_phone: data}),
    onSuccess: ({ok, data}) => {
      ok ? awaitFunc() : errorMessage(data?.message);
    },
    onError: () => errorMessage('Network request failed.'),
  });

  const sendVerficationCode = () => {
    if (edit && number != null && number != '') {
      mutate(number);
    } else if (!edit) {
      mutate(userData.original_phone);
      // navigate('VerficationScreen', {item: userData});
    }
  };

  const skipVerification = () => setAlert(!alert);

  return {
    goBack,
    sendVerficationCode,
    countryCode,
    number,
    formattedNumber,
    updateState,
    edit,
    phoneNumber: userData?.phone,
    skipVerification,
    alert,
    isVerified,
    phoneInput,
    handleCountryChange,
    handlePhoneNumberChange,
    validationError,
    maxLength,
  };
};

export default useNumberEditScreen;
