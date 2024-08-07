import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {hp, wp} from '../Config/responsive';

const BottomModalComponent = ({isVisible, onClose, children, showCenter}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{
        justifyContent: showCenter ? 'center' : 'flex-end',

        margin: 0,
      }}>
      <View
        style={{
          backgroundColor: 'white',
          padding: 25,
          margin: showCenter ? 10 : 0,
          borderTopLeftRadius: !showCenter ? 30 : 10,
          borderTopRightRadius: !showCenter ? 30 : 10,
          width: showCenter ? wp('85') : wp('100'),
          alignSelf: 'center',
          borderRadius: !showCenter ? 0 : 10,
        }}>
        {children}
        {/* <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
          }}></TouchableOpacity> */}
      </View>
    </Modal>
  );
};

export default BottomModalComponent;
