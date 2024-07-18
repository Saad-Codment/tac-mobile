import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {hp, wp} from '../Config/responsive';
import {TextComponent} from './TextComponent';
import {callIcon} from '../Assets';
import {Touchable} from './Touchable';

const EmergencyCardComp = () => {
  return (
    <View style={styles.mainView}>
      <View style={{marginTop: hp('2')}}>
        <TextComponent text={'Emergency'} styles={styles.boldText} />
        <TextComponent text={'Information Center'} styles={styles.boldText} />
        <TextComponent
          text={'Tap call button in emergency.'}
          styles={{fontSize: hp('1.6'), marginTop: hp('1')}}
        />
      </View>
      <Touchable style={{marginLeft: wp('12')}}>
        <Image
          source={callIcon}
          resizeMode="contain"
          style={{width: wp('40'), height: hp('13')}}
        />
      </Touchable>
    </View>
  );
};

export default EmergencyCardComp;

const styles = StyleSheet.create({
  mainView: {
    width: wp('95'),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 2,
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal: hp('2'),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.58,
    shadowRadius: 5,
  },
  boldText: {fontSize: hp('2'), fontWeight: 'bold'},
});
