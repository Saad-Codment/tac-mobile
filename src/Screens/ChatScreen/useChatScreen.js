import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';
import {useMutation, useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {
  getUserProfileUrl,
  SendChatNotificationUrl,
  WhenUserInAndOutChatUrl,
} from '../../Utils/Urls';
import {mergeIds} from '../../Services/GlobalFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import RNFetchBlob from 'rn-fetch-blob';
import ImageCropPicker from 'react-native-image-crop-picker';

// Replace with your actual Socket.io backend URL
const SOCKET_URL = 'YOUR_BACKEND_URL_HERE'; // e.g., 'https://your-chat-server.com'

const formatLastSeen = timestamp => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString(); // e.g., "8/15/2025, 10:10 PM"
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
  onUserOnline,
  onUserOffline,
  onMessageSeen,
) => {
  socket.emit('join_room', {room, userId});

  socket.on('new_message', msg => {
    if (msg.sender !== userId) {
      onNewMessage(msg);
      socket.emit('message_seen', {room, messageId: msg.id, userId});
    }
  });

  socket.on('user_online', data => {
    if (data.userId !== userId) {
      onUserOnline(data);
    }
  });

  socket.on('user_offline', data => {
    if (data.userId !== userId) {
      onUserOffline(data);
    }
  });

  socket.on('message_seen', ({messageId}) => {
    onMessageSeen(messageId);
  });
};

const leaveRoom = (socket, room, userId) => {
  socket.emit('leave_room', {room, userId});
  socket.off('new_message');
  socket.off('user_online');
  socket.off('user_offline');
  socket.off('message_seen');
};

const sendChatMessage = (socket, room, message) => {
  socket.emit('chat_message', {room, message});
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
            sendChatMessage(socket, room, msg);
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

  const getUserData = async () => {
    const UserData = await AsyncStorage.getItem('userData');
    setAsynUserData(JSON.parse(UserData));
  };

  useEffect(() => {
    getUserData();
  }, []);

  const [chatState, setChatState] = useState({
    messages: [],
    message: '',
    chatroomId: '',
    otherUserOnline: false,
    lastSeen: null,
  });

  const {message, messages, chatroomId, otherUserOnline, lastSeen} = chatState;

  const updateState = data => setChatState(prev => ({...prev, ...data}));

  const {getState} = useReduxStore();
  const userData = getState('Auth');
  const {id, userId: paramUserId} = params;

  const myId = userData?.userData?.id ?? paramUserId ?? asynUserData?.id;

  useEffect(() => {
    socketRef.current = initSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      updateState({messages: []}); // Clear messages on unmount
    };
  }, []);

  useEffect(() => {
    if (id && myId) {
      const roomId = mergeIds(id, myId);
      updateState({chatroomId: roomId});

      joinRoom(
        socketRef.current,
        roomId,
        myId,
        msg => updateState({messages: [...messages, {...msg, seen: false}]}),
        () => updateState({otherUserOnline: true}),
        ({timestamp}) =>
          updateState({otherUserOnline: false, lastSeen: timestamp}),
        messageId => {
          updateState({
            messages: messages.map(msg =>
              msg.id === messageId ? {...msg, seen: true} : msg,
            ),
          });
        },
      );

      return () => {
        leaveRoom(socketRef.current, roomId, myId);
      };
    }
  }, [id, myId, messages]);

  const {data} = useQuery({
    queryKey: ['userData'],
    queryFn: () => API.get(getUserProfileUrl + id),
  });

  const {mutate} = useMutation({
    mutationFn: body => {
      return API.post(SendChatNotificationUrl, {
        id,
        message: body?.msg,
        user_id: id,
      });
    },
    onSuccess: ({ok, data}) => {
      console.log('Notification sent:', data);
    },
  });

  const {mutateAsync} = useMutation({
    mutationFn: () => {
      return API.post(WhenUserInAndOutChatUrl, {
        user_id: id,
      });
    },
    onSuccess: ({ok, data}) => {
      console.log('User in/out updated:', data);
    },
  });

  const sendMessage = () => {
    if (message.trim() && chatroomId && myId) {
      const msg = {
        id: `${myId}_${Date.now()}_${Math.random()}`,
        type: 'text',
        content: message,
        sender: myId,
        timestamp: Date.now(),
        seen: false,
      };
      sendChatMessage(socketRef.current, chatroomId, msg);
      updateState({messages: [...messages, msg], message: ''});
      mutate({msg: message});
    }
  };

  const handlePickAndSendMedia = () => {
    if (chatroomId && myId) {
      pickAndSendMedia(socketRef.current, chatroomId, myId, msg =>
        updateState({messages: [...messages, msg]}),
      );
    }
  };

  const scrollViewRef = useRef();
  const handleAutoScroll = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: false});
    }
  };

  useLayoutEffect(() => {
    handleAutoScroll();
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
    receiverData: data?.data,
    handleAutoScroll,
    isLoading: false,
    id,
    scrollViewRef,
    setMessage: e => updateState({message: e}),
    pickAndSendMedia: handlePickAndSendMedia,
    otherUserOnline,
    lastSeen: formatLastSeen(lastSeen),
  };
};

export default useChatScreen;
