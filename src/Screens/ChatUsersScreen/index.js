import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {memo} from 'react';
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

const ChatUsersScreen = ({navigation}) => {
  const {
    messageList,
    dynamicNav,
    users,
    userData,
    onRefresh,
    deleteEntireChat,
  } = useChatUserScreen(navigation);

  const renderItem = ({item, index}) => {
    const avatarLetter =
      item?.other_user?.first_name?.charAt(0)?.toUpperCase() || '?';
    const lastMessage = item?.last_message?.text || 'No messages yet';
    const isTyping = item?.isTyping || false;
    const unreadCount = item?.unread_count || 0;

    return (
      <ChatUserComp item={item} index={index} userDataProp={userData} />
      // <TouchableOpacity
      //   onPress={() =>
      //     dynamicNav('ChatScreen', {
      //       id: item?.other_user?.id || item?.id, // Fallback to item.id if other_user.id is missing
      //       userId: userData?.id,
      //       conversationId: item?.conversation_id,
      //     })
      //   }
      //   style={styles.chatItem}>
      //   <CircleImage
      //     image={imageUrl(item?.other_user?.profile_image)}
      //     size={0.12}
      //     uri={true}
      //     backgroundColor={Colors.grayFaded || '#B0BEC5'}
      //     textStyle={{color: Colors.white || '#FFFFFF', fontSize: hp('2.5')}}
      //   />
      //   <View style={styles.chatInfo}>
      //     <TextComponent
      //       text={`${item?.other_user?.first_name || 'Unknown'} ${
      //         item?.other_user?.last_name || ''
      //       }`}
      //       styles={styles.userName}
      //     />
      //     <TextComponent
      //       text={isTyping ? 'typing...' : lastMessage}
      //       styles={isTyping ? styles.typingText : styles.lastMessage}
      //     />
      //   </View>
      //   {unreadCount > 0 && (
      //     <View style={styles.unreadBadge}>
      //       <TextComponent text={unreadCount} styles={styles.unreadText} />
      //     </View>
      //   )}
      // </TouchableOpacity>
    );
  };

  const renderHiddenItem = ({item}) => (
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
        onPress={() => deleteEntireChat(mergeIds(item.id, item?.user_id))}>
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
      <SwipeListView
        showsVerticalScrollIndicator={false}
        style={styles.listMain}
        useFlatList
        data={users}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        leftOpenValue={0}
        previewRowKey={'0'}
        stopLeftSwipe
        previewOpenDelay={3000}
        closeOnRowPress
        onRefresh={onRefresh}
        refreshing={false}
      />
    </View>
  );
};

export default memo(ChatUsersScreen);
