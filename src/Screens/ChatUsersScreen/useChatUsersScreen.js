import {useEffect, useRef, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {GetChatListUrl} from '../../Utils/Urls';
import useReduxStore from '../../Hooks/UseReduxStore';
import {io} from 'socket.io-client'; // Import io directly
import {mergeIds} from '../../Services/GlobalFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL
const API_BASE_URL = GetChatListUrl;
const SOCKET_URL = 'https://messaging.theappforcowboys.com/'; // Use your socket URL

const useChatUserScreen = ({navigate, addListener}) => {
  const [asynUserData, setAsynUserData] = useState(null);
  const socketRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const {getState} = useReduxStore();
  const {userData} = getState('Auth');

  // Fetch user data from AsyncStorage
  const getUserData = async () => {
    const UserData = await AsyncStorage.getItem('userData');
    setAsynUserData(JSON.parse(UserData));
  };

  useEffect(() => {
    getUserData();
  }, []);

  const myId = userData?.id ?? asynUserData?.id;

  // Fetch chat list from Laravel API
  const {data, refetch} = useQuery({
    queryKey: ['chatList'],
    queryFn: () => API.get('/v1/chat/list'),
  });

  // Initialize Socket.io directly in useEffect
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });
    socketRef.current.on('connect', () => console.log('Socket connected'));
    socketRef.current.on('disconnect', () =>
      console.log('Socket disconnected'),
    );
    socketRef.current.on('error', err => console.error('Socket error:', err));

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
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
            unread_count:
              payload.message.sender_id !== myId
                ? (chat.unread_count || 0) + 1
                : chat.unread_count,
          };
          // Remove from old position and insert at top
          setChats(prevChats => {
            const newChats = prevChats.filter(
              c => c.conversation_id !== payload.conversation_id,
            );
            return [updatedChat, ...newChats];
          });
          if (payload.message.sender_id !== myId) {
            setUnreadCount(prev => prev + 1);
          }
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
      await API.delete(`${API_BASE_URL}/chat/${chatroomId}`);
      setChats(prevChats =>
        prevChats.filter(
          chat => mergeIds(chat.other_user.id, myId) !== chatroomId,
        ),
      );
      setUnreadCount(
        prev =>
          prev -
          (chats.find(chat => mergeIds(chat.other_user.id, myId) === chatroomId)
            ?.unread_count || 0),
      );
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
      setUnreadCount(0); // Reset unread count
    });
    return unsubscribe;
  }, []);

  return {
    messageList: chats,
    dynamicNav,
    users: chats,
    userData,
    onRefresh,
    deleteEntireChat,
  };
};

export default useChatUserScreen;
