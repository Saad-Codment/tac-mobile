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
import RNFetchBlob from 'rn-fetch-blob';
import ImageCropPicker from 'react-native-image-crop-picker';

// Helper function to format timestamp for last seen
const formatLastSeen = timestamp => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString(); // e.g., "8/15/2025, 10:10 PM"
};

// Simulate receiving a message from the other user
const simulateReceivedMessage = (receiverId, onMessageReceived) => {
  const simulatedMessage = {
    id: `${receiverId}_${Date.now()}_${Math.random()}`,
    type: 'text',
    content: 'Hello! This is a simulated reply.',
    sender: receiverId,
    timestamp: Date.now(),
    seen: false,
  };
  onMessageReceived(simulatedMessage);
};

// Simulate marking messages as seen after a delay
const simulateMessageSeen = (messages, userId, onMessageSeen) => {
  messages.forEach(msg => {
    if (msg.sender === userId && !msg.seen) {
      setTimeout(() => {
        onMessageSeen(msg.id);
      }, 2000); // Simulate 2-second delay for seen status
    }
  });
};

// Simulate other user's online/offline status
const simulateUserStatus = (onUserOnline, onUserOffline) => {
  onUserOnline();
  setTimeout(() => {
    onUserOffline({timestamp: Date.now()});
  }, 10000); // Simulate offline after 10 seconds
};

// Pick and send multiple images/videos as separate messages
const pickAndSendMedia = (sender, onMessageSent) => {
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
            onMessageSent(msg);
          })
          .catch(err => console.error('Error reading file:', err));
      });
    })
    .catch(err => console.error('Error picking media:', err));
};

const useChatScreen = ({navigate}, {params}) => {
  const [asynUserData, setAsynUserData] = useState(null);

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

  // Set chatroomId and simulate other user's behavior
  useEffect(() => {
    if (id && myId) {
      const roomId = mergeIds(id, myId);
      updateState({chatroomId: roomId});

      // Simulate other user's online status
      simulateUserStatus(
        () => updateState({otherUserOnline: true}),
        data => updateState({otherUserOnline: false, lastSeen: data.timestamp}),
      );

      // Simulate receiving a message after 3 seconds
      const receiveTimer = setTimeout(() => {
        simulateReceivedMessage(id, msg => {
          updateState({messages: [...messages, msg]});
        });
      }, 3000);

      // Simulate marking sender's messages as seen
      simulateMessageSeen(messages, myId, messageId => {
        updateState({
          messages: messages.map(msg =>
            msg.id === messageId ? {...msg, seen: true} : msg,
          ),
        });
      });

      return () => {
        clearTimeout(receiveTimer);
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
      updateState({messages: [...messages, msg], message: ''});
      mutate({msg: message});

      // Simulate marking this message as seen after a delay
      setTimeout(() => {
        updateState({
          messages: messages.map(m =>
            m.id === msg.id ? {...m, seen: true} : m,
          ),
        });
      }, 2000);
    }
  };

  const handlePickAndSendMedia = () => {
    if (chatroomId && myId) {
      pickAndSendMedia(myId, msg => {
        updateState({messages: [...messages, msg]});
        // Simulate marking media message as seen after a delay
        setTimeout(() => {
          updateState({
            messages: messages.map(m =>
              m.id === msg.id ? {...m, seen: true} : m,
            ),
          });
        }, 2000);
      });
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
      updateState({messages: []}); // Clear messages on unmount
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
