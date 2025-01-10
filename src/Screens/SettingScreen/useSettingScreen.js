import {useMutation, useQuery} from '@tanstack/react-query';
import API, {formDataFunc} from '../../Utils/helperFunc';
import useReduxStore from '../../Hooks/UseReduxStore';
import {useRef, useState} from 'react';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {logoutService} from '../../Services/AuthServices';
import {logOutUser} from '../../Redux/Action/AuthAction';
import {
  allAssociatesUrl,
  allEventTypeUrl,
  editProfileUrl,
} from '../../Utils/Urls';
import {types} from '../../Redux/types';

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

  // const data = queryClient.getQueryData([
  //   apiDataType[onPressKeyRef.current ?? 'null']?.queryName,
  // ]);

  const {data, error} = useQuery({
    queryKey: [apiDataType[onPressKeyRef.current ?? 'null']?.queryName],
    queryFn: () => API.get(apiDataType[onPressKeyRef.current ?? 'null'].url),
  });

  // const data = useQuery({
  //   queryKey: [apiDataType[onPressKeyRef.current ?? 'null']?.queryName],
  // });

  console.log('userDatauserDatauserDatauserData', userData);

  const {mutateAsync} = useMutation({
    mutationFn: data => {
      return formDataFunc(editProfileUrl, data, 'profile_image');
    },
    onSuccess: ({ok, data}) => {
      dispatch(loadingFalse());
      console.log('osdibvklsdbvbsdlvkbsdklsdbvklsd', data);
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
      dispatch(loadingFalse());
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

  // const addTags = (v, key) => {
  //   if (key == 'braid_length' || key == 'braid_size') {
  //     if (Boolean(activeTags[key].find(res => res.id == v.id))) {
  //       updateState({[key]: activeTags[key].filter(res => res.id != v.id)});
  //     } else {
  //       updateState({[key]: [...activeTags[key], v]});
  //     }
  //   } else {
  //     updateState({[key]: v});
  //   }
  // };

  const [modalVal, setModalVal] = useState(false);

  const onOpenModal = key => {
    onPressKeyRef.current = key;
    // setActiveTags(selectedData);
    toggleModal();
  };

  const toggleModal = modalUpdateData => {
    console.log(
      'kjdbvjklsdbkjsbdklbsdlkvbklsbvklds',
      modalUpdateData,
      userData?.age,
    );
    setModalVal(!modalVal);
    mutateAsync({
      first_name: modalUpdateData?.firstName ?? userData?.first_name,
      last_name: modalUpdateData?.lastName ?? userData?.last_name,
      age: Number(modalUpdateData?.userAge ?? userData?.age),
      gender: modalUpdateData?.userGender ?? userData?.gender,
    });
    // if (isSave) {
    // }
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

  console.log('datadatadatadatadatadatadatadatadatadatadata', data?.data);

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
