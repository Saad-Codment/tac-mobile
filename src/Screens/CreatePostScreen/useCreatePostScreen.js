import {useState} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';
import {useMutation} from '@tanstack/react-query';
import {formDataFunc} from '../../Utils/helperFunc';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {createPostUrl} from '../../Utils/Urls';

const useCreatePostScreen = ({navigate, goBack}) => {
  const {getState} = useReduxStore();

  const [postState, setPostState] = useState({
    postText: null,
    postImgs: [],
  });

  const {postImgs, postText} = postState;

  const updateState = data => setPostState(prev => ({...prev, ...data}));

  const onChangeVal = (key, val) => updateState({[key]: val});

  const {mutateAsync} = useMutation({
    mutationFn: data => {
      return formDataFunc(createPostUrl, data, 'images', true);
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage('Your profile updated sucessfully!');
        goBack();
      } else {
        errorMessage(data?.message);
      }
    },
    onError: ({message}) => {
      errorMessage('Problem occurred while uploading data.');
    },
  });

  const createPost = () => {
    if (postImgs.length > 0 || (postText != null && postText != undefined)) {
      mutateAsync({
        title: postText,
        images: postImgs,
      });
    } else errorMessage('Please write or upload images to create post');
  };

  const {userData} = getState('Auth');
  return {userData, onChangeVal, postImgs, postText, createPost};
};

export default useCreatePostScreen;
