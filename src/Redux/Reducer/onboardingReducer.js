import {types} from '../types';

const initial_state = {
  onboarding: false,
};
const actionMap = {
  [types.onBoardFinished]: (state, act) => ({
    ...state.onboarding,
    onboarding: true,
  }),
  [types.restartOnboarding]: (state, act) => ({
    ...state.onboarding,
    onboarding: false,
  }),
};
export default function (state = initial_state, action) {
  const handler = actionMap[action.type];
  return handler ? handler(state, action) : state;
}
