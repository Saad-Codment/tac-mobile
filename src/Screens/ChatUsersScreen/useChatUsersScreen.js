import {useEffect, useRef, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {GetChatListUrl} from '../../Utils/Urls';
import useReduxStore from '../../Hooks/UseReduxStore';
import io from 'socket.io-client';
import {mergeIds} from '../../Services/GlobalFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual Socket.io backend URL
const SOCKET_URL = 'https://messaging.theappforcowboys.com/'; // e.g., 'https://your-chat-server.com'

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
    queryFn: () => API.get('v1/chat/list'),
  });

  // Initialize Socket.io
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
      socketRef.current.disconnect();
      setChats([]); // Clear chats on unmount
    };
  }, []);

  // Setup socket listeners and fetch chats
  useEffect(() => {
    if (myId && data?.data && data?.data.length > 0) {
      setChats(data.data.map(chat => ({...chat, isTyping: false})));

      console.log('Chat List Data:', data.data);
      // Join all chat rooms
      data.data.forEach(chat => {
        const roomId = mergeIds(chat.other_user.id, myId);
        socketRef.current.emit('join_room', {room: roomId, userId: myId});
      });

      // Socket listeners
      socketRef.current.on('newMessage', msg => {
        setChats(prevChats =>
          prevChats.map(chat => {
            const roomId = mergeIds(chat.other_user.id, myId);
            if (msg.room === roomId) {
              const isUnread = msg.sender !== myId && !msg.seen;
              return {
                ...chat,
                last_message: msg,
                unread_count: isUnread
                  ? (chat.unread_count || 0) + 1
                  : chat.unread_count,
              };
            }
            return chat;
          }),
        );
        if (msg.sender !== myId) {
          setUnreadCount(prev => prev + 1);
        }
      });

      socketRef.current.on('userTyping', ({room, userId, typing}) => {
        if (userId !== myId) {
          setChats(prevChats =>
            prevChats.map(chat => {
              const roomId = mergeIds(chat.other_user.id, myId);
              if (room === roomId) {
                return {...chat, isTyping: typing};
              }
              return {...chat, isTyping: false};
            }),
          );
        }
      });

      return () => {
        data?.data?.forEach(chat => {
          const roomId = mergeIds(chat?.other_user?.id, myId);
          socketRef.current.emit('leave_room', {room: roomId, userId: myId});
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
