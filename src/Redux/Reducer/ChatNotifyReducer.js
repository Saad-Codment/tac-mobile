import {types} from '../types';

const initial_state = {
  isChatNotify: false,
};
const actionMap = {
  [types.isChatNotifyTrue]: (state, act) => ({
    ...state.isChatNotify,
    isChatNotify: true,
  }),
  [types.isChatNotifyFalse]: (state, act) => ({
    ...state.isChatNotify,
    isChatNotify: false,
  }),
};
export default function (state = initial_state, action) {
  const handler = actionMap[action.type];
  return handler ? handler(state, action) : state;
}
