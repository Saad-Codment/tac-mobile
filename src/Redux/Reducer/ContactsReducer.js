import {types} from '../types';

const initial_state = {
  contacts: [],
};

const actionMap = {
  [types.addContacts]: (state, act) => {
    return {
      contacts: act.payload,
    };
  },
  [types.ClearContacts]: () => initial_state,
};

export default function (state = initial_state, action) {
  const handler = actionMap[action.type];
  return handler ? handler(state, action) : state;
}
