import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {memo, useCallback} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {backIcon, searchIcon, tacFilterIcon} from '../../Assets';
import {styles} from './styles';
import {Colors} from '../../Theme/Variables';
import {DataNotFound} from '../../Components/DataNotFound';
import {hp, wp} from '../../Config/responsive';
import ThemeButton from '../../Components/ThemeButton';
import Overlay from '../../Components/Overlay';
import UpcomingEventsComp from '../../Components/UpCommingEventsComp';
import BottomModalComponent from '../../Components/BottomModalComponent';
import useGlobalEventsScreen from './useGlobalEventsScreen';
import {keyExtractor} from '../../Utils';
import BottomViewModal from '../../Components/BottomViewModal';
import FilterModalComp from './FilterModalComp';
import SharePostComp from '../../Components/SharePostComp';
import PostViewComp from '../../Components/PostViewComp';
import ShareEventComp from '../../Components/ShareEventComp';
import {TextComponent} from '../../Components/TextComponent';

const GlobalEventsScreen = ({navigation, route}) => {
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
    afterFetchNextPage,
    modal,
    setModal,
    searchVal,
    setSearchVal,
    filterVal,
    setFilterVal,
    isLoading,
    setIsLoading,
  } = useGlobalEventsScreen(navigation, route);

  const RenderItem = useCallback(({item, index}) => {
    return (
      <>
        {item?.type == 3 ? (
          <SharePostComp
            item={item}
            index={index}
            mainViewStyle={{
              marginTop: hp('1'),
              width: wp('95'),
              alignSelf: 'center',
            }}
            upperImgStyle={{width: wp('95')}}
            refetechKeys={[refetchKey]}
            key={index}
            functionToUpdateLike={() => {}}
            // openBottomSheet={id => setModal(id)}
            refetch={refetch}
          />
        ) : item?.type == 1 ? (
          <PostViewComp
            item={item}
            index={index}
            mainViewStyle={{
              marginTop: hp('1'),
              width: wp('95'),
              alignSelf: 'center',
            }}
            upperImgStyle={{width: wp('95')}}
            refetechKeys={[refetchKey]}
            key={index}
            functionToUpdateLike={() => {}}
            // openBottomSheet={id => setModal(id)}
            refetch={refetch}
          />
        ) : item?.type == 5 ? (
          <ShareEventComp
            item={item}
            index={index}
            upperMainView={{
              marginTop: hp('1'),
            }}
            mainViewStyle={{
              width: wp('95'),
              alignSelf: 'center',
            }}
            upperImgStyle={{width: wp('95')}}
            refetechKeys={[refetchKey]}
            key={index}
            functionToUpdateLike={() => {}}
            // openBottomSheet={id => setModal(id)}
            refetch={refetch}
          />
        ) : (
          <UpcomingEventsComp
            item={item}
            index={index}
            mainViewStyle={{
              marginTop: hp('1'),
              width: wp('95'),
              alignSelf: 'center',
            }}
            upperImgStyle={{width: wp('95')}}
            refetechKeys={[refetchKey]}
            key={index}
            functionToUpdateLike={() => {}}
            // openBottomSheet={id => setModal(id)}
            refetch={refetch}
          />
        )}
      </>
    );
  }, []);

  return (
    <>
      <HeaderComponent
        headerTitle={'Search Events'}
        isBack
        // rightIconImg={tacFilterIcon}
        rightIconStyle={{tintColor: 'white'}}
        backText={'Back'}
        backTextStyle={{color: Colors.textGray}}
        isAnotherRightChildern={
          <TextComponent
            text={'Advanced Search'}
            isWhite
            styles={{
              height: hp('2'),
              fontSize: hp('1.5'),
              marginTop: hp('-1.5'),
            }}
          />
        }
        // onRightPress={() => setModal('EventFilterScreen')}
        onRightPress={() =>
          navigation.navigate('EventFilterScreen', {
            onFilterPress: e => setFilterVal(e),
            selectedVal: filterVal,
          })
        }
      />
      <Pressable style={styles.searchContainer} disabled>
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
              setIsLoading(true);
              await refetch();
              setIsLoading(false);
            }}
          />
        </View>
      </Pressable>

      {eventsList != null && (
        <FlatList
          data={eventsList ?? []}
          extraData={eventsList}
          contentContainerStyle={styles.upComingFlatlistView}
          onRefresh={onRefresh}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
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
      )}
      {isFetchingNextPage || (isLoading && <Overlay />)}
      {/* {Boolean(modal != null) && (
        <BottomViewModal
          childrenComp={<FilterModalComp />}
          isModal={Boolean(modal != null)}
          hideBtn={true}
          onBackPress={() => setModal(null)}
        />
      )} */}
    </>
  );
};

export default memo(GlobalEventsScreen);
