import React, {memo, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';

import {HeaderComponent} from '../../Components/HeaderComponent';
import {Touchable} from '../../Components/Touchable';
import {backIcon, crossWhite, radioCircle, searchIcon} from '../../Assets';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import {Colors} from '../../Theme/Variables';
import DividerLine from '../../Components/DividerLine';
import RangeSliderComp from '../../Components/RangeSliderComp';
import ThemeButton from '../../Components/ThemeButton';

import {
  allAssociatesUrl,
  allEventCircuitUrl,
  allEventTypeUrl,
  getMyFriendsUrl,
  globalSearchEventsWithFilterUrl,
  getMinMaxPriceUrl,
} from '../../Utils/Urls';

import API from '../../Utils/helperFunc';
import {
  formatPrice,
  getIdsFromArry,
  showFirstThreeAndCountRest,
} from '../../Services/GlobalFunctions';
import NavigationService from '../../Services/NavigationService';

// ✅ Combined Hook (useEventFilterScreen)
const useEventFilterScreen = () => {
  const {data} = useQuery({
    queryKey: ['getMinMaxPriceUrl'],
    queryFn: () => API.get(getMinMaxPriceUrl),
  });

  const sliderRef = useRef(null);
  const [filterVal, setFilterVal] = useState({
    location: [],
    minPrice: 0,
    maxPrice: data?.data?.max_price ?? 99999999,
    intersetedFriends: [],
    eventTypes: [],
    assocations: [],
    circuits: [],
  });

  const {
    assocations,
    circuits,
    eventTypes,
    intersetedFriends,
    location,
    maxPrice,
    minPrice,
  } = filterVal;

  const updateState = data => setFilterVal(prev => ({...prev, ...data}));
  const onChangeVal = (key, val) => updateState({[key]: val});

  return {
    sliderRef,
    onChangeVal,
    assocations,
    circuits,
    eventTypes,
    intersetedFriends,
    location,
    maxPrice,
    minPrice,
    filterVal,
    priceLimit: data?.data?.max_price ?? 99999999,
  };
};

// ✅ Main Component (EventFilterScreen)
const EventFilterScreen = ({onSearchFilter, onCloseModal}) => {
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
    onChangeVal,
  } = useEventFilterScreen();

  const SelectBtnView = ({stateName, item, index}) => {
    const isSelected = filterVal[stateName]?.some(res => res?.id == item?.id);

    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          onChangeVal(
            stateName,
            filterVal[stateName]?.filter((_, i) => i !== index),
          )
        }
        style={{
          backgroundColor: isSelected ? Colors.backgroundTheme : Colors.white,
          ...styles.allergiesBtns,
        }}>
        <Text
          style={{
            color: isSelected ? 'white' : 'black',
            fontSize: hp('1.2'),
          }}>
          {item?.name ?? item?.first_name ?? item}
        </Text>
        {isSelected && (
          <Image
            source={crossWhite}
            resizeMode="contain"
            style={{
              width: wp('2'),
              height: hp('2'),
              marginLeft: wp('2'),
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Touchable onPress={onCloseModal} style={styles.backButton}>
        <Image
          source={backIcon}
          resizeMode="contain"
          style={styles.backIcon}
          tintColor={'black'}
        />
      </Touchable> */}

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        {/* LOCATION */}
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
                NavigationService.navigate(
                  'LocationScreen',
                  (locationName, coords) => {
                    onChangeVal('location', [
                      {name: locationName, coords, id: locationName},
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
                <DividerLine DividerLineStyle={{marginTop: hp('1')}} />
                {showFirstThreeAndCountRest(location).map((res, i) => (
                  <View key={i} style={styles.multiSelectContainer}>
                    <SelectBtnView
                      item={res}
                      stateName={'location'}
                      index={i}
                    />
                  </View>
                ))}
              </>
            )}
          </View>
        </View>

        {/* PRICE RANGE */}
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

        {/* FRIENDS INTEREST */}
        <View style={styles.eventTypeSection}>
          <View style={styles.eventTypeHeader}>
            <TextComponent text={'Friend Interest'} size={hp('1.5')} />
            <TextComponent
              fade
              text={'Select friends'}
              size={hp('1.2')}
              onPress={() => {
                NavigationService.navigate('SelectFriendListScreem', {
                  onSelectValue: res => onChangeVal('intersetedFriends', res),
                  selectedValue: intersetedFriends,
                  urlName: getMyFriendsUrl,
                  isMultiSelect: true,
                });
              }}
            />
          </View>
          {intersetedFriends.length > 0 && (
            <View style={styles.multiSelectContainer}>
              {showFirstThreeAndCountRest(intersetedFriends).map((res, i) => (
                <SelectBtnView
                  item={res}
                  stateName={'intersetedFriends'}
                  index={i}
                  key={i}
                />
              ))}
            </View>
          )}
        </View>

        {/* EVENT TYPE */}
        <View style={styles.eventTypeSection}>
          <View style={styles.eventTypeHeader}>
            <TextComponent text={'Event type'} size={hp('1.5')} />
            <TextComponent
              fade
              text={'Select type'}
              size={hp('1.2')}
              onPress={() => {
                NavigationService.navigate('ListViewScreen', {
                  onSelectValue: res => onChangeVal('eventTypes', res),
                  selectedValue: eventTypes,
                  urlName: allEventTypeUrl,
                  isMultiSelect: true,
                });
              }}
            />
          </View>
          {eventTypes.length > 0 && (
            <View style={styles.multiSelectContainer}>
              {showFirstThreeAndCountRest(eventTypes).map((res, i) => (
                <SelectBtnView
                  item={res}
                  stateName={'eventTypes'}
                  index={i}
                  key={i}
                />
              ))}
            </View>
          )}
        </View>

        {/* ASSOCIATIONS */}
        <View style={styles.eventTypeSection}>
          <View style={styles.eventTypeHeader}>
            <TextComponent text={'Association'} size={hp('1.5')} />
            <TextComponent
              fade
              text={'Select associations'}
              size={hp('1.2')}
              onPress={() => {
                NavigationService.navigate('ListViewScreen', {
                  onSelectValue: res => onChangeVal('assocations', res),
                  selectedValue: assocations,
                  urlName: allAssociatesUrl,
                  isMultiSelect: true,
                });
              }}
            />
          </View>
          {assocations.length > 0 && (
            <View style={styles.multiSelectContainer}>
              {showFirstThreeAndCountRest(assocations).map((res, i) => (
                <SelectBtnView
                  item={res}
                  stateName={'assocations'}
                  index={i}
                  key={i}
                />
              ))}
            </View>
          )}
        </View>

        {/* CIRCUITS */}
        <View style={styles.eventTypeSection}>
          <View style={styles.eventTypeHeader}>
            <TextComponent text={'Circuits'} size={hp('1.5')} />
            <TextComponent
              fade
              text={'Select circuits'}
              size={hp('1.2')}
              onPress={() => {
                NavigationService.navigate('ListViewScreen', {
                  onSelectValue: res => onChangeVal('circuits', res),
                  selectedValue: circuits,
                  urlName: allEventCircuitUrl,
                  isMultiSelect: true,
                });
              }}
            />
          </View>
          {circuits.length > 0 && (
            <View style={styles.multiSelectContainer}>
              {showFirstThreeAndCountRest(circuits).map((res, i) => (
                <SelectBtnView
                  item={res}
                  stateName={'circuits'}
                  index={i}
                  key={i}
                />
              ))}
            </View>
          )}
        </View>

        {/* SHOW RESULTS */}
        <View style={styles.btnView}>
          <ThemeButton
            title={'Show results'}
            isYellowTheme
            style={styles.btnStyle}
            textStyle={{fontSize: hp('1.5')}}
            onPress={() => {
              onSearchFilter(
                `${globalSearchEventsWithFilterUrl}?association_ids=[${getIdsFromArry(
                  assocations,
                  'id',
                )}]&&event_type_ids=[${getIdsFromArry(
                  eventTypes,
                  'id',
                )}]&&user_ids=[${getIdsFromArry(
                  intersetedFriends,
                  'id',
                )}]&&min_price=${minPrice}&&max_price=${maxPrice}`,
              );
              //   navigation.goBack();
              //   navigation.navigate('GlobalEventsScreen', {
              //     isParams: true,
              //     url: `${globalSearchEventsWithFilterUrl}?association_ids=[${getIdsFromArry(
              //       assocations,
              //       'id',
              //     )}]&&event_type_ids=[${getIdsFromArry(
              //       eventTypes,
              //       'id',
              //     )}]&&user_ids=[${getIdsFromArry(
              //       intersetedFriends,
              //       'id',
              //     )}]&&min_price=${minPrice}&&max_price=${maxPrice}`,
              //   });
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default memo(EventFilterScreen);

// ✅ Styles (merged from styles.js)
const styles = StyleSheet.create({
  backButton: {
    paddingTop: hp('1'),
    paddingLeft: wp('3'),
    width: wp('100'),
    backgroundColor: 'white',
  },
  backIcon: {width: wp('6'), height: hp('4')},
  scrollViewContent: {flexGrow: 1},
  sectionContainer: {
    backgroundColor: 'white',
    paddingBottom: hp('2'),
  },
  sectionTitle: {marginTop: hp('1')},
  locationContainer: {
    width: wp('88'),
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.grayFaded,
    paddingVertical: hp('1.5'),
    marginTop: hp('2'),
    paddingHorizontal: wp('3'),
  },
  searchTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {width: wp('4'), height: hp('2'), marginRight: wp('1')},
  multiSelectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: hp('0.5'),
  },
  allergiesBtns: {
    height: hp('3'),
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: wp('2'),
    marginHorizontal: wp('1'),
    marginVertical: hp('.5'),
    borderWidth: 0.5,
  },
  priceSection: {
    backgroundColor: 'white',
    paddingHorizontal: wp('3'),
    paddingBottom: hp('2'),
    marginVertical: hp('1'),
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1'),
    justifyContent: 'space-between',
  },
  priceBox: {
    width: wp('45'),
    paddingVertical: hp('1.5'),
    backgroundColor: Colors.bgGray,
    borderRadius: 10,
    paddingLeft: wp('2'),
  },
  priceLabel: {marginBottom: hp('0.5')},
  eventTypeSection: {
    backgroundColor: 'white',
    paddingHorizontal: wp('3'),
    paddingVertical: hp('1'),
    marginBottom: hp('1'),
  },
  eventTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnView: {
    paddingTop: hp('2'),
    backgroundColor: 'white',
    paddingBottom: hp('10'),
    flexGrow: 1,
  },
  btnStyle: {
    height: hp('5'),
    width: wp('90'),
    alignSelf: 'center',
  },
});
