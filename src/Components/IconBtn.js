import {Image, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {Colors} from '../Theme/Variables';
import {TextComponent} from './TextComponent';
import {hp, wp} from '../Config/responsive';
import {rightIos} from '../Assets';

export const IconBtn = ({
  icon,
  btnText,
  onpress,
  extraStyle,
  changeText,
  borderLine,
}) => {
  return (
    <Pressable
      style={{
        ...styles.listBtn,
      }}
      onPress={onpress}>
      <Image source={icon} style={styles.iconGreen} />
      <View style={{...styles.listInner, ...extraStyle}}>
        <TextComponent text={btnText} styles={styles.title} />
        <TextComponent
          text={changeText}
          styles={{...styles.title, color: Colors.textGrayColor}}
        />
      </View>
      <Image source={rightIos} style={styles.arrowRight} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listBtn: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  listInner: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    borderColor: Colors.lightBorder,
    paddingVertical: hp('3'),
    borderBottomWidth: 0.3,
  },
  iconGreen: {
    resizeMode: 'contain',
    width: wp('7'),
    height: hp('3'),
    marginRight: wp('2'),
  },
  arrowRight: {
    width: wp('2'),
    resizeMode: 'contain',
    height: hp('2.4'),
  },
  title: {
    fontSize: hp('1.8'),
    fontWeight: 400,
    color: Colors.black,
  },
});
