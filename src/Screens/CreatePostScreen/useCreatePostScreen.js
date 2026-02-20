import {useState} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';
import {useMutation} from '@tanstack/react-query';
import API, {
  createPostFormData,
  createPutFormDataForVideo,
  formDataFunc,
} from '../../Utils/helperFunc';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {
  createPostUrl,
  createPostWithVideosUrl,
  updatePostUrl,
  uploadVideoForCloudfareUrl,
} from '../../Utils/Urls';
import {
  checkImageOrientation,
  findCommonById,
} from '../../Services/GlobalFunctions';
import RNFS from 'react-native-fs';
import {sha256} from 'react-native-sha256';

const useCreatePostScreen = ({navigate, goBack}, {params}) => {
  const {post} = params?.post ? params : {post: null};

  console.log('post', post);

  const isEditPost = Boolean(post?.created_at);

  const {getState, queryClient} = useReduxStore();

  const [orientation, setOrientation] = useState('');
  const [videoAfterUpload, setVideoAfterUpload] = useState([]);

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
      const options = {imageKey: 'images', isArrayImages: true};
      return createPostFormData(createPostWithVideosUrl, data, options);
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
  const getVideoUrlOfCloudFare = useMutation({
    mutationFn: data => {
      return API.post(uploadVideoForCloudfareUrl, data);
    },
    onSuccess: ({ok, data}) => {
      console.log(
        'hjsvxjksdkjvkjsdvkjsdkjvkjsdjkvksjsdfsdfsdfsdfsdfsfdvkjsdv',
        data,
      );
      if (ok) {
        uploadVideoUrlToCloudFare.mutate({
          url: data?.upload_url,
          data: {
            filename: data?.request?.filename,
            type: 'video/mp4',
            uri: data?.request?.uri,
          },
        });

        setVideoAfterUpload(prev => [
          ...prev,
          {
            filename: data?.request?.filename,
            type: 'video/mp4',
            uri: data?.request?.uri,
            videoId: data?.video_id,
          },
        ]);
      } else {
        errorMessage(data?.message);
      }
    },
    onError: ({message}) => {
      errorMessage('Problem occurred while uploading data.');
    },
  });
  const uploadVideoUrlToCloudFare = useMutation({
    mutationFn: async data => {
      console.log('Uploading video to Cloudflare R2 with data:', data);
      const videoUri = data?.data?.uri;
      if (!videoUri) {
        throw new Error('No video URI');
      }

      try {
        const fetchResp = await fetch(videoUri);
        const blob = await fetchResp.blob();

        // Try to get size (fallback if blob.size undefined)
        let fileSize = blob.size || 0;
        if (fileSize === 0) {
          // Optional: use RNFS.stat if installed
          // const stat = await RNFS.stat(videoUri);
          // fileSize = stat.size;
        }

        console.log('Uploading blob size:', fileSize);

        const uploadResp = await fetch(data?.url, {
          method: 'PUT',
          body: blob,
        });

        if (!uploadResp.ok) {
          const errText = await uploadResp.text();
          console.error('R2 full response:', uploadResp.status, errText);
          throw new Error(`Upload failed: ${errText}`);
        }

        console.log('Success! Status:', uploadResp.status);
        return {ok: true};
      } catch (err) {
        console.error('Upload prep failed:', err);
        throw err;
      }
    },

    onSuccess: ({ok, data}) => {
      console.log('Upload success:', data);
      if (ok) {
        console.log('Video uploaded to Cloudflare R2', videoAfterUpload);
        // Add any post-upload logic here
      } else {
        errorMessage(data?.message || 'Upload failed');
      }
    },

    onError: err => {
      console.error('Upload error:', err);
      errorMessage('Failed to upload video. Check file size or network.');
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
    if (
      postText != null &&
      postText != undefined &&
      postText != '' &&
      postText.trim()
    ) {
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
          images:
            postImgs?.filter?.(
              i => !i.type?.startsWith('video/') && i.duration == null,
            ) ?? [],
          video_ids:
            findCommonById(videoAfterUpload, postImgs, 'uri')?.map(
              i => i.videoId,
            ) ?? [],
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
    getVideoUrlOfCloudFare,
    videoAfterUpload,
  };
};

export default useCreatePostScreen;
