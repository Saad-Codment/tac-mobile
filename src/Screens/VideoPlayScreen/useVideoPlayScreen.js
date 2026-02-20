import React, {useState, useRef, useCallback} from 'react';
import {Dimensions} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import useReduxStore from '../../Hooks/UseReduxStore';
import API from '../../Utils/helperFunc';
import {getSinglePostUrl} from '../../Utils/Urls';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const useViewPlayScreen = route => {
  const {params} = route;

  const [currentIndex, setCurrentIndex] = useState(0);

  const {getState} = useReduxStore();
  const {userData: myUserData} = getState('Auth');

  const {data} = useQuery({
    queryKey: ['postVideoAPI'],
    queryFn: () => API.get(getSinglePostUrl + (params?.userData?.id || '')),
  });

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // ← lowered from 70 → better auto-play feel
    minimumViewTime: 100,
    waitForInteraction: false,
  }).current;

  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems.length > 0) {
      const visibleIndex = viewableItems[0].index;
      if (visibleIndex !== null && visibleIndex !== undefined) {
        setCurrentIndex(visibleIndex);
      }
    }
  }, []);

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig,
      onViewableItemsChanged,
    },
  ]).current;

  return {
    currentIndex,
    viewabilityConfig,
    viewabilityConfigCallbackPairs,
    SCREEN_HEIGHT,
    videosArry: data?.data?.videos ?? [],
    userData: data?.data,
    myUserData,
    refectKeys: params?.refectKeys ?? [],
  };
};

export default useViewPlayScreen;
