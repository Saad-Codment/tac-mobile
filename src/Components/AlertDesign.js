import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import {StyleSheet} from 'react-native';
import {Colors} from '../Theme/Variables';
import {hp, wp} from '../Config/responsive';

export const AlertDesign = ({
  isVisible,
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
  cancelText,
  msgStyle,
  confirmButtonColor,
}) => {
  return (
    <AwesomeAlert
      show={isVisible}
      showProgress={false}
      title={title}
      message={message}
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      showCancelButton={true}
      showConfirmButton={true}
      cancelText={cancelText ?? 'Not Now'}
      confirmText={confirmText}
      confirmButtonColor={confirmButtonColor ?? 'rgba(234, 67, 53, 1)'}
      titleStyle={styles.modalTitle}
      messageStyle={{...styles.modalMsg, ...msgStyle}}
      cancelButtonStyle={styles.cancelBtnMain}
      confirmButtonStyle={styles.confirmBtnMain}
      cancelButtonTextStyle={styles.modalCancelBtnText}
      confirmButtonTextStyle={styles.modalcConfirmBtnText}
      onConfirmPressed={onConfirm}
      onCancelPressed={onCancel}
      overlayStyle={{
        backgroundColor: 'rgba(0,0,0,0.6)',
      }}
    />
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    fontWeight: '600',
    color: Colors.primaryColor,
    fontSize: hp('2.5'),
  },
  modalMsg: {
    color: Colors.gray,
    fontSize: hp('1.8'),
    marginBottom: hp('2'),
  },
  cancelBtnMain: {
    backgroundColor: '#F6F6F6',
    paddingHorizontal: wp('1'),
    width: wp('30'),
    height: hp('6'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: hp('1'),
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  confirmBtnMain: {
    // backgroundColor: '#FF4949',
    width: wp('30'),
    height: hp('6'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: '#FF4949',
    borderWidth: 1,
    marginBottom: hp('1'),
  },
  modalCancelBtnText: {
    fontSize: hp('1.8'),
    color: '#212759',
  },
  modalcConfirmBtnText: {
    fontSize: hp('1.8'),
  },
});
