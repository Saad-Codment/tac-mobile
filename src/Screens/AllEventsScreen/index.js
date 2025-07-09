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
import Overlay from '../../Components/Overlay';
import BottomModalComponent from '../../Components/BottomModalComponent';

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
    modal,
    setModal,
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
        openBottomSheet={id => setModal(id)}
        refetch={refetch}
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
      {eventsList != null ? (
        <FlatList
          data={eventsList ?? []}
          extraData={eventsList}
          contentContainerStylee={styles.upComingFlatlistView}
          onRefresh={onRefresh}
          keyExtractor={keyExtractor}
          refreshing={false}
          ListEmptyComponent={
            !isFetching &&
            eventsList.length == 0 && (
              <DataNotFound
                onpress={onRefresh}
                btnStyles={{width: wp('80')}}
                mainViewStyles={{alignSelf: 'center', marginTop: hp('20')}}
              />
            )
          }
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
          ListFooterComponent={
            eventsList.length >= 9 &&
            (isFetchingNextPage ? (
              <ActivityIndicator size="small" color="gray" />
            ) : (
              <ThemeButton
                title={'Load More'}
                style={{
                  marginTop: hp('2'),
                  width: wp('30'),
                  height: hp('4'),
                  alignSelf: 'center',
                  marginBottom: hp('5'),
                }}
                textStyle={{fontSize: hp('1.5')}}
                onPress={async () => {
                  await fetchNextPage();
                  afterFetchNextPage();
                }}
              />
            )) // Show loading spinner at the bottom
          }
        />
      ) : (
        <Overlay />
      )}
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

      {Boolean(modal != null) && (
        <BottomModalComponent
          isVisible={Boolean(modal != null)}
          isReport
          id={modal}
          // type={"even"}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
};

export default memo(AllEventsScreen);
