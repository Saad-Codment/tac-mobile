import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {hp} from '../Config/responsive';
import {Colors} from '../Theme/Variables';

const Rail = () => {
  return <View style={styles.root} />;
};

export default memo(Rail);

const styles = StyleSheet.create({
  root: {
    height: hp('0.5'),
    backgroundColor: 'white',
    borderRadius: 2,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    flex: 1,
  },
});
