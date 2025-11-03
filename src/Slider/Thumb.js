import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../Theme/Variables';

const THUMB_RADIUS_LOW = 12;
const THUMB_RADIUS_HIGH = 16;

const Thumb = ({name}) => {
  return <View style={name === 'high' ? styles.rootHigh : styles.rootLow} />;
};

const styles = StyleSheet.create({
  rootLow: {
    width: THUMB_RADIUS_LOW * 2,
    height: THUMB_RADIUS_LOW * 2,
    borderRadius: THUMB_RADIUS_LOW,
    borderWidth: 3,
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.primaryColor,
  },
  rootHigh: {
    width: THUMB_RADIUS_HIGH * 2,
    height: THUMB_RADIUS_HIGH * 2,
    borderRadius: THUMB_RADIUS_HIGH,
    borderWidth: 2,
    borderColor: '#7f7f7f',
    backgroundColor: Colors.primaryColor,
  },
});

export default memo(Thumb);
