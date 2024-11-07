import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import React, {memo, useState} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';
import {Touchable} from '../../Components/Touchable';
import {
  addcircle,
  crossWhite,
  gpsImg,
  radioCircle,
  radioCircleOn,
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
  uploadFromGalary,
} from '../../Services/GlobalFunctions';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';
import {Controller} from 'react-hook-form';

const CreateEventsScreen = ({navigation}) => {
  const {
    currentDate,
    formDataState,
    datePicker,
    errors,
    control,
    getFieldState,
    setValue,
    register,
    onSelectValueInList,
    toggleDate,
    onSelectValue,
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
            justifyContent: rightView ? 'space-between' : 'flex-start',
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
            {errors[errorName] && (
              <TextComponent
                text={errors[errorName].message}
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
          title={'Event Title'}
          errorName="eventTitle"
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
            <TextComponent
              text={`${formDataState.eventTitle.length}/50`}
              styles={{fontSize: hp('1.5')}}
            />
          }
        />

        <TitleInputView
          title={'Event Image'}
          centerInnerView={
            <Controller
              control={control}
              name="eventImg"
              render={({field: {onChange, value}}) => (
                <Touchable
                  onPress={async () => {
                    const imgData = await uploadFromGalary();
                    onChange(imgData);
                  }}>
                  <Image
                    source={value?.uri ? {uri: value?.uri} : uploadImgView}
                    style={styles.uploadImg}
                  />
                </Touchable>
              )}
            />
          }
        />

        <View style={styles.viewFlex}>
          <TitleInputView
            title={'Start Date'}
            innerLeftView={
              <Controller
                control={control}
                name="eventStartDate"
                render={({field: {onChange, value}}) => (
                  <TextComponent
                    text={formatDateToCustomFormat(value ?? currentDate)}
                    onPress={() => toggleDate('eventStartDate', 'date')}
                    styles={styles.textStyle}
                  />
                )}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            title={'Start Time'}
            innerLeftView={
              <TextComponent
                text={convertToCustomTimeFormat(
                  formDataState.eventStartTime ?? currentDate,
                )}
                onPress={() => toggleDate('eventStartTime', 'time')}
                styles={styles.textStyle}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>
        <View style={styles.viewFlex}>
          <TitleInputView
            title={'End Date'}
            innerLeftView={
              <TextComponent
                text={formatDateToCustomFormat(
                  formDataState.eventEndDate ?? currentDate,
                )}
                onPress={() => toggleDate('eventEndDate', 'date')}
                styles={styles.textStyle}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            title={'End Time'}
            innerLeftView={
              <TextComponent
                text={convertToCustomTimeFormat(
                  formDataState.eventEndTime ?? currentDate,
                )}
                onPress={() => toggleDate('eventEndTime', 'time')}
                styles={styles.textStyle}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>
        <TitleInputView
          title={'Event Location'}
          innerLeftView={
            <TextComponent
              text={
                formDataState?.eventCoords?.locationName ??
                'Please select location.'
              }
              styles={styles.textStyle}
              onPress={() =>
                dynamicRoute('LocationScreen', (locationName, coords) => {
                  onSelectValue('eventCoords', {
                    locationName,
                    coords,
                  });
                })
              }
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
        <TitleInputView
          title={'Performances'}
          centerInnerView={
            <View
              style={{
                ...styles.innerView,
                ...styles.perInnerViewExtra,
              }}>
              {formDataState.perfEventList.map((res, i) => {
                return (
                  <View style={styles.perMapView}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <TextComponent
                        text={`${getOrdinal(i + 1)} Performance: `}
                        styles={{...styles.textStyle}}
                      />

                      <TextInput
                        placeholderTextColor={'gray'}
                        placeholder="Enter title"
                        value={res.title}
                        style={{flex: 1, color: 'black', width: wp('50')}}
                        onChangeText={e => onSelectValueInList(i, 'title', e)}
                      />
                      {i > 0 && (
                        <Touchable
                          style={{marginLeft: wp('3')}}
                          onPress={() => {
                            const newArry = [...formDataState.perfEventList];
                            newArry.splice(i, 1),
                              onSelectValue('perfEventList', newArry);
                          }}>
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
                    <View style={styles.perInnerView}>
                      <TextComponent
                        onPress={() => toggleDate('perfEventList', 'date', i)}
                        text={formatDateToCustomFormat(res.date ?? currentDate)}
                        styles={styles.perInnerText}
                      />
                      <TextComponent
                        onPress={() => toggleDate('perfEventList', 'time', i)}
                        text={convertToCustomTimeFormat(
                          res.time ?? currentDate,
                        )}
                        styles={styles.perInnerText}
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
              onPress={() =>
                onSelectValue('perfEventList', [
                  ...formDataState.perfEventList,
                  {
                    title: null,
                    date: null,
                    time: null,
                  },
                ])
              }>
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
        />
        <View style={styles.viewFlex}>
          <TitleInputView
            title={'Event type'}
            innerLeftView={
              <TextComponent text={'Barrel Racing'} styles={styles.textStyle} />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            title={'Private event'}
            innerLeftView={
              <DropDownPicker
                // open={open}
                // value={value}
                items={[1, 2, 3, 3]}
                // setOpen={setOpen}
                // setValue={setValue}
                // setItems={setItems}
                style={{backgroundColor: 'transaprent', borderWidth: 0}}
                placeholder={'Yes'}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>
        <TitleInputView
          title={'Association'}
          innerLeftView={
            <TextComponent
              text={'Empire Batteries'}
              styles={styles.textStyle}
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
        <View style={styles.viewFlex}>
          <TitleInputView
            title={'Circuits'}
            innerLeftView={
              <TextComponent text={'Green Mile'} styles={styles.textStyle} />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            title={'tour'}
            innerLeftView={
              <DropDownPicker
                // open={open}
                // value={value}
                items={[1, 2, 3, 3]}
                // setOpen={setOpen}
                // setValue={setValue}
                // setItems={setItems}
                style={{backgroundColor: 'transaprent', borderWidth: 0}}
                placeholder={'No'}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>
        <View style={styles.viewFlex}>
          <TitleInputView
            title={'Event Confirmation'}
            innerLeftView={
              <>
                <TextComponent text={'Planning'} styles={styles.textStyle} />
                <Image
                  source={radioCircleOn}
                  resizeMode="contain"
                  style={styles.leftViewImg}
                />
              </>
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            innerLeftView={
              <>
                <TextComponent text={'Confirmed'} styles={styles.textStyle} />
                <Image
                  source={radioCircle}
                  resizeMode="contain"
                  style={styles.leftViewImg}
                />
              </>
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>
        <TitleInputView
          title={'Event Confirmation'}
          innerLeftView={
            <TextComponent
              text={'Empire Batteries, Incorporation.'}
              styles={styles.textStyle}
            />
          }
          innerExtraView={
            <Image
              source={tickSquare}
              resizeMode="contain"
              style={styles.leftViewImg}
            />
          }
        />
        <ThemeButton
          title={'Create Event'}
          isYellowTheme
          style={styles.createBtnStyle}
        />
        {datePicker.alertVal && (
          <DatePicker
            mode={datePicker.modalType}
            open={datePicker.alertVal}
            date={currentDate}
            is24hourSource="device"
            locale="en"
            modal
            onConfirm={e => {
              if (datePicker.stateName == 'perfEventList') {
                onSelectValueInList(
                  datePicker?.index,
                  datePicker.modalType ?? 'date',
                  e,
                );
                toggleDate(null);
              } else {
                onSelectValue(datePicker.stateName, e);
                toggleDate(null);
              }
            }}
          />
        )}
      </KeyBoardWrapper>
    </View>
  );
};

export default memo(CreateEventsScreen);
