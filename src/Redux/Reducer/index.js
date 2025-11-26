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
import ContactsReducer from './ContactsReducer';
import IsContactAllow from './IsContactAllow';
import ImagePrevReducer from './ImagePrevReducer';
import NotificationReducer from './NotificationReducer';
import ChatNotifyReducer from './ChatNotifyReducer';
import CheckVersionReducer from './CheckVersionReducer';

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
const ContactPerConfig = {
  key: 'isContact',
  storage: AsyncStorage,
  whitelist: 'isContact',
};
const NotificationConfig = {
  key: 'isNotification',
  storage: AsyncStorage,
  whitelist: 'isNotification',
};
const ChatNotifyConfig = {
  key: 'isChatNotify',
  storage: AsyncStorage,
  whitelist: 'isChatNotify',
};

const reducers = {
  onboarding: persistReducer(onBoardPersistConfig, onboardingReducer),
  Auth: persistReducer(AuthPersistConfig, AuthReducer),
  isVideo: persistReducer(VideoPersistConfig, videoReducer),
  isContact: persistReducer(ContactPerConfig, IsContactAllow),
  isNotification: persistReducer(NotificationConfig, NotificationReducer),
  isChatNotify: persistReducer(ChatNotifyConfig, ChatNotifyReducer),
  isloading: loadingReducer,
  isAlert: AlertReucer,
  isUpdateNeed: CheckVersionReducer,
  getCategory: getTrainingCatReducer,
  contacts: ContactsReducer,
  modalState: ImagePrevReducer,
};

export const store = createStore(
  combineReducers(reducers),
  applyMiddleware(sagaMiddleware),
);

export const persistor = persistStore(store);
// then run the saga
sagaMiddleware.run(mySaga);
