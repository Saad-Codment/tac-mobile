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
import {searchIcon} from '../../Assets';
import useGloabalSearchScreen from './useGlobalSearchScreen';
import PostViewComp from '../../Components/PostViewComp';
import UpcomingEventsComp from '../../Components/UpCommingEventsComp';
import BottomModalComponent from '../../Components/BottomModalComponent';
import SharePostComp from '../../Components/SharePostComp';
import ShareEventComp from '../../Components/ShareEventComp';

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
  } = useGloabalSearchScreen(navigation);

  console.log(
    'allSearchDataallSearchsdDataallSearchDataallSearchDataallSsdsdsearchData',
    selectTabAllData,
  );

  const DynamicViewForSearch = useCallback(
    ({array, title, isSeeAll, flatViewStyle}) => {
      return (
        <View style={styles.sectionContainer}>
          {isSeeAll && (
            <View style={styles.titleView}>
              <TextComponent text={title} styles={styles.titleText} />
              <TextComponent
                text={'See all'}
                styles={styles.seeAllText}
                onPress={() => {
                  if (
                    searchVal != null &&
                    searchVal != '' &&
                    searchVal != undefined
                  ) {
                    setSelectedVal({id: title, name: title});
                    allDataRefetch();
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
                    refetch={refetch}
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
                        openBottomSheet={id => setModal({id, type: 'post'})}
                      />
                    ) : item?.type == 1 ? (
                      <PostViewComp
                        item={item}
                        index={index}
                        refetechKeys={refetchKeys}
                        functionToUpdateLike={() => {}}
                        openBottomSheet={id => setModal({id, type: 'post'})}
                      />
                    ) : null}
                  </>
                )}
                {title == 'Events' ? (
                  <>
                    {item?.type == 5 ? (
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
                      />
                    ) : item?.type == 2 ? (
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
                      />
                    ) : null}
                  </>
                ) : null}
              </>
            )}
            ListFooterComponent={
              selectTabAllData.length >= 9 &&
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
                    // afterFetchNextPage();
                  }}
                />
              )) // Show loading spinner at the bottom
            }
          />
        </View>
      );
    },
    [selectedVal],
  );

  return (
    <View style={styles.container}>
      <HeaderComponent headerTitle={'Search'} />
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
            onSubmitEditing={() => {
              const isSearch = Boolean(
                searchVal == null || searchVal == '' || searchVal == undefined,
              );
              if (!isSearch) {
                onSearch();
              }
            }}
          />
        </View>
      </View>
      <View style={styles.mainView}>
        <MultiSelectButton
          items={[
            {name: 'All', id: 'all'},
            {name: 'Users', id: 'Users'},
            {name: 'Posts', id: 'Posts'},
            {name: 'Events', id: 'Events'},
          ]}
          selectedBgColor={Colors.headerBg}
          selectedAlter={selectedVal}
          onSelectVal={(id, item) => {
            if (
              item?.id != 'all' &&
              searchVal != null &&
              searchVal != '' &&
              searchVal != undefined
            ) {
              setSelectedVal(item);
              allDataRefetch();
            } else setSelectedVal(item);
          }}
          btnStyle={{marginBottom: 0}}
        />
      </View>
      {allSearchData != null && selectedVal?.id == 'all' && (
        <ScrollView
          contentContainerStyle={{paddingBottom: hp('10')}}
          showsVerticalScrollIndicator={false}>
          {allSearchData?.users?.length > 0 && (
            <DynamicViewForSearch
              title={'Users'}
              array={allSearchData?.users}
              isSeeAll={true}
            />
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
      {selectTabAllData != null && selectedVal?.id != 'all' && (
        <ScrollView
          contentContainerStyle={{paddingBottom: hp('10')}}
          showsVerticalScrollIndicator={false}>
          <DynamicViewForSearch
            title={selectedVal?.name}
            array={selectTabAllData}
            flatViewStyle={{alignItem: 'center'}}
          />
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
