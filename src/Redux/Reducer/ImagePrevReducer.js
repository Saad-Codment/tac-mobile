import {types} from '../types';

const initial_state = {
  image: '',
  modalType: false,
};

const actionMap = {
  [types.openModal]: (state, act) => {
    return {
      image: act.payload,
      modalType: true,
    };
  },
  [types.closeModal]: () => initial_state,
};

export default function (state = initial_state, action) {
  const handler = actionMap[action.type];
  return handler ? handler(state, action) : state;
}
