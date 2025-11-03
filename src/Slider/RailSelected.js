import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {hp} from '../Config/responsive';
import {Colors} from '../Theme/Variables';

export const RailSelected = memo(() => {
  return <View style={styles.root} />;
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: hp('0.5'),
    borderRadius: 5,
    backgroundColor: Colors.primaryColor,
  },
});
