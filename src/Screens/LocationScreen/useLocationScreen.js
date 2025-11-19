import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import Geolocationios from '@react-native-community/geolocation';
import {updateCoordinatesUrl} from '../../Utils/Urls';
import {fetchPostWithToken} from '../../Services/AuthServices';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {formatAddress} from '../../Services/GlobalFunctions';

const useLocationScreen = ({navigate, addListener, params}) => {
  // GET LOCATION DATA  IN PARAM this function  getLocationFunction
  const getLocationFunction = params;
  const mapRef = useRef();

  const [currentLocation, setCurrentLocation] = useState({
    latitude: 27.994402, // Default location
    longitude: -81.760254,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [locationName, setLocationName] = useState();
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationSelect = place => {
    console.log(place, 'Selected Location');
    // Handle selection of a location
    setSelectedLocation(place);
    // Update map region to focus on the selected location
    mapRef.current.animateToRegion({
      latitude: place?.geometry?.location?.lat,
      longitude: place?.geometry?.location?.lng,
      latitudeDelta: 0.115, // Adjust the zoom level as needed
      longitudeDelta: 0.115,
    });
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocationios.requestAuthorization();
    }
  }, []);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location.',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission denied');
            return;
          }
        }

        // Retrieve the current location once permission is granted
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setCurrentLocation({
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
            // Animate the map to the current location
            mapRef.current?.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          },
          error => {
            console.log('Error getting location:', error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } catch (err) {
        console.warn('Error requesting location permission:', err);
      }
    };

    requestLocationPermission();

    return () => {
      Geolocation.clearWatch();
    };
  }, []);

  // Handle map click to set the clicked location
  const handleMapClick = event => {
    const {coordinate} = event.nativeEvent;
    setCurrentLocation(coordinate);
  };

  const getCurrentLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          async position => {
            const {latitude, longitude} = position.coords;
            await updateCoordinates({
              latitude,
              longitude,
            });
            setCurrentLocation({
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });

            // Animate the map to show the current location
            mapRef.current?.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          },
          error => {
            console.log('Error getting current location:', error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  useEffect(() => {
    getCurrentLocation(); // Trigger location fetch on mount
  }, []);

  const queryClient = useQueryClient();
  const {mutateAsync: updateCoordinates} = useMutation({
    mutationFn: async ({latitude, longitude}) =>
      fetchPostWithToken(updateCoordinatesUrl, {}, {latitude, longitude}),
    onMutate: () => {},
    onError: error => {
      console.error('Update coordinates error:', error);
      // setSearchLoading(false);
    },
    onSuccess: item => {
      queryClient.invalidateQueries({queryKey: ['NearbyJobs']});
      // searchLoading(false);
      // requestLocation();
    },
  });

  // Fetch place name using Google Maps API
  // const getPlaceName = async (latitude, longitude) => {
  //   const API_KEY = 'AIzaSyD3C_yNoWPJmiN95CFI2brf72kJ2iOmRHY';
  //   const API_ENDPOINT = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;
  //   try {
  //     console.log('Location Datalksdnvklsdnklvnsdlkvnskld:', API_ENDPOINT);
  //     const response = await fetch(API_ENDPOINT);
  //     const data = await response.json();
  //     const locationName =
  //       data.results[0]?.formatted_address || 'Unknown Location';
  //     console.log('Location Name:', locationName);
  //     return locationName;
  //   } catch (error) {
  //     console.error('Error fetching location details:', error);
  //     return null;
  //   }
  // };

  const getPlaceName = async (latitude, longitude) => {
    // API key should ideally come from environment variables or backend
    const API_KEY = 'AIzaSyD3C_yNoWPJmiN95CFI2brf72kJ2iOmRHY';
    const API_ENDPOINT = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

    try {
      console.log('Fetching location data for:', latitude, longitude);
      const response = await fetch(API_ENDPOINT);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        console.log('No location found for these coordinates');
        return 'Unknown Location';
      }

      const locationName = formatAddress(data.results[0]) || 'Unknown Location';
      console.log(
        'Location Namesdfsdfd:',
        formatAddress(data.results[0]),
        data.results[0],
      );
      return locationName;
    } catch (error) {
      console.error('Error fetching location details:', error);
      return 'Unknown Location';
    }
  };
  // Confirm location and call the external function
  const handleLocationConfirm = async () => {
    if (currentLocation) {
      const locationName = await getPlaceName(
        currentLocation.latitude,
        currentLocation.longitude,
      );
      // const locationName = '43 Brewster St, San Francisco, CA 94110, USA';
      getLocationFunction(locationName, currentLocation);
    }
  };

  return {
    mapRef,
    getCurrentLocation,
    currentLocation,
    setCurrentLocation,
    getLocationFunction,
    handleLocationConfirm,
    locationName,
    handleLocationSelect,
    selectedLocation,
    handleMapClick,
  };
};

export default useLocationScreen;
