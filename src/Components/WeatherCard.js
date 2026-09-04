// Presentational only — every branch here is a real state (loading /
// not-configured / provider-error / data), nothing fabricated. Provider
// specifics (OpenWeatherMap, its field names, its endpoints) never appear
// in this file; it only knows the normalized shape WeatherService returns.
import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {TextComponent} from './TextComponent';
import {Colors} from '../Theme/Variables';
import {hp, wp} from '../Config/responsive';
import {describeUnavailable} from '../Services/Weather/WeatherService';

const formatHour = ms => {
  if (!ms) return '—';
  return new Date(ms).toLocaleTimeString('en-US', {hour: 'numeric'});
};

const WeatherCard = ({
  title = 'Weather',
  isConfigured,
  isLoading,
  current,
  forecast,
}) => {
  const unavailableReason = !isConfigured
    ? 'not_configured'
    : current?.unavailable
    ? current.reason
    : null;

  return (
    <View style={styles.card}>
      <TextComponent text={title} styles={styles.title} />

      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={Colors.primaryColor}
          style={styles.loader}
        />
      ) : unavailableReason ? (
        <TextComponent
          text={describeUnavailable(unavailableReason)}
          fade
          styles={styles.unavailableText}
        />
      ) : (
        <>
          <View style={styles.currentRow}>
            <TextComponent
              text={
                current?.temp != null ? `${Math.round(current.temp)}°C` : '—'
              }
              styles={styles.temp}
            />
            {!!current?.description && (
              <TextComponent
                text={current.description}
                fade
                styles={styles.description}
              />
            )}
          </View>

          {forecast?.entries?.length > 0 && (
            <View style={styles.forecastRow}>
              {forecast.entries.map((entry, i) => (
                <View key={i} style={styles.forecastEntry}>
                  <TextComponent
                    text={formatHour(entry.time)}
                    fade
                    styles={styles.forecastTime}
                  />
                  <TextComponent
                    text={entry.temp != null ? `${Math.round(entry.temp)}°` : '—'}
                    styles={styles.forecastTemp}
                  />
                  {entry.precipChance > 0 && (
                    <TextComponent
                      text={`💧${entry.precipChance}%`}
                      fade
                      styles={styles.forecastPrecip}
                    />
                  )}
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: wp('4'),
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: hp('2'),
  },
  title: {
    fontSize: hp('1.5'),
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: hp('0.8'),
  },
  loader: {alignSelf: 'flex-start', marginTop: hp('0.4')},
  unavailableText: {fontSize: hp('1.2'), color: '#64748B'},
  currentRow: {flexDirection: 'row', alignItems: 'center', gap: wp('2.5')},
  temp: {fontSize: hp('2.2'), fontWeight: '700', color: '#0F172A'},
  description: {
    fontSize: hp('1.3'),
    color: '#475569',
    textTransform: 'capitalize',
  },
  forecastRow: {flexDirection: 'row', marginTop: hp('1.2'), gap: wp('4')},
  forecastEntry: {alignItems: 'center'},
  forecastTime: {fontSize: hp('1.05')},
  forecastTemp: {fontSize: hp('1.3'), fontWeight: '600', color: '#0F172A'},
  forecastPrecip: {fontSize: hp('1')},
});

export default WeatherCard;
