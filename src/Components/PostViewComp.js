import React, {useState} from 'react';
import {Alert, Image, Pressable, StyleSheet, Text, View} from 'react-native';
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
} from '../Assets';
import {Colors} from '../Theme/Variables';
import BlurImage from './BlurImage';
import NavigationService from '../Services/NavigationService';
import useFriendServices from '../Services/FriendServices';
import useReduxStore from '../Hooks/UseReduxStore';
import {imageUrl} from '../Utils/Urls';
import {
  checkImageOrientation,
  formatDateToCustomFormat,
} from '../Services/GlobalFunctions';
import {types} from '../Redux/types';
// somewhere in your app
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

const images = [
  'https://images.pexels.com/photos/27305813/pexels-photo-27305813/free-photo-of-a-woman-taking-a-photo-with-her-camera.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
  //   'https://images.pexels.com/photos/27305813/pexels-photo-27305813/free-photo-of-a-woman-taking-a-photo-with-her-camera.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
  //   'https://images.pexels.com/photos/27305813/pexels-photo-27305813/free-photo-of-a-woman-taking-a-photo-with-her-camera.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
  //   'https://images.pexels.com/photos/27305813/pexels-photo-27305813/free-photo-of-a-woman-taking-a-photo-with-her-camera.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
  'https://images.pexels.com/photos/27305813/pexels-photo-27305813/free-photo-of-a-woman-taking-a-photo-with-her-camera.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
];

const RenderImages = ({images, onImagePress}) => {
  const [orientation, setOrientation] = useState('');

  if (images.length == 1) {
    const handleOrientationCheck = async () => {
      try {
        const orientationType = await checkImageOrientation(
          imageUrl(images[0]),
        );
        setOrientation(orientationType);
      } catch (error) {
        console.log('Error checking image orientation:', error);
      }
    };
    handleOrientationCheck();
    return (
      <Pressable onPress={onImagePress}>
        <BlurImage
          uri={imageUrl(images[0])}
          isURI
          styles={styles.singleImage(orientation)}
          // resizeMode={'contain'}
        />
      </Pressable>
    );
  } else if (images.length == 2) {
    return (
      <Touchable style={styles.twoImagesContainer} onPress={onImagePress}>
        {images.map((img, index) => (
          <BlurImage uri={imageUrl(img)} isURI styles={styles.twoImage} />
        ))}
      </Touchable>
    );
  } else if (images.length == 3) {
    return (
      <Touchable style={styles.twoImagesContainer} onPress={onImagePress}>
        {images.slice(0, 1).map((img, index) => (
          <BlurImage
            uri={imageUrl(img)}
            isURI
            styles={{
              width: wp('46'),
              height: hp('40'),
              // aspectRatio: 0,
            }}
            // resizeMode={'contain'}
          />
          // {/* {index === 3 && images.length > 4 && (
          //   <View style={styles.overlay}>
          //     <Text style={styles.overlayText}>+{images.length - 4}</Text>
          //   </View>
          // )} */}
        ))}
        <View style={{justifyContent: 'space-between'}}>
          {images.slice(1, 3).map((img, index) => (
            <BlurImage
              uri={imageUrl(img)}
              isURI
              styles={{
                width: wp('42'),
                height: hp('19.8'),
                // aspectRatio: 0,
              }}
              // resizeMode={'contain'}
            />
            // {/* {index === 3 && images.length > 4 && (
            //   <View style={styles.overlay}>
            //     <Text style={styles.overlayText}>+{images.length - 4}</Text>
            //   </View>
            // )} */}
          ))}
        </View>

        {/* {images.map((img, index) => (
          <BlurImage
            key={index}
            uri={imageUrl(img)}
            isURI
            styles={styles.threeImage}
            // resizeMode={'contain'}
          />
        ))} */}
      </Touchable>
    );
  } else {
    return (
      <Touchable style={styles.gridContainer} onPress={onImagePress}>
        {images.slice(0, 4).map((img, index) => (
          <View key={index} style={styles.gridItem}>
            <BlurImage
              uri={imageUrl(img)}
              isURI
              styles={{
                ...styles.gridImage,
                marginTop: index > 1 ? hp('0.5') : 0,
              }}
              // resizeMode={'contain'}
            />
            {index === 3 && images.length > 4 && (
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>+{images.length - 4}</Text>
              </View>
            )}
          </View>
        ))}
      </Touchable>
    );
  }
};

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
}) => {
  const {likeAndDisLikeEvent, addLikeOnPost, sharePost, deletePost} =
    useFriendServices();

  const {getState, dispatch, queryClient} = useReduxStore();

  const onImagePress = () => {
    dispatch({
      payload: JSON.parse(item?.images),
      type: types.openModal,
    });
  };

  const onEditPost = item => {
    // Navigate to edit screen or open modal
    NavigationService.navigate('CreatePostScreen', {
      post: item,
      functionToUpdatePostOrEvent: data => functionToUpdatePostOrEvent(data),
    });
  };

  const onDeletePost = item => {
    // Show confirmation and then delete
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
            refetch();
            functionToDelete(index);
            // Call your delete mutation here
            // deletePost.mutateAsync(item?.id);
          },
        },
      ],
    );
  };

  const {userData} = getState('Auth');

  return (
    <View style={{...styles.mainView, ...mainViewStyle}}>
      {/* Header Section */}
      <Pressable
        style={styles.upperView}
        onPress={() =>
          NavigationService.navigate('FriendProfileScreen', {id: item?.user_id})
        }>
        <CircleImage
          image={imageUrl(item?.profile_image ?? item?.user_image)}
          uri
        />
        <View style={styles.userDetails}>
          <TextComponent
            text={
              item?.first_name + ' ' + (item?.last_name ? item?.last_name : '')
            }
            styles={styles.userName}
          />
          <TextComponent
            text={formatDateToCustomFormat(item?.created_at)}
            styles={styles.postTime}
          />
        </View>
        {userData?.id != item?.user_id ? (
          <TextComponent
            text={'Report'}
            fade
            styles={styles.reportText}
            onPress={() => {
              if (userData?.id != item?.user_id) openBottomSheet(item?.id);
            }}
          />
        ) : (
          // <Touchable
          //   onPress={() => {
          //     if (userData?.id != item?.user_id) openBottomSheet(item?.id);
          //   }}>
          //   <Image
          //     source={dotsVertical}
          //     resizeMode="contain"
          //     style={{width: wp('6'), height: hp('4')}}
          //   />
          // </Touchable>
          <Menu>
            <MenuTrigger>
              <Image
                source={dotsVertical}
                resizeMode="contain"
                style={{width: wp('6'), height: hp('4')}}
              />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => onEditPost(item)} text="Edit" />
              <MenuOption onSelect={() => onDeletePost(item)} text="Delete" />
            </MenuOptions>
          </Menu>
        )}
      </Pressable>

      {JSON.parse(item?.images)?.length > 0 ? (
        <View style={styles.contentView}>
          {item?.title != null && (
            <TextComponent
              text={item?.title}
              styles={styles.caption}
              numberOfLines={100}
            />
          )}
          <RenderImages
            images={JSON.parse(item?.images)}
            onImagePress={onImagePress}
          />
        </View>
      ) : (
        <View>
          <View
            style={{
              ...styles.divider,
              marginTop: hp('1'),
              // marginVertical: hp('-1'),
              // marginBottom: hp('-1'),
            }}
          />
          <JustTextRenderPost title={item?.title} />
        </View>
      )}
      <View style={styles.divider} />
      <View style={styles.bottomView}>
        <Touchable
          style={styles.leftRightView}
          onPress={async () => {
            functionToUpdateLike(index);
            await addLikeOnPost.mutateAsync(item?.id);
            if (refetechKeys)
              refetechKeys.map(res => queryClient.invalidateQueries([res]));
          }}>
          <Image
            source={item?.is_liked ? heartFilledLike : heartTheme}
            resizeMode="contain"
            tintColor={'rgba(255, 0, 55, 1)'}
            style={{width: wp('4'), marginRight: wp('1')}}
          />
          <TextComponent
            text={`${item?.likes_count} Likes`}
            isThemeColor={true}
            styles={{
              fontSize: hp('1.3'),
            }}
          />
        </Touchable>
        <Touchable
          style={styles.leftRightView}
          onPress={() => {
            if (setCommentModal) setCommentModal(item?.id, item?.index);
            else
              NavigationService.navigate('CommentScreen', {
                id: item?.id,
                refetechKeys,
                isPost: true,
                refetch,
                functionToUpdateComment,
                index,
              });
          }}>
          <Image
            source={commentIcon}
            resizeMode="contain"
            tintColor={Colors.yellowTextColor}
            style={{width: wp('4'), marginRight: wp('1')}}
          />
          <TextComponent
            text={`${item?.comments_count} Comment`}
            isThemeColor={true}
            styles={{
              fontSize: hp('1.3'),
            }}
          />
        </Touchable>
        <Touchable
          style={styles.leftRightView}
          onPress={() => sharePost.mutate({post_id: item?.id})}>
          <Image
            source={shareTheme}
            resizeMode="contain"
            tintColor={Colors.yellowTextColor}
            style={{width: wp('4')}}
          />
          <TextComponent
            text={'Share'}
            isThemeColor={true}
            styles={{
              marginLeft: wp('1'),
              fontSize: hp('1.3'),
            }}
          />
        </Touchable>
      </View>
    </View>
  );
};

export default PostViewComp;

const styles = StyleSheet.create({
  mainView: {
    width: wp('95'),
    borderRadius: wp('5'),
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
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
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('2'),
    paddingHorizontal: wp('2'),
  },
  singleImage: orientationType => ({
    width: wp('90'),
    height: orientationType == 'portrait' ? hp('70') : hp('30'),
    borderRadius: wp('2'),
    // aspectRatio: 1,
  }),
  twoImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  twoImage: {
    width: wp('44'),
    height: hp('35'),
    // aspectRatio: 1,
    borderRadius: wp('2'),
    backgroundColor: 'yellow',
  },
  threeImagesContainer: {
    flexDirection: 'column',
  },
  threeImage: {
    // width: '100%',
    // height: hp('20'),
    aspectRatio: 1,
    borderRadius: wp('2'),
    marginBottom: hp('1'),
    resizeMode: 'contain',
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
    position: 'relative',
  },
  gridImage: {
    // width: '100%',
    // height: '100%',
    aspectRatio: 1,
    borderRadius: wp('2'),
    resizeMode: 'contain',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    top: hp('0.5'),
    overflow: 'hidden',
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
    // marginVertical: hp('-2'),
    height: hp('3'),
    marginTop: hp('1'),
    paddingHorizontal: wp('3'),
    // width: wp('90'),
    // backgroundColor: 'red',
  },
  leftRightView: {
    flexDirection: 'row',
    // width: wp('31.5'),
    alignItems: 'center',
  },
  reportText: {
    fontSize: hp('1.2'),
    top: hp('-0.5'),
    textAlign: 'right',
    // marginLeft: hp('2'),
    right: wp('2'),
  },
});
