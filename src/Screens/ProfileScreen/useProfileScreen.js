import {useMutation, useQuery} from '@tanstack/react-query';
import API, {formDataFunc} from '../../Utils/helperFunc';
import useReduxStore from '../../Hooks/UseReduxStore';
import {useRef, useState} from 'react';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {logoutService} from '../../Services/AuthServices';
import {logOutAuth, logOutUser} from '../../Redux/Action/AuthAction';
import {
  allAssociatesUrl,
  allEventTypeUrl,
  deleteAccUrl,
  editProfileUrl,
  isPrivateUrl,
} from '../../Utils/Urls';
import {types} from '../../Redux/types';
import {loadingFalse} from '../../Redux/Action/isloadingAction';
import {
  ageIcon,
  assoicationIcon,
  calender,
  eventHistory,
  friendList,
  logout,
  profileIcon,
  racingIcon,
  trashRed,
} from '../../Assets';
import {
  formatDate,
  getIdsFromArry,
  removeUndefined,
} from '../../Services/GlobalFunctions';

const usePorfileScreen = ({navigate, goBack}) => {
  const {dispatch, getState, queryClient} = useReduxStore();
  const {userData} = getState('Auth');
  const {isloading} = getState('isloading');
  const onPressKeyRef = useRef(null);
  console.log('userDatauserDatauserDatauserDatauserData', userData);
  const apiDataType = {
    event_association: {
      queryName: 'allAssociate',
      url: allAssociatesUrl,
    },
    event_type: {
      queryName: 'allEventstype',
      url: allEventTypeUrl,
    },
    null: {
      queryName: 'allEventstype',
      url: allEventTypeUrl,
    },
  };

  const {data, error} = useQuery({
    queryKey: [apiDataType[onPressKeyRef.current ?? 'null']?.queryName],
    queryFn: () => API.get(apiDataType[onPressKeyRef.current ?? 'null'].url),
  });

  const {mutateAsync} = useMutation({
    mutationFn: data => {
      return formDataFunc(editProfileUrl, data, 'profile_image');
    },
    onSuccess: ({ok, data}) => {
      console.log('sldkbvklsdbvklsbdklvbskldbvsdkvbksd', data);
      if (ok) {
        successMessage('Your profile updated sucessfully!');
        if (data.user?.first_name || data?.user?.last_name) {
          dispatch({
            type: types.UpdateProfile,
            payload: data.user,
          });
        }
      } else {
        errorMessage(data?.message);
      }
    },
    onError: ({message}) => {
      errorMessage('Problem occurred while uploading data.');
    },
    retry: true,
  });

  const [alertState, setAlertState] = useState({
    logoutAlert: false,
    deleteAlert: false,
  });

  const {mutate} = useMutation({
    mutationFn: () => API.delete(deleteAccUrl),
    onSuccess: async ({ok, data}) => {
      if (ok) {
        successMessage(data?.message);
        await logoutService();
        dispatch(logOutUser());
        dispatch({
          type: types.restartOnboarding,
        });
      } else errorMessage(data?.message);
    },
    onError: e => errorMessage(e),
  });

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

  const {deleteAlert, logoutAlert} = alertState;

  const updateState = data => setAlertState(prev => ({...prev, ...data}));

  const toggleAlert = state => updateState({[state]: !alertState[state]});

  const dynamicRoute = route => navigate(route);

  const onConfirm = val => {
    if (val == 'logoutAlert') logoutFunc();
    else mutate();
  };

  const logoutFunc = () => {
    toggleAlert(
      (logoutAlert && 'logoutAlert') || (deleteAlert && 'deleteAlert'),
    );
    setTimeout(() => {
      dispatch({
        type: types.restartOnboarding,
      });
      dispatch(logOutAuth());
    }, 900);
  };

  const [modalVal, setModalVal] = useState(false);

  const onOpenModal = key => {
    onPressKeyRef.current = key;
    toggleModal();
  };

  const toggleModal = (modalUpdateData, isSave) => {
    setModalVal(!modalVal);
    console.log(';lsdnvl;sndlvbklsdbvklsdbvsdlkbvnlsd;', modalUpdateData);
    if (isSave) {
      mutateAsync({
        first_name: modalUpdateData?.firstName ?? userData?.first_name,
        last_name: modalUpdateData?.lastName ?? userData?.last_name ?? '',
        state: modalUpdateData?.state?.name ?? userData?.state ?? '',
        city: modalUpdateData?.city?.name ?? userData?.city ?? '',
        age: modalUpdateData?.userAge
          ? formatDate(modalUpdateData?.userAge)
          : userData?.age
          ? userData?.age
          : null,
        gender: modalUpdateData?.userGender?.id ?? userData?.gender ?? '',
        profile_image: modalUpdateData?.profileImg?.type
          ? modalUpdateData?.profileImg
          : null,
        event_type_ids:
          getIdsFromArry(
            removeUndefined(modalUpdateData?.eventType ?? []) ?? [],
            'id',
          ).length == 0
            ? getIdsFromArry(userData?.event_types, 'id')
            : getIdsFromArry(
                removeUndefined(modalUpdateData?.eventType ?? []) ?? [],
                'id',
              ),
        association_ids:
          getIdsFromArry(
            removeUndefined(modalUpdateData?.associations ?? []) ?? [],
            'id',
          ).length == 0
            ? getIdsFromArry(userData?.associations, 'id')
            : getIdsFromArry(
                removeUndefined(modalUpdateData?.associations ?? []) ?? [],
                'id',
              ),
      });
    }
  };

  const activeTags = {
    edit_profile: {
      profileImg: userData?.profile_image,
      firstName: userData?.first_name,
      lastName: userData?.last_name,
    },
    age_view: {age: userData?.age},
    user_gender: {userGender: userData?.gender},
    event_type: {eventTypes: userData?.event_types},
    event_association: {eventAssociations: userData?.associations},
    city: {city: userData?.city},
    state: {state: userData?.state},
  };

  return {
    toggleAlert,
    logoutAlert,
    deleteAlert,
    onConfirm,
    dynamicRoute,
    isloading,
    userData,
    modalVal,
    toggleModal,
    onOpenModal,
    setModalVal,
    activeTags,
    onPressKey: onPressKeyRef.current,
    allData: data?.data,
    justUploadImg: img => {
      console.log('jkldbvkjlsbdklvbskldbvklsdbklvklsd', img);
      mutateAsync({
        profile_image: img,
        first_name: userData?.first_name,
      });
    },
    privateTheProfile: () => {
      isPrivateFun.mutate();
    },
  };
};

export default usePorfileScreen;
