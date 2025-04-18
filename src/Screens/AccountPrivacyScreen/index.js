import {View, Text, Switch} from 'react-native';
import React, {memo} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';
import {TextComponent} from '../../Components/TextComponent';
import useAccountPrivacyScreen from './useAccountPrivacyScreen';
import {DataNotFound} from '../../Components/DataNotFound';
import {lock, locksetting} from '../../Assets';
import {styles} from './styles';

const AccountPrivacyScreen = () => {
  const {userData, privateTheProfile} = useAccountPrivacyScreen();
  return (
    <View style={{flexGrow: 1}}>
      <HeaderComponent headerTitle={'Account Privacy'} isBack />
      <View style={styles.mainView}>
        <TextComponent text={'Lock My Profile'} styles={{fontWeight: 'bold'}} />
        <Switch
          trackColor={{
            false: Colors.grayFaded,
            true: 'transparent',
          }}
          thumbColor={userData?.privacy == 1 ? Colors.primaryColor : '#EAF6ED'}
          ios_backgroundColor="#EAF6ED"
          onValueChange={privateTheProfile}
          value={Boolean(userData?.privacy == 1)}
        />
      </View>
      <TextComponent
        text={
          'By locking your profile, you can control who sees your posts, photos, and personal information. Only your connections will have full access, keeping strangers at a safe distance. Turn it on anytime to enjoy a private, protected experience — because your privacy matters.'
        }
        fade
        styles={styles.fadeText}
      />
      <DataNotFound
        subTitle={'Protect your privacy with a single tap.'}
        title={'Lock Your Profile'}
        centerImg={lock}
        imgStyles={{tintColor: Colors.primaryColor}}
        mainViewStyles={{marginTop: hp('-8')}}
      />
    </View>
  );
};

export default memo(AccountPrivacyScreen);
