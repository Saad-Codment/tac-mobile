import {View, Text} from 'react-native';
import React, {memo} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import PostViewComp from '../../Components/PostViewComp';
import {hp, wp} from '../../Config/responsive';
import SharePostComp from '../../Components/SharePostComp';
import usePostDetailScreen from './usePostDetailScreen';

const PostDetailScreen = ({route}) => {
  const {postData} = usePostDetailScreen(route);
  return (
    <>
      <HeaderComponent headerTitle={'Post'} isBack />
      {postData?.type == 1 && (
        <PostViewComp
          item={postData}
          functionToUpdateLike={() => {}}
          // openBottomSheet={id => setModal(id)}
          functionToDelete={() => {}}
          functionToUpdateComment={() => {}}
          functionToUpdatePostOrEvent={() => {}}
          mainViewStyle={{alignSelf: 'center'}}
          DoNotShowFooter
          //   isRefectechForVideo={refetchKey}
        />
      )}
      {postData?.type == 3 && (
        <SharePostComp
          item={postData}
          functionToUpdateLike={() => {}}
          // openBottomSheet={id => setModal(id)}
          functionToDelete={() => {}}
          functionToUpdateComment={() => {}}
          functionToUpdatePostOrEvent={() => {}}
          DoNotShowFooter
          upperMainView={{
            width: wp('100'),
          }}
        />
      )}
    </>
  );
};

export default memo(PostDetailScreen);
