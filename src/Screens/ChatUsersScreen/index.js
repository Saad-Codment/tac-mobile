import {View, Text, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {searchIcon, trashWhite} from '../../Assets';
import {hp, wp} from '../../Config/responsive';
import {CircleImage} from '../../Components/CircleImage';
import {TextComponent} from '../../Components/TextComponent';
import {SwipeListView} from 'react-native-swipe-list-view';
import {Image} from 'react-native';
import {styles} from './styles';
import ChatUserComp from '../../Components/ChatUserComp';
import useChatUserScreen from './useChatUsersScreen';
import {mergeIds} from '../../Services/GlobalFunctions';

const ChatUsersScreen = ({navigation}) => {
  const {
    messageList,
    users,
    userData,
    dynamicNav,
    onRefresh,
    deleteEntireChat,
    initializeChat,
  } = useChatUserScreen(navigation);

  const renderItem = ({item, index}) => {
    return <ChatUserComp item={item} index={index} userDataProp={userData} />;
  };
  const renderHiddenItem = ({item}) => (
    <View
      style={{
        width: '98%',
        alignSelf: 'center',
      }}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteEntireChat(mergeIds(item.id, item?.user_id))}>
        <Image
          source={trashWhite}
          style={styles.trashIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
  console.log('sdjkvbklsbdvlbsdlkbvsd', users);

  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
  };

  return (
    <View style={{flexGrow: 1}}>
      <HeaderComponent
        headerTitle={'Chat Box'}
        // rightIconImg={searchIcon}
        // isSearch
      />

      <SwipeListView
        showsVerticalScrollIndicator={false}
        style={styles.listMain}
        useFlatList
        // data={[1, 23, 4]}
        data={users}
        // sections={bottomData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-55}
        leftOpenValue={0}
        previewRowKey={'0'}
        stopLeftSwipe
        // previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
        closeOnRowPress
        onRefresh={initializeChat}
        refreshing={false}
      />
    </View>
  );
};

export default memo(ChatUsersScreen);
