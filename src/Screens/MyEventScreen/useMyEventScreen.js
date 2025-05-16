import {useMutation, useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {getEventByDatesUrl, getEventDatesUrl} from '../../Utils/Urls';
import {useState} from 'react';
import {errorMessage} from '../../Config/NotificationMessage';

const useMyEventScreen = ({navigate}) => {
  const [bottomData, setBottomData] = useState([]);

  // if (!isLoading) mutate();
  const [activeButton, setActiveButton] = useState(null);

  const {data} = useQuery({
    queryKey: ['getEventDate'],
    queryFn: async () => {
      const allProps = await API.get(getEventDatesUrl);
      if (allProps?.ok) {
        setActiveButton(activeButton ?? allProps?.data[0]);
        mutate({from_date: allProps?.data[0], page: 1});
      }
      return allProps;
    },
  });

  const {mutate} = useMutation({
    mutationFn: body => {
      return API.post(getEventByDatesUrl, body);
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        setBottomData(data?.data);
      } else {
        console.log('datadatadatadatadatadatadatadata', data?.message);
        errorMessage(data?.message);
      }
    },
  });

  const onSelectVal = date => {
    setActiveButton(date);
    mutate({from_date: date, page: 1});
  };

  return {
    eventDate: data?.data,
    eventsByDate: bottomData,
    onSelectVal,
    activeButton,
  };
};

export default useMyEventScreen;
