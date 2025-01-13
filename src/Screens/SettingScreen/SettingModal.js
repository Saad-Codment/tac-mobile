import {Image, ScrollView, TextInput, View} from 'react-native';
import Modal from 'react-native-modal';
import {boldDivider, crossWhite, editPicBtn} from '../../Assets';
import {styles} from './styles';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import ThemeButton from '../../Components/ThemeButton';
import {useState} from 'react';
import {CircleImage} from '../../Components/CircleImage';
import {Touchable} from '../../Components/Touchable';
import {Colors} from '../../Theme/Variables';
import ErrorInputComponent from '../../Components/ErrorInputComponent';
import {MultiSelectButton} from '../../Components/MultiSelectButton';
import {uploadFromGalary} from '../../Services/GlobalFunctions';

const ageRange = Array.from({length: 23}, (_, i) => {
  const age = 18 + i;
  return {label: String(age), value: String(age)};
});

const SettingModal = ({
  activeTags,
  isModal,
  onPress,
  heading,
  onSelect,
  onBackPress,
  activeTitle,
  allData,
}) => {
  const [innerDataState, setInnerDateState] = useState({
    profileImg: activeTags?.profileImg,
    userAge: activeTags?.age,
    userGender: activeTags?.userGender,
    eventType: activeTags?.eventTypes,
    associations: activeTags?.eventAssociations,
  });

  const [firstName, setFirstName] = useState(activeTags?.firstName);

  const [lastName, setLastName] = useState(activeTags?.lastName);

  const {associations, eventType, profileImg, userAge, userGender} =
    innerDataState;

  const updateState = data => setInnerDateState(prev => ({...prev, ...data}));

  const onChangeVal = (key, val) => {
    updateState({[key]: val});
  };
  const EditProfileView = () => {
    return (
      <>
        <View style={styles.whiteCircle}>
          <CircleImage
            image={profileImg?.uri}
            styles={styles.profileView}
            size={0.4}
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
              style={{height: hp('6')}}
            />
          </Touchable>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={{flex: 1, color: 'black'}}
            placeholder="Enter your first name"
            placeholderTextColor={'gray'}
            value={firstName}
            onChangeText={e => setFirstName(e)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={{flex: 1, color: 'black'}}
            placeholder="Enter your last name"
            placeholderTextColor={'gray'}
            value={lastName}
            onChangeText={e => setLastName(e)}
          />
        </View>
      </>
    );
  };

  const AgeChangeView = () => {
    return (
      <>
        <View style={styles.ageViewModal}>
          <ErrorInputComponent
            dropDownData={ageRange}
            dropDownPlaceholder={'Select your Age'}
            preferenceVal={innerDataState?.userAge}
            setPreferenceVal={val => onChangeVal('userAge', val)}
            dividerBool
            dividerLineBool
          />
        </View>
      </>
    );
  };

  const renderObj = {
    edit_profile: {
      title: 'Edit Profile',
      renderView: () => <EditProfileView />,
    },
    age_view: {title: 'Update Your Age', renderView: () => <AgeChangeView />},
    event_type: {
      title: 'Update Your Event Type',
      renderView: () => (
        <MultiSelectButton
          items={allData}
          isMultipule
          selectedAlter={eventType}
          selectedBgColor={Colors.backgroundTheme}
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
      title: 'Update Association',
      renderView: () => (
        <MultiSelectButton
          items={allData}
          isMultipule
          selectedAlter={associations}
          btnStyle={{height: 'auto', paddingVertical: hp('1')}}
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
    user_gender: {
      title: 'Update Gender',
      renderView: () => (
        <View>
          <MultiSelectButton
            items={[
              {id: 'male', name: 'Male'},
              {id: 'female', name: 'Female'},
              {id: 'other', name: 'Other'},
            ]}
            selectedAlter={userGender?.id ? userGender : {id: userGender}}
            btnStyle={{width: wp('90'), paddingVertical: hp('1')}}
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

  return (
    <View style={styles.modalView}>
      <Modal
        isVisible={isModal}
        animationInTiming={100}
        animationOutTiming={100}
        avoidKeyboard
        animationType="fade"
        hideModalContentWhileAnimating
        useNativeDriver
        onBackButtonPress={
          firstHit && activeTags.length == 0 ? onPress : onBackPress
        }
        style={styles.bottomModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <View style={styles.modalData}>
            <View style={styles.upperIconView}>
              <Image
                source={boldDivider}
                resizeMode="contain"
                style={styles.divider}
              />
              <Touchable onPress={() => onPress({}, false)}>
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
              {renderObj[heading]?.renderView()}
            </ScrollView>
            {/* {firstHit && ( */}
            <ThemeButton
              title={'Save'}
              style={styles.modalBtn}
              onPress={() => {
                onPress({...innerDataState, firstName, lastName}, true);
              }}
              isYellowTheme
            />
            {/* )} */}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingModal;
