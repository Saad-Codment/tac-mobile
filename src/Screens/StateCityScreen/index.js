import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import {
  arrLeft,
  chevDown,
  chevUp,
  crossWhite,
  searchIcon,
  stepBg,
} from '../../Assets';
import {Touchable} from '../../Components/Touchable';
import {TextComponent} from '../../Components/TextComponent';
import {Colors} from '../../Theme/Variables';
import {useMutation, useQuery} from '@tanstack/react-query';
import API, {formDataFunc} from '../../Utils/helperFunc';
import {
  allAssociatesUrl,
  allEventCircuitUrl,
  allEventTypeUrl,
  editProfileUrl,
} from '../../Utils/Urls';
import {hp, wp} from '../../Config/responsive';
import {MultiSelectButton} from '../../Components/MultiSelectButton';
import {statesWithCities} from '../../Utils/statesWithCities';
import {types} from '../../Redux/types';
import useReduxStore from '../../Hooks/UseReduxStore';

export default function StateViewScreen({navigation, route}) {
  const {getState, dispatch} = useReduxStore();

  const {userData} = getState('Auth');

  const {
    onSelectValue,
    selectedValue,
    urlName,
    isMultiSelect,
    listArray,
    onSelectedPress,
  } = route?.params;

  const [selectedList, setSelectedList] = useState(selectedValue);

  const toggleAllergy = allergy => {
    console.log('selectedAllergies:', selectedList);
    if (isMultiSelect) {
      const foundAllergy = selectedList.find(res => res?.id === allergy?.id);

      if (foundAllergy) {
        setSelectedList(selectedList.filter(item => item?.id !== allergy?.id));
      } else {
        setSelectedList([...selectedList, allergy]);
      }
    } else if (!isMultiSelect) {
      const foundAllergy = selectedList.find(res => res?.id === allergy?.id);

      if (foundAllergy) {
        setSelectedList(selectedList.filter(item => item?.id !== allergy?.id));
      } else {
        setSelectedList([allergy]);
      }
    }
  };

  const [filterData, setFilterData] = useState([]);
  const [text, setText] = useState('');

  function searchFun(e) {
    var text = e;
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = listArray.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = (item.name || '').toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      console.log('newDatanewDatanewDatanewData', newData);
      setFilterData(newData);
      setText(text);
    } else {
      setFilterData(listArray);
      setText(text);
    }
  }

  const {mutateAsync} = useMutation({
    mutationFn: data => {
      return formDataFunc(editProfileUrl, {
        ...data,
        first_name: userData?.first_name,
      });
    },
    onSuccess: ({ok, data}) => {
      console.log('sldkbvklsdbvklsbdklvbskldbvsdkvbksd', data);
      if (ok) {
        if (data.user?.first_name || data?.user?.last_name) {
          dispatch({
            type: types.UpdateProfile,
            payload: data.user,
          });
        }
      } else {
        errorMessage(data?.message);
      }
    },
    onError: ({message}) => {},
    retry: true,
  });

  return (
    <View style={styles.mainView}>
      <View>
        <View style={styles.headerMain}>
          <Touchable onPress={() => navigation.goBack()}>
            <Image
              source={arrLeft}
              style={styles.arrBack}
              tintColor={Colors.backgroundTheme}
            />
          </Touchable>
          {route?.params?.title && (
            <TextComponent text={route?.params?.title} />
          )}
          <TextComponent
            text={'Save'}
            styles={styles.saveText}
            onPress={async () => {
              console.log('selectedListselectedList', selectedList);
              // navigation.goBack();
              // if (isMultiSelect) onSelectValue(selectedList);
              // else onSelectValue(...selectedList);
              await mutateAsync({
                city: selectedList[0]?.id,
              });
              navigation.goBack();
            }}
          />
        </View>
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
      </View>
      <ScrollView
        contentContainerStyle={styles.btnsMain}
        showsVerticalScrollIndicator={false}>
        {/* <MultiSelectButton
          items={filterData.length >= 0 && text != '' ? filterData : data?.data}
          onSelectVal={(objId, item) => toggleAllergy(item)}
          objId={urlName}
          selectedAlter={selectedList}
          isMultipule={true}
          leftChildComp={
            <Image
              source={crossWhite}
              resizeMode="contain"
              style={{
                width: wp('3'),
                height: hp('5'),
                marginLeft: wp('3'),
              }}
            />
          }
        /> */}
        {listArray != null &&
          listArray?.length > 0 &&
          (filterData.length >= 0 && text != '' ? filterData : listArray)?.map(
            (item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (onSelectedPress) {
                    mutateAsync({
                      state: item?.id,
                    });
                    navigation.navigate('SelectCityScreen', {
                      // 1. Callback – REQUIRED (to get selected city back)
                      onSelectValue: selected => {
                        console.log('User selected:', selected);
                        // → { state: "California", city: "Los Angeles" }  or  null
                        // Save it wherever you want (state, context, redux, etc.)
                        // setSelectedLocation(selected);
                      },
                      listArray: statesWithCities[item?.id].map(item => ({
                        id: item,
                        name: item,
                      })),
                      title: 'Select City',
                      // 2. Pre-selected value – OPTIONAL (if you want to show already selected city)
                      selectedValue: [
                        {id: userData?.city, name: userData?.city},
                      ],
                      onSelectedPress: false,
                      // OR pass null if nothing selected yet
                      // selectedValue: null,
                    });
                  }
                  toggleAllergy(item);
                }}
                style={{
                  backgroundColor: selectedList?.filter(
                    res => res?.id == item?.id,
                  )[0]?.id
                    ? Colors.backgroundTheme
                    : Colors.white,
                  ...styles.allergiesBtns,
                }}>
                <Text
                  style={{
                    color: selectedList?.filter(res => res?.id == item?.id)[0]
                      ?.id
                      ? 'white'
                      : 'black',
                  }}>
                  {item?.name}
                </Text>
                {Boolean(
                  selectedList?.filter(res => res?.id == item?.id)[0]?.id,
                ) && (
                  <Image
                    source={crossWhite}
                    resizeMode="contain"
                    style={{
                      width: wp('3'),
                      height: hp('5'),
                      marginLeft: wp('3'),
                    }}
                  />
                )}
              </TouchableOpacity>
            ),
          )}
      </ScrollView>
    </View>
  );
}
