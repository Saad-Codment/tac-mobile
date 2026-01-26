import {useEffect} from 'react';
import Purchases from 'react-native-purchases';
import useReduxStore from '../../Hooks/UseReduxStore';

const useCancelSubScreen = () => {
  const {getState} = useReduxStore();
  const {userData} = getState('Auth');

  console.log(
    'userDatauserDatauserDatauserDatauserDatauserDatauserDatauserDatauserData',
    userData,
  );

  const getManagementURL = async () => {
    const customerInfo = await Purchases.getCustomerInfo();
    const activeSubscriptions =
      customerInfo.entitlements.active['Tac subscription group'] ?? undefined;
    console.log(
      'iouewoiwefyiowehiohweiohvwoiehviowehiovhwieohvoiwhevhiwe',
      activeSubscriptions,
    );
    const managementUrl = customerInfo.managementURL;
  };
  //   useEffect(getManagementURL, []);
  return {userData};
};

export default useCancelSubScreen;
