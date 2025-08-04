import React, {useEffect, useState} from 'react';
import {Alert, Platform} from 'react-native';
import useReduxStore from '../../Hooks/UseReduxStore';
import API from '../../Utils/helperFunc';
import {AfterSubBuyUrl, StartTrialUrl} from '../../Utils/Urls';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {loadingFalse, loadingTrue} from '../../Redux/Action/isloadingAction';
import Purchases from 'react-native-purchases';
import {useMutation} from '@tanstack/react-query';
import {allSubID} from '../../Utils/localDB';
import {types} from '../../Redux/types';

const SKU = Platform.select({
  android: ['monthly_18012024', 'yearly_18012024'],
  ios: ['monthly_12062025', 'yearly_12062025'],
});

const useSubscribeScreen = () => {
  const [products, setProducts] = useState([]);

  const {getState, dispatch} = useReduxStore();

  const {userData} = getState('Auth');

  console.log('userDatauserDatauserDatauserDatauserData', userData);
  const {mutate} = useMutation({
    mutationFn: body => {
      return API.post(AfterSubBuyUrl, body);
    },
    onSuccess: async ({ok, data}) => {
      if (ok) {
        dispatch(loadingFalse());
        dispatch({
          type: types.UpdateProfile,
          payload: {
            ...data,
            planName: allSubID[data?.identifier],
            identifier: data?.identifier,
          },
        });
        successMessage('User subscribed successfully');
        // if (data?.start_trial_at) goBack();
      } else {
        dispatch(loadingFalse());
        console.log('lkndklsnkslndvklsdnkvnsdvkndvksd', data);
        // errorMessage(data?.message ?? data?.error ?? 'Some thing wrong');
      }
    },
  });

  const {mutateAsync} = useMutation({
    mutationFn: body => {
      // Get the current date and time
      const currentDate = new Date();

      // Format the date and time
      const formattedDate = currentDate.toISOString().replace('Z', '.000000Z');
      return API.post(StartTrialUrl, {
        trial_start_at: formattedDate,
      });
    },
    onSuccess: async ({ok, data}) => {
      if (ok) {
        dispatch(loadingFalse());
        successMessage(data?.message);
        console.log('skldjbvjksbdkvbsdkvklsdbvklbsdv', data);
        dispatch({
          type: types.UpdateProfile,
          payload: data?.data,
        });
      } else {
        dispatch(loadingFalse());
        errorMessage(data?.message ?? data?.error ?? 'Some thing wrong');
      }
    },
  });

  const buySubscription = async PurchasesPackage => {
    const currentDate = new Date();

    // Format the date and time
    const formattedDate = currentDate.toISOString().replace('Z', '.000000Z');

    dispatch(loadingTrue());

    try {
      const {customerInfo} = await Purchases.purchaseStoreProduct(
        PurchasesPackage,
      );
      console.log(
        'lkdbvklsbdklvbsdklbvlsdbvksdbvklsdbvlksdbvklsd',
        customerInfo.entitlements.active,
      );

      if (customerInfo?.originalAppUserId != null) {
        mutate({
          customer_id: customerInfo.originalAppUserId,
          identifier:
            customerInfo.entitlements.active['Tac subscription group']
              .productIdentifier,
          trial_start_at: formattedDate,
        });
      }
    } catch (error) {
      errorMessage('Purchase failed or was canceled');
      console.error('Purchase failed or was canceled:', error);
      // Handle any additional error handling logic here, if needed.
    } finally {
      // Ensure loading is set to false in all cases
      dispatch(loadingFalse());
    }
  };

  const getProductsFromStore = async () => {
    dispatch(loadingTrue());
    try {
      const offerings = await Purchases.getProducts(SKU);
      const allProducts = offerings ?? [];
      const yearlyPackages = allProducts.filter(
        res => res.subscriptionPeriod == 'P1Y',
      )[0];
      const monthlyPackages = allProducts.filter(
        res => res.subscriptionPeriod == 'P1M',
      )[0];
      setProducts([yearlyPackages, monthlyPackages]);
      dispatch(loadingFalse());
    } catch (error) {
      dispatch(loadingFalse());
    }
  };
  useEffect(() => {
    getProductsFromStore();
    dispatch(loadingFalse());
  }, []); // Empty dependency array means this effect runs once, similar to componentDidMount

  return {
    startTrial: false,
    products,
    buySubscription,
    getProductsFromStore,
    startFreeTrial: () => mutateAsync(),
    userData,
    getProductsFromStore,
    dispatch,
  };
};

export default useSubscribeScreen;
