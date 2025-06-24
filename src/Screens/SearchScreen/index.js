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
  } = useSearchScreen(navigation);

  return (
    <View style={{flex: 1}}>
      <HeaderComponent
        headerTitle={'Search Friends'}
        rightIconImg={searchIcon}
        isSearch
        searchVal
        setSearchVal={setSearchVal}
        onRightPress={() => afterSearch()}
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
                  ? listData?.friends?.length ?? 0
                  : listData?.request?.length ?? 0
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
              ? listData?.friends
              : listData?.request
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
              />
            )
          }
        />
      </View>
    </View>
  );
};

export default memo(SearchScreen);
