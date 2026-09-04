import {useState} from 'react';
import {Alert} from 'react-native';
import {getFbResult, logOutFirebase} from '../../Services/AuthServices';
import useReduxStore from '../../Hooks/UseReduxStore';
import {loginUser, registerUser} from '../../Redux/Action/AuthAction';

const {default: useFormHook} = require('../../Hooks/UseFormHooks');
const {default: Schemas} = require('../../Utils/Validation');

const FIELD_ORDER = ['email', 'password'];

const useLogin = ({navigate, goBack}) => {
  const {handleSubmit, errors, reset, control, getValues, setFocus} =
    useFormHook(Schemas.logIn);

  const {dispatch} = useReduxStore();
  const [remember, setRemember] = useState(true);
  const rememberValue = () => {
    setRemember(!remember);
  };

  const socialLoginFun = type => {
    dispatch(loginUser({type, datas: {}}));
  };

  const onPress = () => navigate('RegisterScreen');

  const loginUserFun = ({email, password}) => {
    dispatch(registerUser({datas: {email, password}}));
  };

  // Called automatically by RHF's handleSubmit when validation fails
  const onInvalid = invalidFields => {
    const firstErrorField = FIELD_ORDER.find(field => invalidFields[field]);
    if (!firstErrorField) return;

    const message =
      invalidFields[firstErrorField]?.message || 'This field is invalid';

    Alert.alert('Invalid Field', message, [
      {
        text: 'OK',
        onPress: () => setFocus(firstErrorField),
      },
    ]);
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
    onInvalid,
    socialLoginFun,
  };
};

export default useLogin;
