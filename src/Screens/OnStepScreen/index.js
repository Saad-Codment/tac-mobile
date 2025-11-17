import {
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import useOnStepScreen from './useOnStepScreen';
import {styles} from './styles';
import {
  arrowrightblack,
  arrRightPurple,
  horse,
  logout,
  stepBg,
} from '../../Assets';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import ThemeButton from '../../Components/ThemeButton';
import {Picker} from '@react-native-picker/picker';
import ErrorInputComponent from '../../Components/ErrorInputComponent';
import {states, step2, step3, step5} from '../../Utils/localDB';
import {Colors} from '../../Theme/Variables';
import {Touchable} from '../../Components/Touchable';
import {allAssociatesUrl, allEventTypeUrl} from '../../Utils/Urls';
import {MultiSelectButton} from '../../Components/MultiSelectButton';
import DatePicker from 'react-native-date-picker';
import {
  formatDateToCustomFormat,
  formatDateToLong,
} from '../../Services/GlobalFunctions';
import {logOutAuth} from '../../Redux/Action/AuthAction';
import SettingModal from '../SettingScreen/SettingModal';
import {statesWithCities} from '../../Utils/statesWithCities';

const OnStepScreen = ({navigation}) => {
  const {
    step,
    onBoardData,
    age,
    ageRange,
    onSelectValue,
    sport,
    association,
    handlePreviousStep,
    handleNextStep,
    transport,
    dynamicRoute,
    // currentDate,
    modalState,
    setModalState,
    dispatch,
    modalVal,
    setModalVal,
    onPressKey,
    activeTags,
    city,
    state,
    onOpenModal,
  } = useOnStepScreen(navigation);

  // Calculate 13 years ago from today
  const currentDate = new Date();
  const maxSelectableDate = new Date();
  maxSelectableDate.setFullYear(currentDate.getFullYear() - 13);

  const renderSteps = {
    1: () => {
      return (
        <>
          <TextComponent
            text={'What year were you born ?'}
            styles={styles.tagline}
          />
          {/* <TextComponent
            text={'Salungat sa kaalaman ng marami.'}
            styles={styles.innerTitle}
            fade={true}
          /> */}

          <TextComponent
            text={formatDateToLong(age ?? maxSelectableDate)}
            onPress={() => setModalState(true)}
            styles={{
              ...styles.textStyle,
              borderRadius: 20,
              paddingVertical: hp('1.6'),
              backgroundColor: Boolean(age != null)
                ? Colors.black
                : 'transparent',
              color: Boolean(age == null) ? Colors.black : 'white',
            }}
          />

          <Pressable
            style={{
              ...styles.gender(Boolean(age == null)),
              marginTop: hp('2'),
              justifyContent: 'center',
            }}
            // key={item?.id}
            onPress={() => onSelectValue('age', null)}>
            {/* <Image
                  source={item?.image}
                  style={styles.catImage(
                    Boolean(onBoardData?.gender == item.title),
                  )}
                /> */}
            <TextComponent
              text={step2[2]?.title}
              styles={{
                ...styles.genderTitle(Boolean(age == null)),
              }}
            />
          </Pressable>

          {modalState && (
            <View style={styles.agePicker}>
              <DatePicker
                mode={'date'}
                open={modalState}
                date={age ?? currentDate}
                is24hourSource="device"
                maximumDate={maxSelectableDate} // 👈 This prevents dates after 13 years ago
                locale="en"
                modal
                onConfirm={e => {
                  onSelectValue('age', e);
                  setModalState(false);
                  // }
                }}
              />
            </View>
          )}
        </>
      );
    },
    2: () => {
      return (
        <View>
          <TextComponent text={'Describe yourself ?'} styles={styles.tagline} />
          {/* <TextComponent
            text={'Salungat sa kaalaman ng marami.'}
            styles={styles.innerTitle}
            fade={true}
          /> */}
          <View style={styles.content}>
            {step2.map((item, index) => (
              <Pressable
                style={styles.gender(
                  Boolean(onBoardData?.gender == item.title),
                )}
                key={item?.id}
                onPress={() => onSelectValue('gender', item.title)}>
                {/* <Image
                  source={item?.image}
                  style={styles.catImage(
                    Boolean(onBoardData?.gender == item.title),
                  )}
                /> */}
                <TextComponent
                  text={item?.title}
                  styles={styles.genderTitle(
                    Boolean(onBoardData?.gender == item.title),
                  )}
                />
              </Pressable>
            ))}
          </View>
        </View>
      );
    },
    3: () => {
      return (
        <View>
          <TextComponent
            numberOfLines={2}
            text={'Are you willing to haul \n horses for others?'}
            styles={styles.tagline}
          />
          {/* <TextComponent
            text={'Salungat sa kaalaman ng marami.'}
            styles={styles.innerTitle}
            fade={true}
          /> */}
          {step3.map((item, index) => (
            <Pressable
              style={{
                ...styles.gender(Boolean(onBoardData?.transport == item.title)),
                justifyContent: 'center',
              }}
              key={item?.id}
              onPress={() => onSelectValue('transport', item.title)}>
              <TextComponent
                text={item?.title}
                styles={styles.genderTitle(
                  Boolean(onBoardData?.transport == item.title),
                )}
              />
            </Pressable>
          ))}
        </View>
      );
    },
    4: () => {
      return (
        <View>
          <TextComponent
            text={'Select is your home town?'}
            styles={styles.tagline}
          />
          {/* <TextComponent
            text={'Salungat sa kaalaman ng marami.'}
            styles={styles.innerTitle}
            fade={true}
          /> */}
          <Touchable
            style={{...styles.inputMain, backgroundColor: 'transparent'}}
            onPress={() => onOpenModal('state')}>
            <TextComponent
              text={state?.name ?? 'Select your state'}
              styles={{...styles.btnTextTwo, color: 'black'}}
            />
            <Image
              source={arrRightPurple}
              style={styles.arrowImage}
              tintColor={'black'}
            />
          </Touchable>
          {state?.name && (
            <Touchable
              style={{
                ...styles.inputMain,
                backgroundColor: 'transparent',
                marginTop: hp('2'),
              }}
              onPress={() => onOpenModal('city')}>
              <TextComponent
                text={city?.name ?? 'Select your city'}
                styles={{...styles.btnTextTwo, color: 'black'}}
              />
              <Image
                source={arrRightPurple}
                style={styles.arrowImage}
                tintColor={'black'}
              />
            </Touchable>
          )}
        </View>
      );
    },
    5: () => {
      return (
        <View>
          <TextComponent
            text={'What type of events are you interested in?'}
            styles={styles.tagline}
          />
          {/* <TextComponent
            text={'Salungat sa kaalaman ng marami.'}
            styles={styles.innerTitle}
            fade={true}
          /> */}
          <Touchable
            style={styles.inputMain}
            onPress={() =>
              dynamicRoute('ListViewScreen', {
                onSelectValue: res => onSelectValue('sport', res),
                selectedValue: sport,
                urlName: allEventTypeUrl,
                isMultiSelect: true,
              })
            }>
            <TextComponent text={'Events'} styles={styles.btnTextTwo} />
            <Image
              source={arrRightPurple}
              style={styles.arrowImage}
              tintColor={'white'}
            />
          </Touchable>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.innerScroll}>
            <MultiSelectButton
              isDisable={true}
              items={sport ?? []}
              btnStyle={styles.selectedValStyle}
              textStyle={{fontSize: hp('1.5')}}
            />
          </ScrollView>
        </View>
      );
    },
    6: () => {
      return (
        <>
          <TextComponent
            text={'Any association you’re align with?'}
            styles={styles.tagline}
          />
          {/* <TextComponent
            text={'Salungat sa kaalaman ng marami.'}
            styles={styles.innerTitle}
            fade={true}
          /> */}
          <Touchable
            style={styles.inputMain}
            onPress={() =>
              dynamicRoute('ListViewScreen', {
                onSelectValue: res => onSelectValue('association', res),
                selectedValue: association,
                urlName: allAssociatesUrl,
                isMultiSelect: true,
              })
            }>
            <TextComponent
              text={'Choose all the associations you are a member of'}
              styles={styles.btnTextTwo}
            />
            <Image
              source={arrRightPurple}
              style={styles.arrowImage}
              tintColor={'white'}
            />
          </Touchable>
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            scrollEnabled
            contentContainerStyle={styles.innerScroll}>
            <MultiSelectButton
              isDisable={true}
              items={association ?? []}
              btnStyle={styles.selectedValStyle}
              textStyle={{fontSize: hp('1.5')}}
            />
          </ScrollView>
        </>
      );
    },
  };

  const renderStepCircles = () => {
    return [1, 2, 3, 4, 5].map(index => (
      <View
        key={index}
        style={{
          ...styles.circleContainer,
        }}>
        <View
          style={[
            styles.circle,
            index <= step ? styles.activeCircle : null,
            {
              borderTopLeftRadius: index === 1 ? 50 : 0,
              borderBottomLeftRadius: index === 1 ? 50 : 0,
              borderTopRightRadius: index === 5 ? 50 : 0,
              borderBottomRightRadius: index === 5 ? 50 : 0,
            },
          ]}>
          <Text style={styles.circleText}></Text>
        </View>
      </View>
    ));
  };

  const renderStepContent = () => {
    // --------step 4 -----------
    const [selectedAge, setSelectedAge] = useState();
    // --------- step 5 ------------
    const [selectedGender, setSelectedGender] = useState(null);

    const handleGenderPress = itemId => {
      setSelectedGender(itemId);
    };
    return renderSteps[step]({
      genderData: {
        handleGenderPress,
        selectedGender,
      },
      ageData: {
        setSelectedAge,
        selectedAge,
      },
    });
  };

  // -----------buttons ---------
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <>
      <ImageBackground source={stepBg} style={styles.container}>
        <View style={styles.skipBtn}>
          <Touchable
            onPress={() => {
              dispatch(logOutAuth());
            }}>
            <Image
              source={logout}
              resizeMode="contain"
              style={{width: wp('6'), height: wp('6')}}
            />
          </Touchable>
          <TextComponent
            text={'Skip'}
            fade
            onPress={() => handleNextStep[step]()}
            styles={{fontSize: hp('1.8')}}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={horse} style={styles.horse} />
          <View style={styles.stepCirclesContainer}>{renderStepCircles()}</View>
        </View>
        <View style={styles.mainContent}>{renderSteps[step]()}</View>
      </ImageBackground>
      <View
        style={{
          ...styles.buttonContainer,
        }}>
        {step != 1 && (
          <ThemeButton
            onPress={handlePreviousStep}
            title={'Previous'}
            textStyle={{...styles.themeButton}}
            style={{
              borderRadius: 40,
              height: hp('5'),
              width: wp('42'),
            }}
          />
        )}
        <ThemeButton
          onPress={() => handleNextStep[step]()}
          title={step === 5 ? 'Get Started' : 'Continue'}
          textStyle={{...styles.themeButton}}
          style={{
            backgroundColor: Colors.primaryColor,
            borderRadius: 40,
            height: hp('5'),
            width: wp(step == 1 ? '90' : '42'),
          }}
        />
      </View>
      {modalVal && (
        <SettingModal
          activeTags={activeTags[onPressKey] ?? []}
          allData={
            onPressKey == 'state'
              ? states
              : onPressKey == 'city'
              ? statesWithCities[state?.name ?? ''] || []
              : []
          }
          heading={onPressKey}
          isModal={modalVal}
          onBackPress={() => setModalVal(false)}
          onPress={e => {
            setModalVal(false);
            onSelectValue(onPressKey, e[onPressKey]);
          }}
        />
      )}
    </>
  );
};

export default OnStepScreen;
