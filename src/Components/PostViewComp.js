import React, {useState, useEffect} from 'react';
import {
  Alert,
  Clipboard,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TextComponent} from './TextComponent';
import {hp, wp} from '../Config/responsive';
import {CircleImage} from './CircleImage';
import {Touchable} from './Touchable';
import {
  commentIcon,
  dotsVertical,
  heartFilledLike,
  heartTheme,
  shareTheme,
  playIcon,
  tickfill,
  tickemp,
  whatapp,
  isnta,
  messageApp,
  copyLink,
  more,
} from '../Assets';
import {Colors} from '../Theme/Variables';
import BlurImage from './BlurImage';
import NavigationService from '../Services/NavigationService';
import useFriendServices from '../Services/FriendServices';
import useReduxStore from '../Hooks/UseReduxStore';
import {imageUrl, videoUrl} from '../Utils/Urls';
import {
  checkImageOrientation,
  formatDateToCustomFormat,
  generateBranchLink,
  generateBranchLinkForPost,
  onShareEvent,
  onSharePost,
  shareEventUsingBranch,
  sharePostToSpecificApp,
} from '../Services/GlobalFunctions';
import {types} from '../Redux/types';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import BottomViewModal from './BottomViewModal';
import ThemeButton from './ThemeButton';
import {successMessage} from '../Config/NotificationMessage';

// ────────────────────────────────────────────────
// Helper: prepare unified media list
// ────────────────────────────────────────────────
const prepareMedia = (images = [], videos = []) => {
  const media = [];

  images.forEach(img => {
    media.push({
      type: 'image',
      url: imageUrl(img),
    });
  });

  videos.forEach(vid => {
    media.push({
      type: 'video',
      url: videoUrl(vid.thumbnail_path),
      videoData: vid,
    });
  });

  return media;
};

// ────────────────────────────────────────────────
// Unified Media Renderer
// ────────────────────────────────────────────────
const RenderMedia = ({images = [], videos = [], onMediaPress}) => {
  const [orientation, setOrientation] = useState('landscape');

  const media = prepareMedia(images, videos);
  const count = media.length;

  useEffect(() => {
    if (count !== 1) return;

    const check = async () => {
      try {
        const ori = await checkImageOrientation(media[0].url);
        setOrientation(ori || 'landscape');
      } catch (err) {
        console.log('Orientation check failed:', err);
      }
    };
    check();
  }, [count, media]);

  if (count === 0) return null;

  if (count === 1) {
    const item = media[0];
    return (
      <Pressable onPress={() => onMediaPress?.(item, 0)}>
        <View style={{position: 'relative'}}>
          <BlurImage
            uri={item.url}
            isURI
            styles={styles.singleImage(orientation)}
          />
          {item.type === 'video' && (
            <Image
              source={playIcon}
              style={styles.playIcon}
              resizeMode="contain"
            />
          )}
        </View>
      </Pressable>
    );
  }

  if (count === 2) {
    return (
      <View style={styles.twoImagesContainer}>
        {media.map((item, index) => (
          <Pressable
            key={index}
            style={{flex: 1}}
            onPress={() => onMediaPress?.(item, index)}>
            <View style={{position: 'relative', flex: 1}}>
              <BlurImage uri={item.url} isURI styles={styles.twoImage} />
              {item.type === 'video' && (
                <Image
                  source={playIcon}
                  style={styles.playIcon}
                  resizeMode="contain"
                />
              )}
            </View>
          </Pressable>
        ))}
      </View>
    );
  }

  if (count === 3) {
    return (
      <View style={styles.twoImagesContainer}>
        <Pressable
          style={{width: wp('46')}}
          onPress={() => onMediaPress?.(media[0], 0)}>
          <View style={{position: 'relative'}}>
            <BlurImage
              uri={media[0].url}
              isURI
              styles={{
                width: wp('46'),
                height: hp('40'),
                borderRadius: wp('2'),
              }}
            />
            {media[0].type === 'video' && (
              <Image
                source={playIcon}
                style={styles.playIcon}
                resizeMode="contain"
              />
            )}
          </View>
        </Pressable>

        <View style={{justifyContent: 'space-between', width: wp('42')}}>
          {media.slice(1).map((item, idx) => (
            <Pressable
              key={idx + 1}
              onPress={() => onMediaPress?.(item, idx + 1)}>
              <View style={{position: 'relative'}}>
                <BlurImage
                  uri={item.url}
                  isURI
                  styles={{
                    width: wp('42'),
                    height: hp('19.8'),
                    borderRadius: wp('2'),
                  }}
                />
                {item.type === 'video' && (
                  <Image
                    source={playIcon}
                    style={styles.playIcon}
                    resizeMode="contain"
                  />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.gridContainer}>
      {media.slice(0, 4).map((item, index) => (
        <Pressable
          key={index}
          style={styles.gridItem}
          onPress={() => onMediaPress?.(item, index)}>
          <View style={{position: 'relative', flex: 1}}>
            <BlurImage
              uri={item.url}
              isURI
              styles={{
                ...styles.gridImage,
                marginTop: index > 1 ? hp('0.5') : 0,
              }}
            />
            {item.type === 'video' && (
              <Image
                source={playIcon}
                style={styles.playIcon}
                resizeMode="contain"
              />
            )}
          </View>

          {index === 3 && count > 4 && (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>+{count - 4}</Text>
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
};

// ────────────────────────────────────────────────
// Just Text Post
// ────────────────────────────────────────────────
const JustTextRenderPost = ({title}) => {
  return (
    <View style={styles.textPostView}>
      <TextComponent
        text={title}
        numberOfLines={100}
        styles={{fontSize: hp('1.5')}}
      />
    </View>
  );
};

// ────────────────────────────────────────────────
// MAIN POST COMPONENT
// ────────────────────────────────────────────────
const PostViewComp = ({
  item,
  refetechKeys,
  functionToUpdateLike,
  index,
  openBottomSheet,
  mainViewStyle,
  refetch,
  functionToDelete,
  functionToUpdateComment,
  functionToUpdatePostOrEvent,
  setCommentModal,
  isRefectechForVideo,
  DoNotShowFooter,
}) => {
  const {likeAndDisLikeEvent, addLikeOnPost, sharePost, deletePost} =
    useFriendServices();

  const [modal, setModal] = useState(false);
  const [shareOnFeed, setShareOnFeed] = useState(true);

  const {getState, dispatch, queryClient} = useReduxStore();

  const images = JSON.parse(item?.images || '[]');
  const videos = item?.videos || [];

  const hasMedia = images.length > 0 || videos.length > 0;

  const handleMediaPress = (mediaItem, clickedIndex) => {
    if (mediaItem.type === 'video') {
      NavigationService.navigate('VideoPlayScreen', {
        videos: item.videos,
        userData: item,
        startIndex: clickedIndex,
        refectKeys: refetechKeys ?? isRefectechForVideo ?? [],
      });
    } else {
      dispatch({
        payload: images,
        type: types.openModal,
      });
    }
  };

  const onEditPost = () => {
    NavigationService.navigate('CreatePostScreen', {
      post: item,
      functionToUpdatePostOrEvent: data => functionToUpdatePostOrEvent(data),
    });
  };

  const onDeletePost = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this post?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePost.mutateAsync(item?.id);
            functionToDelete(index);
          },
        },
      ],
    );
  };

  const {userData} = getState('Auth');

  return (
    <>
      <View style={{...styles.mainView, ...mainViewStyle}}>
        {/* Header */}
        <Pressable
          style={styles.upperView}
          onPress={() => {
            if (userData?.id === item?.user_id) {
              NavigationService.navigate('MyProfileScreen', {id: userData?.id});
            } else {
              NavigationService.navigate('FriendProfileScreen', {
                id: item?.user_id,
              });
            }
          }}>
          <CircleImage
            image={imageUrl(item?.profile_image ?? item?.user_image)}
            uri
          />
          <View style={styles.userDetails}>
            <TextComponent
              text={
                item?.first_name +
                ' ' +
                (item?.last_name ? item?.last_name : '')
              }
              styles={styles.userName}
            />
            <TextComponent
              text={formatDateToCustomFormat(item?.created_at)}
              styles={styles.postTime}
            />
          </View>

          {userData?.id !== item?.user_id ? (
            <TextComponent
              text={'Report'}
              fade
              styles={styles.reportText}
              onPress={() => openBottomSheet?.(item?.id)}
            />
          ) : (
            <Menu>
              <MenuTrigger>
                <Image
                  source={dotsVertical}
                  resizeMode="contain"
                  style={{width: wp('6'), height: hp('4')}}
                />
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {color: 'black'},
                  optionText: {color: 'black'},
                }}>
                <MenuOption onSelect={onEditPost} text="Edit" />
                <MenuOption onSelect={onDeletePost} text="Delete" />
              </MenuOptions>
            </Menu>
          )}
        </Pressable>

        {/* Content */}
        {hasMedia ? (
          <View style={styles.contentView}>
            {item?.title ? (
              <TextComponent
                text={item.title}
                styles={styles.caption}
                numberOfLines={100}
              />
            ) : null}

            <RenderMedia
              images={images}
              videos={videos}
              onMediaPress={handleMediaPress}
            />
          </View>
        ) : (
          <>
            <View style={{...styles.divider, marginTop: hp('1')}} />
            <JustTextRenderPost title={item?.title} />
          </>
        )}

        <View style={styles.divider} />

        {/* Footer */}
        {!DoNotShowFooter && (
          <View style={styles.bottomView}>
            <Touchable
              style={styles.leftRightView}
              onPress={async () => {
                functionToUpdateLike(index);
                await addLikeOnPost.mutateAsync(item?.id);
                if (refetch) refetch();
                if (refetechKeys) {
                  refetechKeys.forEach(key =>
                    queryClient.invalidateQueries([key]),
                  );
                }
              }}>
              <Image
                source={item?.is_liked ? heartFilledLike : heartTheme}
                resizeMode="contain"
                tintColor={'rgba(255, 0, 55, 1)'}
                style={{width: wp('4'), marginRight: wp('1')}}
              />
              <TextComponent
                text={`${item?.likes_count} ${
                  item?.likes_count <= 1 ? 'Like' : 'Likes'
                }`}
                isThemeColor={true}
                styles={{fontSize: hp('1.3')}}
              />
            </Touchable>

            <Touchable
              style={styles.leftRightView}
              onPress={() => {
                if (setCommentModal) {
                  setCommentModal(item?.id, item?.index);
                } else {
                  NavigationService.navigate('CommentScreen', {
                    id: item?.id,
                    refetechKeys,
                    isPost: true,
                    refetch,
                    functionToUpdateComment,
                    index,
                  });
                }
              }}>
              <Image
                source={commentIcon}
                resizeMode="contain"
                tintColor={Colors.yellowTextColor}
                style={{width: wp('4'), marginRight: wp('1')}}
              />
              <TextComponent
                text={`${item?.comments_count} ${
                  item?.comments_count <= 1 ? 'Comment' : 'Comments'
                }`}
                isThemeColor={true}
                styles={{fontSize: hp('1.3')}}
              />
            </Touchable>

            <Touchable
              style={styles.leftRightView}
              onPress={() => {
                setShareOnFeed(true);
                setModal(true);
              }}>
              <Image
                source={shareTheme}
                resizeMode="contain"
                tintColor={Colors.yellowTextColor}
                style={{width: wp('4')}}
              />
              <TextComponent
                text="Share"
                isThemeColor={true}
                styles={{marginLeft: wp('1'), fontSize: hp('1.3')}}
              />
            </Touchable>
          </View>
        )}
      </View>
      {Boolean(modal) && (
        <BottomViewModal
          isModal={modal}
          onBackPress={() => setModal(false)}
          childrenComp={
            <View style={{paddingHorizontal: wp('2')}}>
              {/* New Direct Share Options */}
              <TextComponent
                text={'Share on the other Apps'}
                size={hp('1.5')}
                fontFamily={'bold'}
                styles={{marginLeft: wp('1')}}
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: 'row',
                  // marginVertical: hp('2.5'),
                  paddingHorizontal: wp('2'),
                  width: wp('85'),
                  // backgroundColor: 'red',
                  justifyContent: 'space-between',
                  marginTop: hp('2'),
                }}>
                {/* WhatsApp */}
                <Touchable
                  // style={{marginRight: wp('2')}}
                  onPress={() => {
                    setModal(false);
                    sharePostToSpecificApp('whatsapp', item);
                  }}>
                  <Image source={whatapp} style={{width: 55, height: 55}} />
                </Touchable>

                {/* Instagram */}
                <Touchable
                  // style={{marginRight: wp('2')}}
                  onPress={() => {
                    setModal(false);
                    sharePostToSpecificApp('instagram', item);
                  }}>
                  <Image source={isnta} style={{width: 55, height: 55}} />
                </Touchable>

                {/* TikTok */}
                <Touchable
                  // style={{marginRight: wp('2')}}
                  onPress={() => {
                    setModal(false);
                    sharePostToSpecificApp('message', item);
                  }}>
                  <Image source={messageApp} style={{width: 55, height: 55}} />
                </Touchable>

                {/* Copy Link */}
                <Touchable
                  // style={{marginRight: wp('2')}}
                  onPress={async () => {
                    setModal(false);
                    const link = await generateBranchLinkForPost(item);
                    if (link) {
                      await Clipboard.setString(link); // Make sure you import Clipboard
                      successMessage('Link copied successfully');
                    } else {
                      Alert.alert('Error', 'Failed to generate link');
                    }
                  }}>
                  <Image source={copyLink} style={{width: 55, height: 55}} />
                </Touchable>
                <Touchable
                  onPress={() => {
                    // setModal(false);
                    onSharePost(item);
                  }}>
                  <Image source={more} style={{width: 55, height: 55}} />
                </Touchable>
              </ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: hp('2'),
                }}>
                <Touchable
                  style={styles.checkContainer}
                  onPress={() => {
                    setShareOnFeed(!shareOnFeed);
                  }}>
                  <Image
                    tintColor={Colors.primaryColor}
                    source={shareOnFeed ? tickfill : tickemp}
                    style={{
                      resizeMode: 'contain',
                      // tintColor: Colors.white,
                      width: wp('6'),
                      marginRight: wp('2'),
                    }}
                  />
                </Touchable>
                <TextComponent text={'Share on my TAC feed'} size={hp('1.5')} />
              </View>
              {shareOnFeed && (
                <ThemeButton
                  title={'Share'}
                  style={{
                    height: hp('4'),
                    marginTop: hp('2'),
                    width: wp('70'),
                    alignSelf: 'center',
                  }}
                  textStyle={{fontSize: hp('1.5')}}
                  onPress={() => {
                    setModal(false);

                    sharePost.mutate({post_id: item?.id});
                  }}
                />
              )}
            </View>
          }
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: wp('95'),
    borderRadius: wp('5'),
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    paddingVertical: hp('1'),
  },
  upperView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3'),
    marginBottom: hp('1'),
  },
  userDetails: {
    marginLeft: wp('2'),
    width: wp('70'),
  },
  userName: {
    fontWeight: 'bold',
    fontSize: wp('3'),
  },
  postTime: {
    fontSize: wp('2.5'),
    color: 'gray',
  },
  contentView: {
    paddingHorizontal: wp('3'),
    marginBottom: hp('2'),
  },
  caption: {
    fontSize: wp('3'),
    marginBottom: hp('1'),
  },
  textPostView: {
    paddingVertical: hp('2'),
    paddingHorizontal: wp('2'),
  },
  singleImage: orientationType => ({
    width: wp('90'),
    height: orientationType === 'portrait' ? hp('70') : hp('30'),
    borderRadius: wp('2'),
  }),
  twoImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  twoImage: {
    flex: 1,
    height: hp('35'),
    borderRadius: wp('2'),
    marginHorizontal: wp('1'),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: wp('44'),
    height: hp('20'),
    borderRadius: wp('2'),
    overflow: 'hidden',
    marginBottom: hp('0.5'),
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp('2'),
  },
  playIcon: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    width: wp('10'),
    height: wp('10'),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: wp(6),
    fontWeight: 'bold',
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: wp('90'),
    alignSelf: 'center',
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('3'),
    marginTop: hp('1'),
    paddingHorizontal: wp('3'),
  },
  leftRightView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportText: {
    fontSize: hp('1.2'),
    top: hp('-0.5'),
    textAlign: 'right',
    right: wp('2'),
  },
  modalText: {
    backgroundColor: Colors.bgGray,
    paddingHorizontal: wp('3'),
    paddingVertical: hp('1'),
    width: wp('85'),
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default PostViewComp;
