import {
  Image,
  Pressable,
  ScrollView,
  TextInput,
  View,
  BackHandler,
} from 'react-native';
import Modal from 'react-native-modal';
import {boldDivider, crossWhite, editPicBtn, searchIcon} from '../../Assets';
import {styles} from './styles';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import ThemeButton from '../../Components/ThemeButton';
import {useCallback, useRef, useState, useEffect} from 'react';
import {CircleImage} from '../../Components/CircleImage';
import {Touchable} from '../../Components/Touchable';
import {Colors} from '../../Theme/Variables';
import {MultiSelectButton} from '../../Components/MultiSelectButton';
import {
  formatDateToLong,
  sortByNameAlphabetically,
  uploadFromGalary,
} from '../../Services/GlobalFunctions';
import {imageUrl} from '../../Utils/Urls';
import DatePicker from 'react-native-date-picker';
import {step2} from '../../Utils/localDB';

// ====================== FIX FOR react-native-modal CRASH ======================
// This safely prevents the old removeEventListener error when modal closes
// (common issue with react-native-modal on newer React Native versions)
const originalRemoveEventListener = BackHandler.removeEventListener;
if (typeof originalRemoveEventListener === 'function') {
  BackHandler.removeEventListener = function (eventName, handler) {
    // Safely ignore calls from the library that pass undefined handler
    if (typeof handler !== 'function') {
      return;
    }
    return originalRemoveEventListener.apply(this, arguments);
  };
}
// =============================================================================

const ageRange = Array.from({length: 23}, (_, i) => {
  const age = 18 + i;
  return {label: String(age), value: String(age)};
});

const SettingModal = ({
  activeTags,
  isModal,
  onPress,
  heading,
  onBackPress,
  allData,
}) => {
  const [innerDataState, setInnerDateState] = useState({
    profileImg: activeTags?.profileImg,
    userAge: activeTags?.age,
    userGender: activeTags?.userGender,
    eventType: activeTags?.eventTypes,
    associations: activeTags?.eventAssociations,
    city: activeTags?.city,
    state: activeTags?.state,
  });

  const currentDate = new Date();
  const maxSelectableDate = new Date();
  maxSelectableDate.setFullYear(currentDate.getFullYear() - 13);

  const [modalState, setModalState] = useState(false);

  const [firstName, setFirstName] = useState(activeTags?.firstName);
  const [lastName, setLastName] = useState(activeTags?.lastName ?? '');

  const [_, forceUpdate] = useState();

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);

  const {
    associations,
    eventType,
    profileImg,
    userAge,
    userGender,
    city,
    state,
  } = innerDataState;

  console.log(
    'allDataallDataallDataallDataallDataallDataallDataallDataallData',
    state,
    activeTags?.state,
  );

  const updateState = data => setInnerDateState(prev => ({...prev, ...data}));

  const onChangeVal = (key, val) => {
    updateState({[key]: val});
  };

  const [filterData, setFilterData] = useState([]);
  const [text, setText] = useState('');

  function searchFun(e) {
    var text = e;
    if (text) {
      const newData = allData
        .map(res => ({
          id: res,
          name: res,
        }))
        .filter(function (item) {
          const itemData = (item.name || '').toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      console.log('newDatanewDatanewDatanewData', newData);
      setFilterData(newData);
      setText(text);
    } else {
      setFilterData(
        allData.map(res => ({
          id: res,
          name: res,
        })),
      );
      setText(text);
    }
  }

  const AgeChangeView = () => {
    return (
      <>
        <View style={styles.ageViewModal}>
          <TextComponent
            text={formatDateToLong(
              innerDataState?.userAge ?? maxSelectableDate,
            )}
            onPress={() => setModalState(true)}
            styles={styles.textStyle}
          />

          <Pressable
            style={{
              ...styles.gender(Boolean(innerDataState?.userAge == null)),
              marginTop: hp('2'),
              justifyContent: 'center',
              width: wp('90'),
            }}
            onPress={() => onChangeVal('userAge', null)}>
            <TextComponent
              text={step2[2]?.title}
              styles={styles.genderTitle(
                Boolean(innerDataState?.userAge == null),
              )}
            />
          </Pressable>

          {modalState && (
            <View style={styles.agePicker}>
              <DatePicker
                mode={'date'}
                open={modalState}
                date={
                  innerDataState?.userAge
                    ? new Date(innerDataState?.userAge)
                    : currentDate
                }
                maximumDate={maxSelectableDate}
                is24hourSource="device"
                locale="en"
                modal
                onConfirm={e => {
                  console.log('sdhvswhopierhbiobdfiohbilvhdfobhvodfbo;df', e);
                  setModalState(false);
                  onChangeVal('userAge', e);
                }}
                onCancel={() => {
                  setModalState(false);
                }}
              />
            </View>
          )}
        </View>
      </>
    );
  };

  const renderObj = {
    edit_profile: {
      title: 'Edit Profile',
    },
    age_view: {title: 'Update Your Age', renderView: <AgeChangeView />},
    event_type: {
      title: 'Update Your Event Type',
      renderView: (
        <MultiSelectButton
          items={allData}
          isMultipule
          selectedAlter={eventType}
          selectedBgColor={Colors.backgroundTheme}
          textStyle={{fontSize: hp('1.2')}}
          btnStyle={{
            height: 'auto',
            paddingVertical: hp('0.5'),
            paddingHorizontal: wp('2'),
          }}
          onSelectVal={(objId, item) => {
            if (Boolean(eventType?.find(res => res?.id == item?.id))) {
              onChangeVal(
                'eventType',
                eventType?.filter(res => res?.id != item?.id),
              );
            } else onChangeVal('eventType', [...eventType, , item]);
          }}
        />
      ),
    },
    event_association: {
      title: onPress ? 'Update Associations' : 'Associations',
      renderView: (
        <MultiSelectButton
          items={sortByNameAlphabetically(allData)}
          isMultipule
          selectedAlter={associations}
          isDisable={Boolean(!onPress)}
          btnStyle={{
            height: 'auto',
            paddingVertical: hp('0.5'),
            paddingHorizontal: wp('2'),
          }}
          selectedBgColor={Colors.backgroundTheme}
          onSelectVal={(objId, item) => {
            if (Boolean(associations?.find(res => res?.id == item?.id))) {
              onChangeVal(
                'associations',
                associations?.filter(res => res?.id != item?.id),
              );
            } else onChangeVal('associations', [...associations, , item]);
          }}
        />
      ),
    },
    city: {
      title: onPress ? 'Update City' : 'City',
      renderView: (
        <>
          <View style={styles.searchMain}>
            <Image
              source={searchIcon}
              style={styles.inputImage}
              tintColor={Colors.backgroundTheme}
            />
            <TextInput
              style={styles.inputStyle}
              placeholder={'Search'}
              placeholderTextColor={Colors.textGray}
              value={text}
              onChangeText={e => searchFun(e)}
            />
          </View>
          <MultiSelectButton
            items={
              allData.map(res => ({
                id: res,
                name: res,
              })) != null &&
              allData.map(res => ({
                id: res,
                name: res,
              }))?.length > 0 &&
              (filterData.length >= 0 && text != ''
                ? filterData
                : allData.map(res => ({
                    id: res,
                    name: res,
                  })))
            }
            selectedAlter={city}
            btnStyle={{
              height: 'auto',
              paddingVertical: hp('0.5'),
              paddingHorizontal: wp('2'),
            }}
            selectedBgColor={Colors.backgroundTheme}
            onSelectVal={(objId, item) => {
              onChangeVal('city', item);
            }}
          />
        </>
      ),
    },
    state: {
      title: onPress ? 'Update State' : 'State',
      renderView: (
        <>
          <View style={styles.searchMain}>
            <Image
              source={searchIcon}
              style={styles.inputImage}
              tintColor={Colors.backgroundTheme}
            />
            <TextInput
              style={styles.inputStyle}
              placeholder={'Search'}
              placeholderTextColor={Colors.textGray}
              value={text}
              onChangeText={e => searchFun(e)}
            />
          </View>
          <MultiSelectButton
            items={
              allData.map(res => ({
                id: res,
                name: res,
              })) != null &&
              allData.map(res => ({
                id: res,
                name: res,
              }))?.length > 0 &&
              (filterData.length >= 0 && text != ''
                ? filterData
                : allData.map(res => ({
                    id: res,
                    name: res,
                  })))
            }
            selectedAlter={state}
            btnStyle={{
              height: 'auto',
              paddingVertical: hp('0.5'),
              paddingHorizontal: wp('2'),
            }}
            selectedBgColor={Colors.backgroundTheme}
            onSelectVal={(objId, item) => {
              console.log('selected state item', item);
              onChangeVal('state', item);
            }}
          />
        </>
      ),
    },
    user_gender: {
      title: 'Update Gender',
      renderView: (
        <View>
          <MultiSelectButton
            items={[
              {id: 'male', name: 'Male'},
              {id: 'female', name: 'Female'},
              {id: 'prefer not to say', name: 'Prefer not to say'},
            ]}
            selectedAlter={userGender?.id ? userGender : {id: userGender}}
            btnStyle={{
              width: wp('90'),
              paddingVertical: hp('0.5'),
              paddingHorizontal: wp('2'),
            }}
            selectedBgColor={Colors.backgroundTheme}
            onSelectVal={(objId, item) => {
              onChangeVal('userGender', item);
            }}
          />
        </View>
      ),
    },
  };

  const [firstHit, setFirstHit] = useState(false);

  // Safe back button handler
  const handleBackButton = useCallback(() => {
    if (firstHit && activeTags.length == 0) {
      onPress?.({}, false);
    } else {
      onBackPress?.();
    }
    return true;
  }, [firstHit, activeTags, onPress, onBackPress]);

  useEffect(() => {
    let subscription = null;
    if (isModal) {
      subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButton,
      );
    }
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, [isModal, handleBackButton]);

  return (
    <View style={styles.modalView}>
      <Modal
        isVisible={isModal}
        animationInTiming={100}
        animationOutTiming={100}
        presentationStyle="pageSheet"
        avoidKeyboard
        animationType="fade"
        onBackButtonPress={handleBackButton}
        style={styles.bottomModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              ...styles.modalData,
              paddingBottom: !onPress ? hp('5') : 0,
            }}>
            <View style={styles.upperIconView}>
              <Image
                source={boldDivider}
                resizeMode="contain"
                style={styles.divider}
              />
              <Touchable
                onPress={() => (onPress ? onPress({}, false) : onBackPress())}>
                <Image
                  source={crossWhite}
                  resizeMode="contain"
                  style={styles.cancelIcon}
                />
              </Touchable>
            </View>
            <TextComponent
              text={renderObj[heading]?.title}
              styles={styles.headingText}
            />
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScroll}>
              {heading == 'edit_profile' && (
                <>
                  <View style={styles.whiteCircle}>
                    <CircleImage
                      image={
                        profileImg?.type
                          ? profileImg?.uri
                          : imageUrl(profileImg)
                      }
                      styles={styles.profileView}
                      size={0.3}
                      uri={true}
                    />
                    <Touchable
                      style={styles.addIcon}
                      onPress={async () => {
                        const img = await uploadFromGalary();
                        onChangeVal('profileImg', img);
                      }}>
                      <Image
                        source={editPicBtn}
                        resizeMode="contain"
                        style={{height: hp('4')}}
                      />
                    </Touchable>
                  </View>
                  <View style={styles.inputView}>
                    <TextInput
                      style={{flex: 1, color: 'black', fontSize: hp('1.5')}}
                      placeholder="Enter your first name"
                      placeholderTextColor={'gray'}
                      value={firstName}
                      onChangeText={setFirstName}
                      ref={firstNameRef}
                    />
                  </View>
                  <View style={styles.inputView}>
                    <TextInput
                      style={{flex: 1, color: 'black', fontSize: hp('1.5')}}
                      placeholder="Enter your last name"
                      placeholderTextColor={'gray'}
                      value={lastName}
                      onChangeText={setLastName}
                      ref={lastNameRef}
                    />
                  </View>
                </>
              )}
              {renderObj[heading]?.renderView}
            </ScrollView>
            {onPress && (
              <ThemeButton
                title={'Save'}
                style={styles.modalBtn}
                onPress={() => {
                  onPress({...innerDataState, firstName, lastName}, true);
                }}
                isYellowTheme
                textStyle={{fontSize: hp('1.5')}}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingModal;
