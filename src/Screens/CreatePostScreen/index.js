// CreatePostScreen.jsx
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  ImageBackground,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {memo} from 'react';
import Video from 'react-native-video';
import {HeaderComponent} from '../../Components/HeaderComponent'; // assuming this is your header
import {crossFill, uploadGallery, cameraIcon, cameraBlack} from '../../Assets'; // ← add cameraIcon to your assets
import {CircleImage} from '../../Components/CircleImage';
import {TextComponent} from '../../Components/TextComponent';
import {hp, wp} from '../../Config/responsive';
import useCreatePostScreen from './useCreatePostScreen';
import {imageUrl, videoUrl} from '../../Utils/Urls';
import {styles} from './styles';
import ThemeButton from '../../Components/ThemeButton';
import {
  isVideo,
  uploadFromCamera,
  uploadFromGalary,
} from '../../Services/GlobalFunctions';
import BlurImage from '../../Components/BlurImage';
import {Touchable} from '../../Components/Touchable';
import {Colors} from '../../Theme/Variables';
import Overlay from '../../Components/Overlay';
import {errorMessage} from '../../Config/NotificationMessage';

const CreatePostScreen = ({navigation, route}) => {
  const {
    userData,
    postImgs,
    postText,
    onChangeVal,
    createPost,
    isEditPost,
    orientation,
    getVideoUrlOfCloudFare,
    videoAfterUpload,
    handleRemoveMedia,
  } = useCreatePostScreen(navigation, route);

  const imgHeight = {
    1: orientation => ({
      width: wp('100'),
      height: orientation == 'portrait' ? hp('80') : hp('30'),
    }),
    [postImgs.length > 1]: () => ({}),
  };

  const MAX_MEDIA = 5;
  const remaining = MAX_MEDIA - (postImgs?.length ?? 0);

  const openGallery = async () => {
    if (remaining <= 0) {
      errorMessage('You can only upload maximum 5 media files');
      return;
    }

    const media = await uploadFromGalary(true, true, remaining);
    if (!media || (Array.isArray(media) && media.length === 0)) return;

    const videoItems = media.filter(item => isVideo(item));
    videoItems.forEach(res => {
      getVideoUrlOfCloudFare.mutate({
        filename: res.name || 'video.mp4',
        mime_type: res.type || 'video/mp4',
        uri: res?.uri,
      });
    });

    onChangeVal('postImgs', [...(postImgs || []), ...media]);
  };

  const openCamera = async () => {
    if (remaining <= 0) {
      errorMessage('You can only upload maximum 5 media files');
      return;
    }

    const images = await uploadFromCamera(true, true); // allow multi? usually false for camera
    if (!images || (Array.isArray(images) && images.length === 0)) return;

    const videoItems = images.filter(item => isVideo(item));
    videoItems.forEach(res => {
      getVideoUrlOfCloudFare.mutate({
        filename: res.name || 'video.mp4',
        mime_type: res.type || 'video/mp4',
        uri: res?.uri,
      });
    });

    onChangeVal('postImgs', [...(postImgs || []), ...images]);
  };

  return (
    <View style={{flex: 1}}>
      <HeaderComponent
        headerTitle={isEditPost ? 'Update Post' : 'Create Post'}
        style={{backgroundColor: 'transparent'}}
        titleStyle={{color: 'black'}}
        isBack
        backIconStyle={{tintColor: 'black'}}
        goBack={() => navigation.goBack()}
        rightIconImg={uploadGallery}
        isNewRightImg
        // isAnotherRightChildern={
        //   <ThemeButton
        //     title={'Post'}
        //     style={{
        //       width: wp('10'),
        //       height: hp('3.5'),
        //       marginLeft: wp('2'),
        //       borderRadius: 8,
        //       backgroundColor: 'transparent',
        //     }}
        //     textStyle={{
        //       fontSize: hp('1.8'),
        //       fontWeight: 'bold',
        //       color: Colors.primaryColor,
        //     }}
        //     onPress={createPost}
        //   />
        // }
        isAnotherRightChildern={
          <ThemeButton
            style={{
              width: wp('10'),
              height: hp('3.5'),
              marginLeft: wp('2'),
              borderRadius: 8,
              backgroundColor: 'transparent',
              marginRight: wp('-2'),
            }}
            image={cameraBlack}
            imageStyle={{
              width: wp('7'),
              height: hp('3'),
              tintColor: Colors.primaryColor,
            }}
            onPress={openCamera}
          />
        }
        onRightPress={openGallery} // ← now directly opens gallery (Facebook style)
      />

      <View style={styles.userView}>
        <CircleImage
          image={imageUrl(userData?.profile_image)}
          uri={true}
          size={0.15}
        />
        <TextComponent text={userData?.first_name} styles={styles.userName} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp('15')}}>
        <View style={styles.inputView(Boolean(postImgs.length > 0))}>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="What's on your mind?"
            placeholderTextColor={'gray'}
            onChangeText={e => onChangeVal('postText', e)}
            value={postText}
          />
        </View>

        {/* Floating camera button – Facebook-like quick access */}
        {/* {remaining > 0 && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: wp('4'),
              bottom: hp('2'),
              backgroundColor: Colors.primaryColor,
              borderRadius: 50,
              padding: 12,
              elevation: 5,
              zIndex: 10,
            }}
            onPress={openCamera}>
            <Image
              source={cameraBlack} // ← add a camera icon to your Assets
              style={{width: 28, height: 28, tintColor: 'white'}}
            />
          </TouchableOpacity>
        )} */}

        <View style={styles.imgMainView(Boolean(postImgs.length > 1))}>
          {postImgs.map((res, index) => {
            let displayUri = res.uri;
            if (res.isExistingVideo && res.master_playlist_path) {
              displayUri = videoUrl(res.master_playlist_path);
            } else if (res.isEdit) {
              displayUri = imageUrl(res.uri);
            }

            const videoItem = isVideo(res) || res.type === 'video/old';

            return videoItem ? (
              <View
                key={index}
                style={{
                  ...styles.bgImg(Boolean(postImgs.length > 1)),
                  ...(postImgs.length === 1
                    ? imgHeight[postImgs.length](
                        res?.orientation != null ? res?.orientation : '',
                      )
                    : {}),
                }}>
                <Touchable
                  onPress={() => handleRemoveMedia(res, index)}
                  style={{position: 'absolute', zIndex: 1}}>
                  <Image
                    source={crossFill}
                    resizeMode="contain"
                    style={styles.crossIcon(Boolean(postImgs.length > 1))}
                  />
                </Touchable>
                <Video
                  source={{uri: displayUri}}
                  style={{
                    ...styles.bgImg(Boolean(postImgs.length > 1)),
                    ...(postImgs.length === 1
                      ? imgHeight[postImgs.length](
                          res?.orientation != null ? res?.orientation : '',
                        )
                      : {}),
                  }}
                  resizeMode="cover"
                  paused={false}
                  muted={true}
                  repeat={true}
                  playInBackground={false}
                  controls={false}
                />
                {!videoAfterUpload.find(item => item?.uri == res?.uri)
                  ?.videoId &&
                  !res.isExistingVideo && <Overlay />}
              </View>
            ) : (
              <ImageBackground
                key={index}
                source={videoItem ? {} : {uri: displayUri}}
                resizeMode="contain"
                style={{
                  ...styles.bgImg(Boolean(postImgs.length > 1)),
                  ...(postImgs.length === 1
                    ? imgHeight[postImgs.length](
                        res?.orientation != null ? res?.orientation : '',
                      )
                    : {}),
                }}>
                <Touchable onPress={() => handleRemoveMedia(res, index)}>
                  <Image
                    source={crossFill}
                    resizeMode="contain"
                    style={styles.crossIcon(Boolean(postImgs.length > 1))}
                  />
                </Touchable>
              </ImageBackground>
            );
          })}
        </View>
      </ScrollView>
      {(postImgs.length > 0 || postText.trim()) && (
        <ThemeButton
          title={'Post'}
          style={{
            height: hp('4'),
            position: 'absolute',
            bottom: hp('3'),
            alignSelf: 'center',
            width: wp('80'),
          }}
          textStyle={{
            fontSize: hp('1.5'),
            fontWeight: 'bold',
          }}
          isYellowTheme
          onPress={createPost}
        />
      )}
    </View>
  );
};

export default memo(CreatePostScreen);
