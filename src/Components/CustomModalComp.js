import React, {useState} from 'react';
import {Modal, View, StyleSheet, Image} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {TextComponent} from './TextComponent';
import {Touchable} from './Touchable';
import {hp, wp} from '../Config/responsive';
import {Colors} from '../Theme/Variables';
import {tickSquare, unCheck} from '../Assets';

const CustomModalComp = ({
  visible,
  onCancel,
  onConfirm,
  subtitle,
  checkBoxText,
  checkBoxImg,
  isAleadyAddedToCalender,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TextComponent
            text="Confirm Action"
            size={hp(1.8)}
            fontFamily="bold"
            styles={styles.heading}
          />

          <TextComponent
            text={subtitle}
            size={hp(1.8)}
            fontFamily="Regular"
            styles={styles.subtitle}
          />

          <View style={styles.checkboxContainer}>
            {/* <CheckBox
              value={isChecked}
              onValueChange={setIsChecked}
              tintColors={{true: Colors.primaryColor, false: '#ccc'}}
              style={{transform: [{scale: 0.75}]}} // Decreases size to 75%
            /> */}
            {isAleadyAddedToCalender ? (
              <TextComponent
                text={'This event is already in your device calendar.'}
              />
            ) : (
              <>
                <Touchable onPress={() => setIsChecked(!isChecked)}>
                  <Image
                    source={isChecked ? tickSquare : unCheck}
                    //   source={unCheck}
                    resizeMode="contain"
                    style={styles.checkImg}
                  />
                </Touchable>
                <TextComponent
                  text={checkBoxText}
                  size={hp(1.5)}
                  fontFamily="Regular"
                  styles={styles.checkboxLabel}
                />
              </>
            )}
          </View>

          <View style={styles.buttonRow}>
            <Touchable
              style={styles.cancelBtn}
              onPress={() => {
                setIsChecked(false);
                onCancel();
              }}>
              <TextComponent
                text="Cancel"
                size={hp(1.8)}
                fontFamily="Medium"
                color="#000"
              />
            </Touchable>

            <Touchable
              style={styles.okBtn}
              onPress={() => {
                setIsChecked(false);
                onConfirm(isChecked);
              }}>
              <TextComponent
                text="OK"
                size={hp(1.8)}
                fontFamily="Medium"
                isWhite
              />
            </Touchable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModalComp;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp(85),
    backgroundColor: 'white',
    borderRadius: wp(3),
    padding: wp(5),
  },
  heading: {
    textAlign: 'center',
    marginBottom: hp(3),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: hp(2),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: hp(3),
  },
  checkImg: {
    width: wp('6'),
    height: hp('3'),
    // marginRight: wp('2'),
    // marginRight: wp('-2'),
  },
  checkboxLabel: {
    marginLeft: wp(2),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: hp(1.5),
    backgroundColor: '#ddd',
    borderRadius: wp(2),
    alignItems: 'center',
    marginRight: wp(2),
  },
  okBtn: {
    flex: 1,
    paddingVertical: hp(1.5),
    backgroundColor: Colors.primaryColor,
    borderRadius: wp(2),
    alignItems: 'center',
    marginLeft: wp(2),
  },
});
