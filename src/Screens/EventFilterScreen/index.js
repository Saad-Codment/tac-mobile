import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {Touchable} from '../../Components/Touchable';
import {
  backIcon,
  calendar,
  calender,
  crossWhite,
  radioCircle,
  searchIcon,
} from '../../Assets';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import {Colors} from '../../Theme/Variables';
import {MultiSelectButton} from '../../Components/AssociationComp';
import RangeSliderComp from '../../Components/RangeSliderComp';
import useEventFilterScreen from './useEventFilterScreen';
import {styles} from './styles';
import {
  allAssociatesUrl,
  allEventCircuitUrl,
  allEventTypeUrl,
  getMyFriendsUrl,
  globalSearchEventsUrl,
  globalSearchEventsWithFilterUrl,
} from '../../Utils/Urls';
import {
  formatDateToLong,
  formatPrice,
  getDateMonthYear,
  getIdsFromArry,
  showFirstThreeAndCountRest,
} from '../../Services/GlobalFunctions';
import ThemeButton from '../../Components/ThemeButton';
import DividerLine from '../../Components/DividerLine';
import DatePicker from 'react-native-date-picker';

const EventFilterScreen = ({navigation, route}) => {
  const {
    sliderRef,
    assocations,
    circuits,
    eventTypes,
    intersetedFriends,
    location,
    maxPrice,
    minPrice,
    filterVal,
    priceLimit,
    fromDate,
    toDate,
    currentDate,
    modalType,
    onChangeVal,
    setModalType,
    applyFilters,
    toggleDate,
  } = useEventFilterScreen(route, navigation);

  const SelectBtnView = ({stateName, item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          onChangeVal(
            [stateName],
            filterVal[stateName]?.filter((_, i) => i !== index),
          )
        }
        style={{
          backgroundColor: filterVal[stateName]?.filter(
            res => res?.id == item?.id,
          )[0]?.id
            ? 'rgba(246, 246, 246, 1)'
            : Colors.white,
          borderColor: filterVal[stateName]?.filter(
            res => res?.id == item?.id,
          )[0]?.id
            ? 'rgba(246, 246, 246, 1)'
            : 'rgba(82, 82, 82, 1)',
          ...styles.allergiesBtns,
        }}>
        <Text
          style={{
            color: filterVal[stateName]?.filter(res => res?.id == item?.id)[0]
              ?.id
              ? 'rgba(150, 150, 150, 1)'
              : 'rgba(82, 82, 82, 1)',
            fontSize: hp('1.2'),
            maxWidth: wp('40'),
          }}
          numberOfLines={1}>
          {item?.name ?? item?.first_name ?? item}
        </Text>
        {Boolean(
          filterVal[stateName]?.filter(res => res?.id == item?.id)[0]?.id,
        ) && (
          <Image
            source={crossWhite}
            resizeMode="contain"
            style={{
              width: wp('2'),
              height: hp('2'),
              marginLeft: wp('2'),
            }}
            tintColor={'rgba(150, 150, 150, 1)'}
          />
        )}
      </TouchableOpacity>
    );
  };

  console.log(
    'skllksbdklfbskldbfksdklbfksbdklfbklsdbfkldsbklfbsdklbsdfklbdks',
    showFirstThreeAndCountRest(circuits),
  );

  return (
    <View style={styles.mainContainer}>
      {/* <Touchable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image
          source={backIcon}
          resizeMode="contain"
          style={styles.backIcon}
          tintColor={'black'}
        />
      </Touchable> */}
      <HeaderComponent isBack headerTitle={'Search Filters'} />
      <View style={styles.scrollContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.scrollViewContent} // without flexGrow
        >
          <View style={styles.sectionContainer}>
            <TextComponent
              text={'Location based'}
              styles={styles.sectionTitle}
              size={hp('1.5')}
            />
            <View style={styles.locationContainer}>
              <Touchable
                style={styles.searchTouchable}
                onPress={() => {
                  navigation.navigate(
                    'LocationScreen',
                    (locationName, coords) => {
                      onChangeVal('location', [
                        {
                          name: locationName,
                          coords,
                          id: locationName,
                        },
                        ...location,
                      ]);
                    },
                  );
                }}>
                <Image
                  source={searchIcon}
                  resizeMode="contain"
                  style={styles.searchIcon}
                  tintColor={'black'}
                />
                <TextComponent
                  text={'Search location here...'}
                  fade
                  size={hp('1.5')}
                />
              </Touchable>
              {location.length > 0 && (
                <>
                  <DividerLine
                    DividerLineStyle={{
                      marginTop: hp('1'),
                    }}
                  />
                  {showFirstThreeAndCountRest(location).map((res, i) => {
                    return (
                      <View style={styles.multiSelectContainer}>
                        <SelectBtnView
                          item={res}
                          stateName={'location'}
                          index={i}
                          textStyles={styles.multiSelectText}
                          btnStyles={styles.multiSelectButton}
                        />
                      </View>
                    );
                  })}
                </>
              )}
            </View>
          </View>

          <View
            style={{
              backgroundColor: 'rgba(246, 246, 246, 1);',
              height: hp('1'),
            }}
          />
          <View style={styles.priceSection}>
            <TextComponent
              text={'Select Dates'}
              styles={styles.sectionTitle}
              size={hp('1.5')}
            />
            <View style={styles.priceRangeContainer}>
              <View style={styles.priceBox}>
                <TextComponent
                  text={'From Date'}
                  fade
                  size={hp('1.5')}
                  styles={styles.priceLabel}
                />
                <Touchable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => setModalType('fromDate')}>
                  <Image
                    source={calender}
                    resizeMode="contain"
                    style={{width: wp('4'), height: hp('2')}}
                    tintColor={'black'}
                  />
                  <TextComponent
                    text={` ${
                      fromDate ? formatDateToLong(fromDate) : 'Select Date'
                    }`}
                    size={hp('1.5')}
                  />
                </Touchable>
              </View>
              <View style={styles.priceBox}>
                <TextComponent
                  text={'To Date'}
                  fade
                  size={hp('1.5')}
                  styles={styles.priceLabel}
                />
                <Touchable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => setModalType('toDate')}>
                  <Image
                    source={calender}
                    resizeMode="contain"
                    style={{width: wp('4'), height: hp('2')}}
                    tintColor={'black'}
                  />
                  <TextComponent
                    text={` ${
                      toDate ? formatDateToLong(toDate) : 'Select Date'
                    }`}
                    size={hp('1.5')}
                  />
                </Touchable>
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: 'rgba(246, 246, 246, 1);',
              height: hp('1'),
            }}
          />
          {/* <View style={{...styles.priceSection, marginVertical: hp('1')}}>
            <TextComponent
              text={'Prize money'}
              styles={styles.sectionTitle}
              size={hp('1.5')}
            />
            <View style={styles.priceRangeContainer}>
              <View style={styles.priceBox}>
                <TextComponent
                  text={'Min Price'}
                  fade
                  size={hp('1.5')}
                  styles={styles.priceLabel}
                />
                <TextComponent
                  text={`${formatPrice(minPrice)}`}
                  size={hp('1.5')}
                />
              </View>
              <View style={styles.priceBox}>
                <TextComponent
                  text={'Max Price'}
                  fade
                  size={hp('1.5')}
                  styles={styles.priceLabel}
                />
                <TextComponent
                  text={`${formatPrice(maxPrice)}`}
                  size={hp('1.5')}
                />
              </View>
            </View>
          </View> */}

          <View style={styles.eventTypeSection}>
            <View style={styles.eventTypeHeader}>
              <TextComponent text={'Friends Interested'} size={hp('1.5')} />
              <TextComponent
                fade
                text={'Select friends'}
                size={hp('1.2')}
                onPress={() => {
                  navigation.navigate('SelectFriendListScreem', {
                    onSelectValue: res => onChangeVal('intersetedFriends', res),
                    selectedValue: intersetedFriends,
                    urlName: getMyFriendsUrl,
                    isMultiSelect: true,
                    title: 'Select Friends',
                  });
                }}
              />
            </View>
            {intersetedFriends.length > 0 && (
              <View style={styles.multiSelectContainer}>
                {showFirstThreeAndCountRest(intersetedFriends).map((res, i) => {
                  return (
                    <SelectBtnView
                      item={res}
                      stateName={'intersetedFriends'}
                      index={i}
                      textStyles={styles.multiSelectText}
                      btnStyles={styles.multiSelectButton}
                    />
                  );
                })}
              </View>
            )}
          </View>
          <View
            style={{
              backgroundColor: 'rgba(246, 246, 246, 1);',
              height: hp('1'),
            }}
          />
          <View style={styles.eventTypeSection}>
            <View style={styles.eventTypeHeader}>
              <TextComponent text={'Event type(s)'} size={hp('1.5')} />
              <TextComponent
                fade
                text={'Select type'}
                size={hp('1.2')}
                onPress={() => {
                  navigation.navigate('ListViewScreen', {
                    onSelectValue: res => onChangeVal('eventTypes', res),
                    selectedValue: eventTypes,
                    urlName: allEventTypeUrl,
                    isMultiSelect: true,
                    title: 'Select Type',
                  });
                }}
              />
            </View>
            {eventTypes.length > 0 && (
              <View style={styles.multiSelectContainer}>
                {showFirstThreeAndCountRest(eventTypes).map((res, i) => {
                  return (
                    <SelectBtnView
                      item={res}
                      stateName={'eventTypes'}
                      index={i}
                      textStyles={styles.multiSelectText}
                      btnStyles={styles.multiSelectButton}
                    />
                  );
                })}
              </View>
            )}
          </View>
          <View
            style={{
              backgroundColor: 'rgba(246, 246, 246, 1);',
              height: hp('1'),
            }}
          />
          <View style={styles.eventTypeSection}>
            <View style={styles.eventTypeHeader}>
              <TextComponent text={'Association(s)'} size={hp('1.5')} />
              <TextComponent
                fade
                text={'Select associations'}
                size={hp('1.2')}
                onPress={() => {
                  navigation.navigate('ListViewScreen', {
                    onSelectValue: res => onChangeVal('assocations', res),
                    selectedValue: assocations,
                    urlName: allAssociatesUrl,
                    isMultiSelect: true,
                    title: 'Select Associations',
                  });
                }}
              />
            </View>
            {assocations.length > 0 && (
              <View style={styles.multiSelectContainer}>
                {showFirstThreeAndCountRest(assocations).map((res, i) => {
                  return (
                    <SelectBtnView
                      item={res}
                      stateName={'assocations'}
                      index={i}
                      textStyles={styles.multiSelectText}
                      btnStyles={styles.multiSelectButton}
                    />
                  );
                })}
              </View>
            )}
          </View>
          <View
            style={{
              backgroundColor: 'rgba(246, 246, 246, 1);',
              height: hp('1'),
            }}
          />
          <View style={styles.eventTypeSection}>
            <View style={styles.eventTypeHeader}>
              <TextComponent text={'Circuit(s)'} size={hp('1.5')} />
              <TextComponent
                fade
                text={'Select circuits'}
                size={hp('1.2')}
                onPress={() => {
                  navigation.navigate('ListViewScreen', {
                    onSelectValue: res => onChangeVal('circuits', res),
                    selectedValue: circuits,
                    urlName: allEventCircuitUrl,
                    isMultiSelect: true,
                    title: 'Select Circuits',
                  });
                }}
              />
            </View>
            {circuits.length > 0 && (
              <View style={styles.multiSelectContainer}>
                {showFirstThreeAndCountRest(circuits).map((res, i) => {
                  return (
                    <SelectBtnView
                      item={res}
                      stateName={'circuits'}
                      index={i}
                      textStyles={styles.multiSelectText}
                      btnStyles={styles.multiSelectButton}
                    />
                  );
                })}
              </View>
            )}
          </View>
          <View
            style={{
              backgroundColor: 'rgba(246, 246, 246, 1);',
              height: hp('1'),
            }}
          />
          <View style={styles.priceSection}>
            <TextComponent
              text={'Prize money'}
              styles={styles.sectionTitle}
              size={hp('1.5')}
            />
            <View style={styles.priceRangeContainer}>
              <View style={styles.priceBox}>
                <TextComponent
                  text={'Min Price'}
                  fade
                  size={hp('1.5')}
                  styles={styles.priceLabel}
                />
                <TextComponent
                  text={`${formatPrice(minPrice)}`}
                  size={hp('1.5')}
                />
              </View>
              <View style={styles.priceBox}>
                <TextComponent
                  text={'Max Price'}
                  fade
                  size={hp('1.5')}
                  styles={styles.priceLabel}
                />
                <TextComponent
                  text={`${formatPrice(maxPrice)}`}
                  size={hp('1.5')}
                />
              </View>
            </View>
            <RangeSliderComp
              ref={sliderRef}
              low={minPrice}
              setLow={e => onChangeVal('minPrice', e)}
              high={maxPrice}
              setHigh={e => onChangeVal('maxPrice', e)}
              maxRange={priceLimit}
              step={1}
            />
          </View>
          <View style={styles.btnView}>
            <ThemeButton
              title={'Show results'}
              isYellowTheme
              style={styles.btnStyle}
              textStyle={{fontSize: hp('1.5')}}
              onPress={() => {
                applyFilters();
                // navigation.navigate('GlobalEventsScreen', {
                //   isParams: true,
                //   url: `${globalSearchEventsWithFilterUrl}?association_ids=[${getIdsFromArry(
                //     assocations,
                //     'id',
                //   )}]&&event_type_ids=[${getIdsFromArry(
                //     eventTypes,
                //     'id',
                //   )}]&&user_ids=[${getIdsFromArry(
                //     intersetedFriends,
                //     'id',
                //   )}]&&min_price=${minPrice}&&max_price=${maxPrice}`,
                // });
                // navigation.pop();
              }}
            />
          </View>
        </ScrollView>
        {modalType != null && (
          <DatePicker
            mode={'date'}
            open={Boolean(modalType != null)}
            date={filterVal[modalType] ?? currentDate}
            is24hourSource="locale"
            locale="en"
            onCancel={() => toggleDate(null)}
            modal
            onConfirm={e => {
              console.log(
                'modalTypemodalTypemodalTypemodalTypemodalTypemodalTypemodalTypemodalType',
                modalType,
              );
              onChangeVal(modalType, e);
              toggleDate(null);
            }}
          />
        )}
      </View>
    </View>
  );
};

export default memo(EventFilterScreen);
