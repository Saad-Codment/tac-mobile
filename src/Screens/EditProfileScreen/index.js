import React, {useCallback, useState} from 'react';
import {View, FlatList, Image, Pressable} from 'react-native';
import useEditProfileScreen from './useEditProfileScreen';
import {styles} from './styles';
import {TextComponent} from '../../Components/TextComponent';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {CircleImage} from '../../Components/CircleImage';
import {
  buliding,
  clockrewind,
  edit2,
  flag,
  profile,
  refresh,
  people,
  upload,
  horse,
} from '../../Assets';
import BottomModalComponent from '../../Components/BottomModalComponent';
import {hp} from '../../Config/responsive';
import {InputComponent} from '../../Components/InputComponent';
import ThemeButton from '../../Components/ThemeButton';
import {Colors} from '../../Theme/Variables';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';
import ErrorInputComponent from '../../Components/ErrorInputComponent';

const EditProfileScreen = ({navigation}) => {
  const {
    handleSubmit,
    errors,
    reset,
    control,
    getValues,
    age,
    setAge,
    ageRange,
    isModalVisible,
    setModalVisible,
    setModalVisible1,
    evetTypeList,
    associationList,
  } = useEditProfileScreen(navigation);

  const [modalsVisible, setModalsVisible] = useState({});

  const toggleModal = useCallback(index => {
    setModalsVisible(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  }, []);

  const renderItem = useCallback(({item, index}) => {
    return (
      <Pressable
        onPress={() =>
          item.onpress
            ? item.onpress(index)
            : item?.navigate(navigation.navigate, item?.screenName)
        }
        style={styles.listBtn}>
        <Image source={item?.icon} style={styles.iconGreen} />
        <View style={styles.listInner}>
          <TextComponent text={item?.name} styles={styles.title} />
          <TextComponent text={item?.rightText} styles={styles.change} />
        </View>
      </Pressable>
    );
  }, []);

  const data = [
    {
      icon: refresh,
      name: '26 Years',
      title: 'Update Your Age',
      list: ageRange,
      onpress: () => toggleModal(0),
      rightText: 'Change',
      dropDownPlaceholder: 'Select your Age',
    },
    {
      icon: flag,
      icon: profile,
      name: 'Male',
      onpress: () => {},
    },
    {
      icon: horse,
      name: 'Horse Riding',

      screenName: 'HistoryScreen',
      rightText: 'Change',
      title: 'Update Your Event Type',
      list: evetTypeList,

      onpress: () => toggleModal(2),
      dropDownPlaceholder: 'Select your Event',
    },
    {
      icon: buliding,
      name: 'Association',

      rightText: 'Change',
      title: 'Update Association',
      list: associationList,

      onpress: () => toggleModal(3),
      dropDownPlaceholder: 'Select your Association',
    },
    {
      icon: clockrewind,
      name: 'Event History',
      navigate: (navigate, route) => navigate(route),
      screenName: 'HistoryScreen',
      rightText: 'View',
    },
    {
      icon: people,
      name: 'Friends List',
      navigate: (navigate, route) => navigate(route),
      screenName: 'FriendLists',
      rightText: 'View',
    },
  ];

  return (
    <View>
      <HeaderComponent
        goBack={() => navigation.goBack()}
        isBack
        style={styles.header}
        headerTitle={'Settings'}
        saveReset={edit2}
        onRightPress={() => setModalVisible(!isModalVisible)}
      />
      <View style={styles.midContainer}>
        <View style={styles.proImageContainer}>
          <CircleImage
            uri={
              'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            }
            styles={styles.proImage}
          />
        </View>
        <TextComponent styles={styles.proName} text={'Sheila'} />
        <TextComponent styles={styles.proEmail} text={'sheila@tac.com'} />
        <FlatList
          renderItem={renderItem}
          data={data}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      {data.map((item, index) => (
        <BottomModalComponent
          key={index}
          isVisible={modalsVisible[index]}
          onClose={() => toggleModal(index)}>
          <KeyBoardWrapper style={{borderRadius: 10}}>
            <View style={styles.line} />
            <TextComponent text={item?.title} styles={styles.botText} />
            {index === 0 || 2 || 3 ? (
              <View style={{marginTop: hp('5'), marginBottom: hp('20')}}>
                <ErrorInputComponent
                  dropDownData={item?.list}
                  dropDownPlaceholder={item?.dropDownPlaceholder}
                  preferenceVal={age}
                  setPreferenceVal={setAge}
                  dividerBool
                  dividerLineBool
                />
              </View>
            ) : null}
            <ThemeButton title="Save" style={{marginBottom: hp('1')}} />
          </KeyBoardWrapper>
        </BottomModalComponent>
      ))}
      <BottomModalComponent
        isVisible={isModalVisible}
        onClose={() => setModalVisible(!isModalVisible)}>
        <KeyBoardWrapper style={{borderRadius: 10}}>
          <View style={styles.line} />
          <TextComponent text={'Edit Profile'} styles={styles.botText} />

          <>
            <CircleImage
              uri={
                'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              }
              styles={{marginTop: hp('10'), ...styles.proImage}}
            />
            <Image source={upload} style={styles.upload} />
            <InputComponent
              name="email"
              handleSubmit={handleSubmit}
              errors={errors}
              reset={reset}
              control={control}
              getValues={getValues}
              placeholder="Edit Name"
              placeholderTextColor={Colors.textGray}
              defaultValue=""
              viewStyle={styles.edit}
              textStyle={styles.editText}
              rightText
            />
          </>

          <ThemeButton title="Save" style={{marginBottom: hp('1')}} />
        </KeyBoardWrapper>
      </BottomModalComponent>
    </View>
  );
};

export default EditProfileScreen;
