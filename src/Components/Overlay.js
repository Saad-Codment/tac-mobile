import React from 'react';
import {View, ActivityIndicator} from 'react-native';

const Overlay = ({childern}) => (
  <View
    style={{
      width: '100%',
      height: '100%',
      zIndex: 100,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
      //   top: 0,
      //   bottom: 0,
    }}>
    {childern ? childern : <ActivityIndicator size={'large'} color="#fff" />}
  </View>
);

export default Overlay;
