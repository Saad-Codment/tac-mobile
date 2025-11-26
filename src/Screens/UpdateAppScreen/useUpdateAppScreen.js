import {Linking, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const useUpdateAppScreen = () => {
  const onUpdatePress = () => {
    const versionInfo = DeviceInfo.getVersion();
    console.log('versionInfoversionInfo', versionInfo);
    // Logic to redirect to app store or play store for updating the app
    const url = Platform.select({
      ios: 'https://apps.apple.com/us/app/tac-the-app-for-cowboys/id6738097899',
      android: 'market://details?id=YOUR_PACKAGE_NAME',
    });
    Linking.openURL(url).catch(err =>
      console.error('An error occurred while trying to open the store:', err),
    );
  };
  return {
    onUpdatePress,
  };
};

export default useUpdateAppScreen;
