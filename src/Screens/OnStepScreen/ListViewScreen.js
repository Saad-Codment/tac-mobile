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
import {useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {
  allAssociatesUrl,
  allEventCircuitUrl,
  allEventTypeUrl,
} from '../../Utils/Urls';
import {hp, wp} from '../../Config/responsive';
import {MultiSelectButton} from '../../Components/MultiSelectButton';

export default function ListViewScreen({navigation, route}) {
  const apiDataType = {
    [allAssociatesUrl]: {
      queryName: 'allAssociate',
      url: allAssociatesUrl,
    },
    [allEventTypeUrl]: {
      queryName: 'allEventstype',
      url: allEventTypeUrl,
    },
    [allEventCircuitUrl]: {
      queryName: 'allEventsCircuit',
      url: allEventCircuitUrl,
    },
  };

  const {onSelectValue, selectedValue, urlName, isMultiSelect} = route?.params;

  const {data, error} = useQuery({
    queryKey: [apiDataType[urlName].queryName],
    queryFn: () => API.get(apiDataType[urlName].url),
  });

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
      const newData = data?.data.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = (item.name || '').toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      console.log('newDatanewDatanewDatanewData', newData);
      setFilterData(newData);
      setText(text);
    } else {
      setFilterData(data?.data);
      setText(text);
    }
  }

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
          <TextComponent
            text={'Save'}
            styles={styles.saveText}
            onPress={() => {
              navigation.goBack();
              if (isMultiSelect) onSelectValue(selectedList);
              else onSelectValue(...selectedList);
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
            placeholder={'Search Allergies'}
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
        {data?.data != null &&
          data?.data?.length > 0 &&
          (filterData.length >= 0 && text != '' ? filterData : data?.data)?.map(
            (item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleAllergy(item)}
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
