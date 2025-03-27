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

const CreatePostScreen = ({navigation}) => {
  const {userData, postImgs, postText, onChangeVal, createPost} =
    useCreatePostScreen(navigation);

  console.log('postImgspostImgspostImgspostImgs', postImgs);

  const imgHeight = {
    1: {width: wp('100'), height: hp('30')},
  };

  return (
    <View style={{flex: 1}}>
      <HeaderComponent
        headerTitle={'Create Post'}
        style={{backgroundColor: 'transparent'}}
        titleStyle={{color: 'black'}}
        isBack
        backIconStyle={{tintColor: 'black'}}
        goBack={() => navigation.goBack()}
        rightIconImg={uploadGallery}
        onRightPress={async () => {
          Alert.alert(
            'Pick to choose image',
            '',
            [
              {
                text: 'Camera',
                onPress: async () => {
                  const images = await uploadFromCamera(true);
                  onChangeVal('postImgs', [images]);
                },
              },
              {
                text: 'Gallery', // Just a dismissal button
                onPress: async () => {
                  const images = await uploadFromGalary(true);
                  onChangeVal('postImgs', images);
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
                source={{uri: res?.uri}}
                style={{
                  ...styles.bgImg(Boolean(postImgs.length > 1)),
                  ...imgHeight[postImgs.length],
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

      <ThemeButton
        title={'Post'}
        isYellowTheme
        style={styles.createBtnStyle}
        onPress={createPost}
      />
    </View>
  );
};

export default memo(CreatePostScreen);
