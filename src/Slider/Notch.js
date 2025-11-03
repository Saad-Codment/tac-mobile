// Notch.js
import React, {memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, scaleFont} from '../Theme/Variables';

const Notch = ({value}) => {
  return (
    <View style={styles.notch}>
      <Text style={styles.notchText}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  notch: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
  },
  notchText: {
    fontSize: scaleFont(12),
    color: '#333',
  },
});

export default memo(Notch);
