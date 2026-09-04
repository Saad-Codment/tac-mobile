import {useState} from 'react';
import {Alert} from 'react-native';
import {loginUser} from '../../Redux/Action/AuthAction';
import useReduxStore from '../../Hooks/UseReduxStore';
import {errorMessage} from '../../Config/NotificationMessage';

const {default: useFormHook} = require('../../Hooks/UseFormHooks');
const {default: Schemas} = require('../../Utils/Validation');

// Order to check/focus fields in — should match the order they appear on screen
const FIELD_ORDER = [
  'first_name',
  'last_name',
  'email',
  'password',
  'confirm_password',
];

const useRegister = ({navigate, goBack}) => {
  const {handleSubmit, errors, reset, control, getValues, setFocus} =
    useFormHook(Schemas.signUp);

  const {dispatch} = useReduxStore();
  const [remember, setRemember] = useState(false);
  const rememberValue = () => setRemember(!remember);

  const signUpButton = ({first_name, last_name, email, password}) => {
    dispatch(
      loginUser({
        type: 'email',
        datas: {first_name, email, password, last_name},
      }),
    );
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

  const loginNav = () => navigate('LoginScreen');

  const [policy, setPolicy] = useState(true);
  const PolicyValue = () => setPolicy(!policy);

  const socialLoginFun = type => {
    dispatch(loginUser({type, datas: {}}));
  };

  return {
    handleSubmit,
    errors,
    reset,
    control,
    getValues,
    facebookLoginFunc: () => {},
    googleLoginFunc: () => {},
    PhoneNumberLoginFuc: () => {},
    remember,
    setRemember,
    rememberValue,
    goBack,
    loginNav,
    signUpButton,
    onInvalid,
    PolicyValue,
    policy,
    socialLoginFun,
  };
};

export default useRegister;
