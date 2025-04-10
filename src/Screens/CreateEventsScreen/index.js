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
} from 'react-native';
import React, {memo, useState} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';
import {Touchable} from '../../Components/Touchable';
import {
  addcircle,
  arrRight,
  crossWhite,
  gpsImg,
  infoCircle,
  questionMark,
  radioCircle,
  radioCircleOn,
  squareGray,
  tickSquare,
  uploadImgView,
} from '../../Assets';
import DatePicker from 'react-native-date-picker';
import DividerLine from '../../Components/DividerLine';
import ErrorInputComponent from '../../Components/ErrorInputComponent';
import {Dropdown} from 'react-native-element-dropdown';
import DropDownPicker from 'react-native-dropdown-picker';
import ThemeButton from '../../Components/ThemeButton';
import {styles} from './styles';
import useCreateEventsScreen from './useCreateEventsScreen';
import {
  convertToCustomTimeFormat,
  formatDateToCustomFormat,
  getOrdinal,
  uploadFromCamera,
  uploadFromGalary,
} from '../../Services/GlobalFunctions';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';
import {Controller} from 'react-hook-form';
import {
  allAssociatesUrl,
  allEventCircuitUrl,
  allEventTypeUrl,
  getAllTypeUrl,
} from '../../Utils/Urls';
import {InfoModal} from '../../Components/InfoModalComp';

const CreateEventsScreen = ({navigation}) => {
  const {
    currentDate,
    datePicker,
    errors,
    control,
    perfEventListArry,
    modalVisible,
    setModalVisible,
    createEventFun,
    handleSubmit,
    append,
    remove,
    getFieldState,
    setValue,
    register,
    toggleDate,
    dynamicRoute,
  } = useCreateEventsScreen(navigation);

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
            // justifyContent: rightView ? 'space-between' : 'flex-start',
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
                text={errorName.message}
                styles={styles.errorText}
              />
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <View style={{flexGrow: 1}}>
      <HeaderComponent headerTitle={'Create Event'} />

      <KeyBoardWrapper
        styles={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* <Controller
        render={({field: {onChange, value}}) => ( */}
        <TitleInputView
          title={'Event Title *'}
          errorName={errors['eventTitle']}
          innerLeftView={
            <Controller
              control={control}
              name="eventTitle"
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Enter title"
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
              name="eventTitle"
              defaultValue={''}
              render={({field: {onChange, value}}) => (
                <TextComponent
                  text={`${value.length}/50`}
                  styles={{fontSize: hp('1.5')}}
                />
              )}
            />
          }
        />

        <TitleInputView
          title={'Event Image *'}
          errorName={errors['eventImg']}
          centerInnerView={
            <Controller
              control={control}
              name="eventImg"
              render={({field: {onChange, value}}) => (
                <>
                  <Touchable
                    // onPress={async () => {
                    //   const imgData = await uploadFromGalary();
                    //   onChange(imgData);
                    // }}
                    onPress={async () => {
                      Alert.alert(
                        'Pick to choose image',
                        '',
                        [
                          {
                            text: 'Camera',
                            onPress: async () => {
                              const imgData = await uploadFromCamera();
                              onChange(imgData);
                            },
                          },
                          {
                            text: 'Gallery', // Just a dismissal button
                            onPress: async () => {
                              const imgData = await uploadFromGalary();
                              onChange(imgData);
                            },
                          },
                        ],
                        {cancelable: true},
                      );
                    }}>
                    <Image
                      source={value?.uri ? {uri: value?.uri} : uploadImgView}
                      style={styles.uploadImg}
                    />
                  </Touchable>
                  {errors['eventImg'] && (
                    <TextComponent
                      text={errors['eventImg'].message}
                      styles={styles.errorText}
                    />
                  )}
                </>
              )}
            />
          }
        />

        <View style={styles.viewFlex}>
          <TitleInputView
            title={'Start Date *'}
            errorName={errors['eventStartDate']}
            innerLeftView={
              <Controller
                control={control}
                name="eventStartDate"
                render={({field: {onChange, value}}) => (
                  <TextComponent
                    text={formatDateToCustomFormat(value ?? currentDate)}
                    onPress={() =>
                      toggleDate('eventStartDate', 'date', null, onChange)
                    }
                    styles={styles.textStyle}
                  />
                )}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            title={'Start Time *'}
            errorName={errors['eventStartTime']}
            innerLeftView={
              <Controller
                control={control}
                name="eventStartTime"
                render={({field: {onChange, value}}) => (
                  <TextComponent
                    text={convertToCustomTimeFormat(value ?? currentDate)}
                    onPress={() =>
                      toggleDate('eventStartTime', 'time', null, onChange)
                    }
                    styles={styles.textStyle}
                  />
                )}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>
        <View style={styles.viewFlex}>
          <TitleInputView
            title={'End Date *'}
            errorName={errors['eventEndDate']}
            innerLeftView={
              <Controller
                control={control}
                name="eventEndDate"
                render={({field: {onChange, value}}) => (
                  <TextComponent
                    text={formatDateToCustomFormat(value ?? currentDate)}
                    onPress={() =>
                      toggleDate('eventEndDate', 'date', null, onChange)
                    }
                    styles={styles.textStyle}
                  />
                )}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            title={'End Time *'}
            errorName={errors['eventEndTime']}
            innerLeftView={
              <Controller
                control={control}
                name="eventEndTime"
                render={({field: {onChange, value}}) => (
                  <TextComponent
                    text={convertToCustomTimeFormat(value ?? currentDate)}
                    onPress={() =>
                      toggleDate('eventEndTime', 'time', null, onChange)
                    }
                    styles={styles.textStyle}
                  />
                )}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>
        <TitleInputView
          title={'Event Location *'}
          errorName={errors['eventLocation']?.locationName}
          innerLeftView={
            <Controller
              control={control}
              name="eventLocation"
              render={({field: {onChange, value}}) => (
                <TextComponent
                  text={value?.locationName ?? 'Please select location.'}
                  styles={styles.textStyle}
                  onPress={() =>
                    dynamicRoute('LocationScreen', (locationName, coords) => {
                      console.log(
                        'locationNamelocationNamelocationNamelocationNamelocationNamelocationName',
                        locationName,
                        coords,
                      );
                      onChange({
                        locationName: locationName,
                        coords: coords,
                      });
                    })
                  }
                />
              )}
            />
          }
          innerExtraView={
            <Image
              source={gpsImg}
              resizeMode="contain"
              style={styles.leftViewImg}
            />
          }
        />
        {/* <TitleInputView
          title={'Performances'}
          centerInnerView={
            <View
              style={{
                ...styles.innerView,
                ...styles.perInnerViewExtra,
              }}>
              {perfEventListArry.map((res, i) => {
                return (
                  <View style={styles.perMapView} key={res?.id}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <TextComponent
                        text={`${getOrdinal(i + 1)} Performance: `}
                        styles={{...styles.textStyle}}
                      />
                      <Controller
                        control={control}
                        name={`perfEventList[${i}].title`}
                        render={({field: {onChange, value}}) => (
                          <TextInput
                            placeholderTextColor={'gray'}
                            placeholder="Enter title"
                            value={value}
                            style={{flex: 1, color: 'black', width: wp('50')}}
                            onChangeText={e =>
                              setValue(`perfEventList[${i}].title`, e)
                            }
                          />
                        )}
                      />
                      {i > 0 && (
                        <Touchable
                          style={{marginLeft: wp('3')}}
                          onPress={() => remove(i)}>
                          <Image
                            source={crossWhite}
                            resizeMode="contain"
                            tintColor={'black'}
                            style={{width: wp('3'), height: hp('2')}}
                          />
                        </Touchable>
                      )}
                    </View>
                    <DividerLine DividerLineStyle={styles.divider} />
                    <Controller
                      control={control}
                      name={`perfEventList[${i}].date`}
                      render={({field: {onChange, value}}) => (
                        <TextComponent
                          onPress={() =>
                            toggleDate(
                              `perfEventList[${i}].date`,
                              'date',
                              null,
                              onChange,
                            )
                          }
                          text={formatDateToCustomFormat(value ?? currentDate)}
                          styles={{
                            ...styles.perInnerText,
                            width: wp('85'),
                            alignSelf: 'center',
                            marginBottom: hp('1'),
                          }}
                        />
                      )}
                    />
                    <View
                      style={{
                        ...styles.perInnerView,
                        alignItems: 'center',
                      }}>
                      <Controller
                        control={control}
                        name={`perfEventList[${i}].startTime`}
                        render={({field: {onChange, value}}) => (
                          <TextComponent
                            onPress={() =>
                              toggleDate(
                                `perfEventList[${i}].startTime`,
                                'time',
                                null,
                                onChange,
                              )
                            }
                            text={convertToCustomTimeFormat(
                              value ?? currentDate,
                            )}
                            styles={styles.perInnerText}
                          />
                        )}
                      />
                      <TextComponent text={'-'} />
                      <Controller
                        control={control}
                        name={`perfEventList[${i}].endTime`}
                        render={({field: {onChange, value}}) => (
                          <TextComponent
                            onPress={() =>
                              toggleDate(
                                `perfEventList[${i}].endTime`,
                                'time',
                                null,
                                onChange,
                              )
                            }
                            text={convertToCustomTimeFormat(
                              value ?? currentDate,
                            )}
                            styles={styles.perInnerText}
                          />
                        )}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          }
          innerViewOuterStyle={{
            ...styles.perInnerOuterView,
            paddingHorizontal: 0,
          }}
          rightView={
            <Touchable
              style={styles.addMoreView}
              onPress={() => {
                append({
                  title: '',
                  date: currentDate,
                  startTime: currentDate,
                  endTime: currentDate,
                });
              }}>
              <Image
                source={addcircle}
                resizeMode="contain"
                style={styles.addMoreImg}
              />
              <TextComponent
                text={'Add more'}
                fade={true}
                styles={styles.addMoreTxt}
              />
            </Touchable>
          }
        /> */}
        <View style={styles.viewFlex}>
          <TitleInputView
            title={'Event Type *'}
            errorName={errors['eventType']?.name}
            innerLeftView={
              <Controller
                control={control}
                name={`eventType`}
                render={({field: {onChange, value}}) => (
                  <TextComponent
                    text={
                      value?.length
                        ? value?.length + ' types is selected'
                        : 'Event type'
                    }
                    styles={{
                      ...styles.textStyle,
                      color: value?.name ? Colors.black : Colors.grayFaded,
                      width: wp('30'),
                    }}
                    onPress={() =>
                      dynamicRoute('ListViewScreen', {
                        onSelectValue: res => onChange(res),
                        selectedValue: value ?? [],
                        urlName: allEventTypeUrl,
                        isMultiSelect: true,
                      })
                    }
                  />
                )}
              />
            }
            innerExtraView={
              <Image
                source={arrRight}
                resizeMode="contain"
                style={{...styles.leftViewImg, height: hp('2')}}
                tintColor={'black'}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            title={'Private Event *'}
            errorName={errors['privateEvent']}
            rightView={
              <Touchable
                style={{
                  marginLeft: wp('2'),
                }}
                onPress={() => setModalVisible(true)}>
                <Image
                  source={questionMark}
                  resizeMode="contain"
                  style={{width: wp('5'), height: hp('3')}}
                />
              </Touchable>
            }
            innerLeftView={
              <Controller
                control={control}
                name={`privateEvent`}
                render={({field: {onChange, value}}) => {
                  return (
                    <TextComponent
                      text={value == 0 ? 'No' : 'Yes'}
                      styles={{
                        ...styles.textStyle,
                      }}
                      onPress={() =>
                        dynamicRoute('ListViewScreen', {
                          onSelectValue: res => onChange(res),
                          selectedValue: value ?? [],
                          urlName: allEventTypeUrl,
                          isMultiSelect: true,
                        })
                      }
                    />
                  );
                }}
              />
            }
            innerExtraView={
              <Controller
                control={control}
                name={`privateEvent`}
                render={({field: {onChange, value}}) => {
                  return (
                    <Switch
                      trackColor={{
                        false: Colors.grayFaded,
                        true: 'transparent',
                      }}
                      thumbColor={value ? Colors.primaryColor : '#EAF6ED'}
                      ios_backgroundColor="#EAF6ED"
                      onValueChange={e => onChange(e ? 1 : 0)}
                      value={Boolean(value == 1)}
                    />
                  );
                }}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>
        <TitleInputView
          title={'Associations'}
          errorName={errors['eventAssociation']?.name}
          innerLeftView={
            <Controller
              control={control}
              name={`eventAssociation`}
              render={({field: {onChange, value}}) => (
                <TextComponent
                  text={
                    value?.length
                      ? value?.length + ' associations is selected'
                      : 'No association'
                  }
                  styles={{
                    ...styles.textStyle,
                    color: value?.name ? Colors.black : Colors.grayFaded,
                    width: wp('80'),
                  }}
                  onPress={() =>
                    dynamicRoute('ListViewScreen', {
                      onSelectValue: res => onChange(res),
                      selectedValue: value ?? [],
                      urlName: allAssociatesUrl,
                      isMultiSelect: true,
                    })
                  }
                />
              )}
            />
          }
          innerExtraView={
            <Image
              source={arrRight}
              resizeMode="contain"
              style={{...styles.leftViewImg, height: hp('2')}}
              tintColor={'black'}
            />
          }
        />
        <TitleInputView
          title={'Added Money *'}
          errorName={errors['eventPrice']}
          innerLeftView={
            <Controller
              control={control}
              name="eventPrice"
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Enter price (in USD)"
                  maxLength={50}
                  placeholderTextColor={'gray'}
                  value={value}
                  onChangeText={onChange}
                  keyboardType="number-pad"
                />
              )}
            />
          }
        />
        <View style={styles.viewFlex}>
          <TitleInputView
            title={'Circuits'}
            errorName={errors['eventCircuit']?.name}
            innerLeftView={
              <Controller
                control={control}
                name={`eventCircuit`}
                render={({field: {onChange, value}}) => (
                  <TextComponent
                    text={
                      value?.length
                        ? value?.length + ' circuits is selected'
                        : 'No circuits'
                    }
                    styles={{
                      ...styles.textStyle,
                      color: value?.name ? Colors.black : Colors.grayFaded,
                      width: wp('30'),
                    }}
                    onPress={() =>
                      dynamicRoute('ListViewScreen', {
                        onSelectValue: res => onChange(res),
                        selectedValue: value ?? [],
                        urlName: allEventCircuitUrl,
                        isMultiSelect: true,
                      })
                    }
                  />
                )}
              />
            }
            innerExtraView={
              <Image
                source={arrRight}
                resizeMode="contain"
                style={{...styles.leftViewImg, height: hp('2')}}
                tintColor={'black'}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            title={'Tour *'}
            errorName={errors['evnetTour']}
            innerLeftView={
              <Controller
                control={control}
                name={`evnetTour`}
                render={({field: {onChange, value}}) => {
                  return (
                    <TextComponent
                      text={value == 1 ? 'No' : 'Yes'}
                      styles={{
                        ...styles.textStyle,
                      }}
                      // onPress={() =>
                      //   dynamicRoute('ListViewScreen', {
                      //     onSelectValue: res => onChange(res),
                      //     selectedValue: [value] ?? [],
                      //     urlName: allEventTypeUrl,
                      //     isMultiSelect: true,
                      //   })
                      // }
                    />
                  );
                }}
              />
            }
            innerExtraView={
              <Controller
                control={control}
                name={`evnetTour`}
                render={({field: {onChange, value}}) => {
                  return (
                    <Switch
                      trackColor={{
                        false: Colors.grayFaded,
                        true: 'transparent',
                      }}
                      thumbColor={value == 7 ? Colors.primaryColor : '#EAF6ED'}
                      ios_backgroundColor="#EAF6ED"
                      onValueChange={e => onChange(e ? 7 : 1)}
                      value={Boolean(value == 7)}
                    />
                  );
                }}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>
        <View style={styles.viewFlex}>
          <TitleInputView
            title={'Event Confirmation *'}
            errorName={errors['eventConfirm']}
            innerLeftView={
              <Controller
                control={control}
                name={`eventConfirm`}
                render={({field: {onChange, value}}) => (
                  <>
                    <TextComponent
                      text={'Planning'}
                      styles={{...styles.textStyle, width: wp('28')}}
                      onPress={() => onChange(0)}
                    />
                    <Touchable onPress={() => onChange(0)}>
                      <Image
                        source={value == 0 ? radioCircleOn : radioCircle}
                        resizeMode="contain"
                        style={styles.leftViewImg}
                      />
                    </Touchable>
                  </>
                )}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            innerLeftView={
              <Controller
                control={control}
                name={`eventConfirm`}
                render={({field: {onChange, value}}) => (
                  <>
                    <TextComponent
                      text={'Confirmed'}
                      styles={{...styles.textStyle, width: wp('28')}}
                      onPress={() => onChange(1)}
                    />
                    <Touchable onPress={() => onChange(1)}>
                      <Image
                        source={value == 1 ? radioCircleOn : radioCircle}
                        resizeMode="contain"
                        style={styles.leftViewImg}
                      />
                    </Touchable>
                  </>
                )}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>
        <TitleInputView
          title={'Want To Add In Calender?'}
          innerLeftView={
            <Controller
              control={control}
              name={`eventSync`}
              defaultValue={false}
              render={({field: {onChange, value}}) => (
                <TextComponent
                  text={'Add To Calendar'}
                  styles={styles.textStyle}
                  onPress={() => onChange(!value)}
                />
              )}
            />
          }
          innerExtraView={
            <Controller
              control={control}
              name={`eventSync`}
              render={({field: {onChange, value}}) => (
                <Touchable onPress={() => onChange(!value)}>
                  <Image
                    source={value ? tickSquare : squareGray}
                    resizeMode="contain"
                    style={styles.leftViewImg}
                  />
                </Touchable>
              )}
            />
          }
        />
        <ThemeButton
          title={'Create Event'}
          isYellowTheme
          style={styles.createBtnStyle}
          onPress={handleSubmit(createEventFun)}
        />
        {datePicker.alertVal && (
          <Controller
            control={control}
            name={datePicker.stateName}
            render={({field: {onChange, value}}) => (
              <DatePicker
                mode={datePicker.modalType}
                open={datePicker.alertVal}
                date={value ?? currentDate}
                is24hourSource="device"
                locale="en"
                modal
                onConfirm={e => {
                  // if (datePicker.stateName == 'perfEventList') {
                  //   datePicker.onChange();
                  //   onSelectValueInList(
                  //     datePicker?.index,
                  //     datePicker.modalType ?? 'date',
                  //     e,
                  //   );
                  //   toggleDate(null);
                  // } else {
                  onChange(e);
                  // datePicker.onChange(e);
                  // onSelectValue(datePicker.stateName, e);
                  toggleDate(null);
                  // }
                }}
              />
            )}
          />
        )}
        <InfoModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Private Event"
          content="Enable this if you want the event to stay private, and only visible to you. It won't appear on public event listings."
        />
      </KeyBoardWrapper>
    </View>
  );
};

export default memo(CreateEventsScreen);
