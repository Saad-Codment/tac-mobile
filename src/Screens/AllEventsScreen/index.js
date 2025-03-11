import {View, Text, ActivityIndicator, FlatList} from 'react-native';
import React, {memo, useCallback} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {AniFlatOneByOne} from '../../AnimatedComp/AniFlatOneByOne';
import {DataNotFound} from '../../Components/DataNotFound';
import {hp, wp} from '../../Config/responsive';
import useAllEventsScreen from './useAllEventsScreen';
import {styles} from './styles';
import UpcomingEventsComp from '../../Components/UpCommingEventsComp';
import ThemeButton from '../../Components/ThemeButton';
import {keyExtractor} from '../../Utils';

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
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    refetch,
    likePost,
    afterLikeFun,
    functionToUpdateLike,
    afterFetchNextPage,
  } = useAllEventsScreen(navigation, route);

  const RenderItem = useCallback(({item, index}) => {
    return (
      <UpcomingEventsComp
        item={item}
        index={index}
        mainViewStyle={{
          marginTop: hp('2'),
          width: wp('95'),
          alignSelf: 'center',
        }}
        upperImgStyle={{width: wp('95')}}
        refetechKeys={[refetchKey]}
        key={index}
        functionToUpdateLike={() => {}}
      />
    );
  }, []);

  return (
    <>
      <HeaderComponent
        headerTitle={title}
        goBack={() => navigation.goBack()}
        isBack
      />
      <FlatList
        data={eventsList}
        extraData={eventsList}
        contentContainerStylee={styles.upComingFlatlistView}
        onRefresh={onRefresh}
        keyExtractor={keyExtractor}
        refreshing={false}
        ListEmptyComponent={
          <DataNotFound
            onpress={onRefresh}
            btnStyles={{width: wp('80')}}
            mainViewStyles={{alignSelf: 'center', marginTop: hp('20')}}
          />
        }
        renderItem={({item, index}) => <RenderItem item={item} index={index} />}
        ListFooterComponent={
          eventsList.length >= 9 &&
          (isFetchingNextPage ? (
            <ActivityIndicator size="small" color="gray" />
          ) : (
            <ThemeButton
              title={'Load More'}
              style={{
                marginTop: hp('2'),
                width: wp('40'),
                alignSelf: 'center',
                marginBottom: hp('5'),
              }}
              onPress={async () => {
                await fetchNextPage();
                afterFetchNextPage();
              }}
            />
          )) // Show loading spinner at the bottom
        }
      />
      {/* <AniFlatOneByOne
        data={eventsList}
        flatViewStyle={styles.upComingFlatlistView}
        onRefresh={onRefresh}
        flatListProps={{
          ListEmptyComponent: (
            <DataNotFound onpress={onRefresh} btnStyles={{width: wp('80')}} />
          ),
          // onEndReachedThreshold: 0.5, // Trigger fetch when 50% of the list is scrolled
          // ListFooterComponent: () =>
          //   isFetchingNextPage ? <ActivityIndicator /> : null,
          // onEndReached: () => {
          //   if (hasNextPage) fetchNextPage();
          // },
          ListFooterComponent:
            eventsList.length >= 9 &&
            (isFetchingNextPage ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <ThemeButton
                title={'Load More'}
                style={{marginTop: hp('2'), width: wp('40')}}
                onPress={async () => {
                  await fetchNextPage();
                  afterFetchNextPage();
                }}
              />
            )), // Show loading spinner at the bottom
        }}
        InnerCompnonet={(item, index) => (
          <RenderItem item={item} index={index} />
        )}
      /> */}
    </>
  );
};

export default memo(AllEventsScreen);
