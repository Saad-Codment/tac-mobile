import {View, Text, FlatList, Image} from 'react-native';
import React, {useCallback} from 'react';
import useFriendLists from './useFriendLists';
import {styles} from './styles';
import {TextComponent} from '../../Components/TextComponent';
import {Touchable} from '../../Components/Touchable';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {chat, rightIos} from '../../Assets';
import BlurImage from '../../Components/BlurImage';
import {hp, wp} from '../../Config/responsive';
import MutualFriends from '../../Components/MutualFriendsComponent';
import {AniFlatOneByOne} from '../../AnimatedComp/AniFlatOneByOne';
import {DataNotFound} from '../../Components/DataNotFound';
import MyFriendComp from '../../Components/MyFriendComp';

const FriendLists = ({navigation}) => {
  const {friendListData, onRefresh} = useFriendLists(navigation);

  return (
    <>
      <HeaderComponent
        headerTitle={'Friend List'}
        goBack={() => navigation.goBack()}
        isBack
      />
      <AniFlatOneByOne
        data={friendListData}
        flatViewStyle={styles.upComingFlatlistView}
        onRefresh={onRefresh}
        flatListProps={{
          numColumns: 1,
          ListEmptyComponent: (
            <DataNotFound onpress={onRefresh} btnStyles={{width: wp('80')}} />
          ),
        }}
        InnerCompnonet={(item, index) => (
          <MyFriendComp item={item} index={index} />
        )}
      />
    </>
  );
};

export default FriendLists;
