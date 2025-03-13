import {types} from '../types';

const initial_state = {
  isContact: false,
};
const actionMap = {
  [types.isContactTrue]: (state, act) => ({
    ...state.isContact,
    isContact: true,
  }),
  [types.isContactFalse]: (state, act) => ({
    ...state.isContact,
    isContact: false,
  }),
};
export default function (state = initial_state, action) {
  const handler = actionMap[action.type];
  return handler ? handler(state, action) : state;
}
