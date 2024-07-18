import {useForm} from 'react-hook-form';

const useFormHook = Schema => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    clearErrors,
    setValue,
    setError,
    setFocus,
    getValues,
    reset,
    register,
    getFieldState,
    trigger,
    resetField,
    unregister,
    watch,
  } = useForm({
    mode: 'all',
    resolver: Schema,
  });

  return {
    control,
    handleSubmit,
    errors,
    clearErrors,
    setValue,
    setError,
    setFocus,
    getValues,
    reset,
    register,
    getFieldState,
    trigger,
    resetField,
    unregister,
    watch,
  };
};

export default useFormHook;
