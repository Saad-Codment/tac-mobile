import {types} from '../types';

const initial_state = {
  isVideo: false,
};
const actionMap = {
  [types.isVideo]: (state, act) => ({
    ...state.isVideo,
    isVideo: act.payload,
  }),
};
export default function (state = initial_state, action) {
  const handler = actionMap[action.type];
  return handler ? handler(state, action) : state;
}
