const getCredentials = () => {
  if (__DEV__)
    return {
      baseURL: 'https://virtualrealitycreators.com/tac-backend/api',
      imageURL: 'https://virtualrealitycreators.com/tieGuy-bakend/storage/',
    };
  else {
    console.log = () => {};
    return {
      baseURL: 'https://virtualrealitycreators.com/tac-backend/api',
      imageURL: 'https://virtualrealitycreators.com/tieGuy-bakend/storage/',
    };
  }
};

export const {baseURL, imageURL} = getCredentials();

export const apendUrl = url => {
  return baseURL + url;
};
export const imageUrl = url => {
  console.log(url, 'sdfksdfl;jlsdkj');
  return url ? imageURL + url : '';
  // : 'https://res.cloudinary.com/dd6tdswt5/image/upload/v1684830799/UserImages/mhysa2zj0sbmvnw69b35.jpg';
};

export const MapAPIKey = 'AIzaSyAu-nEBbiOahfUyeMc8Lc1gTTKfete_wnQ';

export const registerUrl = '/signup';
export const loginUrl = '/login';
export const VerifyUserUrl = '/verify';
export const allAssociatesUrl = '/setup/associations';
export const allEventTypeUrl = '/setup/event-types';
export const onBoardConpleteUrl = '/on-board';
export const allEventCircuitUrl = 'setup/circuits';
export const createEventUrl = '/events/store';

export const logoutUrl = 'auth/logout';
