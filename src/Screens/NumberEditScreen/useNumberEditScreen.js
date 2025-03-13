import {errorMessage} from '../../Config/NotificationMessage';
import useReduxStore from '../../Hooks/UseReduxStore';
import {useEffect, useState} from 'react';
import API from '../../Utils/helperFunc';
import {SendVerficatioUrl} from '../../Utils/Urls';
import {useMutation} from '@tanstack/react-query';
import {getLastNightDigit, hashPassword} from '../../Services/GlobalFunctions';

const useNumberEditScreen = ({navigate, goBack}) => {
  const {dispatch, getState} = useReduxStore();

  const {userData} = getState('Auth');
  const isVerified = Boolean(userData?.verified == 1);

  const isNumber = Boolean(
    userData.original_phone == null || userData.original_phone == '',
  );

  const [alert, setAlert] = useState(false);

  const [PhoneNumber, setPhoneNumber] = useState({
    countryCode: '',
    number: '',
    edit: isNumber,
  });

  const {countryCode, number, edit} = PhoneNumber;

  const updateState = data => setPhoneNumber(prev => ({...prev, ...data}));

  const awaitFunc = () => {
    navigate('VerficationScreen', {
      item: {
        ...userData,
        phone: number,
        // phone: async () => await hashPassword(getLastNightDigit(number)),
        original_phone: number,
      },
    });
  };

  const {mutate} = useMutation({
    mutationFn: data => {
      return API.post(SendVerficatioUrl, {
        original_phone: data,
      });
    },
    onSuccess: ({ok, data}) => {
      console.log('sjdbvlksbdklbklsdvsd', data);
      if (ok) {
        awaitFunc();
      } else {
        errorMessage(data?.message);
      }
    },
    onError: () => {
      errorMessage('Network request failed.');
    },
  });

  const sendVerficationCode = async () => {
    console.log('js,dbvklsbdlkbdslkbvlksdbklds', number);
    if (edit && number != null && number != '') {
      mutate(number);
    } else if (!edit) {
      mutate(userData.original_phone);
      // navigate('VerficationScreen', {item: userData});
    }
  };

  const skipVerification = () => {
    setAlert(!alert);
  };

  useEffect(() => {
    return () => {
      if (!isVerified) {
        skipVerification();
      }
    };
  }, []);

  return {
    goBack,
    sendVerficationCode,
    countryCode,
    number,
    updateState,
    edit,
    phoneNumber: userData?.phone,
    skipVerification,
    alert,
    isVerified,
  };
};
export default useNumberEditScreen;
