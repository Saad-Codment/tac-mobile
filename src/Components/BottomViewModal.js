import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import React, {memo} from 'react';
import {Touchable} from './Touchable';
import {boldDivider, crossWhite} from '../Assets';
import {TextComponent} from './TextComponent';
import {Colors} from '../Theme/Variables';
import Modal from 'react-native-modal';
import ThemeButton from './ThemeButton';
import {hp, wp} from '../Config/responsive';

const BottomViewModal = memo(
  ({
    heading,
    subtitle,
    isModal,
    onPress,
    onBackPress,
    firstHit,
    childrenComp,
    btnTitle,
    isNewBtn,
    newBtnTitle,
    onNewBtnPress,
    hideBtn,
  }) => {
    return (
      <View style={styles.modalView}>
        <Modal
          isVisible={isModal}
          animationInTiming={100}
          animationOutTiming={100}
          avoidKeyboard
          animationType="fade"
          // hideModalContentWhileAnimating
          // useNativeDriver
          onBackButtonPress={onBackPress}
          style={styles.bottomModal}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                ...styles.modalData,
                paddingBottom: !onPress ? hp('5') : 0,
              }}>
              <View style={styles.upperIconView}>
                <Image
                  source={boldDivider}
                  resizeMode="contain"
                  style={styles.divider}
                />
                <Touchable onPress={onBackPress}>
                  <Image
                    source={crossWhite}
                    resizeMode="contain"
                    style={styles.cancelIcon}
                  />
                </Touchable>
              </View>
              <TextComponent text={heading} styles={styles.headingText} />
              <TextComponent
                text={subtitle}
                styles={{
                  textAlign: 'center',
                  width: wp('70'),
                  alignSelf: 'center',
                }}
                fade
                size={'1.6'}
              />
              <ScrollView
                showsVerticalScrollIndicator={false}
                // keyboardShouldPersistTaps="always"
                contentContainerStyle={styles.modalScroll}>
                {childrenComp}
                {!hideBtn && onPress && !isNewBtn && (
                  <ThemeButton
                    title={btnTitle ?? 'Save expense'}
                    style={{
                      ...styles.modalBtn,
                    }}
                    onPress={() => {
                      onPress();
                    }}
                    isTheme
                    textStyle={{fontSize: hp('1.5')}}
                  />
                )}
                {isNewBtn && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: wp('90'),
                    }}>
                    <ThemeButton
                      title={newBtnTitle ?? 'Delete'}
                      style={{
                        ...styles.modalBtn,
                        backgroundColor: 'red',
                        width: wp('42'),
                        // bottom: hp('12'),
                      }}
                      onPress={() => {
                        onNewBtnPress();
                      }}
                      textStyle={{fontSize: hp('1.5')}}
                    />
                    <ThemeButton
                      title={btnTitle ?? 'Save expense'}
                      style={{
                        ...styles.modalBtn,
                        width: wp('42'),
                      }}
                      onPress={() => {
                        onPress();
                      }}
                      isTheme
                      textStyle={{fontSize: hp('1.5')}}
                    />
                  </View>
                )}
              </ScrollView>
              {/* {firstHit && ( */}
              {/* )} */}
            </View>
          </View>
        </Modal>
      </View>
    );
  },
);

export default BottomViewModal;

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalData: {
    // height: tripType ? hp('40') : hp('30'),
    backgroundColor: Colors.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 10,
    },
    shadowOpacity: 3,
    shadowRadius: 7.68,
    elevation: 20,
    width: wp('100'),
    paddingHorizontal: wp('5'),
    maxHeight: hp('90'),
    height: 'auto',
    alignSelf: 'center',
    marginBottom: hp('-2.5'),

    // height: hp('40'),
  },
  upperIconView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  divider: {width: wp('15'), height: hp('5'), left: wp('40'), top: hp('1')},
  cancelIcon: {
    alignSelf: 'flex-end',
    tintColor: 'black',
    width: wp('5'),
    height: hp('2'),
  },
  headingText: {
    fontSize: hp('2'),
    fontWeight: 'bold',
    paddingLeft: wp('5'),
    marginBottom: hp('1'),
    textAlign: 'center',
  },
  addIcon: {
    position: 'absolute',
    right: wp('15'),
    height: hp('6'),
    top: hp('8.8'),
  },
  whiteCircle: {
    // height: hp('22'),
    // width: wp('32'),
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('90'),
    marginTop: hp('10'),
  },
  modalScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wp('90'),
    // paddingBottom: hp('5'), // Adjust as needed
  },
  inputView: {
    width: wp('90'),
    height: hp('5'),
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: Colors.dkBorderColor,
    paddingHorizontal: wp('3'),
    marginBottom: hp('5'),
  },
  ageViewModal: {
    width: wp('90'),
    marginBottom: hp('20'),
    marginTop: hp('3'),
  },
  modalBtn: {
    width: wp('90'),
    alignSelf: 'center',
    marginTop: hp('2'),
    marginBottom: hp('5'),
    height: hp('5'),
  },
  textStyle: {
    fontSize: hp('1.5'),
    textAlign: 'center',
    borderRadius: 25,
    borderWidth: 1,
    paddingVertical: hp('2'),
  },
  gender: selectedGender => ({
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: selectedGender ? Colors.black : Colors.textGray,
    borderRadius: 50,
    width: wp('92'),
    paddingHorizontal: wp('4'),
    paddingVertical: hp('1.5'),
    alignItems: 'center',
    marginBottom: hp('3.5'),
    backgroundColor: selectedGender ? Colors.black : 'transparent',
    // height: hp('3'),
  }),
  genderTitle: selectedGender => ({
    fontWeight: '400',
    fontSize: hp('1.5'),
    color: selectedGender ? Colors.white : Colors.textGray,
  }),
  leftIconStyle: {
    width: wp('5'),
    height: hp('2'),
  },
});
