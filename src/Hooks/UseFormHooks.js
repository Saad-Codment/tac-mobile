import {useForm} from 'react-hook-form';

const useFormHook = (Schema, defaultValues) => {
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
    defaultValues,
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
