import {useQueryClient} from '@tanstack/react-query';
import {useSelector, useDispatch} from 'react-redux';

const useReduxStore = () => {
  const dispatch = useDispatch();
  const getState = key => useSelector(state => state[key]);
  const queryClient = useQueryClient();
  return {dispatch, getState, queryClient};
};

export default useReduxStore;
