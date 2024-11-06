import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
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

const CreateEventsScreen = ({navigation}) => {
  const {
    currentDate,
    formDataState,
    datePicker,
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
          <View
            style={{
              ...styles.innerView,
              ...innerViewOuterStyle,
            }}>
            {innerLeftView}
            {innerExtraView}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{flexGrow: 1}}>
      <HeaderComponent headerTitle={'Create Event'} />

      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <TitleInputView
          title={'Event Title'}
          innerLeftView={
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter title"
              maxLength={50}
              value={formDataState.eventTitle}
              onChangeText={e => onSelectValue('eventTitle', e)}
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
            <Touchable
              onPress={async () => {
                const imgData = await uploadFromGalary();
                onSelectValue('eventImg', imgData);
              }}>
              <Image
                source={
                  formDataState?.eventImg?.uri
                    ? {uri: formDataState?.eventImg?.uri}
                    : uploadImgView
                }
                // resizeMode="contain"
                style={styles.uploadImg}
              />
            </Touchable>
          }
        />

        <View style={styles.viewFlex}>
          <TitleInputView
            title={'Start Date'}
            innerLeftView={
              <TextComponent
                text={formatDateToCustomFormat(
                  formDataState.eventStartDate ?? currentDate,
                )}
                onPress={() => toggleDate('eventStartDate', 'date')}
                styles={styles.textStyle}
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
                    <View style={{flexDirection: 'row'}}>
                      <TextComponent
                        text={`${getOrdinal(i + 1)} Performance: `}
                        styles={styles.textStyle}
                      />
                      <TextInput
                        style={{
                          width: wp('50'),
                          color: 'black',
                        }}
                        placeholder="Enter title"
                        maxLength={50}
                        value={formDataState.eventTitle}
                        onChangeText={e => onSelectValue('eventTitle', e)}
                      />
                      {i > 0 && (
                        <Touchable style={{marginLeft: wp('3')}}>
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
                        text={'12 - July - 2024'}
                        styles={styles.perInnerText}
                      />
                      <TextComponent
                        text={'08 : 00 - 11 : 00 Pm'}
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
                  '',
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
              onSelectValue(datePicker.stateName, e);
              toggleDate(null);
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default memo(CreateEventsScreen);
