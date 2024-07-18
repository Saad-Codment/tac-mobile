import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {hp, wp} from '../Config/responsive';
import {Colors} from '../Theme/Variables';
import {TextComponent} from './TextComponent';

export const CategoryIntro = ({introImage, introTitle, introDescription}) => {
  return (
    <View style={styles.intro}>
      <Image
        source={introImage}
        style={styles.introImage}
        resizeMode="contain"
      />
      <View style={styles.introInner}>
        <TextComponent text={introTitle} styles={styles.introTitle} />
        <TextComponent text={introDescription} styles={styles.introDes} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  intro: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: wp('5'),
    marginRight: wp('5'),
    marginVertical: hp('2.5'),
    alignItems: 'center',
  },
  introImage: {
    width: wp('20'),
    height: hp('15'),
    flex: 0.4,
    marginRight: wp('3'),
  },
  introInner: {
    flex: 0.6,
  },
  introTitle: {
    color: Colors.primaryColor,
    fontWeight: '500',
    fontSize: hp('2.2'),
    marginBottom: hp('1'),
  },
  introDes: {
    color: Colors.lightGray,
    fontSize: hp('1.8'),
    fontWeight: '300',
  },
});
