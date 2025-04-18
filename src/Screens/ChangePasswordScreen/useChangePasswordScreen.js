import {useState} from 'react';
import {loadingFalse, loadingTrue} from '../../Redux/Action/isloadingAction';
import useReduxStore from '../../Hooks/UseReduxStore';
import {firebase} from '@react-native-firebase/auth';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';

const {default: useFormHook} = require('../../Hooks/UseFormHooks');
const {default: Schemas} = require('../../Utils/Validation');

const useChangePasswordScreen = ({navigate, goBack}) => {
  const {handleSubmit, errors, reset, control, getValues} = useFormHook(
    Schemas.newPassword,
  );

  const {dispatch} = useReduxStore();
  const changePassword = async currentPassword => {
    dispatch(loadingTrue());
    const {password, new_password, confirm_password} = currentPassword;
    if (password != new_password) {
      console.log(password, new_password, confirm_password, 'asasadasd');
      var user = firebase.auth().currentUser;
      try {
        const reauthenticate = password => {
          // Pass only the password as an argument
          var crd = firebase.auth.EmailAuthProvider.credential(
            user.email,
            password,
          );
          console.log('credential:', crd);
          return user.reauthenticateWithCredential(crd);
        };
        await reauthenticate(password); // Pass only the password
        await user.updatePassword(confirm_password);
        successMessage('Your password has been changed');
        goBack();
      } catch (error) {
        console.log('error:', error);
        errorMessage('Current password is wrong');
      } finally {
        dispatch(loadingFalse());
      }
    } else {
      dispatch(loadingFalse());
      errorMessage('New password must be different from old password');
    }
  };

  return {
    handleSubmit,
    errors,
    reset,
    control,
    getValues,
    goBack,
    changePassword,
  };
};

export default useChangePasswordScreen;
