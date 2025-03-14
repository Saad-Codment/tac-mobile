import {useEffect, useState} from 'react';
import {
  checkContactPer,
  checkContactPermission,
  checkSqlDataBase,
  getContactFromSql,
  sendPhoneBookTOServer,
  sendUpdatedAt,
} from '../../Services/ContactServices';
import useReduxStore from '../../Hooks/UseReduxStore';
import {contactTrue} from '../../Redux/Action/isContactAction';

const useSyncPhonebookScreen = () => {
  const {getState, dispatch} = useReduxStore();

  const {userData} = getState('Auth');
  const {isContact} = getState('isContact');
  const {contacts} = getState('contacts');

  const [isPer, setIsPer] = useState(false);

  const [alertState, setAlertState] = useState(false);

  const toggleAlert = () => setAlertState(!alertState);

  const getUser = () => {
    getContactFromSql();
  };

  const useEffectFuc = async () => {
    getUser();
    sendUpdatedAt();
  };

  // useEffect(useEffectFuc, []);

  function prioritizeInAppContacts() {
    // Filter out contacts with the inApp key and those without it
    const inAppContacts = contacts.filter(contact => contact.inApp);
    const otherContacts = contacts.filter(contact => !contact.inApp);

    // Concatenate the two arrays, putting inApp contacts first
    return {inAppContacts, otherContacts};
  }

  const onConfirm = async () => {
    // toggleAlert();
    if (userData?.isNewUser) {
      await sendPhoneBookTOServer();
      await getContactFromSql();
    } else {
      checkSqlDataBase();
      await getContactFromSql();
    }

    dispatch(contactTrue());
  };

  const onChangeToggle = e => {
    setAlertState(!alertState);
    setTimeout(() => {
      onConfirm();
    }, 1000);
  };

  return {
    isPer,
    onChangeToggle,
    toggleAlert,
    onConfirm,
    alertState,
    isContact,
    prioritizeInAppContacts,
    dispatch,
  };
};

export default useSyncPhonebookScreen;
