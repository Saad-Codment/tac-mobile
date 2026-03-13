import React from 'react';
import {StyleSheet, Text, Image, View, Platform, TextInput} from 'react-native';
import {TextComponent} from './TextComponent';
import {Touchable} from './Touchable';
import {arrow, arrowBack, arrowLeft, cameraBlack} from '../Assets';
import {hp, wp} from '../Config/responsive';
import {Colors} from '../Theme/Variables';
import NavigationService from '../Services/NavigationService';

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
  backIconStyle,
  rightIconImg,
  isSearch,
  searchVal,
  setSearchVal,
  searchBoxPlaceholder,
  isAnotherRightChildern,
  isAllowSearch,
  onGoBack,
  isNewRightImg,
}) => {
  return (
    <View style={[styles.TopHeader, {...style}]}>
      <View style={styles.HeaderLeft}>
        <Touchable
          onPress={() => {
            NavigationService.goBack();
            // if (onGoBack) onGoBack();
          }}
          style={styles.backMain}
          disabled={!isBack}>
          {isBack && (
            <Image
              source={arrowLeft}
              style={{
                resizeMode: 'contain',
                tintColor: 'white',
                ...styles.arrowback,
                ...backIconStyle,
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
        {isSearch ? (
          <View style={styles.inputView}>
            <TextInput
              style={{flex: 1, color: 'white'}}
              placeholder={searchBoxPlaceholder ?? 'Search for friends'}
              placeholderTextColor={'gray'}
              value={searchVal}
              onChangeText={e => setSearchVal(e)}
              returnKeyType="search"
              onEndEditing={onRightPress}
            />
          </View>
        ) : (
          <TextComponent
            text={headerTitle}
            numberOfLines={numberOfLines ?? 1}
            styles={{...styles.HeaderTitle, ...titleStyle}}
          />
        )}
      </View>
      <View style={styles.HeaderRight}>
        {/* <Touchable style={styles.styleCheck} onPress={onRightPress}>
          <Image
            source={icon}
            style={{...styles.filterIcon, ...rightIconStyle}}
          />
        </Touchable> */}
        <Touchable
          style={{
            ...styles.backMain,
            top: Platform.OS == 'android' ? hp('1') : 0,
          }}
          onPress={onRightPress}>
          {/* {isNewRightImg && (
            <Image
              source={cameraBlack}
              tintColor={Colors.primaryColor}
              style={{...styles.filterIcon, ...rightIconStyle}}
            />
          )} */}
          <Image
            source={rightIconImg ?? saveReset}
            style={{...styles.filterIcon, ...rightIconStyle}}
          />
          {isAnotherRightChildern}
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
    paddingTop: Platform.OS == 'ios' ? hp('9') : hp('3'),
    height: Platform.OS == 'ios' ? hp('10') : hp('8'),
    alignItems: 'center',
  },

  backMain: {
    alignItems: 'center',
    flexDirection: 'row',
    textAlign: 'left',
    // alignItems: 'flex-end',

    // backgroundColor: 'red',
  },
  backBtn: {
    marginLeft: wp('1.5'),
    color: Colors.gray,
    fontSize: hp('2'),
    top: Platform.OS == 'ios' ? hp('3') : 0,
  },
  HeaderTitle: {
    fontSize: hp('1.8'),
    color: Colors.white,
    fontWeight: '500',
    // width: wp('60'),
    textAlignVertical: 'center',
    // justifyContent: 'center',
    marginTop: Platform.OS == 'android' ? hp('1') : hp('0.5'),
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
    width: wp('6'),
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
  inputView: {
    width: wp('75'),
    height: hp('5'),
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: Colors.dkBorderColor,
    paddingHorizontal: wp('3'),
    marginRight: wp('5'),
    marginTop: Platform.OS == 'android' ? hp('-0.5') : hp('-1.2'),
    // marginBottom: hp('9'),
  },
  styleCheck: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    width: wp('7'),
    marginRight: wp('1'),
    // backgroundColor: 'green',
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
    alignSelf: 'flex-end',
  },
});
