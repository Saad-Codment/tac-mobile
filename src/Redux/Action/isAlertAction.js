import {types} from '../types';

export const alertTrue = payload => ({
  type: types.isAlertTrue,
});
export const alertFalse = payload => ({
  type: types.isAlertFalse,
});
