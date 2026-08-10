import React, {memo, useState} from 'react';
import {View, ScrollView, TextInput, Image, Switch} from 'react-native';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {Touchable} from '../../Components/Touchable';
import ThemeButton from '../../Components/ThemeButton';
import OptionPickerModal from '../../Components/OptionPickerModal';
import {hp, wp} from '../../Config/responsive';
import {imageUrl} from '../../Utils/Urls';
import useVehicleFormScreen from './useVehicleFormScreen';
import {styles} from './styles';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';

const FormField = ({label, value, onChangeText, keyboardType, placeholder}) => (
  <View style={styles.fieldWrapper}>
    <TextComponent text={label} styles={styles.fieldLabel} />
    <TextInput
      style={styles.fieldInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      keyboardType={keyboardType}
    />
  </View>
);

const VehicleFormScreen = ({navigation, route}) => {
  const {
    isEdit,
    title,
    setTitle,
    name,
    setName,
    vehicleNumber,
    setVehicleNumber,
    horseStalls,
    setHorseStalls,
    humanSeats,
    setHumanSeats,
    heightCm,
    setHeightCm,
    widthCm,
    setWidthCm,
    lengthCm,
    setLengthCm,
    weightKg,
    setWeightKg,
    axleCount,
    setAxleCount,
    images,
    pickImages,
    removeImage,
    saveVehicle,
    isSaving,
    vehicleType,
    setVehicleType,
    vehicleTypeOptions,
    isLoadingVehicleTypes,
    carriesHorses,
    setCarriesHorses,
    basePricePerHorse,
    setBasePricePerHorse,
    basePricePerSeat,
    setBasePricePerSeat,
  } = useVehicleFormScreen(navigation, route);

  const [showTypePicker, setShowTypePicker] = useState(false);
  const selectedTypeLabel = vehicleTypeOptions.find(
    o => o.value === vehicleType,
  )?.label;

  return (
    <View style={styles.screenContainer}>
      <HeaderComponent
        headerTitle={isEdit ? 'Edit Vehicle' : 'Add Vehicle'}
        isBack
        goBack={() => navigation.goBack()}
      />

      <KeyBoardWrapper
        styles={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <TextComponent text={'Images'} styles={styles.sectionLabel} />
        <View style={styles.imageRow}>
          {images.map((img, idx) => (
            <View key={idx} style={styles.imageThumbWrapper}>
              <Image
                source={{uri: img.isEdit ? imageUrl(img.uri) : img.uri}}
                style={styles.imageThumb}
                resizeMode="cover"
              />
              <Touchable
                onPress={() => removeImage(idx)}
                style={styles.imageRemoveBtn}>
                <TextComponent text={'✕'} styles={styles.imageRemoveBtnText} />
              </Touchable>
            </View>
          ))}
          {images.length < 5 && (
            <Touchable onPress={pickImages} style={styles.imageAddBtn}>
              <TextComponent text={'+'} styles={styles.imageAddBtnText} />
            </Touchable>
          )}
        </View>

        <TextComponent text={'Details'} styles={styles.sectionLabel} />
        <FormField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Big Red Hauler"
        />
        <FormField
          label="Name / Model"
          value={name}
          onChangeText={setName}
          placeholder="Thunder King"
        />
        <FormField
          label="Vehicle Number"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          placeholder="TRK-001"
        />

        {/* NEW — Vehicle Type dropdown */}
        <View style={styles.fieldWrapper}>
          <TextComponent text={'Vehicle Type'} styles={styles.fieldLabel} />
          <Touchable
            onPress={() => setShowTypePicker(true)}
            style={[styles.fieldInput, styles.fieldSelect]}>
            <TextComponent
              text={
                isLoadingVehicleTypes
                  ? 'Loading...'
                  : selectedTypeLabel ?? 'Select vehicle type'
              }
              styles={
                selectedTypeLabel
                  ? styles.fieldSelectTextFilled
                  : styles.fieldSelectTextEmpty
              }
            />
            <TextComponent text={'▾'} styles={styles.fieldSelectChevron} />
          </Touchable>
        </View>

        {/* NEW — Carries Horses toggle */}
        <View style={styles.toggleRow}>
          <View style={{flex: 1}}>
            <TextComponent text={'Carries Horses'} styles={styles.fieldLabel} />
            <TextComponent
              text={'Does this vehicle transport horses?'}
              fade
              styles={styles.toggleHint}
            />
          </View>
          <Switch
            value={carriesHorses}
            onValueChange={setCarriesHorses}
            trackColor={{false: '#E5E7EB', true: '#3B82F688'}}
            thumbColor={carriesHorses ? '#3B82F6' : '#F3F4F6'}
          />
        </View>

        <TextComponent text={'Capacity'} styles={styles.sectionLabel} />
        <View style={styles.row}>
          <View style={styles.halfField}>
            <FormField
              label="Horse Stalls"
              value={horseStalls}
              onChangeText={setHorseStalls}
              keyboardType="number-pad"
              placeholder="6"
            />
          </View>
          <View style={styles.halfField}>
            <FormField
              label="Human Seats"
              value={humanSeats}
              onChangeText={setHumanSeats}
              keyboardType="number-pad"
              placeholder="4"
            />
          </View>
        </View>

        {/* NEW — Pricing */}
        <TextComponent
          text={'Pricing (for joiners)'}
          styles={styles.sectionLabel}
        />
        <View style={styles.row}>
          <View style={styles.halfField}>
            <FormField
              label="Price per Horse ($)"
              value={basePricePerHorse}
              onChangeText={setBasePricePerHorse}
              keyboardType="decimal-pad"
              placeholder="50.00"
            />
          </View>
          <View style={styles.halfField}>
            <FormField
              label="Price per Seat ($)"
              value={basePricePerSeat}
              onChangeText={setBasePricePerSeat}
              keyboardType="decimal-pad"
              placeholder="20.00"
            />
          </View>
        </View>

        <TextComponent text={'Dimensions'} styles={styles.sectionLabel} />
        <View style={styles.row}>
          <View style={styles.halfField}>
            <FormField
              label="Height (cm)"
              value={heightCm}
              onChangeText={setHeightCm}
              keyboardType="decimal-pad"
              placeholder="380"
            />
          </View>
          <View style={styles.halfField}>
            <FormField
              label="Width (cm)"
              value={widthCm}
              onChangeText={setWidthCm}
              keyboardType="decimal-pad"
              placeholder="250"
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.halfField}>
            <FormField
              label="Length (cm)"
              value={lengthCm}
              onChangeText={setLengthCm}
              keyboardType="decimal-pad"
              placeholder="1200"
            />
          </View>
          <View style={styles.halfField}>
            <FormField
              label="Weight (kg)"
              value={weightKg}
              onChangeText={setWeightKg}
              keyboardType="decimal-pad"
              placeholder="8500"
            />
          </View>
        </View>
        <FormField
          label="Axle Count"
          value={axleCount}
          onChangeText={setAxleCount}
          keyboardType="number-pad"
          placeholder="3"
        />
      </KeyBoardWrapper>

      <View style={styles.bottomBar}>
        <ThemeButton
          title={
            isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Vehicle'
          }
          isYellowTheme
          disabled={isSaving}
          style={styles.saveBtn}
          onPress={saveVehicle}
        />
      </View>

      <OptionPickerModal
        visible={showTypePicker}
        title="Select Vehicle Type"
        options={vehicleTypeOptions}
        selectedValue={vehicleType}
        onSelect={value => {
          setVehicleType(value);
          setShowTypePicker(false);
        }}
        onClose={() => setShowTypePicker(false)}
      />
    </View>
  );
};

export default memo(VehicleFormScreen);
