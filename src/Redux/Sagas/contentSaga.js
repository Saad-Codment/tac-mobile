const {put, call, takeLatest} = require('redux-saga/effects');
const {loadingTrue, loadingFalse} = require('../Action/isloadingAction');
const {errorMessage} = require('../../Config/NotificationMessage');
const {
  getCategoryApi,
  getmsdsApi,
  getCatalogApi,
} = require('../../Services/contentServices');
const {types} = require('../types');
const dataType = {
  Training: 'Training',
  Video: 'Video',
  msdSheets: 'msdSheets',
  catalog: 'catalog',
  salespitch: 'salespitch',
};

/* The `getTrainingData` function is a generator function used in a Redux Saga to handle asynchronous
actions related to fetching training data. Here is a breakdown of what it does: */
const getTrainingData = function* ({payload}) {
  yield put(loadingTrue());
  try {
    const {ok, data} = yield call(getCategoryApi, dataType[payload]);
    // console.log('dta', data, 'type', dataType[payload], 'pay0', payload);
    if (ok) {
      yield put({
        type: types.updateCat,
        catType: dataType[payload],
        payload: data,
      });
    }
  } catch (error) {
    errorMessage(error.message.split(' ').slice(1).join(' ') ?? error);
    // console.log('err', error);
  } finally {
    yield put(loadingFalse());
  }
};

/* The `getmsdsData` function is a generator function used in a Redux Saga to handle asynchronous
actions related to fetching MSDS (Material Safety Data Sheets) data. Here is a breakdown of what it
does: */
const getmsdsData = function* ({payload}) {
  yield put(loadingTrue());
  try {
    const {ok, data} = yield call(getmsdsApi);
    if (ok) {
      yield put({
        type: types.updateCat,
        catType: 'msdSheets',
        payload: data?.all_msds,
      });
    }
  } catch (error) {
    errorMessage(error.message.split(' ').slice(1).join(' ') ?? error);
    console.log('err', error);
  } finally {
    yield put(loadingFalse());
  }
};

/* The `getcatalogData` function is a generator function used in a Redux Saga to handle asynchronous
actions related to fetching catalog data. Here is a breakdown of what it does: */
const getcatalogData = function* ({payload}) {
  yield put(loadingTrue());
  try {
    const {ok, data} = yield call(getCatalogApi);
    if (ok) {
      yield put({
        type: types.updateCat,
        catType: 'catalog',
        payload: data?.all_catalogs,
      });
    }
  } catch (error) {
    errorMessage(error.message.split(' ').slice(1).join(' ') ?? error);
    console.log('err', error);
  } finally {
    yield put(loadingFalse());
  }
};

function* contentSaga() {
  yield takeLatest(types.trainingCat, getTrainingData);
  yield takeLatest(types.msdsSheet, getmsdsData);
  yield takeLatest(types.getcatalogData, getcatalogData);
}

export default contentSaga;
