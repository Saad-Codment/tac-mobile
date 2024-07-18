import {useCallback, useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {
  dailyForecast,
  showWeather,
  getLocation,
  fiveDaysForecast,
  getWeather,
} from 'react-native-weather-api';
import {
  AMPMLayout,
  checkLocationPermission,
  checkPer,
  getProperLocation,
  getValBeforePoint,
  granted,
  removeSpacesBetweenWords,
} from '../Services/GlobalFunctions';
import {hp, wp} from '../Config/responsive';
import Images, {
  blackImg,
  parCloud,
  mist,
  rain,
  snow,
  thunderstorm,
  brokenClouds,
  scatteredClouds,
  clearSkyD,
  clearSkyN,
  fewClouds,
} from '../Assets';
import {TextComponent} from './TextComponent';
import {Colors, FontSize} from '../Theme/Variables';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocationios from '@react-native-community/geolocation';
import {PERMISSIONS, request} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';

const WeatherComp = ({addListener, startLocationDes}) => {
  const [weatherState, setWeatherState] = useState();
  // const isGranted = true;

  const weatherImgaes = {
    parCloud,
    mist,
    rain,
    snow,
    thunderstorm,
    brokenClouds,
    scatteredClouds,
    clearSkyD,
    clearSkyN,
    fewClouds,
    smoke: brokenClouds,
    haze: brokenClouds,
    'sand/dust whirls': brokenClouds,
    fog: brokenClouds,
    sand: brokenClouds,
    dust: brokenClouds,
    'volcanic ash': brokenClouds,
    squalls: brokenClouds,
    tornado: brokenClouds,
    'overcast clouds': brokenClouds,
  };

  const [isGranted, setIsGranted] = useState(false);

  const checkPermission = async () => {
    const {hasLocationPermission} = await getProperLocation();
    console.log('sldbkljsbdkvbsdkvbksdbvksdbvd', hasLocationPermission);
    if (hasLocationPermission?.ok == true) setIsGranted(true);
    else setIsGranted(true);
  };

  const getWeatherLo = async () => {
    // await checkPermission();
    const hasPermission = await checkLocationPermission();
    setIsGranted(hasPermission);
    if (hasPermission) {
      let temp;
      let wind;
      getLocation().then(location => {
        getWeather({
          key: 'd3b17fd9554eb61a5ddc829fe4624335',
          lat: location.coords.latitude,
          lon: location.coords.longitude,
          unit: 'metric',
        })
          .then(() => {
            let data = new showWeather();
            console.log('         lsdbklvbsdlkvbsdklvbsldkbvlksbdvsd', data);
            setWeatherState(data);
            temp = data.temp;
            wind = data.wind;
          })
          .catch(err =>
            console.log('lskdbvlkbsdlkvblksdbvlksdbklvbsdklbksd', err),
          );
      });
    }
  };

  useEffect(() => {
    const event = addListener('focus', async () => {
      console.log('jdbjksdjkvjksdvjksdvjksdvkjsdvvkjsdkjvbkjsdvsdb');
      await getWeatherLo();
    });
    getWeatherLo();
    return event;
  }, [startLocationDes]);

  const WeatherImgaesView = useCallback(() => {
    return (
      <Image
        source={AMPMLayout(
          weatherImgaes[
            removeSpacesBetweenWords(weatherState?.description ?? 'parCloud')
          ] ??
            weatherImgaes[
              `${removeSpacesBetweenWords(weatherState?.description)}D` ??
                'parCloud'
            ],
          weatherImgaes[
            removeSpacesBetweenWords(weatherState?.description ?? 'parCloud')
          ] ??
            weatherImgaes[
              `${removeSpacesBetweenWords(weatherState?.description)}N` ??
                'parCloud'
            ],
        )}
        resizeMode="contain"
        style={styles.cloudImg}
      />
    );
  }, [weatherState?.description]);

  return isGranted ? (
    <ImageBackground
      style={styles.bgImage}
      source={blackImg}
      resizeMode="contain">
      <View style={styles.upView}>
        <WeatherImgaesView />
        <View style={styles.upInnerView}>
          <TextComponent
            text={getValBeforePoint(weatherState?.temp)}
            styles={styles.temp}
          />
          <TextComponent text={'°C'} styles={styles.textDeg} />
        </View>
      </View>
      <View style={styles.downView}>
        <TextComponent
          text={`It's ${weatherState?.description}`}
          styles={{color: 'white', width: wp('45')}}
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name={'arrow-up'} color={'white'} size={hp('2.5')} />
          <TextComponent
            text={`${weatherState?.temp_max} °C`}
            isWhite={true}
            styles={{marginRight: wp('2')}}
          />
          <Ionicons name={'arrow-down'} color={'white'} size={hp('2.5')} />
          <TextComponent text={`${weatherState?.temp_min} °C`} isWhite={true} />
        </View>
      </View>
    </ImageBackground>
  ) : (
    <View style={styles.allowBtn}>
      <TextComponent
        text={'Allow location'}
        styles={styles.allowText}
        isWhite={true}
        onPress={async () => {
          Linking.openSettings();
          // const p = await checkPer();
          // console.log('sdl,bvklbsdlkvblksdbvklsdbvklsdbkvsd', p);
          // Geolocation.requestAuthorization('always');
          // const op = await request(
          //   Platform.OS == 'ios'
          //     ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          //     : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          // );
          // console.log('sdl,bvklbsdlkvblksdbvklsdbvklsdbkvsd', op);
        }}
      />
    </View>
  );
};

export default WeatherComp;

const styles = StyleSheet.create({
  bgImage: {width: wp('96'), alignSelf: 'center', height: hp('20')},
  upView: {
    marginTop: hp('3'),
    flexDirection: 'row',
    width: wp('90'),
    alignSelf: 'center',
  },
  cloudImg: {
    width: wp('40'),
    height: hp('15'),
    position: 'absolute',
    top: hp('-7'),
  },
  upInnerView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  temp: {
    fontSize: hp('7'),
    color: 'white',
    textAlign: 'right',
    marginLeft: wp('60'),
    fontWeight: 'bold',
  },
  textDeg: {
    fontSize: hp('3'),
    color: 'white',
    fontWeight: 'bold',
    marginTop: hp('1'),
  },
  downView: {
    marginLeft: wp('2'),
    flexDirection: 'row',
    marginTop: hp('1.5'),
  },
  allowBtn: {
    width: wp('95'),
    height: hp('10'),
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: hp('3'),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.58,
    shadowRadius: 5,
  },
  allowText: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.primaryColor,
    height: hp('5'),
    width: wp('50'),
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingTop: Platform.OS == 'ios' ? hp('1.3') : 0,
  },
});
