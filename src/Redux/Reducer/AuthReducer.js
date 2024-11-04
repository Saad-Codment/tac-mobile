import {types} from '../types';

const initial_state = {
  userData: {},
  token: '',
  isLogin: false,
};

const actionMap = {
  [types.UpdateAuth]: (state, act) => {
    return {
      userData: act.payload.user,
      token: act.payload.token,
      isLogin: true,
    };
  },
  [types.LogoutType]: () => initial_state,
  [types.UpdateProfile]: (state, act) => ({
    ...state,
    userData: act.payload,
  }),
};

export default function (state = initial_state, action) {
  const handler = actionMap[action.type];
  return handler ? handler(state, action) : state;
}
