import {View, Text} from 'react-native';
import React, {memo} from 'react';
import {HeaderComponentProfile} from '../../Components/HeaderComponentProfile';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {uploadGallery} from '../../Assets';
import {CircleImage} from '../../Components/CircleImage';
import {TextComponent} from '../../Components/TextComponent';
import {wp} from '../../Config/responsive';
import useCreatePostScreen from './useCreatePostScreen';
import {imageUrl} from '../../Utils/Urls';
import {styles} from './styles';

const CreatePostScreen = ({navigation}) => {
  const {userData} = useCreatePostScreen(navigation);

  return (
    <View style={{flex: 1}}>
      <HeaderComponent
        headerTitle={'Create Post'}
        style={{backgroundColor: 'transparent'}}
        titleStyle={{color: 'black'}}
        isBack
        backIconStyle={{tintColor: 'black'}}
        goBack={() => navigation.goback()}
        rightIconImg={uploadGallery}
      />
      <View style={styles.userView}>
        <CircleImage
          image={imageUrl(userData?.profile_image)}
          uri={true}
          size={0.15}
        />
        <TextComponent text={userData?.first_name} styles={styles.userName} />
      </View>
      <Text>index</Text>
    </View>
  );
};

export default memo(CreatePostScreen);
