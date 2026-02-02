import React, {useState, useRef, useCallback} from 'react';
import {
  FlatList,
  Dimensions,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video'; // ← this is the import

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const useViewPlayScreen = () => {
  const [reels, setReels] = useState([
    {
      id: '1',
      videoUrl:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      username: 'testuser1',
    },
    {
      id: '2',
      videoUrl:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      username: 'testuser2',
    },
    {
      id: '3',
      videoUrl:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      username: 'testuser3',
    },
    {
      id: '4',
      videoUrl:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      username: 'testuser4',
    },
    {
      id: '5',
      videoUrl:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      username: 'testuser5',
    },
    {
      id: '6',
      videoUrl:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      username: 'testuser6',
    },
    {
      id: '7',
      videoUrl:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      username: 'testuser7',
    },
    {
      id: '8',
      videoUrl:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      username: 'testuser8',
    },
  ]); // your array of reel data [{ id, videoUrl, username, ... }]
  const [currentIndex, setCurrentIndex] = useState(0);

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 70, // start playing at ~70% visible
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
    reels,
    currentIndex,
    viewabilityConfig,
    viewabilityConfigCallbackPairs,
    SCREEN_HEIGHT,
  };
};

export default useViewPlayScreen;
