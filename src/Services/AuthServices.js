import auth from '@react-native-firebase/auth';
import {fcmToken, loginUrl, logoutUrl, registerUrl} from '../Utils/Urls';
import API from '../Utils/helperFunc';

/**
 * The function `getFbResult` returns the ID token result of the current user after authentication.
 */
const getFbResult = () => auth().currentUser.getIdTokenResult();

/**
 * The loginService function sends a POST request to the loginUrl with the provided parameter.
 */
const loginService = param => API.post(loginUrl, param);

/**
 * The `registerService` function sends a POST request to a specified URL with the provided parameter.
 */
const registerService = param => API.post(registerUrl, param);

/**
 * The `logoutService` function is an asynchronous function that sends a GET request to the `logoutUrl`
 * using an API.
 */
const logoutService = async () => await API.get(logoutUrl);

/**
 * The function `fcmRegService` is an asynchronous function that posts a FCM token to an API endpoint.
 */
const fcmRegService = async params =>
  await API.post(fcmToken, {fcm_token: params});

/**
 * The function `logOutFirebase` signs out the current user from Firebase authentication.
 */
const logOutFirebase = () => auth().signOut();

export {
  getFbResult,
  loginService,
  logOutFirebase,
  registerService,
  logoutService,
  fcmRegService,
};
