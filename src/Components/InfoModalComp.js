import React, {useState} from 'react';
import {
  Modal,
  View,
  Image,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
} from 'react-native';
import {closeIcon} from '../Assets';
import {Touchable} from './Touchable';
import {TextComponent} from './TextComponent';
import {hp, wp} from '../Config/responsive';
import {Colors} from '../Theme/Variables';

export const InfoModal = ({isVisible, onClose, title, content}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Touchable onPress={onClose} style={styles.closeBtn}>
            <Image source={closeIcon} style={styles.closeIconStyle} />
          </Touchable>
          <TextComponent text={title} styles={styles.modalHd} />
          <TextComponent text={content} styles={styles.modalText} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingVertical: hp('2'),
    paddingBottom: hp('5'),
    paddingHorizontal: wp('3'),
    borderRadius: 10,
    marginHorizontal: wp('5'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  modalHd: {
    fontSize: hp('3.5'),
    fontWeight: '700',
    color: Colors.primaryColor,
    textAlign: 'center',
    marginBottom: hp('1'),
  },
  modalText: {
    fontSize: hp('1.8'),
    textAlign: 'center',
    marginHorizontal: wp('2'),
    lineHeight: 19,
  },
  closeBtn: {
    alignItems: 'flex-end',
  },
  closeIconStyle: {
    resizeMode: 'contain',
    width: wp('6'),
    height: hp('3'),
    marginBottom: hp('-1'),
  },
});
