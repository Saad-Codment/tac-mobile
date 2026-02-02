import {View, Text, FlatList} from 'react-native';
import React, {memo, useCallback} from 'react';
import Video from 'react-native-video';
import useViewPlayScreen from './useVideoPlayScreen';

const VideoPlayScreen = ({navigation}) => {
  const {
    reels,
    currentIndex,
    viewabilityConfig,
    viewabilityConfigCallbackPairs,
    SCREEN_HEIGHT,
  } = useViewPlayScreen();

  const renderItem = useCallback(
    ({item, index}) => {
      const isActive = index === currentIndex;
      // Optional aggressive prefetch: play/next one too (good on fast networks, test memory!)
      // const isActiveOrNext = index === currentIndex || index === currentIndex + 1;

      return (
        <View style={{height: SCREEN_HEIGHT, width: '100%'}}>
          <Video
            source={{uri: item?.videoUrl}}
            style={{flex: 1}}
            resizeMode="cover"
            repeat={true} // loops forever
            paused={!isActive} // ← core: pause when not visible
            muted={false} // or control via state for tap-to-mute
            playInBackground={false} // usually false for feeds
            playWhenInactive={false}
            // Buffering tweaks (helps reduce spinner time)
            bufferConfig={{
              minBufferMs: 15000, // Android: start playback after 1.5s buffered
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500, // min buffer needed to start/resume
              bufferForPlaybackAfterRebufferMs: 5000,
            }}
            // iOS forward buffer (seconds ahead)
            preferredForwardBufferDuration={10} // try 5–15 sec
            // Events for loading indicator / error handling
            onBuffer={({isBuffering}) => {
              // You can show a spinner overlay if needed
              console.log('Buffering:', isBuffering);
            }}
            onReadyForDisplay={() => console.log('Ready to display')}
            onError={err => console.log('Video error:', err)}
            // Optional: poster for first frame while loading
            // poster={item.thumbnailUrl}
            // posterResizeMode="cover"
          />

          {/* Loading overlay (optional – show while buffering) */}
          {/* {isBuffering && <ActivityIndicator size="large" color="white" style={{ position: 'absolute', top: '50%', left: '50%' }} />} */}

          {/* Overlay UI */}
          <View style={{position: 'absolute', bottom: 40, left: 16, right: 16}}>
            <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
              @{item.username || 'user'}
            </Text>
            {/* Add caption, likes, etc. */}
          </View>
        </View>
      );
    },
    [currentIndex],
  );

  return (
    <View>
      <FlatList
        data={reels}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        windowSize={5} // → pre-renders ~2 above + 2 below → starts buffering next 1-2
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
        onEndReached={() => {
          // Your pagination: fetch next batch of reels
        }}
        onEndReachedThreshold={0.3}
      />
    </View>
  );
};

export default memo(VideoPlayScreen);
