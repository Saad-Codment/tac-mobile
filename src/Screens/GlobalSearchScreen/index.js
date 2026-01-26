import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {memo, useCallback} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {MultiSelectButton} from '../../Components/MultiSelectButton';
import {styles} from './styles';
import {Colors} from '../../Theme/Variables';
import {TextComponent} from '../../Components/TextComponent';
import {hp, wp} from '../../Config/responsive';
import {AniFlatOneByOne} from '../../AnimatedComp/AniFlatOneByOne';
import {DataNotFound} from '../../Components/DataNotFound';
import ThemeButton from '../../Components/ThemeButton';
import MyFriendComp from '../../Components/MyFriendComp';
import FriendReqComp from '../../Components/FriendReqComp';
import {searchIcon, tacFilterIcon} from '../../Assets';
import useGloabalSearchScreen from './useGlobalSearchScreen';
import PostViewComp from '../../Components/PostViewComp';
import UpcomingEventsComp from '../../Components/UpCommingEventsComp';
import BottomModalComponent from '../../Components/BottomModalComponent';
import SharePostComp from '../../Components/SharePostComp';
import ShareEventComp from '../../Components/ShareEventComp';
import {Touchable} from '../../Components/Touchable';
import Overlay from '../../Components/Overlay';

const GlobalSearchScreen = ({navigation}) => {
  const {
    selectedVal,
    setSelectedVal,
    searchVal,
    setSearchVal,
    allSearchData,
    isFetching,
    isPending,
    onSearch,
    refetch,
    modal,
    setModal,
    allDataRefetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    selectTabAllData,
    refetchKeys,
    filterVal,
    setFilterVal,
    queryClient,
    selectUrl,
    isParams,
    allDataEvents,
    isFetchingNextPageEvents,
    fetchNextPageEvents,
    hasNextPageEvents,
    isPendingEvents,
    isFetchingEvents,
    isRefetchingEvnts,
    allDataRefetchEvents,
    setPages,
    refetchWhenParams,
    isLoading,
    setIsLoading,
    totalPages,
    pages,
  } = useGloabalSearchScreen(navigation);

  console.log(
    'allSearchDataallSearchsdDataallSearchDataallSearchDataallSsdsdsearchDataslkdnvlksdn',
    Boolean(totalPages != pages),
  );

  const DynamicViewForSearch = useCallback(
    ({array, title, isSeeAll, flatViewStyle, isNotRefreshing}) => {
      return (
        <View style={styles.sectionContainer}>
          {isSeeAll && (
            <View style={styles.titleView}>
              <TextComponent text={title} styles={styles.titleText} />
              <TextComponent
                text={'See all'}
                styles={styles.seeAllText}
                onPress={async () => {
                  if (
                    searchVal != null &&
                    searchVal != '' &&
                    searchVal != undefined
                  ) {
                    setSelectedVal({id: title, name: title});
                    setIsLoading(true);
                    await allDataRefetch();
                    setIsLoading(false);
                  }
                }}
              />
            </View>
          )}
          <FlatList
            data={array ?? []}
            style={{...styles.upComingFlatlistView, ...flatViewStyle}}
            numColumns={1}
            renderItem={({item, index}) => (
              <>
                {title === 'Users' && (
                  <MyFriendComp
                    item={item}
                    index={index}
                    refetch={isNotRefreshing ? undefined : refetch}
                    mainViewStyles={styles.friendCompContainer}
                  />
                )}
                {title == 'Posts' && (
                  <>
                    {item?.type == 3 ? (
                      <SharePostComp
                        item={item}
                        index={index}
                        refetechKeys={refetchKeys}
                        functionToUpdateLike={() => {}}
                        refetch={isNotRefreshing ? undefined : refetch}
                        openBottomSheet={id => setModal({id, type: 'post'})}
                      />
                    ) : item?.type == 1 ? (
                      <PostViewComp
                        item={item}
                        index={index}
                        refetechKeys={refetchKeys}
                        functionToUpdateLike={() => {}}
                        mainViewStyle={{
                          marginTop: hp('1'),
                          alignSelf: 'center',
                          marginBottom: hp('1'),
                        }}
                        openBottomSheet={id => setModal({id, type: 'post'})}
                        refetch={isNotRefreshing ? undefined : refetch}
                      />
                    ) : null}
                  </>
                )}
                {title == 'Events' ? (
                  <>
                    {item?.type == 5 || item?.type == 6 ? (
                      <ShareEventComp
                        item={item}
                        index={index}
                        mainViewStyle={{
                          width: wp('95'),
                          alignSelf: 'center',
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                          overflow: 'hidden',
                          marginVertical: hp('1'),
                        }}
                        upperMainView={{
                          width: wp('100'),
                          marginVertical: hp('1'),
                        }}
                        refetechKeys={refetchKeys}
                        functionToUpdateLike={() => {}}
                        openBottomSheet={id => setModal({id, type: 'event'})}
                        refetch={isNotRefreshing ? undefined : refetch}
                      />
                    ) : item?.type == 2 || item?.type == 4 ? (
                      <UpcomingEventsComp
                        item={item}
                        index={index}
                        mainViewStyle={{
                          width: wp('95'),
                          marginBottom: hp('1'),
                          alignSelf: 'center',
                        }}
                        upperImgStyle={{width: wp('95')}}
                        refetechKeys={refetchKeys}
                        functionToUpdateLike={() => {}}
                        openBottomSheet={id => setModal({id, type: 'event'})}
                        refetch={isNotRefreshing ? undefined : refetch}
                      />
                    ) : null}
                  </>
                ) : null}
              </>
            )}
            //   ListFooterComponent={
            //  // Show loading spinner at the bottom
            //   }
          />
        </View>
      );
    },
    [selectedVal],
  );

  return (
    <View style={styles.container}>
      <HeaderComponent
        headerTitle={'Search'}
        isBack
        // onGoBack={() => {
        //   queryClient.removeQueries({
        //     queryKey: ['globalSearchUrlForAllData'],
        //     exact: true,

        //   });
        // }}
      />
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Image
            source={searchIcon}
            resizeMode="contain"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={Colors.textGray}
            value={searchVal}
            onChangeText={e => setSearchVal(e)}
            returnKeyType="search"
            onSubmitEditing={async () => {
              setFilterVal(prev => ({...prev, isParams: false}));
              const isSearch = Boolean(
                searchVal == null || searchVal == '' || searchVal == undefined,
              );
              if (!isSearch) {
                setSelectedVal({name: 'Events', id: 'Events'});
                setIsLoading(true);
                await allDataRefetch();
                setIsLoading(false);
              }
            }}
          />
          {selectedVal?.id == 'Events' && (
            <Touchable
              onPress={() => {
                // setFilterVal(prev => ({...prev, isParams: false}));
                navigation.navigate('EventFilterScreen', {
                  onFilterPress: e => {
                    setPages(1);
                    setTimeout(() => {
                      setFilterVal(e);
                    }, 1000);
                    setTimeout(() => {
                      refetchWhenParams();
                    }, 1500);
                  },
                  selectedVal: filterVal,
                });
              }}>
              <TextComponent
                text={'Advanced Search'}
                isLightThemeColor
                size={hp('1.3')}
              />
              {/* <Image
                source={tacFilterIcon}
                resizeMode="contain"
                style={{...styles.searchIcon, width: wp('5'), height: hp('2')}}
              /> */}
            </Touchable>
          )}
        </View>
      </View>
      <View style={styles.mainView}>
        <MultiSelectButton
          items={[
            {name: 'Events', id: 'Events'},
            {name: 'Users', id: 'Users'},
            {name: 'Posts', id: 'Posts'},
            {name: 'All', id: 'all'},
          ]}
          selectedBgColor={Colors.headerBg}
          selectedAlter={selectedVal}
          onSelectVal={async (id, item) => {
            setPages(1);
            setFilterVal(prev => ({...prev, isParams: false}));
            if (item?.id != 'all') {
              setSelectedVal(item);
              setIsLoading(true);
              await allDataRefetch();
              setIsLoading(false);
            } else if (item?.id == 'all') {
              setSelectedVal(item);
              setIsLoading(true);
              await refetch();
              setIsLoading(false);
            }
          }}
          btnStyle={{
            marginBottom: 0,
            height: hp('3'),
            paddingHorizontal: wp('2'),
          }}
          isTabBarStyle={true}
          textStyle={{fontSize: hp('1.2'), fontWeight: 'bold'}}
        />
      </View>
      {allSearchData != null && selectedVal?.id == 'all' && (
        <ScrollView
          contentContainerStyle={{paddingBottom: hp('10')}}
          showsVerticalScrollIndicator={false}>
          {allSearchData?.users?.length > 0 && (
            <>
              <DynamicViewForSearch
                title={'Users'}
                array={allSearchData?.users}
                isSeeAll={true}
                flatViewStyle={{marginTop: hp('1')}}
              />
              {/* {
                    selectTabAllData.length >= 9 &&
              isSeeAll != true &&
              (isFetchingNextPage ? (
                <ActivityIndicator size="small" color="gray" />
              ) : (
                Boolean(totalPages != pages) && (
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
                      setPages(prev => prev + 1);
                      setTimeout(async () => {
                        await fetchNextPage();
                      }, 100);
                      // afterFetchNextPage();
                    }}
                  />
                )
              ))
              } */}
            </>
          )}
          {allSearchData?.posts?.length > 0 && (
            <DynamicViewForSearch
              title={'Posts'}
              array={allSearchData?.posts}
              isSeeAll={true}
            />
          )}
          {allSearchData?.events?.length > 0 && (
            <DynamicViewForSearch
              title={'Events'}
              array={allSearchData?.events}
              isSeeAll={true}
            />
          )}
        </ScrollView>
      )}
      {selectTabAllData != null &&
        selectedVal?.id != 'all' &&
        selectTabAllData?.length > 0 && (
          <ScrollView
            contentContainerStyle={{paddingBottom: hp('10')}}
            showsVerticalScrollIndicator={false}>
            <DynamicViewForSearch
              title={selectedVal?.name}
              array={selectTabAllData}
              flatViewStyle={{alignItem: 'center'}}
              isNotRefreshing={true}
            />
            {selectTabAllData.length >= 9 &&
              (isFetchingNextPage ? (
                <ActivityIndicator size="small" color="gray" />
              ) : (
                Boolean(totalPages != pages) && (
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
                      setPages(prev => prev + 1);
                      setTimeout(async () => {
                        await fetchNextPage();
                      }, 100);
                      // afterFetchNextPage();
                    }}
                  />
                )
              ))}
          </ScrollView>
        )}
      {/* <View style={styles.sectionContainer}>
        <View style={styles.titleView}>
          <TextComponent text={'Peoples'} styles={styles.titleText} />
          <TextComponent text={'See all'} styles={styles.seeAllText} />
        </View>
        <AniFlatOneByOne
          data={allSearchData?.users ?? []}
          flatViewStyle={styles.upComingFlatlistView}
          //   onRefresh={refetch}
          flatListProps={{
            numColumns: 1,
            ListEmptyComponent: (
              <DataNotFound
                btnStyles={styles.dataNotFoundBtn}
                imgStyles={styles.dataNotFoundImg}
                mainViewStyles={styles.dataNotFoundContainer}
              />
            ),
          }}
          InnerCompnonet={(item, index) => (
            <MyFriendComp
              item={item}
              index={index}
              refetch={refetch}
              mainViewStyles={styles.friendCompContainer}
            />
          )}
        />
      </View> */}
      {Boolean(isLoading) && <Overlay />}
      {Boolean(modal != null) && (
        <BottomModalComponent
          isVisible={Boolean(modal != null)}
          isReport
          id={modal?.id}
          type={modal?.type}
          onClose={() => setModal(null)}
        />
      )}
    </View>
  );
};

export default memo(GlobalSearchScreen);
