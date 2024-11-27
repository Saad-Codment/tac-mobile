import {Image, ScrollView, TextInput, View} from 'react-native';
import Modal from 'react-native-modal';
import {boldDivider, editPicBtn} from '../../Assets';
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

const ageRange = Array.from({length: 23}, (_, i) => {
  const age = 18 + i;
  return {label: String(age), value: String(age)};
});

const SettingModal = ({
  activeTags,
  allData,
  isModal,
  onPress,
  heading,
  onSelect,
  onBackPress,
  activeTitle,
}) => {
  const EditProfileView = () => {
    return (
      <>
        <View style={styles.whiteCircle}>
          <CircleImage
            image={null}
            styles={styles.profileView}
            size={0.4}
            uri={true}
          />
          <Touchable style={styles.addIcon}>
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
            placeholder="Enter your name"
            placeholderTextColor={'gray'}
          />
        </View>
      </>
    );
  };

  const AgeChangeView = () => {
    return (
      <>
        <View style={styles.agePicker}>
          <ErrorInputComponent
            dropDownData={ageRange}
            dropDownPlaceholder={'Select your Age'}
            // text={'Rating  '}
            // preferenceVal={age}
            // setPreferenceVal={val => onSelectValue('age', val)}
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
      renderView: () => <MultiSelectButton items={[]} />,
    },
    event_association: {
      title: 'Update Association',
      renderView: () => <AgeChangeView />,
    },
  };

  const [firstHit, setFirstHit] = useState(false);

  return (
    <View
      // key={userNameModal}
      style={styles.modalView}>
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
            <Image
              source={boldDivider}
              resizeMode="contain"
              style={styles.divider}
            />
            <TextComponent
              text={renderObj[heading]?.title}
              styles={styles.headingText}
            />
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScroll}>
              {renderObj[heading]?.renderView}
              {/* {Boolean(
                heading == 'braid_size' || heading == 'braid_length',
              ) && <MultiSelectView />}
              {Boolean(heading == 'braid_type') && <SignleSelectView />}
              {Boolean(heading == 'estimatePrice') && <EstimateTimeView />} */}
            </ScrollView>
            {/* {firstHit && ( */}
            <ThemeButton
              title={'Save'}
              style={styles.modalBtn}
              onPress={onPress}
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
