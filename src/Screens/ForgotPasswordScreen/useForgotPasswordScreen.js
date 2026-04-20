import useReduxStore from '../../Hooks/UseReduxStore';
import {forgotPasswordAction} from '../../Redux/Action/AuthAction';

const {default: useFormHook} = require('../../Hooks/UseFormHooks');
const {default: Schemas} = require('../../Utils/Validation');

const useForgotPasswordScreen = ({navigate, goBack}) => {
  const {handleSubmit, errors, reset, control, getValues} = useFormHook(
    Schemas.forgot,
  );
  const {dispatch} = useReduxStore();

  const forgotPassword = ({email}) => {
    dispatch(forgotPasswordAction(email));
  };

  return {
    handleSubmit,
    errors,
    reset,
    control,
    getValues,
    goBack,
    forgotPassword,
  };
};

export default useForgotPasswordScreen;
