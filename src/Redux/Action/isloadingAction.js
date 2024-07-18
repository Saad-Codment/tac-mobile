import {types} from '../types';

export const loadingTrue = payload => ({
  type: types.isLoadingTrue,
});
export const loadingFalse = payload => ({
  type: types.isLoadingFalse,
});
