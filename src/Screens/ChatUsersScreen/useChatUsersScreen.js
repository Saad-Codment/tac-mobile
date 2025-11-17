import {useEffect, useRef, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {
  chatUserListUrl,
  deleteEntireChatUrl,
  GetChatListUrl,
} from '../../Utils/Urls';
import useReduxStore from '../../Hooks/UseReduxStore';
import {io} from 'socket.io-client'; // Import io directly
import {mergeIds} from '../../Services/GlobalFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL
const API_BASE_URL = GetChatListUrl;
const SOCKET_URL = 'https://messaging.theappforcowboys.com/'; // Use your socket URL

const useChatUserScreen = ({navigate, addListener}) => {
  const socketRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [searchVal, setSearchVal] = useState('');

  const {getState} = useReduxStore();
  const {userData} = getState('Auth');

  const myId = userData?.id;

  // Fetch chat list from Laravel API
  const {data, refetch} = useQuery({
    queryKey: ['chatList'],
    queryFn: () => API.get(chatUserListUrl),
  });
  const [filterData, setFilterData] = useState([]);

  function searchFun(e) {
    var text = e;
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = chats.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = (
          item?.other_user?.first_name + ' ' + item?.other_user?.last_name || ''
        ).toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      console.log('newDatanewDatanewDatanewData', newData);
      setFilterData(newData);
      setSearchVal(text);
    } else {
      setFilterData(chats);
      setSearchVal(text);
    }
  }

  // Initialize Socket.io directly in useEffect
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });
    // socketRef.current.on('connect', () => console.log('Socket connected'));
    // socketRef.current.on('disconnect', () =>
    //   console.log('Socket disconnected'),
    // );
    // socketRef.current.on('error', err => console.error('Socket error:', err));

    // return () => {
    //   if (socketRef.current) {
    //     socketRef.current.disconnect();
    //   }
    // };
  }, []);

  // Setup socket listeners and fetch chats
  useEffect(() => {
    if (myId && data?.data && data?.data.length > 0) {
      // Initialize chats with isTyping: false
      setChats(data.data.map(chat => ({...chat, isTyping: false})));

      // Join all chat rooms
      data.data.forEach(chat => {
        socketRef.current.emit('join', userData?.id);
      });

      // Socket listeners
      socketRef.current.on('newMessage', payload => {
        console.log('New message received ChatList:', payload);
        const index = chats.findIndex(
          c => c.conversation_id === payload.conversation_id,
        );
        if (index !== -1) {
          const chat = chats[index];
          const updatedChat = {
            ...chat,
            last_message: payload.message,
            unread_count: chat.unread_count,
          };
          // Remove from old position and insert at top
          setChats(prevChats => {
            const newChats = prevChats.filter(
              c => c.conversation_id !== payload.conversation_id,
            );
            return [updatedChat, ...newChats];
          });
        }
      });

      socketRef.current.on('userTyping', payload => {
        console.log('Typing event received:', payload);
        const chat = chats.find(c => c.other_user.id === payload.sender_id);
        if (chat) {
          setChats(prevChats =>
            prevChats.map(c =>
              c.other_user.id === payload.sender_id
                ? {...c, isTyping: payload.isTyping}
                : c,
            ),
          );
          if (payload.isTyping) {
            setTimeout(() => {
              setChats(prevChats =>
                prevChats.map(c =>
                  c.other_user.id === payload.sender_id
                    ? {...c, isTyping: false}
                    : c,
                ),
              );
            }, 3000);
          }
        }
      });

      return () => {
        data.data.forEach(chat => {
          const roomId = mergeIds(myId, chat.other_user.id);
          socketRef.current.emit('leave', roomId);
        });
        socketRef.current.off('newMessage');
        socketRef.current.off('userTyping');
      };
    }
  }, [data, myId]);

  // Delete entire chat
  const deleteEntireChat = async chatroomId => {
    try {
      await API.delete(`${deleteEntireChatUrl}${chatroomId}`);
      onRefresh();
      onRefresh();
      return true;
    } catch (error) {
      console.error('Error deleting chat:', error);
      return false;
    }
  };

  // Navigation to ChatScreen
  const dynamicNav = (screenName, screenData) =>
    navigate(screenName, screenData);

  // Refresh chat list
  const onRefresh = () => {
    refetch();
  };

  // Clear notifications on focus
  useEffect(() => {
    const unsubscribe = addListener('focus', () => {
      onRefresh();
    });
    return unsubscribe;
  }, []);

  const rowRefs = useRef(new Map()).current; // Store refs for each row
  const openRowKey = useRef(null); // Track currently open row
  const closeTimeout = useRef(null); // Track timeout

  // Auto-close after 2 seconds
  const autoCloseRow = rowKey => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    closeTimeout.current = setTimeout(() => {
      const rowRef = rowRefs.get(rowKey);
      if (rowRef) {
        rowRef.closeRow();
        openRowKey.current = null;
      }
    }, 2000); // 2 seconds
  };

  const onRowOpen = (rowKey, rowMap) => {
    // Close previously open row
    if (openRowKey.current && openRowKey.current !== rowKey) {
      const prevRowRef = rowRefs.get(openRowKey.current);
      if (prevRowRef) {
        prevRowRef.closeRow();
      }
    }

    // Set current open row
    openRowKey.current = rowKey;
    rowRefs.set(rowKey, rowMap[rowKey]);

    // Auto-close after delay
    autoCloseRow(rowKey);
  };

  const onRowClose = (rowKey, rowMap) => {
    setTimeout(() => {
      const rowRef = rowMap[rowKey];
      if (rowRef) rowRef.closeRow();
    }, 100); // tiny delay to show swipe
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
      }
    };
  }, []);

  return {
    messageList: chats,
    dynamicNav,
    users: chats,
    userData,
    onRefresh,
    deleteEntireChat,
    searchVal,
    setSearchVal,
    searchFun,
    filterData,
    onRowOpen,
    onRowClose,
  };
};

export default useChatUserScreen;
