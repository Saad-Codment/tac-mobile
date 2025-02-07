import {View, Text, ActivityIndicator} from 'react-native';
import React, {memo, useCallback} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {AniFlatOneByOne} from '../../AnimatedComp/AniFlatOneByOne';
import {DataNotFound} from '../../Components/DataNotFound';
import {hp, wp} from '../../Config/responsive';
import useAllEventsScreen from './useAllEventsScreen';
import {styles} from './styles';
import UpcomingEventsComp from '../../Components/UpCommingEventsComp';
import ThemeButton from '../../Components/ThemeButton';

const AllEventsScreen = ({navigation, route}) => {
  const {
    title,
    eventsList,
    isRefetching,
    isFetching,
    hasMoreData,
    onRefresh,
    loadMoreData,
    refetchKey,
  } = useAllEventsScreen(navigation, route);

  const RenderItem = useCallback(
    ({item, index}) => {
      return (
        <UpcomingEventsComp
          item={item}
          index={index}
          mainViewStyle={{marginTop: hp('2'), width: wp('95')}}
          upperImgStyle={{width: wp('95')}}
          refetechKeys={[refetchKey]}
        />
      );
    },
    [eventsList],
  );

  return (
    <>
      <HeaderComponent
        headerTitle={title}
        goBack={() => navigation.goBack()}
        isBack
      />
      <AniFlatOneByOne
        data={eventsList}
        flatViewStyle={styles.upComingFlatlistView}
        onRefresh={onRefresh}
        flatListProps={{
          ListEmptyComponent: (
            <DataNotFound onpress={onRefresh} btnStyles={{width: wp('80')}} />
          ),
          ListFooterComponent:
            eventsList.length >= 9 &&
            !hasMoreData &&
            (isFetching ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <ThemeButton
                title={'Load More'}
                style={{marginTop: hp('2'), width: wp('40')}}
                onPress={() => loadMoreData()}
              />
            )), // Show loading spinner at the bottom
        }}
        InnerCompnonet={(item, index) => (
          <RenderItem item={item} index={index} />
        )}
      />
    </>
  );
};

export default memo(AllEventsScreen);
