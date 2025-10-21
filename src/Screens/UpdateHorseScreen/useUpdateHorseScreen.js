import {useMutation, useQuery} from '@tanstack/react-query';
import {getTransportUrl, updateTransportUrl} from '../../Utils/Urls';
import API from '../../Utils/helperFunc';
import useReduxStore from '../../Hooks/UseReduxStore';
import {useState} from 'react';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {types} from '../../Redux/types';

const useUpdateHorseScreen = () => {
  const {getState, dispatch} = useReduxStore();

  const {userData} = getState('Auth');

  const [selectedVal, setSelectedVal] = useState(userData?.transport);
  const {data, refetch} = useQuery({
    queryKey: ['getTransportUrl'],
    queryFn: () => API.get(getTransportUrl),
  });

  const {mutateAsync} = useMutation({
    mutationFn: data => {
      return API.post(updateTransportUrl, {
        transport_id: selectedVal?.id,
      });
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        dispatch({
          type: types.UpdateProfile,
          payload: data.user,
        });
        successMessage(data?.message || 'Transport Updated.');
      } else {
        errorMessage(data?.message);
      }
    },
    onError: ({message}) => {
      errorMessage('Problem occurred while uploading data.');
    },
  });

  return {
    allTransportData: data?.data,
    refetchAllTransportData: refetch,
    selectedVal,
    setSelectedVal,
    updateTransport: mutateAsync,
  };
};

export default useUpdateHorseScreen;
