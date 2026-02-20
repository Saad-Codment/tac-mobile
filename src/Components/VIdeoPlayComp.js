import {View, Dimensions, Image, StyleSheet, Pressable} from 'react-native';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import Video from 'react-native-video';
import {useFocusEffect} from '@react-navigation/native';
import {CircleImage} from './CircleImage';
import {TextComponent} from './TextComponent';
import {hp, wp} from '../Config/responsive';
import {
  backIcon,
  commentCircle,
  heartCircle,
  heartFillCircle,
  shareCIrcle,
} from '../Assets';
import ThemeButton from './ThemeButton';
import useFriendServices from '../Services/FriendServices';
import useReduxStore from '../Hooks/UseReduxStore';
import {imageUrl, videoUrl} from '../Utils/Urls';
import Overlay from './Overlay';
import {Touchable} from './Touchable';
import NavigationService from '../Services/NavigationService';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const VIdeoPlayComp = ({
  item,
  isActive,
  userData,
  myUserData,
  refetechKeys,
  index,
}) => {
  const {sendFriendReq, removeFriend, sharePost, addLikeOnPost} =
    useFriendServices();
  const {queryClient} = useReduxStore();

  const [loader, setLoader] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [videoOrientation, setVideoOrientation] = useState('unknown');

  // Optimistic Like
  const [isOptimisticLiked, setIsOptimisticLiked] = useState(
    userData?.is_liked === 1,
  );
  const [optimisticLikesCount, setOptimisticLikesCount] = useState(
    Number(userData?.likes_count ?? 0),
  );

  useEffect(() => {
    setIsOptimisticLiked(userData?.is_liked === 1);
    setOptimisticLikesCount(Number(userData?.likes_count ?? 0));
  }, [userData?.is_liked, userData?.likes_count]);

  // Reset when becoming active
  useEffect(() => {
    if (isActive) {
      setLoader(true);
      setIsBuffering(true);
      setIsContentVisible(false);
    }
  }, [isActive]);

  // Focus handling
  const [isScreenFocused, setIsScreenFocused] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);
      return () => setIsScreenFocused(false);
    }, []),
  );

  const shouldBePaused = !isActive || !isScreenFocused;

  const videoResizeMode = videoOrientation === 'portrait' ? 'cover' : 'contain';

  const handleLike = useCallback(async () => {
    const newLiked = !isOptimisticLiked;
    const newCount = newLiked
      ? optimisticLikesCount + 1
      : optimisticLikesCount - 1;

    setIsOptimisticLiked(newLiked);
    setOptimisticLikesCount(newCount);

    try {
      await addLikeOnPost.mutateAsync(userData?.id);
      refetechKeys?.forEach(key => queryClient.invalidateQueries([key]));
    } catch (error) {
      console.warn('Like failed – UI stays updated', error);
    }
  }, [
    isOptimisticLiked,
    optimisticLikesCount,
    userData?.id,
    addLikeOnPost,
    refetechKeys,
    queryClient,
  ]);

  const shouldShowLoader = !isContentVisible || loader;

  // Force new Video instance when isActive changes to true
  // This is the key change — avoids stuck paused state without seek
  const videoKey = isActive
    ? `video-active-${index}`
    : `video-inactive-${index}`;

  return (
    <View style={styles.container}>
      <Video
        key={videoKey} // ← this forces remount when isActive becomes true again
        ref={ref => {
          if (ref && isActive) {
            // Optional: can add ref.current?.setRate?.(1.0) if library supports
          }
        }}
        source={{uri: videoUrl(item?.master_playlist_path)}}
        style={styles.video}
        resizeMode={videoResizeMode}
        repeat={true}
        paused={shouldBePaused}
        muted={false}
        playInBackground={false}
        playWhenInactive={false}
        allowsExternalPlayback={false}
        fullscreen={false}
        fullscreenAutorotate={false}
        audioOutput={'speaker'}
        hideShutterView={true}
        disableAudioSessionManagement={true}
        preventsDisplaySleepDuringVideoPlayback={true}
        enterPictureInPictureOnLeave={false}
        controls={true}
        rate={1.0} // ← explicit rate, sometimes helps
        bufferConfig={{
          minBufferMs: 3000, // more aggressive
          maxBufferMs: 20000,
          bufferForPlaybackMs: 1000,
          bufferForPlaybackAfterRebufferMs: 2000,
        }}
        preferredForwardBufferDuration={5}
        automaticallyWaitsToMinimizeStalling={false}
        onBuffer={({isBuffering}) => {
          setIsBuffering(isBuffering);
        }}
        onProgress={({currentTime}) => {
          if (currentTime > 0.3) {
            setIsContentVisible(true);
            setLoader(false);
          }
        }}
        onLoad={data => {
          const natural = data.naturalSize || {};
          if (natural.orientation) {
            setVideoOrientation(natural.orientation);
          } else if (natural.width && natural.height) {
            setVideoOrientation(
              natural.width > natural.height ? 'landscape' : 'portrait',
            );
          }
          setLoader(false);
        }}
        onReadyForDisplay={() => {
          setIsContentVisible(true);
          setLoader(false);
        }}
        onError={err => console.log('Video error:', err)}
      />

      <Touchable
        style={{position: 'absolute', top: hp('8'), left: wp('5'), zIndex: 10}}
        onPress={() => NavigationService.goBack()}>
        <Image
          source={backIcon}
          resizeMode="contain"
          style={{width: wp('8'), height: hp('3')}}
        />
      </Touchable>

      {/* Bottom overlay */}
      <View style={styles.bottomOverlay}>
        <Pressable
          style={styles.userRow}
          onPress={() => {
            if (myUserData?.id === userData?.user_id) {
              NavigationService.navigate('MyProfileScreen', {
                id: myUserData?.id,
              });
            } else {
              NavigationService.navigate('FriendProfileScreen', {
                id: userData?.user_id,
              });
            }
          }}>
          <CircleImage uri image={imageUrl(userData?.user_image)} />
          <TextComponent
            text={`${userData?.first_name || ''} ${
              userData?.last_name || ''
            }`.trim()}
            isWhite
            size={hp('1.5')}
            styles={styles.nameText}
            fontFamily={'bold'}
          />
          {myUserData?.id !== userData?.user_id && (
            <ThemeButton
              title={
                userData?.friends != 0
                  ? 'Remove'
                  : userData?.requested == 0
                  ? 'Add friend'
                  : 'Requested'
              }
              style={styles.addFriendButton}
              textStyle={styles.addFriendText}
              isWhite
              onPress={async () => {
                if (userData?.friends == 0) {
                  await sendFriendReq.mutateAsync(userData?.user_id);
                  refetechKeys?.forEach(res =>
                    queryClient.invalidateQueries([res]),
                  );
                } else {
                  Alert.alert(
                    'Confirmation Alert',
                    `Are you sure you want to remove ${userData?.first_name} as a friend?`,
                    [
                      {text: 'Cancel', style: 'cancel'},
                      {
                        text: 'Yes, Remove',
                        style: 'destructive',
                        onPress: async () => {
                          await removeFriend.mutateAsync(userData?.friends);
                          refetechKeys?.forEach(res =>
                            queryClient.invalidateQueries([res]),
                          );
                        },
                      },
                    ],
                  );
                }
              }}
            />
          )}
        </Pressable>

        <TextComponent
          text={userData?.title || ''}
          isWhite
          styles={styles.caption}
          size={hp('1.5')}
        />
      </View>

      {/* Action buttons */}
      <View style={styles.actionButtonsContainer}>
        <Pressable style={styles.actionItem} onPress={handleLike}>
          <Image
            source={isOptimisticLiked ? heartFillCircle : heartCircle}
            resizeMode="contain"
            style={styles.actionIcon}
          />
          <TextComponent
            text={optimisticLikesCount.toString()}
            isWhite
            size={hp('1.5')}
            fontFamily={'bold'}
          />
        </Pressable>

        <Pressable
          style={styles.actionItem}
          onPress={() => {
            NavigationService.navigate('CommentScreen', {
              id: userData?.id,
              refetechKeys,
              isPost: true,
              index,
            });
          }}>
          <Image
            source={commentCircle}
            resizeMode="contain"
            style={styles.actionIcon}
          />
          <TextComponent
            text={userData?.comments_count ?? '0'}
            isWhite
            size={hp('1.5')}
            fontFamily={'bold'}
          />
        </Pressable>

        <Touchable
          style={styles.actionItem}
          onPress={() => sharePost.mutate({post_id: userData?.id})}>
          <Image
            source={shareCIrcle}
            resizeMode="contain"
            style={styles.actionIcon}
          />
        </Touchable>
      </View>

      {shouldShowLoader && <Overlay />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp('100'),
    width: '100%',
    backgroundColor: '#181818',
  },
  video: {
    flex: 1,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    marginHorizontal: wp('2'),
    maxWidth: wp('30'),
  },
  addFriendButton: {
    width: wp('30'),
    height: hp('4'),
    marginLeft: wp('10'),
  },
  addFriendText: {
    fontSize: hp('1.3'),
    fontWeight: 'bold',
  },
  caption: {
    marginTop: hp('1'),
  },
  actionButtonsContainer: {
    position: 'absolute',
    right: wp('3'),
    bottom: hp('15'),
    alignItems: 'center',
    justifyContent: 'space-between',
    height: hp('30'),
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIcon: {
    width: wp('10'),
    height: hp('7'),
  },
});

export default VIdeoPlayComp;
