import {types} from '../types';

const initial_state = {
  Training: {
    cat: [],
    subCat: [],
  },
  Video: {
    subCat: [],
  },
  msdSheets: [],
  catalog: [],
  salespitch: {
    cat: [],
    subCat: [],
  },
};

const actionMap = {
  [types.updateCat]: (state, act) => ({
    ...state,
    [act.catType]: act.payload,
  }),
  [types.subCat]: (state, act) => ({
    ...state,
    training: {
      cat: [...training.cat],
      subCat: act.payload,
    },
  }),
  //   [types.LogoutType]: () => initial_state,
  //   [types.UpdateProfile]: (state, act) => ({
  //     ...state,
  //     userData: act.payload,
  //   }),
};

export default function (state = initial_state, action) {
  const handler = actionMap[action.type];
  return handler ? handler(state, action) : state;
}
