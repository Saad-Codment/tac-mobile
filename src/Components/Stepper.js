import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TextComponent} from './TextComponent';
import {Touchable} from './Touchable';
import {hp, wp} from '../Config/responsive';

const Stepper = ({label, value, onChange, min = 0, max = 20}) => (
  <View style={S.row}>
    <TextComponent text={label} styles={S.label} />
    <View style={S.controls}>
      <Touchable
        onPress={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        style={[S.btn, value <= min && S.btnDisabled]}>
        <TextComponent text={'−'} styles={S.btnText} />
      </Touchable>
      <TextComponent text={String(value)} styles={S.value} />
      <Touchable
        onPress={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        style={[S.btn, value >= max && S.btnDisabled]}>
        <TextComponent text={'+'} styles={S.btnText} />
      </Touchable>
    </View>
  </View>
);

const S = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1'),
  },
  label: {fontSize: hp('1.4'), fontWeight: '600', color: '#111827'},
  controls: {flexDirection: 'row', alignItems: 'center', gap: wp('3')},
  btn: {
    width: wp('9'),
    height: wp('9'),
    borderRadius: wp('4.5'),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: {opacity: 0.4},
  btnText: {fontSize: hp('1.8'), color: '#3B82F6', fontWeight: '700'},
  value: {
    fontSize: hp('1.6'),
    fontWeight: '700',
    color: '#111827',
    minWidth: wp('8'),
    textAlign: 'center',
  },
});

export default Stepper;
