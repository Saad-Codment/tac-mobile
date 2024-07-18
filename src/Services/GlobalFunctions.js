import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import Geolocationios from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
  request,
} from 'react-native-permissions';
import {store} from '../Redux/Reducer';
import {loadingFalse, loadingTrue} from '../Redux/Action/isloadingAction';
import {errorMessage} from '../Config/NotificationMessage';
import {MapAPIKey} from '../Utils/Urls';

const getSingleCharacter = text => {
  let letter = text?.charAt(0).toUpperCase();
  return letter;
};

const reqPer = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  );
  return granted;
};

const checkPer = async () => {
  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      // ||
      // PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION ||
      // PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    );
    console.log('grantedgrantedgrantedgrantedgrantedgrantedgranted', granted);
    return granted == PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.error('Permission check failed:', err);
    return false;
  }
};

// const getProperLocation = () => {
//   Geolocation.setRNConfiguration({
//     config: {
//       skipPermissionRequests: false,
//       authorizationLevel: 'always' | 'whenInUse' | 'auto',
//       enableBackgroundLocationUpdates: true,
//       locationProvider: 'playServices' | 'android' | 'auto',
//     },
//   });

// return new Promise(async (resolve, reject) => {
//   try {
//     // Function to get current position and location name
//     const getCurrentPosition = async geolocationFunction => {
//       return new Promise((resolve, reject) => {
//         geolocationFunction(
//           async info => {
//             const locationName = await getLocationName(
//               info.coords.latitude,
//               info.coords.longitude,
//             );
//             resolve({
//               coords: {
//                 lat: info.coords.latitude,
//                 long: info.coords.longitude,
//               },
//               description: locationName || 'Unknown location',
//               ok: true,
//             });
//           },
//           error => {
//             errorMessage('Please enable your mobile location');
//             reject({error, ok: false});
//           },
//           {enableHighAccuracy: true, accuracy: true},
//         );
//       });
//     };

//       // Request permission for Android
//       if (Platform.OS === 'android') {
//         const granted = await reqPer();
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           return Alert.alert(
//             'Warning',
//             'Location permission have been denied. Please enable location permission from settings.',
//             [
//               {text: 'Cancel', onPress: () => null, style: 'cancel'},
//               {
//                 text: 'Open Setting',
//                 onPress: () => {
//                   openSettings().catch(() =>
//                     console.warn('Cannot open settings'),
//                   );
//                 },
//               },
//             ],
//             {userInterfaceStyle: 'light'},
//           );
//         }
//       }

//       // Get location based on platform
//       const position = await (Platform.OS === 'android'
//         ? getCurrentPosition(Geolocation.getCurrentPosition)
//         : getCurrentPosition(Geolocationios.getCurrentPosition));

//       resolve(position);
//     } catch (error) {
//       console.error('Error getting location:', error);
//       store.dispatch(loadingFalse());
//       reject(error);
//     }
//   });
// };

// Function to check location permission
const checkLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    return permissionStatus === RESULTS.GRANTED;
  } else {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted;
  }
};

// Function to request location permission
const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const permissionStatus = await request(
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    );
    return permissionStatus === RESULTS.GRANTED;
  } else {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
};

// Function to get current location
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async position => {
        const locationName = await getLocationName(
          position.coords.latitude,
          position.coords.longitude,
        );
        resolve({
          coords: {
            lat: position.coords.latitude,
            long: position.coords.longitude,
          },
          description: locationName || 'Unknown location',
          ok: true,
        });
      },
      error => {
        reject(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
};

const getProperLocation = async () => {
  const hasPermission = await checkLocationPermission();
  if (hasPermission) {
    const position = await getCurrentLocation();
    return {location: position, ok: true};
  } else {
    const permissionGranted = await requestLocationPermission();
    if (permissionGranted) {
      const position = await getCurrentLocation();
      return position;
    } else {
      Alert.alert(
        'Permission Denied',
        'Location permission is required to use this feature',
        [{text: 'OK'}],
      );
      return {location: {}, ok: false};
    }
  }
};

const getLocationName = async (latitude, longitude) => {
  console.log('third');

  const geocodingAPI = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MapAPIKey}`;

  // Replace "YOUR_API_KEY" with your actual Google Maps Geocoding API key

  const res = await fetch(geocodingAPI);
  const response = await res.json();
  if (response.results.length > 0) {
    const locationName = response.results[0].formatted_address;
    return locationName;
  }
};

function extractTimeFromString(str) {
  const timeRegex = /(\d{1,2}:\d{2}\s*[AP]M)/i; // Regular expression to match time in format "hh:mm AM/PM"
  const match = str.match(timeRegex);

  if (match) {
    return match[1]; // Extracting the matched time
  } else {
    return '';
  }
}

function removeTimeFromDate(datetimeStr) {
  // input value ""2024-03-12T08:00:15.000000Z""
  // output value "2024-03-12"

  const dateInString = datetimeStr.toISOString();

  // Split the string at 'T' and take the first part (the date)
  const datePart = dateInString.split('T')[0];
  return datePart;
}

function getDateMonthYear(dateString) {
  const dateParts = dateString.split('-'); // Splitting the date string by '-'
  const year = dateParts[0];
  const monthNumber = parseInt(dateParts[1], 10); // Parsing month number to integer
  const day = dateParts[2];

  // Array of English month names
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Getting English month name using the month number
  const monthName = monthNames[monthNumber - 1];

  return {
    day,
    monthName,
    year,
  };
}

const openGoogleMaps = (latitude, longitude) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  Linking.openURL(url);
};

const fetchRailwayCrossingAPI = async (lat, long) => {
  const apiKey = MapAPIKey;
  const locations = `${lat},${long}`;
  const radius = '10'; // Radius in meters (adjust as needed)
  const query = 'railway crossing -station'; // Search for railway crossings and exclude stations
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    query,
  )}&location=${locations}&radius=${radius}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const results = data.results;
    // Filter out any results that contain "station" in their name
    const filteredResults = results.filter(
      place => !place.name.toLowerCase().includes('station'),
    );
    const places = filteredResults.map(place => ({
      id: place.place_id,
      name: place.name,
      location: {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
      },
    }));
    return {ok: true, data: places};
    // setCrossings(places);
  } catch (error) {
    console.log('Error fetching railway crossings:', error);
    return {ok: false, data: error};
  }
};

function getValBeforePoint(value) {
  //    input = 353.68558
  //    output = 353

  // Convert the string to a number
  const number = parseFloat(value);

  // Return the integer part before the decimal point
  return Math.floor(number);
}

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula.
 * @param {number} lat1 - Latitude of the first point.
 * @param {number} lon1 - Longitude of the first point.
 * @param {number} lat2 - Latitude of the second point.
 * @param {number} lon2 - Longitude of the second point.
 * @returns {number} Distance between the two points in kilometers.
 */
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers

  // Helper function to convert degrees to radians
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers
  return distance.toFixed(2); // Return distance rounded to two decimal places
}

/**
 * Converts degrees to radians.
 * @param {number} deg - Value in degrees.
 * @returns {number} Value in radians.
 */
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Calculates the distance between the current location and each location in an array.
 * @param {Object} currentLocation - Current location object with 'lat' and 'lon' properties.
 * @param {Array} locations - Array of location objects, each with 'lat' and 'lon' properties.
 * @returns {Array} Array of distances from the current location to each location in the array in kilometers.
 */
function getDistancesBetweenLocationsArry(currentLocation, locations) {
  // console.log(
  //   'skldbvklsdblkvbsdlkbvlksdvlkbsdvlksdbvklsdbvksdl',
  //   currentLocation,
  // );
  return locations.map(res => {
    return {
      id: res?.id,
      km: getDistanceFromLatLonInKm(
        currentLocation?.lat,
        currentLocation?.long,
        res?.location?.latitude,
        res?.location?.longitude,
      ),
    };
  });
}

const matchTwoArrays = (matchFrom, matchTheArry, needToGetId) => {
  let matchFromArry = [...matchFrom];
  // Create a Set of nutrition IDs for faster lookup
  let nutritionIds = needToGetId
    ? new Set(matchTheArry.map(matchTheArry => matchTheArry.id))
    : matchTheArry;

  // Match nutritions with ingredients
  matchFromArry.forEach(matchFrom => {
    if (nutritionIds.has(matchFrom.id)) {
      matchFrom.match = true;
    } else {
      matchFrom.match = false;
    }
  });
  return matchFromArry;
};

const matchIDinTwoArry = (data, ids) => {
  return data.filter(item => ids.includes(item.id));
};

/**
 * The function `filterKeyFromArry` filters an array of objects based on a specified key.
 * @param arry - An array of objects.
 * @param key - The `key` parameter in the `filterKeyFromArry` function is used to specify the key that
 * you want to filter the array of objects by. This key will be used to access a specific property in
 * each object within the array for filtering.
 * @returns The `filterKeyFromArry` function takes an array `arry` and a key `key`, and filters the
 * array based on the truthiness of the value at the specified key in each element. The function
 * returns a new array containing only the elements where the value at the specified key is truthy.
 */
const filterKeyFromArry = (arry, key) => {
  return arry.filter(res => res[key])[0];
};

/**
 * The AMPMLayout function checks if the given time is between 6 AM and 6 PM.
 * @returns a boolean value. It returns true if the hours of the given time parameter are between 6
 * (inclusive) and 19 (exclusive), indicating that it is daytime. Otherwise, it returns false,
 * indicating that it is nighttime.
 */
const AMPMLayout = (onDay, onNight) => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  if (hours >= 6 && hours < 19) return onDay ?? true;
  else return onNight ?? false;
};

/**
 * The function `removeSpacesBetweenWords` removes spaces from a given input string.
 * @param input - The `removeSpacesBetweenWords` function takes a string `input` as a parameter. It
 * checks if the input contains any spaces. If spaces are found, it removes all spaces from the input
 * string and returns the modified string. If no spaces are found, it simply returns the input string
 * as it
 * @returns The `removeSpacesBetweenWords` function removes spaces between words in the input string
 * and returns the modified string without spaces. If the input does not contain any spaces, it returns
 * the input string as it is.
 */
function removeSpacesBetweenWords(name) {
  // Check if the name contains a space
  if (name && name.includes(' ')) {
    // Split the name into words
    let words = name.split(' ');

    // Capitalize the first letter of the second word
    words[1] = words[1].charAt(0).toUpperCase() + words[1].slice(1);

    // Join the words back together without the space
    return words.join('');
  } else {
    // If there's no space, return the name as it is
    return name;
  }
}

// Function to get object by ID
function getObjectById(data, id) {
  return data.find(obj => obj.id === id);
}

function generateUniqueId() {
  const timestamp = Date.now(); // Get the current timestamp
  const randomNum = Math.random().toString(36).substr(2, 9); // Generate a random string
  return `${timestamp}${randomNum}`;
}

function updateArryObjById(data, id, newObject) {
  // Create a copy of the data array
  let newArry = [...data];

  // Find the index of the object with the specified id
  let index = newArry.findIndex(obj => obj.id === id);

  // If the object is found, update it with the new object
  if (index !== -1) {
    newArry[index] = newObject;
  }

  // Return the updated array
  return newArry;
}

export {
  getSingleCharacter,
  getProperLocation,
  getDateMonthYear,
  extractTimeFromString,
  openGoogleMaps,
  removeTimeFromDate,
  getValBeforePoint,
  fetchRailwayCrossingAPI,
  getDistanceFromLatLonInKm,
  checkPer,
  reqPer,
  requestLocationPermission,
  checkLocationPermission,
  getDistancesBetweenLocationsArry,
  matchTwoArrays,
  matchIDinTwoArry,
  AMPMLayout,
  removeSpacesBetweenWords,
  filterKeyFromArry,
  getObjectById,
  generateUniqueId,
  updateArryObjById,
};
