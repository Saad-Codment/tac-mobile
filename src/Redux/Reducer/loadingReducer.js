import {types} from '../types';

const initial_state = {
  isloading: false,
};
const actionMap = {
  [types.isLoadingTrue]: (state, act) => ({
    ...state.isloading,
    isloading: true,
  }),
  [types.isLoadingFalse]: (state, act) => ({
    ...state.isloading,
    isloading: false,
  }),
};
export default function (state = initial_state, action) {
  const handler = actionMap[action.type];
  return handler ? handler(state, action) : state;
}
