import {loadingFalse, loadingTrue} from '../../Redux/Action/isloadingAction';
import {successMessage, errorMessage} from '../../Config/NotificationMessage';
import useReduxStore from '../../Hooks/UseReduxStore';
import {useRef, useState} from 'react';
import API from '../../Utils/helperFunc';
import {SendVerficatioUrl, verifyNumberUrl} from '../../Utils/Urls';
import {
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {types} from '../../Redux/types';
import {useMutation} from '@tanstack/react-query';
import {getLastNightDigit, hashPassword} from '../../Services/GlobalFunctions';

const {default: useFormHook} = require('../../Hooks/UseFormHooks');
const {default: Schemas} = require('../../Utils/Validation');

const useVerificationScreen = (
  {navigate, goBack, reset, popToTop},
  {params},
) => {
  const refTimer = useRef();
  const {dispatch, getState} = useReduxStore();
  const CELL_COUNT = 6;
  const [value, setValue] = useState('');
  const [isResend, setIsResend] = useState(false);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const timerOnProgressFunc = remainingTimeInSecs => {};

  console.log('jsdbvklsbdklvbsdklbvklsdbvlksdbvs', params.item.original_phone);

  const VerifyCode = async () => {
    let url = verifyNumberUrl + params.item.phone + '/' + value;
    const {ok, data} = await API.get(url);
    if (ok) {
      dispatch({
        type: types.UpdateProfile,
        payload: {...params.item, is_verified: 1},
      });
      successMessage('Your number has been verified');
      popToTop();
    } else {
      console.log('kjdbvjksdbvjksdbjvksdbvj', data);
      errorMessage(data?.message);
    }
  };

  const {mutate} = useMutation({
    mutationFn: data => {
      return API.post(verifyNumberUrl, {
        phone: data,
        code: value,
        original_phone: params.item.original_phone,
      });
    },
    onSuccess: ({ok, data}) => {
      console.log('sjdbvlksbdklbklsdvsd', data);
      if (ok) {
        dispatch({
          type: types.UpdateProfile,
          payload: data?.user,
        });
        successMessage('Your number has been verified');
        popToTop();
        // navigate('VerficationScreen', {item: {...userData, phone: number}});
      } else {
        errorMessage(data?.message);
      }
    },
    onError: () => {
      errorMessage('Network request failed.');
    },
  });

  const {mutateAsync} = useMutation({
    mutationFn: data => {
      return API.post(SendVerficatioUrl, {
        original_phone: params.item.original_phone,
      });
    },
    onSuccess: ({ok, data}) => {
      console.log('sjdbvlksbdklbklsdvsd', data);
      if (ok) {
        successMessage('New OTP has been send your the number.');
      } else {
        errorMessage(data?.message);
      }
    },
    onError: () => {
      errorMessage('Network request failed.');
    },
  });

  const sendVerfication = async num => {
    const {ok, data} = await API.post(SendVerficatioUrl, {original_phone: num});
    if (ok) successMessage('New OTP has been send your the number.');
    else errorMessage('Some error to send OTP!');
  };

  const resendOTP = () => {
    refTimer.current.resetTimer();
    setIsResend(false);
    mutateAsync(params.item.phone);
  };

  const timerCallbackFunc = timerFlag => {
    // Setting timer flag to finished
    setIsResend(true);
    console.warn(
      'You can alert the user by letting him know that Timer is out.',
    );
  };

  function xorEncrypt(input, key) {
    let output = '';
    for (let i = 0; i < input.length; i++) {
      // XOR each character of the input with the corresponding character in the key
      const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      output += String.fromCharCode(charCode);
    }
    return output;
  }

  // Example usage
  const password = 'myPassword123';
  // const key = '2b7e151628aed2a6abf7158809cf4f3c'; // Fixed key
  // const encrypted = xorEncrypt(password, key);

  const key = '2b7e151628aed2a6abf7158809cf4f3c'; // Fixed key

  function hashPassword(password) {
    let output = '';
    console.log('skdjbvjksbdkjlvbksd', password);
    for (let i = 0; i < password.length; i++) {
      // XOR each character of the password with the corresponding character in the key
      const charCode = password.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      console.log('skdjbvjksbdkjlvbkssdsdsdsdd', charCode);
      output += String.fromCharCode(charCode);
    }
    console.log(
      'skdjbvjksbdkjlvbkssasdsdfgdfgdfdfdsdsdsdd',
      JSON.stringify(output),
    );
    // Encode the output in hexadecimal to handle non-printable characters
    // const hashed = Buffer.from(output).toString('hex');
    return {hashed: JSON.stringify(output)};
  }

  return {
    props,
    getCellOnLayoutHandler,
    value,
    setValue,
    ref,
    CELL_COUNT,
    VerifyCode: async () => {
      const getNumber = await getLastNightDigit([params.item.phone]);
      const {hashed} = hashPassword(getNumber[0]);
      // const encrypted = xorEncrypt(getNumber[0], key);
      console.log('slkdvlksbdlkbsldbvksdbvbsdklbvksd', hashed);
      mutate(hashed);
    },
    goBack,
    isResend,
    setIsResend,
    refTimer,
    timerCallbackFunc,
    resendOTP,
    timerOnProgressFunc,
    sendVerfication,
  };
};

export default useVerificationScreen;
