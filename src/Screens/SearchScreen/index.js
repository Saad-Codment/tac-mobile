import {View, Text} from 'react-native';
import React, {memo} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {searchIcon} from '../../Assets';
import {hp, wp} from '../../Config/responsive';
import {MultiSelectButton} from '../../Components/MultiSelectButton';
import {Colors} from '../../Theme/Variables';
import useSearchScreen from './useSearchScreen';
import DividerLine from '../../Components/DividerLine';
import {TextComponent} from '../../Components/TextComponent';
import {AniFlatOneByOne} from '../../AnimatedComp/AniFlatOneByOne';
import {DataNotFound} from '../../Components/DataNotFound';
import FriendReqComp from '../../Components/FriendReqComp';
import {styles} from './styles';
import MyFriendComp from '../../Components/MyFriendComp';
import {getMyFriendsUrl} from '../../Utils/Urls';
import ThemeButton from '../../Components/ThemeButton';

const SearchScreen = ({navigation}) => {
  const {
    onSelectVal,
    selectedVal,
    listData,
    userData,
    refetch,
    setSearchVal,
    searchVal,
    afterSearch,
    isSearch,
  } = useSearchScreen(navigation);

  return (
    <View>
      <HeaderComponent
        headerTitle={'Search Friends'}
        rightIconImg={searchIcon}
        isSearch
        searchVal
        // isBack
        setSearchVal={setSearchVal}
        onRightPress={() => {
          if (!isSearch) afterSearch();
        }}
      />
      <View style={styles.mainView}>
        <MultiSelectButton
          items={[
            {name: 'Your Friends', id: 'YourFriends'},
            {id: 'FriendRequests', name: 'Friend Requests'},
          ]}
          selectedBgColor={Colors.headerBg}
          selectedAlter={selectedVal}
          onSelectVal={(id, item) => onSelectVal(item)}
          btnStyle={{marginBottom: 0}}
        />
      </View>
      <View style={{marginTop: hp('1')}}>
        <View style={styles.titleView}>
          <View style={{flexDirection: 'row'}}>
            <TextComponent text={selectedVal.name} styles={styles.titleText} />
            <TextComponent
              text={` ${
                selectedVal.id == 'YourFriends'
                  ? listData?.friendsCount ?? 0
                  : listData?.requestCount ?? 0
              }`}
              styles={styles.titleText}
              isLightThemeColor
            />
          </View>
          <TextComponent
            text={'See all'}
            styles={{marginRight: wp('2'), fontSize: hp('1.2')}}
            onPress={() =>
              navigation.navigate(
                selectedVal.id == 'FriendRequests'
                  ? 'FriendReqScreen'
                  : 'FriendLists',
                {
                  url: getMyFriendsUrl,
                  key: 'myFriends',
                  title: 'Friend list',
                },
              )
            }
          />
        </View>
        <AniFlatOneByOne
          data={
            selectedVal.id == 'YourFriends'
              ? Array.isArray(listData?.friends)
                ? listData?.friends.slice(0, 7)
                : []
              : Array.isArray(listData?.request)
              ? listData?.request.slice(0, 7)
              : []
          }
          flatViewStyle={styles.upComingFlatlistView}
          onRefresh={refetch}
          flatListProps={{
            numColumns: 1,
            ListEmptyComponent: (
              <DataNotFound
                btnStyles={{width: wp('85')}}
                imgStyles={{width: wp('30')}}
                // title={
                //   selectedVal.id == 'YourFriends'
                //     ? 'No Rodeo Crew Yet'
                //     : 'The Stable’s Quiet – No Requests'
                // }
                // subTitle={
                //   selectedVal.id == 'YourFriends'
                //     ? 'Search for friends or sync your contacts to see which rodeo enthusiasts are already on TAC.'
                //     : 'Looks like no new friend requests for now. Keep the rodeo spirit alive and grow your TAC crew!'
                // }
                mainViewStyles={{
                  flex: 1,
                  paddingTop: hp('10'),
                  width: wp('100'),
                }}
              />
            ),
            ListFooterComponent: (
              <>
                {selectedVal.id == 'YourFriends' &&
                  listData?.friends?.length > 7 && (
                    <ThemeButton
                      title={`View All ${listData?.friendsCount} friend(s)`}
                      style={{
                        width: wp('95'),
                        alignSelf: 'center',
                        height: hp('5'),
                        marginTop: hp('1'),
                        marginBottom: hp('1'),
                      }}
                      textStyle={{fontSize: hp('1.5')}}
                    />
                  )}
                {selectedVal.id == 'FriendRequests' &&
                  listData?.request?.length > 7 && (
                    <ThemeButton
                      title={`View All ${listData?.request} request(s)`}
                      style={{
                        width: wp('95'),
                        alignSelf: 'center',
                        height: hp('5'),
                        marginTop: hp('1'),
                        marginBottom: hp('1'),
                      }}
                      textStyle={{fontSize: hp('1.5')}}
                    />
                  )}
              </>
            ),
          }}
          InnerCompnonet={(item, index) =>
            selectedVal.id == 'YourFriends' ? (
              userData?.id != item?.id && (
                <MyFriendComp
                  item={item}
                  index={index}
                  refetch={refetch}
                  mainViewStyles={{width: wp('95')}}
                />
              )
            ) : (
              <FriendReqComp
                item={item}
                index={index}
                refetechKeys={[
                  'searchScreenData',
                  'myFriends',
                  'friendRequests',
                ]}
                refetch={refetch}
              />
            )
          }
        />
      </View>
    </View>
  );
};

export default memo(SearchScreen);
