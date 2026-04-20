import React, {useEffect} from 'react';
import {Alert as RNAlert} from 'react-native';
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
  msgStyle, // kept for compatibility (not used in native Alert)
  confirmButtonColor, // kept for compatibility (not used in native Alert)
}) => {
  useEffect(() => {
    if (!isVisible) return;

    RNAlert.alert(
      title || 'Alert',
      message || '',
      [
        {
          text: cancelText ?? 'Not Now',
          onPress: onCancel,
          style: 'cancel',
        },
        {
          text: confirmText || 'Confirm',
          onPress: onConfirm,
          style: 'destructive',
        },
      ],
      {
        cancelable: false, // prevents closing by tapping outside or back button
      },
    );
  }, [isVisible, title, message, confirmText, onConfirm, onCancel, cancelText]);

  // This component doesn't render anything — native Alert handles the UI
  return null;
};

export default AlertDesign;
