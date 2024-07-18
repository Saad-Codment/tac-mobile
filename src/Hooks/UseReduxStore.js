import {useSelector, useDispatch} from 'react-redux';

const useReduxStore = () => {
  const dispatch = useDispatch();
  const getState = key => useSelector(state => state[key]);
  return {dispatch, getState};
};

export default useReduxStore;
