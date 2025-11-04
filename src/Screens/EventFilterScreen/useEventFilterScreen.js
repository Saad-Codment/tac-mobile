import {useRef, useState} from 'react';
import {
  getMinMaxPriceUrl,
  globalSearchEventsWithFilterUrl,
} from '../../Utils/Urls';
import {useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {StackActions, useNavigation} from '@react-navigation/native';
import {getIdsFromArry} from '../../Services/GlobalFunctions';

const useEventFilterScreen = ({params}) => {
  const navigation = useNavigation();

  const {data} = useQuery({
    queryKey: ['getMinMaxPriceUrl'],
    queryFn: () => API.get(getMinMaxPriceUrl),
  });

  const currentDate = new Date();

  const sliderRef = useRef(null);
  const [filterVal, setFilterVal] = useState(params?.selectedVal);
  const [modalType, setModalType] = useState(null);
  // const [filterVal, setFilterVal] = useState({
  //   location: params?.location,
  //   minPrice: params?.minPrice,
  //   maxPrice: params?.maxPrice ?? 99999999,
  //   intersetedFriends: params?.intersetedFriends,
  //   eventTypes: params?.eventTypes,
  //   assocations: params?.assocations,
  //   circuits: params?.circuits,
  // });

  const {
    assocations,
    circuits,
    eventTypes,
    intersetedFriends,
    location,
    maxPrice,
    minPrice,
    fromDate,
    toDate,
  } = filterVal;
  const updateState = data => setFilterVal(prev => ({...prev, ...data}));

  const onChangeVal = (key, val) => updateState({[key]: val});

  const applyFilters = () => {
    const url = `${globalSearchEventsWithFilterUrl}association_ids[]=${getIdsFromArry(
      assocations,
      'id',
    )}&event_type_ids[]=${getIdsFromArry(
      eventTypes,
      'id',
    )}&user_ids[]=${getIdsFromArry(
      intersetedFriends,
      'id',
    )}&min_price=${minPrice}&max_price=${maxPrice}&circuit_ids[]=${getIdsFromArry(
      circuits,
      'id',
    )}`;
    params?.onFilterPress({...filterVal, isParams: true});
    navigation.goBack();
  };

  const toggleDate = () => setModalType(null);

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
    applyFilters,
    fromDate,
    toDate,
    currentDate,
    toggleDate,
    modalType,
    setModalType,
  };
};
export default useEventFilterScreen;
