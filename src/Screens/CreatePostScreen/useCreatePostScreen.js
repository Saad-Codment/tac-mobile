import {useState} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';
import {useMutation} from '@tanstack/react-query';
import {formDataFunc} from '../../Utils/helperFunc';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {createPostUrl, updatePostUrl} from '../../Utils/Urls';
import {checkImageOrientation} from '../../Services/GlobalFunctions';

const useCreatePostScreen = ({navigate, goBack}, {params}) => {
  const {post} = params?.post ? params : {post: null};

  console.log('post', post);

  const isEditPost = Boolean(post?.created_at);

  const {getState, queryClient} = useReduxStore();

  const [orientation, setOrientation] = useState('');

  const [postState, setPostState] = useState({
    postText: post?.title || null,
    postImgs: post?.images
      ? JSON.parse(post?.images)?.map(res => {
          return {
            uri: res,
            type: 'image/jpeg',
            name: res.split('/').pop(),
            isEdit: true,
          };
        })
      : [],
  });

  const {postImgs, postText} = postState;

  const updateState = data => setPostState(prev => ({...prev, ...data}));

  const onChangeVal = (key, val) => updateState({[key]: val});

  const {mutateAsync} = useMutation({
    mutationFn: data => {
      console.log('dataldfknbkldnflbndklfbnldfnklb', data);
      return formDataFunc(createPostUrl, data, 'images', true);
    },
    onSuccess: ({ok, data}) => {
      console.log('hjsvxjksdkjvkjsdvkjsdkjvkjsdjkvksjdvkjsdv', data);
      if (ok) {
        successMessage('Post Created.');
        goBack();
        navigate('MyProfileScreen', {id: userData?.id});
      } else {
        errorMessage(data?.message);
      }
    },
    onError: ({message}) => {
      errorMessage('Problem occurred while uploading data.');
    },
  });
  const {mutate} = useMutation({
    mutationFn: data => {
      console.log('dataldfknbkldnflbndklfbnldfnklb', data);
      return formDataFunc(updatePostUrl + post?.id, data, 'images', true);
    },
    onSuccess: ({ok, data}) => {
      console.log(
        'lskdbvklbsdklvblsdbvsdbkvbsdkvbskdlvklsdbvklsdbklvbsd',
        data,
      );
      if (ok) {
        successMessage('Post Updated.');

        goBack();
        if (params?.functionToUpdatePostOrEvent) {
          params?.functionToUpdatePostOrEvent(data);
        }
        queryClient.invalidateQueries(['myProfilePosts']);
        if (params?.refetch()) {
          setTimeout(() => {
            params?.refetch();
          }, 1500);
        }
      } else {
        errorMessage(data?.message);
      }
      console.log('klsdbvklsdbvklbsdklvbklsdbvklsldvs', data);
    },
  });

  const createPost = () => {
    if (postText != null && postText != undefined) {
      if (isEditPost) {
        mutate({
          title: postText,
          images: postImgs.filter(res => !res?.isEdit),
          images_array: JSON.stringify(
            postImgs.filter(res => res?.isEdit).map(res => res.uri),
          ),
        });
      } else {
        mutateAsync({
          title: postText,
          images: postImgs,
        });
      }
    } else errorMessage('Please write or upload images to create post');
  };

  const handleOrientationCheck = async images => {
    // try {
    //   const orientationType = await checkImageOrientation(imageUrl());
    //   setOrientation(orientationType);
    // } catch (error) {
    //   console.log('Error checking image orientation:', error);
    // }
  };

  const {userData} = getState('Auth');
  return {
    userData,
    onChangeVal,
    postImgs,
    postText,
    createPost,
    isEditPost,
    orientation,
    handleOrientationCheck,
  };
};

export default useCreatePostScreen;
