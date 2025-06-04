import {types} from '../types';

const initial_state = {
  isNotification: false,
};
const actionMap = {
  [types.isNotifyTrue]: (state, act) => ({
    ...state.isNotification,
    isNotification: true,
  }),
  [types.isNotifyFalse]: (state, act) => ({
    ...state.isNotification,
    isNotification: false,
  }),
};
export default function (state = initial_state, action) {
  const handler = actionMap[action.type];
  return handler ? handler(state, action) : state;
}
