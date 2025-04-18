import {useMutation} from '@tanstack/react-query';
import useReduxStore from '../../Hooks/UseReduxStore';
import {isPrivateUrl} from '../../Utils/Urls';
import API from '../../Utils/helperFunc';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {types} from '../../Redux/types';

const useAccountPrivacyScreen = () => {
  const {dispatch, getState, queryClient} = useReduxStore();
  const {userData} = getState('Auth');
  const isPrivateFun = useMutation({
    mutationFn: () => API.post(isPrivateUrl, {}),
    onSuccess: ({ok, data}) => {
      console.log('skldbvklbsdklvbklsdbvkbsdkvbsdbvklsdbvksd', data);
      if (ok) {
        successMessage(data?.message);
        dispatch({
          type: types.UpdateProfile,
          payload: data.user,
        });
      } else errorMessage(data?.message);
    },
    onError: e => errorMessage(e),
  });
  return {
    userData,
    privateTheProfile: () => {
      isPrivateFun.mutate();
    },
  };
};
export default useAccountPrivacyScreen;
