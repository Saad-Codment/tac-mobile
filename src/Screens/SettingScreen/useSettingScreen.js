import {useMutation} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import useReduxStore from '../../Hooks/UseReduxStore';
import {useRef, useState} from 'react';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {logoutService} from '../../Services/AuthServices';
import {logOutUser} from '../../Redux/Action/AuthAction';

const SettingScreen = ({navigate}) => {
  const {dispatch, getState} = useReduxStore();
  const {userData} = getState('Auth');
  const {isloading} = getState('isloading');

  console.log('userDatauserDatauserDatauserData', userData);

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

  const onPressKeyRef = useRef(null);

  const onOpenModal = key => {
    onPressKeyRef.current = key;
    // setActiveTags(selectedData);
    toggleModal();
  };

  const toggleModal = isSave => {
    setModalVal(!modalVal);
    if (isSave) {
      //   mutate({
      //     type: 'type',
      //     size: 'size',
      //     length: 'length',
      //     type_ids: getIdsFromObj(braid_type, 'id'),
      //     size_ids: getIdsFromObj(braid_size, 'id'),
      //     length_ids: getIdsFromObj(braid_length, 'id'),
      //   });
    }
  };

  const activeTags = {
    edit_profile: {
      profileImg: userData?.profile_image,
      firstName: userData?.first_name,
      lastName: userData?.last_name,
    },
    age_view: {age: userData?.age},
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
  };
};

export default SettingScreen;
