import {useMutation, useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {contactFormUrl, getInquiryUrl} from '../../Utils/Urls';
import {useState} from 'react';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {set} from 'react-hook-form';

const useContactUsScreen = () => {
  const {data} = useQuery({
    queryKey: ['inquiry'],
    queryFn: () => API.get(getInquiryUrl),
  });

  const [selectedVal, setSelectedVal] = useState(null);
  const [message, setMessage] = useState('');

  const {mutate} = useMutation({
    mutationFn: () =>
      API.post(contactFormUrl, {
        inquiry_term_id: selectedVal?.id,
        message,
      }),
    onSuccess: ({ok, data}) => {
      if (ok) {
        setMessage('');
        setSelectedVal(null);
        successMessage(data?.message);
      } else {
        errorMessage(data?.message);
      }
    },
    onError: () => {
      errorMessage('Network request failed.');
    },
  });
  return {
    reasonList: data?.data,
    selectedVal,
    setSelectedVal,
    message,
    setMessage,
    submitContactForm: mutate,
  };
};
export default useContactUsScreen;
