import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';
import {useMutation, useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {
  baseURL,
  getUserProfileUrl,
  SendChatNotificationUrl,
  sendMsgUrl,
  WhenUserInAndOutChatUrl,
} from '../../Utils/Urls';
import {mergeIds} from '../../Services/GlobalFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import RNFetchBlob from 'rn-fetch-blob';
import ImageCropPicker from 'react-native-image-crop-picker';

// Replace with your actual Socket.io backend URL
const SOCKET_URL = 'https://messaging.theappforcowboys.com/'; // e.g., 'https://your-chat-server.com'

// Laravel API base URL (replace with your actual URL)
const API_BASE_URL = baseURL; // e.g., 'https://your-laravel-api.com'

// Helper function to format timestamp for last seen
const formatLastSeen = timestamp => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString(); // e.g., "10/14/2025, 2:14 AM"
};

// Socket.io Functions
const initSocket = () => {
  const socket = io(SOCKET_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
  });
  socket.on('connect', () => console.log('Socket connected'));
  socket.on('disconnect', () => console.log('Socket disconnected'));
  socket.on('error', err => console.error('Socket error:', err));
  return socket;
};

const joinRoom = (
  socket,
  room,
  userId,
  onNewMessage,
  onUserTyping,
  onMessageSeen,
) => {
  socket.emit('join_room', {room, userId});

  socket.on('newMessage', msg => {
    if (msg.sender !== userId) {
      onNewMessage(msg);
      socket.emit('messageSeen', {room, messageId: msg.id, userId});
    }
  });

  socket.on('userTyping', ({userId: senderId, typing}) => {
    if (senderId !== userId) {
      onUserTyping(typing);
    }
  });

  socket.on('messageSeen', ({messageId}) => {
    onMessageSeen(messageId);
  });
};

const leaveRoom = (socket, room, userId) => {
  socket.emit('leave_room', {room, userId});
  socket.off('newMessage');
  socket.off('userTyping');
  socket.off('messageSeen');
};

const publishTyping = (socket, room, userId, typing) => {
  socket.emit('publish', {
    event: `typing.${typing ? 'start' : 'stop'}`,
    userId,
    room,
  });
};

const pickAndSendMedia = (socket, room, sender, onMessageSent) => {
  ImageCropPicker.openPicker({
    multiple: true,
    mediaType: 'any',
    cropping: false,
  })
    .then(files => {
      files.forEach(file => {
        RNFetchBlob.fs
          .readFile(file.path, 'base64')
          .then(base64 => {
            const type = file.mime.startsWith('image/') ? 'image' : 'video';
            const msg = {
              id: `${sender}_${Date.now()}_${Math.random()}`,
              type,
              content: base64,
              mime: file.mime,
              sender,
              timestamp: Date.now(),
              seen: false,
            };
            socket.emit('chat_message', {room, message: msg});
            onMessageSent(msg);
          })
          .catch(err => console.error('Error reading file:', err));
      });
    })
    .catch(err => console.error('Error picking media:', err));
};

const useChatScreen = ({navigate}, {params}) => {
  const [asynUserData, setAsynUserData] = useState(null);
  const socketRef = useRef(null);
  const [chatState, setChatState] = useState({
    messages: [],
    message: '',
    chatroomId: params?.conversationId,
    isTyping: false,
    lastSeenMessageId: null,
    page: 1,
    hasMore: true,
    isLoadingMessages: false,
  });

  const {
    messages,
    message,
    chatroomId,
    isTyping,
    lastSeenMessageId,
    page,
    hasMore,
    isLoadingMessages,
  } = chatState;

  const updateState = data => setChatState(prev => ({...prev, ...data}));

  const {getState} = useReduxStore();
  const userData = getState('Auth');
  const {id, userId: paramUserId} = params; // id: other user's ID, paramUserId: optional user ID

  const myId = userData?.userData?.id ?? paramUserId ?? asynUserData?.id;

  // Fetch user data from AsyncStorage
  const getUserData = async () => {
    const UserData = await AsyncStorage.getItem('userData');
    setAsynUserData(JSON.parse(UserData));
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Initialize Socket.io
  useEffect(() => {
    socketRef.current = initSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      updateState({messages: []}); // Clear messages on unmount
    };
  }, []);

  // Fetch other user and last seen message ID
  const {data: otherUserData} = useQuery({
    queryKey: ['otherUser', chatroomId],
    queryFn: () => API.get(`v1/chat/${chatroomId}/participants`),
    enabled: !!chatroomId,
  });

  console.log('Other User Data:', otherUserData?.data);

  // Fetch messages (paginated)
  const fetchMessages = async pageNum => {
    try {
      updateState({isLoadingMessages: true});
      const response = await API.get(
        `v1/chat/${chatroomId}/messages?page=${pageNum}`,
      );
      const newMessages = response.data.data;
      console.log('API Response for Messages:', response?.data);
      const hasMoreMessages = response.data.has_more;
      console.log('Fetched Messages:', response?.data);
      updateState({
        messages: pageNum === 1 ? newMessages : [...newMessages, ...messages],
        hasMore: false,
        page: pageNum,
      });

      if (pageNum === 1) {
        handleAutoScroll();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      updateState({isLoadingMessages: false});
    }
  };

  // Mark messages as seen
  const {mutate: markMessagesAsSeen} = useMutation({
    mutationFn: () => API.post(`v1/chat/${chatroomId}/seen`),
    onSuccess: () => {
      console.log('Messages marked as seen');
    },
  });

  // Send message
  const {mutate: sendMessageMutation} = useMutation({
    mutationFn: body => API.post(sendMsgUrl, body),
    onSuccess: response => {
      const msg = response.data;
      console.log('Message sent:', response?.data);
      socketRef.current.emit('chat_message', {room: chatroomId, message: msg});
      updateState({messages: [...messages, msg], message: ''});
      publishTyping(socketRef.current, chatroomId, myId, false);
    },
  });

  // Notify user in/out
  const {mutateAsync} = useMutation({
    mutationFn: () => API.post(WhenUserInAndOutChatUrl, {user_id: id}),
    onSuccess: ({ok, data}) => {
      console.log('User in/out updated:', data);
    },
  });

  // Join room and set up socket listeners
  useEffect(() => {
    if (id && myId) {
      const roomId = mergeIds(id, myId);
      // updateState({chatroomId: roomId});

      joinRoom(
        socketRef.current,
        roomId,
        myId,
        msg => updateState({messages: [...messages, {...msg, seen: false}]}),
        typing => updateState({isTyping: typing}),
        messageId => {
          updateState({
            lastSeenMessageId: messageId,
            messages: messages.map(msg =>
              msg.id === messageId ? {...msg, seen: true} : msg,
            ),
          });
        },
      );

      fetchMessages(1); // Load initial messages
      markMessagesAsSeen(); // Mark messages as seen on entry

      return () => {
        leaveRoom(socketRef.current, roomId, myId);
      };
    }
  }, [id, myId]);

  // Handle typing
  const typingTimeoutRef = useRef(null);
  const handleTyping = text => {
    updateState({message: text});
    if (text.trim()) {
      publishTyping(socketRef.current, chatroomId, myId, true);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        publishTyping(socketRef.current, chatroomId, myId, false);
      }, 2000);
    } else {
      publishTyping(socketRef.current, chatroomId, myId, false);
    }
  };

  // Send text message
  const sendMessage = () => {
    if (message.trim() && chatroomId && myId) {
      sendMessageMutation({
        receiver_id: id,
        text: message,
      });
    }
  };

  // Send media messages
  const handlePickAndSendMedia = () => {
    if (chatroomId && myId) {
      pickAndSendMedia(socketRef.current, chatroomId, myId, msg =>
        updateState({messages: [...messages, msg]}),
      );
    }
  };

  // Handle scroll for pagination
  const scrollViewRef = useRef();
  const handleScroll = e => {
    const {contentOffset} = e.nativeEvent;
    if (contentOffset.y <= 0 && hasMore && !isLoadingMessages) {
      fetchMessages(page + 1);
    }
  };

  const handleAutoScroll = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: false});
    }
  };

  useLayoutEffect(() => {
    if (page === 1) {
      handleAutoScroll();
    }
  }, [messages]);

  useEffect(() => {
    mutateAsync();
    return () => {
      mutateAsync();
    };
  }, []);

  return {
    sendMessage,
    message,
    allMessages: messages,
    userData: userData?.userData,
    receiverData: otherUserData?.data?.other_user,
    handleAutoScroll,
    handleScroll,
    isLoading: isLoadingMessages,
    id,
    scrollViewRef,
    setMessage: handleTyping,
    pickAndSendMedia: handlePickAndSendMedia,
    isTyping,
    lastSeenMessageId: otherUserData?.data?.last_read_message_id,
    lastSeen: formatLastSeen(otherUserData?.data?.last_seen_timestamp),
  };
};

export default useChatScreen;
