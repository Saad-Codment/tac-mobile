import useReduxStore from '../../Hooks/UseReduxStore';

const useCreatePostScreen = ({navigate}) => {
  const {getState} = useReduxStore();

  const {userData} = getState('Auth');
  return {userData};
};

export default useCreatePostScreen;
