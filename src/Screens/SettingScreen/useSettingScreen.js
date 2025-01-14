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
import {getIdsFromArry, removeUndefined} from '../../Services/GlobalFunctions';

const SettingScreen = ({navigate, goBack}) => {
  const {dispatch, getState, queryClient} = useReduxStore();
  const {userData} = getState('Auth');
  const {isloading} = getState('isloading');
  const onPressKeyRef = useRef(null);

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
      if (ok) {
        successMessage('Your profile updated sucessfully!');
        dispatch({
          type: types.UpdateProfile,
          payload: data.user,
        });
      } else {
        errorMessage(data?.message);
      }
    },
    onError: ({message}) => {
      errorMessage('Problem occurred while uploading data.');
    },
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
    if (isSave) {
      mutateAsync({
        first_name: modalUpdateData?.firstName ?? userData?.first_name,
        last_name: modalUpdateData?.lastName ?? userData?.last_name,
        age: Number(modalUpdateData?.userAge ?? userData?.age),
        gender: modalUpdateData?.userGender?.id ?? userData?.gender,
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
  };
};

export default SettingScreen;
