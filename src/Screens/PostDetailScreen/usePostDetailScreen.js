import {useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {getSinglePostUrl} from '../../Utils/Urls';
import {useState} from 'react';

const usePostDetailScreen = ({params}) => {
  const [modal, setModal] = useState(false);

  const {data} = useQuery({
    queryKey: ['singlePostData'],
    queryFn: () => API.get(getSinglePostUrl + (params?.id || 211)),
  });
  console.log('single post data', data?.data?.videos);
  return {postData: data?.data};
};

export default usePostDetailScreen;
