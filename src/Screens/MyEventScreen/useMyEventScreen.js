import {useMutation, useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {getEventByDatesUrl, getEventDatesUrl} from '../../Utils/Urls';
import {useEffect, useState} from 'react';
import {errorMessage} from '../../Config/NotificationMessage';

const useMyEventScreen = ({navigate, addListener}) => {
  const [bottomData, setBottomData] = useState(null);

  // if (!isLoading) mutate();
  const [activeButton, setActiveButton] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  console.log(
    'lksdbvklbsdklvbskdlbvklsdbvkbsdkvbskdlvbklsdvbkds',
    new Date().getMonth() + 1,
  );
  var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const {data, refetch} = useQuery({
    queryKey: ['getEventDate'],
    queryFn: async () => {
      const allProps = await API.get(
        getEventDatesUrl + '?timezone=' + timeZone,
      );
      console.log('allPropsallPropsallProps', allProps?.data);
      if (allProps?.ok) {
        setActiveButton(activeButton ?? allProps?.data[0]);
        mutate({
          from_date: allProps?.data[0]?.date,
          page: 1,
          month: currentMonth,
        });
      }
      return allProps;
    },
  });

  const {mutate} = useMutation({
    mutationFn: body => {
      console.log(
        'datadatadatadatadatadsdvsdvsatadatadatjhvdhjdshjvsdjhka',
        body,
      );
      return API.post(getEventByDatesUrl, {...body, timeZone});
    },
    onSuccess: ({ok, data}) => {
      setBottomData([]);
      console.log('datadatadatadatadatadsdvsdvsatadatadata', data);
      if (ok) {
        setBottomData(data?.data);
      } else {
        console.log('datadatadatadatadatadatadatadata', data?.message);
        errorMessage(data?.message);
      }
    },
  });

  const onSelectVal = date => {
    setBottomData(null);
    setActiveButton(date);
    mutate({from_date: date, page: 1});
  };

  const onMonthChange = ({month, dateString}) => {
    setCurrentMonth(month);
    mutate({from_date: dateString, page: 1, month});
  };

  useEffect(() => {
    const event = addListener('focus', async () => {
      refetch();
      // if (params?.id) onRefresh();
    });
    return event;
  }, []);

  return {
    eventDate: data?.data,
    eventsByDate: bottomData,
    onSelectVal,
    activeButton,
    onMonthChange,
    refetch,
  };
};

export default useMyEventScreen;
