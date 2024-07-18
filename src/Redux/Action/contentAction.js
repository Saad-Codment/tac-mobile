import {types} from '../types';

export const getCategory = payload => ({
  type: types.trainingCat,
  payload,
});
export const getmsds = () => ({
  type: types.msdsSheet,
});
export const getcatalog = () => ({
  type: types.getcatalogData,
});
