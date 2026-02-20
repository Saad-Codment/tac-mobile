import {View, FlatList} from 'react-native';
import React, {memo, useCallback} from 'react';
import useViewPlayScreen from './useVideoPlayScreen';
import {hp} from '../../Config/responsive';
import VIdeoPlayComp from '../../Components/VIdeoPlayComp';
import {keyExtractor} from '../../Utils';

const VideoPlayScreen = ({navigation, route}) => {
  const {
    currentIndex,
    viewabilityConfig,
    viewabilityConfigCallbackPairs,
    SCREEN_HEIGHT,
    videosArry,
    userData,
    myUserData,
    refectKeys,
  } = useViewPlayScreen(route);

  const renderItem = useCallback(
    ({item, index}) => {
      const isActive = index === currentIndex;

      return (
        <VIdeoPlayComp
          isActive={isActive}
          item={{...item, id: index}}
          userData={userData}
          myUserData={myUserData}
          refetechKeys={['postVideoAPI', ...(refectKeys || [])]}
          index={index}
        />
      );
    },
    [currentIndex, userData, myUserData, refectKeys],
  );

  return (
    <FlatList
      data={videosArry}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      pagingEnabled
      snapToInterval={SCREEN_HEIGHT}
      snapToAlignment="start"
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      windowSize={3}
      removeClippedSubviews={true}
      initialNumToRender={2}
      maxToRenderPerBatch={2}
      getItemLayout={(data, index) => ({
        length: SCREEN_HEIGHT,
        offset: SCREEN_HEIGHT * index,
        index,
      })}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
      onEndReached={() => {
        // Your pagination logic here if needed
      }}
      onEndReachedThreshold={0.5}
    />
  );
};

export default memo(VideoPlayScreen);
