import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useState} from 'react';
import useLocationScreen from './useLocationScreen';
import {styles} from './styles';
import MapView, {MapMarker, Marker} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'; // Import Google Places Autocomplete library
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ThemeButton from '../../Components/ThemeButton';

import {hp, isIOS, wp} from '../../Config/responsive';
import {crossWhite, currentLoc, gpsImg, location} from '../../Assets';
import Geolocation from '@react-native-community/geolocation';
import {Colors} from '../../Theme/Variables';
import {openSettings} from 'react-native-permissions';
import {HeaderComponent} from '../../Components/HeaderComponent';

const LocationScreen = ({route, navigation}) => {
  // Then, you can use setLocationValue as needed in the 'LocationScreen'.
  const {
    mapRef,

    currentLocation,
    setCurrentLocation,
    getLocationFunction,
    handleLocationConfirm,
    locationName,
    handleLocationSelect,
    selectedLocation,
    handleMapClick,
  } = useLocationScreen(route);

  const getCurrentLocation = () => {
    // Get current device location
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({latitude, longitude});
        mapRef.current.animateToRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.015, // Adjust the zoom level as needed
          longitudeDelta: 0.015,
        });
      },
      error =>
        Alert.alert(
          'Permission Required',
          error.message, // The message from the error
          [
            {
              text: 'Go to Settings',
              onPress: () => {
                // This opens the app's settings so the user can enable the necessary permissions
                openSettings().catch(() =>
                  Alert.alert('Error', 'Unable to open settings'),
                );
              },
            },
            {
              text: 'OK', // Just a dismissal button
              style: 'cancel',
            },
          ],
          {cancelable: true},
        ),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            zIndex: 999,
            top: 0,
            position: 'absolute',
          }}>
          <HeaderComponent
            headerTitle={'Location'}
            style={{width: wp('100')}}
            goBack={() => navigation.goBack()}
            isBack
          />
          <GooglePlacesAutocomplete
            fetchDetails={true} // you need this to fetch the details object onPress
            GooglePlacesDetailsQuery={{fields: ['place', 'geometry']}}
            placeholder="Search"
            onPress={(data, details = null) => {
              // 'details' contains information about the selected place
              handleLocationSelect(details);
            }}
            renderRightButton={() => (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  this.textInput.clear();
                }}>
                <Image
                  source={crossWhite}
                  resizeMode="contain"
                  tintColor={Colors.primaryColor}
                  style={{
                    width: wp('4'),
                    height: hp('2'),
                    marginRight: wp('2'),
                  }}
                />
                {/* <MaterialIcons name="cancel" size={17} color={Colors.gray} /> */}
              </TouchableOpacity>
            )}
            textInputProps={{
              // placeholderTextColor: Colors.statusCompleted,
              // selectionColor: Colors.themeGreen,
              clearButtonMode: 'never',
              ref: input => {
                this.textInput = input;
              },
            }}
            styles={{
              container: styles.autocompleteContainer,
              textInputContainer: styles.textInputContainer,
              textInput: styles.textInput, // Cha
              predefinedPlacesDescription: styles.predefinedPlacesDescription,
            }}
            enablePoweredByContainer={false}
            query={{
              key: 'AIzaSyD3C_yNoWPJmiN95CFI2brf72kJ2iOmRHY',
              // key: 'AIzaSyBZbrelj6pX2E593uWnF8FIboHhwbFAcnE',
              language: 'en',
            }}
            // Override the default renderRow function to style the suggested output
            renderRow={(rowData, index, highlighted) => (
              <Text style={{color: Colors.primaryColor}}>
                {rowData.description}
              </Text>
            )}
          />

          {/* {/ Display selected location /} */}
          {/* {selectedLocation && (
              <View>
                <Text>Selected Location: {selectedLocation.name}</Text>
                <Text>Latitude: {selectedLocation?.geometry?.location.lat}</Text>
                <Text>Longitude: {selectedLocation?.geometry?.location.lng}</Text>
              </View>
            )} */}
        </View>

        <MapView
          onPress={handleMapClick}
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          focusable
          // followsUserLocation
          moveOnMarkerPress
          showsMyLocationButton
          zoomEnabled
          showsUserLocation
          onRegionChangeComplete={newRegion => {
            console.log({newRegion});
            // Update the currentLocation state when the map region changes
            setCurrentLocation({
              latitude: newRegion.latitude,
              longitude: newRegion.longitude,
            });
          }}
          onP>
          {currentLocation && (
            <MapMarker
              draggable
              coordinate={currentLocation}
              onDragEnd={e => {
                console.log(e, 'alkdsjfklajdsflkadjsfkljaldsafjklsdkj');
                // Update the currentLocation state when the marker is dragged
                const newCoordinate = e.nativeEvent.coordinate;
                setCurrentLocation(newCoordinate);
              }}
              // description="You are here!"
              // pinColor="blue" // Customize the pin color if needed
            >
              {selectedLocation && (
                <Marker
                  coordinate={{
                    latitude: selectedLocation?.geometry?.location?.lat,
                    longitude: selectedLocation?.geometry?.location?.lng,
                  }}
                  title={selectedLocation.name}
                />
              )}
              {/* {/ Customizing the size of the marker image /} */}
              <Image
                // tintColor={isIOS ? Colors.black : Colors.black}
                source={currentLoc}
                style={{
                  width: wp('10'),
                  height: hp('10'),
                }} // Set the desired width and height
              />
            </MapMarker>
          )}
        </MapView>
        <TouchableOpacity
          onPress={getCurrentLocation}
          style={styles.currentLocation}>
          <Image
            source={gpsImg}
            resizeMode="contain"
            tintColor={'white'}
            style={styles.dropDown}
          />
          {/* <FontAwesome6
          style={styles.dropDown}
          color={Colors.white}
          name={'location-crosshairs'}
          size={hp('3')}
        /> */}
        </TouchableOpacity>

        <ThemeButton
          onPress={() => {
            handleLocationConfirm();
            // getLocationFunction(locationName);
            navigation.goBack();
          }}
          title={'Confirm '}
          style={styles.btnStyle}
          textStyle={styles.btnTextStyle}
        />
      </View>
    </>
  );
};

export default memo(LocationScreen);
