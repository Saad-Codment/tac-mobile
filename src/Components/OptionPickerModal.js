import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {TextComponent} from './TextComponent';
import {Touchable} from './Touchable';
import ThemeButton from './ThemeButton';
import {hp, wp} from '../Config/responsive';

// Fully self-contained — same reasoning as StopScheduleModal: a plain
// absolutely-positioned overlay (not RN's <Modal>), own local styles.
// Generic single-select list: pass options as [{label, value}], get the
// picked `value` back via onSelect.
const OptionPickerModal = ({
  visible,
  title,
  subtitle,
  options = [],
  selectedValue,
  onSelect,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <View style={S.overlay}>
      <View style={S.card}>
        <TextComponent text={title} styles={S.title} />
        {!!subtitle && (
          <TextComponent text={subtitle} fade styles={S.subtitle} />
        )}

        <ScrollView style={S.list} showsVerticalScrollIndicator={false}>
          {options.length === 0 ? (
            <TextComponent
              text={'No options available.'}
              fade
              styles={S.emptyText}
            />
          ) : (
            options.map(opt => {
              const isSelected = selectedValue === opt.value;
              return (
                <Touchable
                  key={String(opt.value)}
                  onPress={() => onSelect(opt.value)}
                  style={[S.option, isSelected && S.optionActive]}>
                  <TextComponent
                    text={opt.label}
                    styles={[S.optionText, isSelected && S.optionTextActive]}
                  />
                  {isSelected && (
                    <TextComponent text={'✓'} styles={S.checkmark} />
                  )}
                </Touchable>
              );
            })
          )}
        </ScrollView>

        <ThemeButton
          title="Close"
          style={S.closeBtn}
          textStyle={S.closeBtnText}
          onPress={onClose}
        />
      </View>
    </View>
  );
};

const S = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: wp('6'),
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: wp('5'),
    maxHeight: hp('60'),
  },
  title: {fontSize: hp('1.8'), fontWeight: '700', color: '#111827'},
  subtitle: {fontSize: hp('1.2'), color: '#64748B', marginTop: hp('0.4')},
  list: {marginTop: hp('1.5')},
  emptyText: {
    textAlign: 'center',
    paddingVertical: hp('3'),
    fontSize: hp('1.3'),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1.4'),
    paddingHorizontal: wp('3'),
    borderRadius: 10,
    marginBottom: hp('0.6'),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  optionActive: {borderColor: '#3B82F6', backgroundColor: '#EFF6FF'},
  optionText: {fontSize: hp('1.4'), color: '#111827', fontWeight: '500'},
  optionTextActive: {color: '#1E40AF', fontWeight: '700'},
  checkmark: {fontSize: hp('1.4'), color: '#3B82F6', fontWeight: '700'},
  closeBtn: {
    marginTop: hp('1.5'),
    height: hp('5.2'),
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  closeBtnText: {color: '#1F2937', fontWeight: '600'},
});

export default OptionPickerModal;
