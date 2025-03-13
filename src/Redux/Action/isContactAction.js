import {types} from '../types';

export const contactTrue = payload => ({
  type: types.isContactTrue,
});
export const contactFalse = payload => ({
  type: types.isContactFalse,
});
