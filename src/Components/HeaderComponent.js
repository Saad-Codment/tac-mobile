import React from 'react';
import {StyleSheet, Text, Image, View, Platform} from 'react-native';
import {TextComponent} from './TextComponent';
import {Touchable} from './Touchable';
import {arrow, arrowBack, arrowLeft} from '../Assets';
import {hp, wp} from '../Config/responsive';
import {Colors} from '../Theme/Variables';

export const HeaderComponent = ({
  headerTitle,
  style,
  saveReset,
  icon,
  backText,
  saveResetStyle,
  goBack,
  backTextStyle,
  titleStyle,
  numberOfLines,
  isBack,
  rightIconStyle,
  onRightPress,
}) => {
  return (
    <View style={[styles.TopHeader, {...style}]}>
      <View style={styles.HeaderLeft}>
        <Touchable onPress={goBack} style={styles.backMain} disabled={!isBack}>
          {isBack && (
            <Image
              source={arrowLeft}
              style={{
                resizeMode: 'contain',
                tintColor: 'white',
                ...styles.arrowback,
              }}
            />
          )}
          <TextComponent
            text={backText}
            styles={{...styles.backBtn, ...backTextStyle}}
          />
        </Touchable>
      </View>
      <View style={styles.HeaderCenter}>
        <TextComponent
          text={headerTitle}
          numberOfLines={numberOfLines ?? 1}
          styles={{...styles.HeaderTitle, ...titleStyle}}
        />
      </View>
      <View style={styles.HeaderRight}>
        <Touchable style={styles.styleCheck} onPress={onRightPress}>
          <Image source={icon} style={{...styles.filterIcon, rightIconStyle}} />
        </Touchable>
        <Touchable style={styles.backMain} onPress={onRightPress}>
          <Image
            source={saveReset}
            style={{...styles.filterIcon, rightIconStyle}}
          />

          {/* <TextComponent
            text={saveReset}
            styles={{...styles.backBtn, ...saveResetStyle}}
          /> */}
        </Touchable>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  TopHeader: {
    flexDirection: 'row',
    // marginTop: Platform.OS == 'ios' ? hp('6') : hp('3'),
    paddingHorizontal: wp('3.5'),
    paddingBottom: hp('3'),
    backgroundColor: Colors.headerBg,
    paddingTop: Platform.OS == 'ios' ? hp('8') : hp('3'),
    height: Platform.OS == 'ios' ? hp('12') : hp('8'),
    alignItems: 'center',
  },

  backMain: {
    alignItems: 'center',
    flexDirection: 'row',
    textAlign: 'left',
    alignItems: 'flex-end',

    // backgroundColor: 'red',
  },
  backBtn: {
    marginLeft: wp('1.5'),
    color: Colors.gray,
    fontSize: hp('2'),
  },
  HeaderTitle: {
    fontSize: hp('2.5'),
    color: Colors.white,
    fontWeight: '500',
    // width: wp('60'),
    textAlignVertical: 'center',
    // justifyContent: 'center',
  },
  HeaderLeft: {
    flex: 0.5,
    // justifyContent: 'center',
    // backgroundColor: 'blue',
    // alignItems: 'center',
    // alignContent: 'center',
  },
  arrowback: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    width: wp('7'),
  },
  filterIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    width: wp('7'),
    resizeMode: 'contain',
    height: hp('3'),
    marginLeft: wp('2'),
  },
  styleCheck: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    width: wp('7'),
    marginRight: wp('1'),
    // backgroundColor: 'green'
  },
  HeaderCenter: {
    // flex: 1,
    alignItems: 'center',
    // backgroundColor: 'blue',
    height: hp('5'),
    textAlign: 'center',
    marginTop: hp('1'),
    // width: wp('100'),
  },
  HeaderRight: {
    flex: 0.5,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
});
