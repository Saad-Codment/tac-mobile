import {View, Text, Switch, Image} from 'react-native';
import React, {memo} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import {Colors} from '../../Theme/Variables';
import useSyncPhonebookScreen from './useSyncPhonebookScreen';
import {styles} from './styles';
import {syncView} from '../../Assets';
import {AlertDesign} from '../../Components/AlertDesign';
import {MyTabs} from './tabBarScreen';
import {contactFalse} from '../../Redux/Action/isContactAction';

const SyncPhonebookScreen = ({navigation}) => {
  const {
    isPer,
    onChangeToggle,
    toggleAlert,
    alertState,
    onConfirm,
    isContact,
    prioritizeInAppContacts,
    dispatch,
  } = useSyncPhonebookScreen(navigation);

  const AskPerView = () => {
    return (
      <View style={styles.synView}>
        <Image
          source={syncView}
          resizeMode="contain"
          style={{width: wp('50'), height: hp('25')}}
        />
        <TextComponent text={'Sync your contacts'} styles={styles.synHeading} />
        <TextComponent
          text={
            'Find your rodeo friends on TAC! Sync your contacts to see who’s already here. We’ll only use your contacts to show friends — your contact list is never stored or shared.'
          }
          fade
          styles={{textAlign: 'center', fontSize: hp('1.5')}}
        />
      </View>
    );
  };

  return (
    <>
      <HeaderComponent
        headerTitle={'Sync phonebook'}
        goBack={() => navigation.goBack()}
        isBack
      />
      <View style={styles.upperView}>
        <View>
          <TextComponent text={'Phonebook'} styles={{fontWeight: 'bold'}} />
          <TextComponent text={'Sync turned off'} fade />
        </View>
        <Switch
          trackColor={{
            false: Colors.grayFaded,
            true: 'transparent',
          }}
          thumbColor={isContact ? Colors.primaryColor : '#EAF6ED'}
          ios_backgroundColor="#EAF6ED"
          onValueChange={() => {
            if (isContact) dispatch(contactFalse());
            else toggleAlert();
          }}
          value={isContact}
        />
      </View>
      {isContact ? (
        <MyTabs
          tacContacts={prioritizeInAppContacts().inAppContacts}
          invitedContacts={prioritizeInAppContacts().otherContacts}
        />
      ) : (
        <AskPerView />
      )}
      <AlertDesign
        isVisible={alertState}
        title={'Enable Contacts'}
        message={
          'Tac needs access to your contacts to help you easily find and invite friends to the app.'
        }
        cancelText={'Not Now'}
        confirmText={'Enable'}
        msgStyle={{textAlign: 'center'}}
        onCancel={toggleAlert}
        onConfirm={onChangeToggle}
      />
      {/* {isPer ? } */}
    </>
  );
};

export default memo(SyncPhonebookScreen);
