import {showMessage} from 'react-native-flash-message';
import {Colors} from '../Theme/Variables';

export const errorMessage = (description, continerStyle) => {
  showMessage({
    type: 'danger',
    icon: 'auto',
    message: 'Warning',
    description: description,
    floating: true,
    backgroundColor: Colors.themeRed,
    style: {alignItems: 'center', ...continerStyle},
  });
};

export const successMessage = (description, continerStyle) => {
  showMessage({
    type: 'success',
    icon: 'auto',
    message: 'Success',
    description: description,
    floating: true,
    backgroundColor: Colors.primaryColor,
    style: {alignItems: 'center', ...continerStyle},
  });
};
