import {catalogBroucher, msdSheets, sendType} from '../Utils/Urls';

const {default: API} = require('../Utils/helperFunc');

/**
 * The function `getCategoryApi` is an asynchronous function that sends a POST request to an API with a
 * specified title.
 * @returns The `getCategoryApi` function is returning a promise that resolves to the result of the
 * `API.post` method call with the `sendType` and an object containing the `type` property set to the
 * `title` parameter.
 */
const getCategoryApi = async title => {
  return await API.post(sendType, {type: title});
};

/**
 * The function `getmsdsApi` is an asynchronous function that retrieves data from an API endpoint named
 * `msdSheets`.
 * @returns The `getmsdsApi` function is returning the result of calling the `API.get` function with
 * the `msdSheets` parameter.
 */
const getmsdsApi = async title => {
  return await API.get(msdSheets);
};

/**
 * The function `getCatalogApi` is an asynchronous function that retrieves a catalog API based on a
 * given title.
 * @returns The `getCatalogApi` function is returning a promise that resolves to the result of calling
 * the `API.get` function with the `catalogBroucher` parameter.
 */
const getCatalogApi = async title => {
  return await API.get(catalogBroucher);
};

export {getCategoryApi, getmsdsApi, getCatalogApi};
