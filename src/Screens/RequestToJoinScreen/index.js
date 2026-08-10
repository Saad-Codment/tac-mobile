import React, {memo, useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {Touchable} from '../../Components/Touchable';
import ThemeButton from '../../Components/ThemeButton';
import OptionPickerModal from '../../Components/OptionPickerModal';
import Stepper from '../../Components/Stepper';
import {hp, wp} from '../../Config/responsive';
import useRequestToJoinScreen from './useRequestToJoinScreen';
import {styles} from './styles';

const RequestToJoinScreen = ({navigation, route}) => {
  const {
    pickupStopId,
    dropoffStopId,
    setDropoffStopId,
    selectPickup,
    pickupOptions,
    dropoffOptions,
    humanCount,
    setHumanCount,
    horseCount,
    setHorseCount,
    submitRequest,
    isSubmitting,
  } = useRequestToJoinScreen(navigation, route);

  const [activePicker, setActivePicker] = useState(null); // 'pickup' | 'dropoff' | null

  const pickupLabel = pickupOptions.find(o => o.value === pickupStopId)?.label;
  const dropoffLabel = dropoffOptions.find(
    o => o.value === dropoffStopId,
  )?.label;

  return (
    <View style={styles.screenContainer}>
      <HeaderComponent
        headerTitle={'Request to Join'}
        isBack
        goBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <TextComponent
          text={'Where do you need to go?'}
          styles={styles.sectionLabel}
        />

        <View style={styles.fieldWrapper}>
          <TextComponent text={'Pickup Stop'} styles={styles.fieldLabel} />
          <Touchable
            onPress={() => setActivePicker('pickup')}
            style={styles.selectField}>
            <TextComponent
              text={pickupLabel ?? 'Select pickup stop'}
              styles={
                pickupLabel ? styles.selectTextFilled : styles.selectTextEmpty
              }
            />
            <TextComponent text={'▾'} styles={styles.selectChevron} />
          </Touchable>
        </View>

        <View style={styles.fieldWrapper}>
          <TextComponent text={'Dropoff Stop'} styles={styles.fieldLabel} />
          <Touchable
            onPress={() => pickupStopId && setActivePicker('dropoff')}
            style={[
              styles.selectField,
              !pickupStopId && styles.selectFieldDisabled,
            ]}>
            <TextComponent
              text={
                dropoffLabel ??
                (pickupStopId ? 'Select dropoff stop' : 'Select pickup first')
              }
              styles={
                dropoffLabel ? styles.selectTextFilled : styles.selectTextEmpty
              }
            />
            <TextComponent text={'▾'} styles={styles.selectChevron} />
          </Touchable>
        </View>

        <TextComponent
          text={'How many are joining?'}
          styles={styles.sectionLabel}
        />
        <View style={styles.card}>
          <Stepper
            label={'👤 Seats'}
            value={humanCount}
            onChange={setHumanCount}
          />
          <View style={styles.divider} />
          <Stepper
            label={'🐴 Horses'}
            value={horseCount}
            onChange={setHorseCount}
          />
        </View>

        <TextComponent
          text={
            "At least one seat or horse is required. The organizer will review your request before it's confirmed."
          }
          fade
          styles={styles.hintText}
        />
      </ScrollView>

      <View style={styles.bottomBar}>
        <ThemeButton
          title={isSubmitting ? 'Submitting...' : 'Submit Request'}
          isYellowTheme
          disabled={isSubmitting}
          style={styles.submitBtn}
          onPress={submitRequest}
        />
      </View>

      <OptionPickerModal
        visible={activePicker === 'pickup'}
        title="Select Pickup Stop"
        options={pickupOptions}
        selectedValue={pickupStopId}
        onSelect={value => {
          selectPickup(value);
          setActivePicker(null);
        }}
        onClose={() => setActivePicker(null)}
      />
      <OptionPickerModal
        visible={activePicker === 'dropoff'}
        title="Select Dropoff Stop"
        subtitle="Must come after your pickup stop"
        options={dropoffOptions}
        selectedValue={dropoffStopId}
        onSelect={value => {
          setDropoffStopId(value);
          setActivePicker(null);
        }}
        onClose={() => setActivePicker(null)}
      />
    </View>
  );
};

export default memo(RequestToJoinScreen);
