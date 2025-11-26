import {types} from '../types';

const initial_state = {
  isUpdateNeed: false,
};
const actionMap = {
  [types.isUpdateNeedTrue]: (state, act) => ({
    ...state.isUpdateNeed,
    isUpdateNeed: true,
  }),
  [types.isUpdateNeedFalse]: (state, act) => ({
    ...state.isUpdateNeed,
    isUpdateNeed: false,
  }),
};
export default function (state = initial_state, action) {
  const handler = actionMap[action.type];
  return handler ? handler(state, action) : state;
}
