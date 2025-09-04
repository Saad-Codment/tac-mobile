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
  uploadFromCamera,
  uploadFromGalary,
} from '../../Services/GlobalFunctions';
import BlurImage from '../../Components/BlurImage';
import {Touchable} from '../../Components/Touchable';
import {Colors} from '../../Theme/Variables';

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
  } = useCreatePostScreen(navigation, route);

  console.log('postImgspostImgspostImgspostImgs', postImgs);

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
            onPress={createPost}
          />
        }
        onRightPress={async () => {
          Alert.alert(
            'Pick to choose image',
            '',
            [
              {
                text: 'Camera',
                onPress: async () => {
                  const images = await uploadFromCamera(true);
                  onChangeVal(
                    'postImgs',
                    isEditPost ? [...postImgs, images] : [images],
                  );
                },
              },
              {
                text: 'Gallery', // Just a dismissal button
                onPress: async () => {
                  const images = await uploadFromGalary(true);
                  onChangeVal(
                    'postImgs',
                    isEditPost ? [...postImgs, ...images] : images,
                  );
                },
              },
              {
                text: 'Cancel', // Just a dismissal button
                onPress: async () => {
                  // console.log(
                  //   'slkdbvklsdbvklsdbklvbskdlv',
                  //   value?.length,
                  // );
                  // const imgData = await uploadFromGalary(
                  //   true,
                  //   false,
                  //   Math.max(0, 5 - (value?.length ?? 0)),
                  // );
                  // onChange([...(value ?? []), ...imgData]);
                },
              },
            ],
            {cancelable: true},
          );
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
            return (
              <ImageBackground
                source={{uri: res?.isEdit ? imageUrl(res?.uri) : res?.uri}}
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

      {/* <ThemeButton
        title={'Post'}
        isYellowTheme
        style={styles.createBtnStyle}
        onPress={createPost}
      /> */}
    </View>
  );
};

export default memo(CreatePostScreen);
