import {useState} from 'react';
import {getFbResult, logOutFirebase} from '../../Services/AuthServices';
import useReduxStore from '../../Hooks/UseReduxStore';
import {loginUser, registerUser} from '../../Redux/Action/AuthAction';

const {default: useFormHook} = require('../../Hooks/UseFormHooks');
const {default: Schemas} = require('../../Utils/Validation');

/**
 * The `useLogin` function is a custom hook in JavaScript that handles user login functionality,
 * including form validation, state management, and navigation.
 * @returns The `useLogin` function is returning an object with the following properties and methods:
 */
const useLogin = ({navigate, goBack}) => {
  const {handleSubmit, errors, reset, control, getValues} = useFormHook(
    Schemas.logIn,
  );
  const {dispatch} = useReduxStore();
  const [remember, setRemember] = useState(true);
  const rememberValue = () => {
    setRemember(!remember);
  };

  const socialLoginFun = type => {
    dispatch(loginUser({type, datas: {}}));
  };

  const onPress = () => navigate('RegisterScreen');

  /**
   * The `loginUserFun` function dispatches an action to register a user with the provided email and
   * password.
   */
  const loginUserFun = ({email, password}) => {
    dispatch(registerUser({datas: {email, password}}));
  };

  return {
    handleSubmit,
    errors,
    reset,
    control,
    getValues,
    PhoneNumberLoginFuc: () => {},
    remember,
    setRemember,
    rememberValue,
    onPress,
    loginUser: loginUserFun,
    socialLoginFun,
  };
};

export default useLogin;
