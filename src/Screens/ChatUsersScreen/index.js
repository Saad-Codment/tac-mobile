import {View, Text, TouchableOpacity, Image, TextInput} from 'react-native';
import React, {memo, useRef} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {searchIcon, trashWhite} from '../../Assets';
import {hp, wp} from '../../Config/responsive';
import {CircleImage} from '../../Components/CircleImage';
import {TextComponent} from '../../Components/TextComponent';
import {SwipeListView} from 'react-native-swipe-list-view';
import {styles} from './styles';
import {mergeIds} from '../../Services/GlobalFunctions';
import {Colors} from '../../Theme/Variables';
import useChatUserScreen from './useChatUsersScreen';
import {imageUrl} from '../../Utils/Urls';
import ChatUserComp from '../../Components/ChatUserComp';
import {keyExtractor} from '../../Utils';

const ChatUsersScreen = ({navigation}) => {
  const {
    messageList,
    dynamicNav,
    users,
    userData,
    onRefresh,
    deleteEntireChat,
    searchVal,
    setSearchVal,
    searchFun,
    filterData,
    onRowOpen,
    onRowClose,
  } = useChatUserScreen(navigation);
  // This is the ONLY correct way – a ref to an object (not Map!)
  // FIXED: This is now a real persistent ref
  const rowRefs = useRef({}); // ← CORRECT (no .current!)

  // Close all rows instantly
  const closeAllRowsNow = () => {
    Object.values(rowRefs.current).forEach(ref => {
      ref?.closeRow?.();
    });
  };

  const closeAllRowsAfter1Second = () => {
    setTimeout(() => {
      closeAllRowsNow();
    }, 1000);
  };
  const renderItem = ({item, index}) => {
    const avatarLetter =
      item?.other_user?.first_name?.charAt(0)?.toUpperCase() || '?';
    const lastMessage = item?.last_message?.text || 'No messages yet';
    const isTyping = item?.isTyping || false;
    const unreadCount = item?.unread_count || 0;

    return <ChatUserComp item={item} index={index} userDataProp={userData} />;
  };

  const renderHiddenItem = ({item, index}, rowMap) => (
    <View
      style={{
        width: '98%',
        alignSelf: 'center',
        justifyContent: 'center', // Center the trash icon vertically
      }}>
      <TouchableOpacity
        style={[
          styles.backRightBtn,
          styles.backRightBtnRight,
          {height: hp('6')},
        ]} // Match height here
        onPress={() => {
          console.log(
            'Deleting conversation_id:',
            rowMap[item?.key]?.closeRow(),
          );
          const rowKey = keyExtractor(item, index);

          // 🔥 AUTO-CLOSE the row immediately
          if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
          }
          deleteEntireChat(item?.conversation_id);
        }}>
        <Image
          source={trashWhite}
          style={styles.trashIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderComponent headerTitle={'Chat Box'} />
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
            onChangeText={e => searchFun(e)}
            returnKeyType="search"
          />
        </View>
      </View>
      <SwipeListView
        showsVerticalScrollIndicator={false}
        style={styles.listMain}
        useFlatList
        data={
          users != null &&
          users?.length > 0 &&
          (filterData.length >= 0 && searchVal != '' ? filterData : users)
        }
        // data={users}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        leftOpenValue={0}
        previewRowKey={'0'}
        // stopLeftSwipe
        previewOpenDelay={3000}
        onRefresh={onRefresh}
        refreshing={false}
        keyExtractor={keyExtractor}
        // These are correct
        // onRowOpen={(rowKey, rowMap) => {
        //   rowRefs.current[rowKey] = rowMap[rowKey]; // ← use .current here
        // }}
        // onRowClose={rowKey => {
        //   delete rowRefs.current[rowKey];
        // }}
        // onRowDidClose={rowKey => {
        //   delete rowRefs.current[rowKey];
        // }}
        // Optional: auto-close on press
        // closeOnRowPress={true}
      />
    </View>
  );
};

export default memo(ChatUsersScreen);
