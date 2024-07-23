import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import useOnStepScreen from './useOnStepScreen';
import {styles} from './styles';
import {horse, stepBg} from '../../Assets';
import {hp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import ThemeButton from '../../Components/ThemeButton';
import {Picker} from '@react-native-picker/picker';
import ErrorInputComponent from '../../Components/ErrorInputComponent';
import {step5} from '../../Utils/localDB';

const OnStepScreen = ({navigation}) => {
  const {step, setStep, onBoardData, setOnboardData, age, setAge, ageRange} =
    useOnStepScreen(navigation);

  const renderSteps = {
    1: () => {
      return (
        <>
          <TextComponent text={'What is your age ?'} styles={styles.tagline} />
          <TextComponent text={'Age Range'} styles={styles.titleStep4} />
          <View style={styles.agePicker}>
            <ErrorInputComponent
              dropDownData={ageRange}
              dropDownPlaceholder={'Select your Age'}
              // text={'Rating  '}
              preferenceVal={age}
              setPreferenceVal={setAge}
              dividerBool
              dividerLineBool
            />
          </View>
        </>
      );
    },
    2: () => {
      return (
        <View>
          <TextComponent text={'Describe yourself ?'} styles={styles.tagline} />
          <View style={styles.content}>
            {step5.map((item, index) => (
              <Pressable
                style={styles.gender(
                  Boolean(onBoardData?.gender == item.title),
                )}
                key={item?.id}
                onPress={() => onSelectValue('gender', item.title)}>
                <Image
                  source={item?.image}
                  // style={styles
                  //   .catImage
                  //   // Boolean(onBoardData?.gender == item.title),
                  //   ()}
                />
                <TextComponent
                  text={item?.title}
                  // styles={styles
                  //   .genderTitle
                  //   // Boolean(onBoardData?.gender == item.title),
                  //   ()}
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
            text={'Do you have transport availability'}
            styles={styles.tagline}
          />
          <TextComponent text={'Age Range'} styles={styles.titleStep4} />
        </View>
      );
    },
    4: ({ageData: {setSelectedAge, selectedAge}}) => {
      return (
        <View>
          <TextComponent
            text={'What type of sports you’re interested in'}
            styles={styles.tagline}
          />
          <TextComponent text={'Age Range'} styles={styles.titleStep4} />
        </View>
      );
    },
    5: ({genderData: {handleGenderPress, selectedGender}}) => {
      return (
        <View>
          <TextComponent
            text={'Any association you’re align with?'}
            styles={styles.tagline}
          />
          <TextComponent text={'Gender'} styles={styles.titleStep4} />
        </View>
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

  return (
    <>
      <ImageBackground source={stepBg} style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={horse} style={styles.horse} />
          <View style={styles.stepCirclesContainer}>{renderStepCircles()}</View>
        </View>
        <View style={styles.mainContent}>{renderStepContent()}</View>
        {/* <Text onPress={() => setStep(step + 1)}>NEsdasxt</Text> */}
      </ImageBackground>
      <View style={styles.buttonContainer}>
        <ThemeButton
          onPress={() => setStep(step + 1)}
          title={'Continue'}
          textStyle={styles.themeButton}
        />
      </View>
    </>
  );
};

export default OnStepScreen;
