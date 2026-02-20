import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  ImageBackground,
  Alert,
} from 'react-native';
import React, {memo} from 'react';
import Video from 'react-native-video'; // added for video preview
import {HeaderComponentProfile} from '../../Components/HeaderComponentProfile';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {crossFill, uploadGallery} from '../../Assets';
import {CircleImage} from '../../Components/CircleImage';
import {TextComponent} from '../../Components/TextComponent';
import {hp, wp} from '../../Config/responsive';
import useCreatePostScreen from './useCreatePostScreen';
import {imageUrl} from '../../Utils/Urls';
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
    handleOrientationCheck,
    getVideoUrlOfCloudFare,
    videoAfterUpload,
  } = useCreatePostScreen(navigation, route);

  console.log('postImgs →', postImgs);

  const imgHeight = {
    1: orientation => ({
      width: wp('100'),
      height: orientation == 'portrait' ? hp('80') : hp('30'),
    }),
    [postImgs.length > 1]: () => ({}),
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
        isAnotherRightChildern={
          <ThemeButton
            title={'Post'}
            style={{
              width: wp('10'),
              height: hp('3.5'),
              marginLeft: wp('2'),
              borderRadius: 8,
              backgroundColor: 'transparent',
            }}
            textStyle={{
              fontSize: hp('1.8'),
              fontWeight: 'bold',
              color: Colors.primaryColor,
            }}
            // isDisable={Boolean(postImgs?.length == 5)}
            onPress={createPost}
          />
        }
        onRightPress={async () => {
          if (postImgs?.length < 5) {
            Alert.alert(
              'Pick to choose',
              '',
              [
                {
                  text: 'Camera',
                  onPress: async () => {
                    const images = await uploadFromCamera(
                      true,
                      true,
                      Math.max(0, 5 - (postImgs?.length ?? 0)),
                    );
                    const videoItems = images.filter(item => isVideo(item));
                    if (videoItems.length > 0) {
                      videoItems.map(res => {
                        getVideoUrlOfCloudFare.mutate({
                          filename: res.name || 'video/mp4',
                          mime_type: res.type || 'video.mp4',
                          uri: res?.uri,
                        });
                      });
                    }

                    onChangeVal(
                      'postImgs',
                      [...postImgs, ...images],
                      // isEditPost ? [...postImgs, ...images] : images,
                    );
                  },
                },
                {
                  text: 'Gallery',
                  onPress: async () => {
                    // allowVideos = true → now supports video + image selection
                    const media = await uploadFromGalary(
                      true,
                      true,
                      Math.max(0, 5 - (postImgs?.length ?? 0)),
                    );
                    const videoItems = media.filter(item => isVideo(item));
                    if (videoItems.length > 0) {
                      videoItems.map(res => {
                        getVideoUrlOfCloudFare.mutate({
                          filename: res.name || 'video/mp4',
                          mime_type: res.type || 'video.mp4',
                          uri: res?.uri,
                        });
                      });
                    }

                    onChangeVal(
                      'postImgs',
                      [...postImgs, ...media],
                      // isEditPost ? [...postImgs, ...media] : media,
                    );
                  },
                },
                {
                  text: 'Cancel',
                  style: 'destructive',
                },
              ],
              {cancelable: true},
            );
          } else errorMessage('You can only upload maximum 5 media files');
        }}
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
        <View style={styles.imgMainView(Boolean(postImgs.length > 1))}>
          {postImgs.map((res, index) => {
            const mediaUri = res?.isEdit ? imageUrl(res?.uri) : res?.uri;
            const videoItem = isVideo(res);

            return videoItem ? (
              <View
                style={{
                  ...styles.bgImg(Boolean(postImgs.length > 1)),
                  ...(postImgs.length === 1
                    ? imgHeight[postImgs.length](
                        res?.orientation != null ? res?.orientation : '',
                      )
                    : {}),
                }}>
                <Touchable
                  onPress={() => {
                    postImgs.splice(index, 1);
                    onChangeVal('postText', postText);
                  }}
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                  }}>
                  <Image
                    source={crossFill}
                    resizeMode="contain"
                    style={styles.crossIcon(Boolean(postImgs.length > 1))}
                  />
                </Touchable>
                <Video
                  source={{uri: res?.uri}}
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
                  ?.videoId && <Overlay />}
              </View>
            ) : (
              <ImageBackground
                key={index}
                source={videoItem ? {} : {uri: mediaUri}}
                style={{
                  ...styles.bgImg(Boolean(postImgs.length > 1)),
                  ...(postImgs.length === 1
                    ? imgHeight[postImgs.length](
                        res?.orientation != null ? res?.orientation : '',
                      )
                    : {}),
                }}>
                <Touchable
                  onPress={() => {
                    postImgs.splice(index, 1);
                    onChangeVal('postText', postText);
                  }}>
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
    </View>
  );
};

export default memo(CreatePostScreen);
