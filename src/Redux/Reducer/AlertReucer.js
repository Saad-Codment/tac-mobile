import {types} from '../types';

const initial_state = {
  isAlert: false,
};
const actionMap = {
  [types.isAlertTrue]: (state, act) => ({
    ...state.isAlert,
    isAlert: true,
  }),
  [types.isAlertFalse]: (state, act) => ({
    ...state.isAlert,
    isAlert: false,
  }),
};
export default function (state = initial_state, action) {
  const handler = actionMap[action.type];
  return handler ? handler(state, action) : state;
}
