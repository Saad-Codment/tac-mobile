import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {memo, useState} from 'react';
import {
  allAssociatesUrl,
  allEventCircuitUrl,
  allEventTypeUrl,
  getMyFriendsUrl,
} from '../../Utils/Urls';
import {useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {Touchable} from '../../Components/Touchable';
import {TextComponent} from '../../Components/TextComponent';
import {arrLeft, crossWhite, searchIcon} from '../../Assets';
import {Colors} from '../../Theme/Variables';
import {styles} from './styles';
import {hp, wp} from '../../Config/responsive';
import MyFriendComp from '../../Components/MyFriendComp';

const SelectFriendListScreem = ({navigation, route}) => {
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
    [getMyFriendsUrl]: {
      queryName: 'allEventsCircuit',
      url: getMyFriendsUrl,
    },
  };

  const {onSelectValue, selectedValue, urlName, isMultiSelect} = route?.params;

  const {data, error} = useQuery({
    queryKey: [apiDataType[urlName].queryName],
    queryFn: () => API.get(apiDataType[urlName].url),
  });

  console.log(
    'datadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadata',
    data?.data,
  );

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
      const newData = data?.data?.data?.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = (
          `${item.first_name} ${item?.last_name}` || ''
        ).toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      console.log('newDatanewDatanewDatanewData', newData);
      setFilterData(newData);
      setText(text);
    } else {
      setFilterData(data?.data?.data);
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
          {route?.params?.title && (
            <TextComponent text={route?.params?.title} />
          )}
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
        {data?.data?.data != null &&
          data?.data?.data?.length > 0 &&
          (filterData.length >= 0 && text != ''
            ? filterData
            : data?.data?.data
          )?.map((item, index) => (
            <MyFriendComp
              item={item}
              isSelected={true}
              mainViewStyles={{width: wp('90'), marginLeft: wp('1')}}
              isDisable={true}
              onSelectValue={() => toggleAllergy(item)}
              isSelectedVal={Boolean(
                selectedList.find(res => res?.id === item?.id),
              )}
            />
          ))}
      </ScrollView>
    </View>
  );
};

export default memo(SelectFriendListScreem);
