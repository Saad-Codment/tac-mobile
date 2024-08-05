import {View, Text} from 'react-native';
import React from 'react';
import useEditProfileScreen from './useEditProfileScreen';
import {styles} from './styles';
import {TextComponent} from '../../Components/TextComponent';
import {HeaderComponentProfile} from '../../Components/HeaderComponentProfile';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {CircleImage} from '../../Components/CircleImage';

const EditProfileScreen = ({navigation}) => {
  const {} = useEditProfileScreen(navigation);
  return (
    <View>
      <HeaderComponent
        goBack={() => navigation.goBack()}
        isBack
        style={styles.header}
        headerTitle={'Settings'}
      />
      <View style={styles.midContainer}>
        <View style={styles.proImageContainer}>
          <CircleImage
            uri={
              'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            }
            styles={styles.proImage}
          />
        </View>
        {/* <CircleImage
          uri={
            'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          }
          styles={styles.proImage}
        /> */}
        <TextComponent styles={styles.proName} text={'Sheila'} />
        <TextComponent styles={styles.proEmail} text={'sheila@tac.com'} />
      </View>
    </View>
  );
};

export default EditProfileScreen;
