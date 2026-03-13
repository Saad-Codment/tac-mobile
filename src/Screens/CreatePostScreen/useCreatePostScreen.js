import {useLayoutEffect, useState} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';
import {useMutation} from '@tanstack/react-query';
import API, {createPostFormData, formDataFunc} from '../../Utils/helperFunc';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {
  createPostUrl,
  createPostWithVideosUrl,
  deleteVideoForCloudfareUrl,
  updatePostUrl,
  updatePostWithVideoUrl,
  uploadVideoForCloudfareUrl,
} from '../../Utils/Urls';
import {
  findCommonById,
  isVideo,
  uploadFromGalary,
} from '../../Services/GlobalFunctions';

const useCreatePostScreen = ({navigate, goBack}, {params}) => {
  const {post} = params?.post ? params : {post: null};
  const isEditPost = Boolean(post?.created_at);

  const {getState, queryClient} = useReduxStore();
  const {userData} = getState('Auth');

  useLayoutEffect(() => {
    if (params?.isOpenGallary) {
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
        const onChangeVal = (key, value) => {
          if (key === 'postText') setPostText(value);
          if (key === 'postImgs') setPostImgs(value);
        };

        onChangeVal('postImgs', [...(postImgs || []), ...media]);
      };
      openGallery();
    }
  }, []);

  // ── Main post state ──────────────────────────────────────────────
  const [postText, setPostText] = useState(post?.title || '');
  const [postImgs, setPostImgs] = useState(() => {
    const items = [];

    // 1. Existing images
    if (post?.images) {
      try {
        const parsed = JSON.parse(post.images);
        parsed.forEach(path => {
          items.push({
            uri: path,
            type: 'image/jpeg',
            name: path.split('/').pop(),
            isEdit: true,
          });
        });
      } catch {}
    }

    // 2. Existing videos (we'll show thumbnail for preview)
    if (post?.videos?.length) {
      post.videos.forEach(vid => {
        items.push({
          uri: vid.thumbnail_path || '', // preview image
          type: 'video/existing',
          isEdit: true,
          isExistingVideo: true,
          videoId: vid.id,
          master_playlist_path: vid.master_playlist_path,
          thumbnail_path: vid.thumbnail_path,
        });
      });
    }

    return items;
  });

  const [videoAfterUpload, setVideoAfterUpload] = useState([]); // only new videos

  // ── Mutations ────────────────────────────────────────────────────

  // CREATE mutation (your original – unchanged)
  const {mutateAsync: createPostMutation} = useMutation({
    mutationFn: data => {
      const options = {imageKey: 'images', isArrayImages: true};
      return createPostFormData(createPostWithVideosUrl, data, options);
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage('Post Created.');
        goBack();
        navigate('MyProfileScreen', {id: userData?.id});
      } else {
        errorMessage(data?.message);
      }
    },
    onError: () => errorMessage('Problem occurred while uploading data.'),
  });

  // UPDATE mutation
  const updatePostMutation = useMutation({
    mutationFn: data =>
      formDataFunc(updatePostWithVideoUrl + post?.id, data, 'images', true),
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage('Post Updated.');
        goBack();
        if (params?.functionToUpdatePostOrEvent) {
          params.functionToUpdatePostOrEvent(data);
        }
        queryClient.invalidateQueries(['myProfilePosts']);
        if (params?.refetch) setTimeout(() => params.refetch(), 1500);
      } else {
        errorMessage(data?.message);
      }
    },
    onError: () => errorMessage('Problem occurred while updating post.'),
  });

  // Video upload flow (same for create & edit)
  const getVideoUrlOfCloudFare = useMutation({
    mutationFn: data => API.post(uploadVideoForCloudfareUrl, data),
    onSuccess: ({ok, data}) => {
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
  });

  // Your existing upload & delete mutations here (unchanged)
  // uploadVideoUrlToCloudFare, deleteVideo ...

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

  const deleteVideo = useMutation({
    mutationFn: ({videoId}) => API.delete(deleteVideoForCloudfareUrl + videoId),
    onSuccess: () => console.log('Old video deleted'),
    onError: () => errorMessage('Failed to delete video.'),
  });

  // ── Handlers ─────────────────────────────────────────────────────

  const handleAddMedia = newMedia => {
    const videos = newMedia.filter(isVideo);
    const images = newMedia.filter(i => !isVideo(i));

    videos.forEach(vid => {
      getVideoUrlOfCloudFare.mutate({
        filename: vid.name || 'video.mp4',
        mime_type: vid.type || 'video/mp4',
        uri: vid.uri,
      });
    });

    setPostImgs(prev => [...prev, ...newMedia]);
  };

  const handleRemoveMedia = (item, index) => {
    if (item.isExistingVideo && item.videoId) {
      deleteVideo.mutate({videoId: item.videoId});
    }
    setPostImgs(prev => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  const handleCreateOrUpdate = () => {
    if (!postText?.trim() && postImgs.length === 0) {
      return errorMessage('Please write something or add media');
    }

    if (isEditPost) {
      // ── EDIT LOGIC ────────────────────────────────────────
      const oldImages = postImgs
        .filter(i => i.isEdit && !i.isExistingVideo)
        .map(i => i.uri);

      const newImages = postImgs.filter(i => !i.isEdit && !isVideo(i));

      const keptVideoIds = postImgs
        .filter(i => i.isExistingVideo)
        .map(i => i.videoId);

      const newVideoIds = videoAfterUpload
        .filter(v => postImgs.some(m => m.uri === v.uri))
        .map(v => v.videoId);

      updatePostMutation.mutate({
        title: postText,
        images: newImages, // new image files
        images_array: JSON.stringify(oldImages), // paths of kept old images
        video_ids: [...newVideoIds],
      });
    } else {
      // ── CREATE LOGIC – your original flow (unchanged) ──
      createPostMutation({
        title: postText,
        images: postImgs.filter(i => !isVideo(i)),
        video_ids:
          findCommonById(videoAfterUpload, postImgs, 'uri')?.map(
            i => i.videoId,
          ) ?? [],
      });
    }
  };

  return {
    userData,
    postText,
    setPostText,
    postImgs,
    onChangeVal: (key, value) => {
      if (key === 'postText') setPostText(value);
      if (key === 'postImgs') setPostImgs(value);
    },
    createPost: handleCreateOrUpdate,
    isEditPost,
    getVideoUrlOfCloudFare,
    videoAfterUpload,
    handleRemoveMedia,
    handleAddMedia, // optional – if you want to refactor onRightPress
  };
};

export default useCreatePostScreen;
