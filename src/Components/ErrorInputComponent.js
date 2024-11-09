import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Touchable,
  Pressable,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, FontSize, colors} from '../Theme/Variables';
import {hp, wp} from '../Config/responsive';
import {TextComponent} from './TextComponent';
import DividerLine from './DividerLine';
import {Button} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker1 from 'react-native-modern-datepicker';
// import RangeSliderComponent from './RangeSliderComponent';
import GalleryComponent from './GalleryComponent';
import {Dropdown} from 'react-native-element-dropdown';
// import Ionicons from 'react-native-vector-icons/Ionicons';
export default function ErrorInputComponent({
  name,
  errors,
  control,
  minLength,
  placeholder,
  style,
  keyboard,
  iconImg,
  secureTextEntry,
  multiline,
  numberOfLines,
  isRequired,
  defaultValue = '',
  inputLength,
  isSecure,
  text,
  ViewStyle,
  textStyle,
  maxLength,
  isDate,
  VectorIconName,
  MIN_DEFAULT,
  MAX_DEFAULT,
  isGallery,
  min,
  max,
  setMin,
  setMax,
  setRangeValue,
  galleryData,
  onSelectImage,
  deleteImage,
  isLocation,
  locationText,
  locationValue,
  locationOnPress,
  value,
  setValue,
  date,

  setsetJobExp,
  setDate,
  time,
  setTime,
  selectedTime,
  setSelectedTime,
  currentLocation,
  setCurrentLocation,
  dividerBool,
  dividerLineBool,
  TwoDivider,
  VectorIconName1,
  preferenceVal,
  setPreferenceVal,
  flagVal,
  setFlagVal,
  setCoordinates,
  refVal,
  numeric,
  dropDownPlaceholder,
  dropDownData,
  minimumDate,
}) {
  console.log('lsdkbnklsbdnklbsdklbvdklsbvklbdskvbdklsbvdsv', refVal);
  const [show, setShow] = useState(!isSecure);
  const [open, setOpen] = useState(false);

  // //For DateFormat Convert Function
  // function formatDateToCustomFormat(isoDate) {
  //   var originalDate = new Date(isoDate);

  //   var year = originalDate.getUTCFullYear();
  //   var month = originalDate.getUTCMonth() + 1;
  //   var day = originalDate.getUTCDate();

  //   var formattedDate = month + ' / ' + day + ' / ' + year;
  //   console.log({formattedDate});
  //   return formattedDate;
  // }
  function formatDateToCustomFormat(isoDate) {
    var originalDate = new Date(isoDate);

    // Define an array of month names
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Get the month name using the array
    var monthName = monthNames[originalDate.getMonth()];

    var year = originalDate.getUTCFullYear();
    var day = originalDate.getUTCDate();

    var formattedDate = `${monthName} ${day}, ${year}`;
    return formattedDate;
  }
  var customFormatDate = formatDateToCustomFormat(date);

  //For Time Format Convert Function
  function convertToCustomTimeFormat(isoDate) {
    const date = new Date(isoDate);

    // Subtract 5 hours
    date.setUTCHours(date.getUTCHours() - 7);

    // Extract hours and minutes
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    // Determine if it's A.M. or P.M.
    const amOrPm = hours < 12 ? 'P.M.' : 'A.M.';

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;

    // Ensure that both hours and minutes have two digits
    const formattedTime = `${formattedHours}:${String(minutes).padStart(
      2,
      '0',
    )} ${amOrPm}`;

    return formattedTime;
  }
  const customTimeFormat = convertToCustomTimeFormat(date);
  // const currentDate = new Date();
  // const initialTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

  const [isFocus, setIsFocus] = useState(false);
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: 'blue'}]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  //PREFERENCESSS
  const data = dropDownData;
  //FLAG DATA
  const Flag = [
    {label: 'Normal', value: '0'},
    {label: 'Urgent', value: '1'},
  ];

  const [isFocus1, setIsFocus1] = useState(false);
  const renderLabel1 = () => {
    if (value || isFocus1) {
      return (
        <Text style={[styles.label, isFocus1 && {color: 'blue'}]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  return (
    <>
      <View style={{...styles.container, ...ViewStyle}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* TextComponent for label text */}
          <TextComponent text={text} styles={styles.text} />

          {/* TextComponent for asterisk */}
          {isRequired && (
            <TextComponent
              text={' *'}
              styles={{color: Colors.themeRed, fontSize: FontSize.scale16}}
            />
          )}
        </View>
        {placeholder && (
          <TextInput
            keyboardType={numeric ? 'numeric' : 'default'}
            selectionColor={Colors.primaryColor}
            maxLength={maxLength}
            placeholderTextColor={Colors.themeGray}
            numberOfLines={numberOfLines}
            multiline={multiline}
            placeholder={placeholder}
            style={{
              ...styles.inputField,
              height: hp(numberOfLines > 3 ? '15' : '5'),
              borderColor: Colors.primaryColor,
            }}
            onChangeText={setValue}
            value={value}
            secureTextEntry={!show}
          />
        )}
        {multiline && (
          <View
            style={{
              justifyContent: 'flex-end',
              position: 'absolute',
              right: 30,
              bottom: 30,
            }}>
            <TextComponent
              styles={styles.textLength}
              text={`${value.length ?? 0}/200`}
            />
          </View>
        )}

        {VectorIconName && (
          <TouchableOpacity onPress={() => setOpen(true)}>
            <TextComponent
              text={
                (VectorIconName == 'time-outline' && customTimeFormat) ||
                (VectorIconName == 'calendar-outline' && customFormatDate) ||
                (VectorIconName == 'stopwatch-outline' && selectedTime)
              }
              styles={{
                color: Colors.themeGray,
                fontSize: hp('1.8'),
                // fontWeight: '500',
              }}
            />
          </TouchableOpacity>
        )}
        {isDate && (
          <DatePicker
            minimumDate={minimumDate}
            onDateChange={date => {
              console.log(date, 'slslslsl');
            }}
            is24hourSource="device"
            mode={
              (VectorIconName == 'time-outline' && 'time') ||
              (VectorIconName == 'calendar-outline' && 'date')
            }
            locale="en"
            modal
            open={open}
            date={date}
            onConfirm={date => {
              setOpen(false);
              setDate(date);
              console.log({date});
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        )}

        {/* {MAX_DEFAULT > 0 && (
          <RangeSliderComponent
            refVal={refVal}
            rangeEnabled={false}
            MIN_DEFAULT={MIN_DEFAULT}
            MAX_DEFAULT={MAX_DEFAULT}
            min={min}
            max={max}
            setMin={setMin}
            setMax={setMax}
            setRangeValue={setRangeValue}
          />
        )} */}

        {isGallery && (
          <GalleryComponent
            onSelectImage={onSelectImage}
            galleryData={galleryData}
            deleteImage={deleteImage}
          />
        )}

        {isLocation && (
          <TouchableOpacity
            style={{...styles.dateContainer, justifyContent: 'space-between'}}
            onPress={locationOnPress}>
            <TextComponent
              text={locationText}
              styles={{
                color: Colors.themeGray,
                fontSize: FontSize.scale14,
                fontWeight: '500',
                width: wp('78'),
              }}
            />
            <MaterialIcons
              style={styles.dropDown}
              color={Colors.themeYellow}
              name={'my-location'}
              size={hp('3')}
            />
          </TouchableOpacity>
        )}

        {dividerBool && (
          <View style={styles.container1}>
            {/* {renderLabel()} */}
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'black'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={{
                color: Colors.black,
              }}
              placeholder={!isFocus ? dropDownPlaceholder : '...'}
              searchPlaceholder="Search..."
              value={preferenceVal}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setPreferenceVal(item.value);
                setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <Ionicons
              //     style={styles.icon}
              //     color={isFocus ? Colors.themeYellow : 'black'}
              //     name="options"
              //     size={20}
              //   />
              // )}
            />
          </View>
        )}
        {TwoDivider && (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => setOpen(true)}
              style={{...styles.dateContainer, width: wp('45')}}>
              <MaterialIcons
                style={styles.dropDown}
                color={Colors.primaryColor}
                name={'error-outline'}
                size={hp('3')}
              />

              <TextComponent
                text={
                  (VectorIconName1 == 'time-outline' && customTimeFormat) ||
                  (VectorIconName1 == 'calendar-outline' && customFormatDate) ||
                  (VectorIconName1 == 'stopwatch-outline' && selectedTime)
                }
                styles={{
                  color: Colors.themeGray,
                  fontSize: FontSize.scale14,
                  fontWeight: '500',
                }}
              />
            </TouchableOpacity>
            <View style={styles.dropDownContainer}>
              {/* {renderLabel()} */}
              <Dropdown
                style={[styles.dropdown, isFocus1 && {borderColor: 'blue'}]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={Flag}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus1 ? 'Flag jobs as urgent' : '...'}
                searchPlaceholder="Search..."
                value={flagVal}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setFlagVal(item.value);
                  setIsFocus(false);
                }}
                renderLeftIcon={() => (
                  <Ionicons
                    style={styles.icon}
                    color={isFocus ? Colors.themeYellow : 'black'}
                    name="options"
                    size={20}
                  />
                )}
              />
            </View>
          </View>
        )}
      </View>

      {!dividerLineBool && <DividerLine />}

      {/* Modal for DatePicker1 */}
      {VectorIconName == 'stopwatch-outline' && (
        <Modal animationType="slide" transparent={true} visible={open}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DatePicker1
                mode="time"
                minuteInterval={3}
                onTimeChange={selectedTime => {
                  console.log({selectedTime});
                  setSelectedTime(selectedTime);
                  setOpen(false);
                }}
                options={{mainColor: Colors.themeYellow}}
              />
            </View>
          </View>
        </Modal>
      )}
      {/*End Modal for DatePicker1 */}
    </>
  );
}

const styles = StyleSheet.create({
  container1: {
    marginTop: hp('-2'),
  },
  dropDownContainer: {
    backgroundColor: 'white',
    marginTop: hp('1.5'),
    width: wp('45'),
  },
  dropdown: {
    overflow: 'hidden',
    height: hp('6'),
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 20,
    borderBottomColor: Colors.textGray,
    borderTopColor: Colors.textGray,
    borderLeftColor: Colors.textGray,
    borderRightColor: Colors.textGray,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: -8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: 'red',
    borderColor: 'red',
  },
  placeholderStyle: {
    fontSize: FontSize.scale12,
    fontWeight: '500',
    color: Colors.textGray,
  },
  selectedTextStyle: {
    fontSize: FontSize.scale16,
    color: Colors.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    // height: 40,
    fontSize: 16,
    color: Colors.black,
  },

  text: {
    fontSize: FontSize.scale15,
    fontWeight: '700',
  },
  inputField: {
    textAlignVertical: 'top',
    paddingTop: hp('1.5'),
    fontSize: FontSize.scale14,
    fontWeight: '500',
    color: Colors.themeGray,
    borderRadius: 5,
    padding: 10,
    borderWidth: 0.8,
    marginTop: hp('1.5'),
  },
  textLength: {
    textAlign: 'right',
    color: Colors.themeGray,
    fontSize: FontSize.scale14,

    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    textAlignVertical: 'top',
    fontSize: FontSize.scale14,
    color: Colors.themeGray,
    borderRadius: 10,
    padding: 7,
    borderWidth: 0.8,
    // marginRight: wp('2'),
    alignItems: 'center',
    // marginTop: hp('1.5'),
  },
  dropDown: {
    marginRight: wp('2'),
  },
  // Add styles for the modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: wp('80%'),
    alignItems: 'center',
  },
  closeButton: {
    marginTop: hp('2'),
    backgroundColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  // location: {},
});
