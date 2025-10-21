import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, Platform, Image} from 'react-native';
import Purchases from 'react-native-purchases';
import SubscriptionInfoComp from '../../Components/SubscriptionInfoComp';
import {subscriptionMessages} from '../../Utils/localDB';
import useReduxStore from '../../Hooks/UseReduxStore';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {Touchable} from '../../Components/Touchable';
import {backIcon} from '../../Assets';
import {hp, wp} from '../../Config/responsive';

const SubscriptionInfoScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState(null);

  const {getState} = useReduxStore();
  const {userData} = getState('Auth');
  console.log('userDatauserDatauserData', userData?.store);
  useEffect(() => {
    setStore(userData?.store || 'none');
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#CB9531" />
      </View>
    );
  }

  const os = Platform.OS;
  let message = '';
  let title = 'How to Manage Your Subscription';

  if (store === 'APP_STORE')
    message =
      subscriptionMessages.app_store[os] || subscriptionMessages.app_store.web;
  else if (store === 'PLAY_STORE')
    message =
      subscriptionMessages.play_store[os] ||
      subscriptionMessages.play_store.web;
  else if (store === 'stripe') message = subscriptionMessages.stripe.any;
  else message = subscriptionMessages.none;

  return (
    <View style={{flex: 1, backgroundColor: 'white', paddingTop: hp('2')}}>
      <Touchable onPress={() => navigation.goBack()}>
        <Image
          source={backIcon}
          resizeMode="contain"
          style={{width: wp('8'), height: hp('3'), marginLeft: wp('2')}}
          tintColor={'black'}
        />
      </Touchable>
      <SubscriptionInfoComp title={title} message={message} />
    </View>
  );
};
export default SubscriptionInfoScreen;
