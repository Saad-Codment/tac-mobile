import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TextComponent} from './TextComponent';
import {hp, wp} from '../Config/responsive';
import {CircleImage} from './CircleImage';
import {Touchable} from './Touchable';
import {commentIcon, heartFilledLike, heartTheme, shareTheme} from '../Assets';
import {Colors} from '../Theme/Variables';
import BlurImage from './BlurImage';
import NavigationService from '../Services/NavigationService';
import useFriendServices from '../Services/FriendServices';
import useReduxStore from '../Hooks/UseReduxStore';
import {imageUrl} from '../Utils/Urls';
import {formatDateToCustomFormat} from '../Services/GlobalFunctions';

const images = [
  'https://images.pexels.com/photos/27305813/pexels-photo-27305813/free-photo-of-a-woman-taking-a-photo-with-her-camera.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
  //   'https://images.pexels.com/photos/27305813/pexels-photo-27305813/free-photo-of-a-woman-taking-a-photo-with-her-camera.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
  //   'https://images.pexels.com/photos/27305813/pexels-photo-27305813/free-photo-of-a-woman-taking-a-photo-with-her-camera.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
  //   'https://images.pexels.com/photos/27305813/pexels-photo-27305813/free-photo-of-a-woman-taking-a-photo-with-her-camera.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
  'https://images.pexels.com/photos/27305813/pexels-photo-27305813/free-photo-of-a-woman-taking-a-photo-with-her-camera.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
];

const RenderImages = ({images}) => {
  if (images.length == 1) {
    return (
      <BlurImage uri={imageUrl(images[0])} isURI styles={styles.singleImage} />
    );
  } else if (images.length == 2) {
    return (
      <View style={styles.twoImagesContainer}>
        {images.map((img, index) => (
          <BlurImage
            key={index}
            uri={imageUrl(img)}
            isURI
            styles={styles.twoImage}
          />
        ))}
      </View>
    );
  } else if (images.length == 3) {
    return (
      <View style={styles.threeImagesContainer}>
        {images.map((img, index) => (
          <BlurImage
            key={index}
            uri={imageUrl(img)}
            isURI
            styles={styles.threeImage}
          />
        ))}
      </View>
    );
  } else {
    return (
      <View style={styles.gridContainer}>
        {images.slice(0, 4).map((img, index) => (
          <View key={index} style={styles.gridItem}>
            <BlurImage
              uri={imageUrl(img)}
              isURI
              styles={{
                ...styles.gridImage,
                marginTop: index > 1 ? hp('0.5') : 0,
              }}
            />
            {index === 3 && images.length > 4 && (
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>+{images.length - 4}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  }
};

const JustTextRenderPost = ({title}) => {
  return (
    <View style={styles.textPostView}>
      <TextComponent text={title} numberOfLines={100} />
    </View>
  );
};

const PostViewComp = ({item, refetechKeys, functionToUpdateLike, index}) => {
  const {likeAndDisLikeEvent, addLikeOnPost} = useFriendServices();

  const {queryClient} = useReduxStore();

  return (
    <View style={styles.mainView}>
      {/* Header Section */}
      <View style={styles.upperView}>
        <CircleImage
          image={imageUrl(item?.profile_image ?? item?.user_image)}
          uri
        />
        <View style={styles.userDetails}>
          <TextComponent
            text={item?.first_name + ' ' + item?.last_name}
            styles={styles.userName}
          />
          <TextComponent
            text={formatDateToCustomFormat(item?.created_at)}
            styles={styles.postTime}
          />
        </View>
      </View>

      {JSON.parse(item?.images)?.length > 0 ? (
        <View style={styles.contentView}>
          <TextComponent
            text={item?.title}
            styles={styles.caption}
            numberOfLines={100}
          />
          <RenderImages images={JSON.parse(item?.images)} />
        </View>
      ) : (
        <View>
          <View
            style={{
              ...styles.divider,
              marginTop: hp('1'),
              marginBottom: hp('-1'),
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
          }}>
          <Image
            source={item?.is_liked ? heartFilledLike : heartTheme}
            resizeMode="contain"
            tintColor={Colors.yellowTextColor}
            style={{width: wp('5'), marginRight: wp('1')}}
          />
          <TextComponent
            text={`${item?.likes_count} Likes`}
            isThemeColor={true}
            styles={{
              fontSize: hp('1.5'),
            }}
          />
        </Touchable>
        <Touchable
          style={styles.leftRightView}
          onPress={() =>
            NavigationService.navigate('CommentScreen', {
              id: item?.id,
              refetechKeys,
              isPost: true,
            })
          }>
          <Image
            source={commentIcon}
            resizeMode="contain"
            tintColor={Colors.yellowTextColor}
            style={{width: wp('5'), marginRight: wp('1')}}
          />
          <TextComponent
            text={`${item?.comments_count} Comment`}
            isThemeColor={true}
            styles={{
              fontSize: hp('1.5'),
            }}
          />
        </Touchable>
        <View style={styles.leftRightView}>
          <Image
            source={shareTheme}
            resizeMode="contain"
            tintColor={Colors.yellowTextColor}
            style={{width: wp('5')}}
          />
          <TextComponent
            text={'Share'}
            isThemeColor={true}
            styles={{
              marginLeft: wp('1'),
              fontSize: hp('1.5'),
            }}
          />
        </View>
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
    paddingVertical: hp('2'),
  },
  upperView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3'),
    marginBottom: hp('1'),
  },
  userDetails: {
    marginLeft: wp('2'),
  },
  userName: {
    fontWeight: 'bold',
    fontSize: wp('4'),
  },
  postTime: {
    fontSize: wp('3.2'),
    color: 'gray',
  },
  contentView: {
    paddingHorizontal: wp('3'),
    marginBottom: hp('2'),
  },
  caption: {
    fontSize: wp('3.8'),
    marginBottom: hp('1'),
  },
  textPostView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('2'),
    paddingHorizontal: wp('2'),
  },
  singleImage: {
    width: '100%',
    height: hp('30'),
    borderRadius: wp('2'),
  },
  twoImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  twoImage: {
    width: '48%',
    height: hp('25'),
    borderRadius: wp('2'),
    backgroundColor: 'yellow',
  },
  threeImagesContainer: {
    flexDirection: 'column',
  },
  threeImage: {
    width: '100%',
    height: hp('20'),
    borderRadius: wp('2'),
    marginBottom: hp('1'),
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
    width: '100%',
    height: '100%',
    borderRadius: wp('2'),
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
    marginTop: hp('1.5'),
    paddingHorizontal: wp('3'),
    // width: wp('90'),
    // backgroundColor: 'red',
  },
  leftRightView: {
    flexDirection: 'row',
    // width: wp('31.5'),
    alignItems: 'center',
  },
});
