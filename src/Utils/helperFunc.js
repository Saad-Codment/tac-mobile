import {create} from 'apisauce';
import {
  GetChatListUrl,
  SendChatNotificationUrl,
  VerifyUserUrl,
  baseURL,
  checkVersionUrl,
  fcmTokenUrl,
  homeSuggestedFriendsUrl,
  likeUnlikeUrl,
  postLikeUrl,
  sendMsgUrl,
} from './Urls';
import {store} from '../Redux/Reducer';
import {loadingFalse, loadingTrue} from '../Redux/Action/isloadingAction';
import {Platform} from 'react-native';
import {logOutUser} from '../Redux/Action/AuthAction';
import {types} from '../Redux/types';
import {logOutFirebase, logoutService} from '../Services/AuthServices';
import {getFileNameFromURL} from '../Services/GlobalFunctions';
import Purchases from 'react-native-purchases';
import {allSubID} from './localDB';
import RNFS from 'react-native-fs';

const API = create({
  baseURL,
  // timeout: 15000,
  //   timeoutErrorMessage: 'Please try Again...',
});

const hideLoaderAPIs = [
  VerifyUserUrl,
  fcmTokenUrl,
  likeUnlikeUrl,
  postLikeUrl,
  homeSuggestedFriendsUrl,
  SendChatNotificationUrl,
  sendMsgUrl,
  GetChatListUrl,
  checkVersionUrl,
];
// const hideLoaderAPIs = ['/playcount', '/playlist', '/home-content'];

API.addRequestTransform(config => {
  console.log('kslbdvklsbdkvbksdlnlksdbvsd', config.url);
  if (!hideLoaderAPIs.includes(config.url)) store.dispatch(loadingTrue());
  const {Auth} = store.getState();
  config.headers = {
    Authorization: `Bearer ${Auth.token}`,
  };
  return config;
});

API.addResponseTransform(response => {
  setTimeout(() => store.dispatch(loadingFalse()), 500);
  const {Auth} = store.getState();
  console.log('token111', Auth.token, response?.originalError?.message);
  if (
    response?.originalError?.message == 'Request failed with status code 401' &&
    Auth.token != ''
  )
    store.dispatch(logOutUser());

  return response;
});

const {get} = API;

//^ altering the get()
API.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);
  // if (response.ok) {
  return response;
  // }
};

// const formDataFunc = (url, body) => {
//   const {Auth} = store.getState();

//   var myHeaders = new Headers();
//   myHeaders.append('Accept', 'application/json');
//   myHeaders.append('Authorization', `Bearer ${Auth.token}`);
//   myHeaders.append('Content-Type', 'multipart/form-data');

//   // const formData = new FormData();
//   // Object.entries(body).forEach(([key, val]) => {
//   //   if (key === 'photos' && Array.isArray(val)) {
//   //     val.forEach((res, index) => {
//   //       formData.append(`photos`, {
//   //         name: res?.fileName,
//   //         type: res?.type,
//   //         uri:
//   //           Platform.OS == 'ios' ? res?.uri.replace('file://', '') : res?.uri,
//   //       });
//   //     });
//   //   } else {
//   //     formData.append(key, val);
//   //   }
//   // });
//   var requestOptions = {
//     method: 'POST',
//     headers: myHeaders,
//     body: body,
//     redirect: 'follow',
//   };

//   return fetch(url, requestOptions)
//     .then(res => res.json())
//     .then(res => res)
//     .catch(err => err);
// };

// export {formDataFunc};

const fetchPostWithToken = (url, body, isFormData, imageKey, isArray) => {
  const {Auth} = store.getState('Auth');
  const fullUrl = baseURL + url;
  store.dispatch(loadingTrue());
  console.log(
    'Auth Token',
    createFormData(body, imageKey, isArray)?.getAll(),
    createFormData(body, imageKey, isArray)?.getParts(),
    isFormData,
  );

  var requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type':
        isFormData == true ? 'multipart/form-data' : 'application/json',
      Authorization: `Bearer ${Auth.token}`,
    },
    body:
      isFormData == true
        ? createFormData(body, imageKey, isArray)
        : JSON.stringify(body),
    redirect: 'follow',
  };

  return fetch(fullUrl, requestOptions)
    .then(response => {
      if (!response.ok) {
        return {ok: false, res: response}; // Return the response data
      } else {
        return response.json();
      }
    })
    .then(response => {
      console.log('response1', response);
      return {ok: response?.ok ?? true, res: response}; // Return the response data
    })
    .catch(error => {
      console.error('error1', error);
      throw {ok: false, res: error}; // Re-throw the error to propagate it to the caller
    });
};

const createFormData = (photos, imageKey, isArray) => {
  console.log(photos, isArray, 'oekleiaaake');
  const data = new FormData();

  Object.entries(photos).forEach(([key, val]) => {
    console.log(
      'oisdhviosbdoivbosidbvoisdbiovbsiodbvoisdfdfdfddbivosbdovbsdiovboisd',
    );
    isArray
      ? data.append(imageKey, {
          name: val?.fileName,
          type: val?.type,
          uri:
            Platform.OS == 'ios' ? val?.uri.replace('file://', '') : val?.uri,
        })
      : data.append(imageKey, {
          name: photos[imageKey]?.fileName,
          type: photos[imageKey]?.type,
          uri:
            Platform.OS == 'ios'
              ? photos[imageKey]?.uri.replace('file://', '')
              : photos[imageKey]?.uri,
        });
    // } else {
    //   data.append(key, val);
    // }
  });

  console.log('sdkljbvkjlsdbvkljbsdkjvbsdkbvjsdv', data);

  // Object.keys(body).forEach(key => {
  //   console.log({body}, 'dldldlq');
  //   data.append(key, body[key]);
  // });

  return data;
};

const getUserDataFromRevenewCat = async () => {
  return await Purchases.getCustomerInfo();
};

const fetchGetWithToken = async (url, isUpdate) => {
  const {Auth} = store.getState('Auth');
  const fullUrl = baseURL + url;
  // console.log(Auth.token, Auth.userData, 'Auth Token', fullUrl);

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.token}`, // Assuming a Bearer token authentication
        // Add other headers if needed
      },
    });

    if (!response.ok) {
      store.dispatch({type: types.LogoutType});
      throw new Error('Network response was not ok.');
    } else if (response.ok) {
      const data = await response.json();
      if (data?.user) {
        const getData = await getUserDataFromRevenewCat();
        const activeSubscriptions =
          getData.entitlements.active['Tac subscription group'] ?? undefined;
        if (activeSubscriptions != undefined) {
          store.dispatch({
            type: types.UpdateProfile,
            payload: {
              ...data,
              planName:
                allSubID[activeSubscriptions?.productIdentifier] ?? null,
              identifier: activeSubscriptions?.productIdentifier,
            },
          });
        }
        store.dispatch({
          type: types.UpdateProfile,
          payload: data?.user,
        });
      }

      // console.log(data, 'alskdjfklajsdfkljadlsfjaklsdjfl2kds444ajf2lkdjs');

      return data; // Return the fetched data
    }
  } catch (error) {
    store.dispatch({type: types.LogoutType});
    console.error('Error fetching data:', error);
    throw error; // Rethrow the error to handle it at the caller's level if needed
  }
  //
  // store.dispatch({type: types.LogoutType});
};

// Helper function to convert image to PNG
// const convertToPNG = async (imageUri) => {
//   try {
//     // Extract file extension
//     const fileExt = imageUri.split('.').pop().toLowerCase();

//     // If already PNG, return original
//     if (fileExt === 'png') return imageUri;

//     // Generate new filename with .png extension
//     const newPath = `${RNFS.TemporaryDirectoryPath}/${Date.now()}.png`;

//     // Read the original file
//     const base64Data = await RNFS.readFile(imageUri, 'base64');

//     // Write as PNG (this is a simplified approach)
//     await RNFS.writeFile(newPath, base64Data, 'base64');

//     return newPath;
//   } catch (error) {
//     console.error('Image conversion error:', error);
//     return imageUri; // Fallback to original if conversion fails
//   }
// };

const formDataFunc = async (url, body, imageKey, isArray, inewArryKey) => {
  const {Auth} = store.getState();
  store.dispatch(loadingTrue());

  // Helper function to convert image to PNG
  const convertToPNG = async imageUri => {
    try {
      // Extract file extension
      const fileExt = imageUri.split('.').pop().toLowerCase();

      // If already PNG, return original
      if (fileExt === 'png') return imageUri;

      // Generate new filename with .png extension
      const newPath = `${RNFS.TemporaryDirectoryPath}/${Date.now()}.png`;

      // Read the original file
      const base64Data = await RNFS.readFile(imageUri, 'base64');

      // Write as PNG (this is a simplified approach)
      await RNFS.writeFile(newPath, base64Data, 'base64');

      return newPath;
    } catch (error) {
      console.error('Image conversion error:', error);
      return imageUri; // Fallback to original if conversion fails
    }
  };

  const myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Authorization', `Bearer ${Auth.token}`);

  const formData = new FormData();

  // Handle image conversion and form data preparation
  if (isArray && body[imageKey]?.length > 0) {
    for (const [index, value] of body[imageKey].entries()) {
      if (value?.uri) {
        const pngUri = await convertToPNG(value.uri);
        formData.append(`${imageKey}[${index}]`, {
          uri: Platform.OS == 'ios' ? pngUri : value.uri,
          type: 'image/png', // Force PNG type
          name: value.name || `image_${index}.png`,
        });
      }
    }
  } else if (body[imageKey]?.uri) {
    const pngUri = await convertToPNG(body[imageKey].uri);
    formData.append(imageKey, {
      uri: Platform.OS == 'ios' ? pngUri : body[imageKey].uri,
      type: 'image/png', // Force PNG type
      name: body[imageKey].name || 'image.png',
    });
  }

  if (inewArryKey && body[inewArryKey].length > 0) {
    body[inewArryKey].map((performance, index) => {
      formData.append(`performances[${index}][title]`, performance.title || '');
      formData.append(`performances[${index}][date]`, performance.date || '');
      formData.append(
        `performances[${index}][start_time]`,
        performance.start_time || '',
      );
      formData.append(
        `performances[${index}][end_time]`,
        performance.end_time || '',
      );
    });
  }

  // Add other fields
  Object.entries(body).forEach(([key, value]) => {
    if (key !== imageKey) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, value);
      }
    }
  });
  console.log('lksdnvklsdnklvndsklvskdlvnkldvs', JSON.stringify(formData));
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formData,
  };

  try {
    const response = await fetch(baseURL + url, requestOptions);
    const data = await response.json();
    store.dispatch(loadingFalse());
    return {data, ok: !data?.errors};
  } catch (error) {
    console.error('API Error:', error);
    store.dispatch(loadingFalse());
    return {data: error, ok: false};
  }
};

export {formDataFunc, fetchPostWithToken, fetchGetWithToken};

export default API;
