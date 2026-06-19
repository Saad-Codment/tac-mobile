import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  Platform,
  Switch,
  Alert,
  ImageBackground,
  FlatList,
} from 'react-native';
import React, {memo, useCallback, useState} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';
import {Touchable} from '../../Components/Touchable';
import {crossWhite, editProfileBlack} from '../../Assets';
import ErrorInputComponent from '../../Components/ErrorInputComponent';
import ThemeButton from '../../Components/ThemeButton';
import {styles} from './styles';
import useTruckAddScreen from './useTruckAddScreen';
import {
  uploadFromCamera,
  uploadFromGalary,
} from '../../Services/GlobalFunctions';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';
import {Controller} from 'react-hook-form';
import {imageUrl} from '../../Utils/Urls';
import {keyExtractor} from '../../Utils';

const TruckAddScreen = ({navigation, route}) => {
  const {errors, control, isEditTruck, handleSubmit, createTruckFun} =
    useTruckAddScreen(navigation, route);

  const TitleInputView = ({
    title,
    onChange,
    placeHolder,
    validation,
    rightView,
    innerViewOuterStyle,
    innerExtraView,
    titleStyle,
    innerLeftView,
    centerInnerView,
    errorName,
    errorView,
  }) => {
    return (
      <View style={styles.mainView}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TextComponent
            text={title}
            fade={true}
            styles={{
              ...styles.compTitle,
              ...titleStyle,
            }}
          />
          {rightView}
        </View>
        {centerInnerView ? (
          centerInnerView
        ) : (
          <>
            <View
              style={{
                ...styles.innerView,
                ...innerViewOuterStyle,
              }}>
              {innerLeftView}
              {innerExtraView}
            </View>
            {errorName && (
              <TextComponent
                text={errorName.message ?? errorName}
                styles={styles.errorText}
                numberOfLines={3}
              />
            )}
          </>
        )}
      </View>
    );
  };

  const renderImageView = useCallback(({item, index, onChange, value}) => {
    return (
      <>
        <Touchable
          style={{
            position: 'absolute',
            zIndex: 1,
            right: wp('2'),
            top: hp('1'),
          }}
          onPress={() => {
            const imgArry = [...value];
            onChange(imgArry.filter(res => res?.uri != item?.uri));
          }}>
          <Image
            source={crossWhite}
            resizeMode="contain"
            style={{width: wp('4'), height: hp('3')}}
          />
        </Touchable>
        <Image
          source={{uri: item?.isEdit ? imageUrl(item?.uri) : item?.uri}}
          resizeMode="cover"
          style={{
            width: wp('44'),
            height: hp('12'),
            borderRadius: 10,
            marginVertical: hp('0.5'),
          }}
        />
      </>
    );
  }, []);

  return (
    <View style={{flexGrow: 1}}>
      <HeaderComponent
        headerTitle={isEditTruck ? 'Update Truck' : 'Add Truck'}
        isBack
        goBack={() => navigation.goBack()}
      />

      <KeyBoardWrapper
        styles={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* ── Truck Title ── */}
        <TitleInputView
          title={'Vehicle Number *'}
          errorName={errors['vehicle_number']}
          innerLeftView={
            <Controller
              control={control}
              name="vehicle_number"
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Enter vehicle number"
                  maxLength={50}
                  placeholderTextColor={'gray'}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          }
          innerExtraView={
            <Controller
              control={control}
              name="vehicle_number"
              defaultValue={''}
              render={({field: {onChange, value}}) => (
                <TextComponent
                  text={`${(value ?? '').length}/50`}
                  styles={{fontSize: hp('1.2')}}
                />
              )}
            />
          }
        />

        {/* ── Truck Image ── */}
        <TitleInputView
          title={'Truck Image *'}
          errorName={errors['truckImg']}
          centerInnerView={
            <Controller
              control={control}
              name="truckImg"
              render={({field: {onChange, value}}) => (
                <>
                  <FlatList
                    data={value}
                    renderItem={({item, index}) =>
                      renderImageView({item, index, onChange, value})
                    }
                    keyExtractor={keyExtractor}
                    contentContainerStyle={{
                      flexDirection: 'row',
                      width: wp('90'),
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    showsHorizontalScrollIndicator={false}
                    ListFooterComponent={
                      (value?.length ?? 0) <= 4 && (
                        <Touchable
                          onPress={async () => {
                            Alert.alert(
                              'Pick to choose image',
                              '',
                              [
                                {
                                  text: 'Camera',
                                  onPress: async () => {
                                    const imgData = await uploadFromCamera(
                                      false,
                                      false,
                                      5,
                                    );
                                    onChange([imgData]);
                                  },
                                },
                                {
                                  text: 'Gallery',
                                  onPress: async () => {
                                    const imgData = await uploadFromGalary(
                                      false,
                                      false,
                                      Math.max(0, 5 - (value?.length ?? 0)),
                                    );
                                    onChange([imgData]);
                                  },
                                },
                                {
                                  text: 'Cancel',
                                  style: 'destructive',
                                  onPress: () => {},
                                },
                              ],
                              {cancelable: true},
                            );
                          }}
                          style={{
                            width: wp('44'),
                            height: hp('12'),
                            borderRadius: 10,
                            marginVertical: hp('0.5'),
                            borderWidth: 0.5,
                            borderColor: Colors.grayBorder,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Colors.lightInnerColor,
                          }}>
                          <Image
                            source={editProfileBlack}
                            resizeMode="contain"
                            style={{width: wp('6'), height: hp('4')}}
                          />
                          <TextComponent
                            text={'Upload Image'}
                            size={hp('1.5')}
                          />
                        </Touchable>
                      )
                    }
                  />
                  {errors['truckImg'] && (
                    <TextComponent
                      text={errors['truckImg'].message}
                      styles={styles.errorText}
                    />
                  )}
                  <TextComponent />
                </>
              )}
            />
          }
        />

        {/* ── Name ── */}
        <TitleInputView
          title={'Name *'}
          errorName={errors['name']}
          innerLeftView={
            <Controller
              control={control}
              name="name"
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Enter name"
                  placeholderTextColor={'gray'}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          }
        />

        {/* ── Horse Stalls & Human Seats ── */}
        <View style={styles.viewFlex}>
          <TitleInputView
            title={'Horse Stalls *'}
            errorName={errors['horse_stalls']}
            innerLeftView={
              <Controller
                control={control}
                name="horse_stalls"
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="0"
                    placeholderTextColor={'gray'}
                    value={
                      value !== undefined && value !== null ? String(value) : ''
                    }
                    onChangeText={text =>
                      onChange(text === '' ? '' : Number(text))
                    }
                    keyboardType="number-pad"
                  />
                )}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            title={'Human Seats *'}
            errorName={errors['human_seats']}
            innerLeftView={
              <Controller
                control={control}
                name="human_seats"
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="0"
                    placeholderTextColor={'gray'}
                    value={
                      value !== undefined && value !== null ? String(value) : ''
                    }
                    onChangeText={text =>
                      onChange(text === '' ? '' : Number(text))
                    }
                    keyboardType="number-pad"
                  />
                )}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>

        {/* ── Height & Weight ── */}
        <View style={styles.viewFlex}>
          <TitleInputView
            title={'Height (cm) *'}
            errorName={errors['height_cm']}
            innerLeftView={
              <Controller
                control={control}
                name="height_cm"
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="0"
                    placeholderTextColor={'gray'}
                    value={
                      value !== undefined && value !== null ? String(value) : ''
                    }
                    onChangeText={text =>
                      onChange(text === '' ? '' : Number(text))
                    }
                    keyboardType="number-pad"
                  />
                )}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            title={'Weight (kg) *'}
            errorName={errors['weight_kg']}
            innerLeftView={
              <Controller
                control={control}
                name="weight_kg"
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="0"
                    placeholderTextColor={'gray'}
                    value={
                      value !== undefined && value !== null ? String(value) : ''
                    }
                    onChangeText={text =>
                      onChange(text === '' ? '' : Number(text))
                    }
                    keyboardType="number-pad"
                  />
                )}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>

        {/* ── Length & Width ── */}
        <View style={styles.viewFlex}>
          <TitleInputView
            title={'Length (cm) *'}
            errorName={errors['length_cm']}
            innerLeftView={
              <Controller
                control={control}
                name="length_cm"
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="0"
                    placeholderTextColor={'gray'}
                    value={
                      value !== undefined && value !== null ? String(value) : ''
                    }
                    onChangeText={text =>
                      onChange(text === '' ? '' : Number(text))
                    }
                    keyboardType="number-pad"
                  />
                )}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            title={'Width (cm) *'}
            errorName={errors['width_cm']}
            innerLeftView={
              <Controller
                control={control}
                name="width_cm"
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="0"
                    placeholderTextColor={'gray'}
                    value={
                      value !== undefined && value !== null ? String(value) : ''
                    }
                    onChangeText={text =>
                      onChange(text === '' ? '' : Number(text))
                    }
                    keyboardType="number-pad"
                  />
                )}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>

        {/* ── Axle Count ── */}
        <TitleInputView
          title={'Axle Count *'}
          errorName={errors['axle_count']}
          innerLeftView={
            <Controller
              control={control}
              name="axle_count"
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.inputStyle}
                  placeholder="0"
                  placeholderTextColor={'gray'}
                  value={
                    value !== undefined && value !== null ? String(value) : ''
                  }
                  onChangeText={text =>
                    onChange(text === '' ? '' : Number(text))
                  }
                  keyboardType="number-pad"
                />
              )}
            />
          }
        />

        <ThemeButton
          title={isEditTruck ? 'Update Truck' : 'Add Truck'}
          isYellowTheme
          style={styles.createBtnStyle}
          onPress={handleSubmit(createTruckFun)}
          textStyle={{fontSize: hp('1.5')}}
        />
      </KeyBoardWrapper>
    </View>
  );
};

export default memo(TruckAddScreen);
