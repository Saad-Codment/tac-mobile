import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';
import AuthReducer from './AuthReducer';
import loadingReducer from './loadingReducer';
import onboardingReducer from './onboardingReducer';
import createSagaMiddleware from 'redux-saga';
import mySaga from '../Sagas/index';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import AlertReucer from './AlertReucer';
import getTrainingCatReducer from './getTrainingCatReducer';
import videoReducer from './videoReducer';

const sagaMiddleware = createSagaMiddleware();

const onBoardPersistConfig = {
  key: 'onboarding',
  storage: AsyncStorage,
  whitelist: 'onboarding',
};

const AuthPersistConfig = {
  key: 'Auth',
  storage: AsyncStorage,
  whitelist: ['userData', 'token', 'isLogin'],
};
const VideoPersistConfig = {
  key: 'isVideo',
  storage: AsyncStorage,
  whitelist: 'isVideo',
};

const reducers = {
  onboarding: persistReducer(onBoardPersistConfig, onboardingReducer),
  Auth: persistReducer(AuthPersistConfig, AuthReducer),
  isVideo: persistReducer(VideoPersistConfig, videoReducer),
  isloading: loadingReducer,
  isAlert: AlertReucer,
  getCategory: getTrainingCatReducer,
};

export const store = createStore(
  combineReducers(reducers),
  applyMiddleware(sagaMiddleware),
);

export const persistor = persistStore(store);
// then run the saga
sagaMiddleware.run(mySaga);
