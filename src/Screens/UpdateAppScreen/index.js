import {View, Text, Image} from 'react-native';
import React, {memo} from 'react';
import {TextComponent} from '../../Components/TextComponent';
import ThemeButton from '../../Components/ThemeButton';
import {styles} from './styles';
import {noData, updateIcon} from '../../Assets';
import {hp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';
import useUpdateAppScreen from './useUpdateAppScreen';

const UpdateAppScreen = () => {
  const {onUpdatePress} = useUpdateAppScreen();
  return (
    <View style={{...styles.mealInner}}>
      <Image
        source={updateIcon}
        style={{...styles.noDataImage}}
        tintColor={Colors.primaryColor}
      />
      <TextComponent text={'Update Available'} styles={styles.noDataTitle} />
      <TextComponent
        text={
          'A new version of the app is available. Please update to continue.'
        }
        styles={styles.noDataSubTitle}
      />
      <ThemeButton
        title={'Update Now'}
        onPress={onUpdatePress}
        textStyle={{textAlign: 'center', fontSize: hp('1.5')}}
        style={{...styles.btnStyles}}
      />
    </View>
  );
};

export default memo(UpdateAppScreen);
