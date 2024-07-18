import React from 'react';
import {Text, Image, StyleSheet, View} from 'react-native';
import {Colors, FontFamily} from '../Theme/Variables';
import {hp, wp} from '../Config/responsive';
import {TextComponent} from './TextComponent';
import {comingSoon} from '../Assets';
import ThemeButton from './ThemeButton';

const DataNotFound = () => {
  return (
    <View style={styles.noData}>
      <Image source={comingSoon} style={styles.noDataImg} />
      <TextComponent text={'Coming Soon...'} styles={styles.noDataText} />
      <ThemeButton title={'Refresh'} style={styles.btnSt} />
    </View>
  );
};

export default DataNotFound;

const styles = StyleSheet.create({
  noData: {
    marginTop: hp('-4'),
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noDataImg: {
    width: wp('30'),
    height: hp('15'),
    resizeMode: 'contain',
  },
  noDataText: {
    fontSize: hp('3'),
    color: Colors.themeRed,
    marginVertical: hp('2'),
  },
  btnSt: {
    marginTop: hp('1.5'),
    width: wp('55'),
  },
});
