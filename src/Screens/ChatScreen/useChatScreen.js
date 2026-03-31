import {useCallback, useEffect, useRef, useState} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';
import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import API, {formDataFunc} from '../../Utils/helperFunc';
import {
  baseURL,
  getConversationIdUrl,
  getUserProfileUrl,
  SendChatNotificationUrl,
  sendMsgUrl,
  socketURL,
  WhenUserInAndOutChatUrl,
} from '../../Utils/Urls';
import {
  mergeIds,
  sortChatsByCreatedAt,
  uploadFromCamera,
  uploadFromGalary,
} from '../../Services/GlobalFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import {loadingFalse} from '../../Redux/Action/isloadingAction';
import initSocket from '../../Services/SocketServices'; // Use only initSocket
import {io} from 'socket.io-client';
import axios from 'axios';
import {set} from 'react-hook-form';
import {Alert} from 'react-native';
import {types} from '../../Redux/types';

// API base URL
const API_BASE_URL = baseURL;

const formatLastSeen = timestamp => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString(); // e.g., "10/15/2025, 10:07 PM"
};

const useChatScreen = ({navigate}, {params}) => {
  const socketRef = useRef(null);
  const [asynUserData, setAsynUserData] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [images, setImages] = useState([]);
  const typingTimeoutRef = useRef(null);
  const [pagesLoaded, setPagesLoaded] = useState(1);
  const [isSeenTrue, setIsSeenTrue] = useState(false);
  const [isShowFlat, setIsShowFlat] = useState(false);

  const {getState, dispatch} = useReduxStore();
  const {userData, token} = getState('Auth');
  const {id, userId: paramUserId} = params; // id: other user's ID, paramUserId: optional
  const myId = userData?.id ?? paramUserId ?? asynUserData?.id;

  // Fetch user data from AsyncStorage
  const getUserData = async () => {
    const UserData = await AsyncStorage.getItem('userData');
    setAsynUserData(JSON.parse(UserData));
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Initialize Socket.io using initSocket from separate file
  useEffect(() => {
    if (myId) {
      socketRef.current = io(socketURL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
      });
      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current.id);
        // Re-join room on reconnect if conversationId exists
        if (params?.conversationId) {
          socketRef.current.emit('join', mergeIds(myId, id));
        }
      });
      socketRef.current.on('disconnect', () =>
        console.log('Socket disconnected'),
      );
      socketRef.current.on('error', err => console.error('Socket error:', err));
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [myId, id, params?.conversationId]);

  // Fetch other participant
  const {data: otherUserData} = useQuery({
    queryKey: ['otherUser', params?.conversationId],
    queryFn: () => API.get(`/v1/chat/${params?.conversationId}/participants`),
    enabled: !!params?.conversationId,
    retry: 5,
  });

  const receiverData = otherUserData?.data?.other_user;

  // Fetch messages (paginated)
  // const fetchMessages = async (pageNum = 1) => {
  //   useFetchMessages();
  // };
  // // Fetch messages (paginated)
  const fetchMessages = async (pageNum = 1) => {
    try {
      setIsLoading(true);
      dispatch(loadingFalse());
      const response = await API.get(
        `/v1/chat/${params?.conversationId}/messages?page=${pagesLoaded}`,
      );
      setPagesLoaded(prev => prev + 1);
      const newMessages = response.data.data;
      const hasMore = !!response.data.next_page_url;
      return {
        messages: pageNum === 1 ? newMessages : [...messages, ...newMessages],
        hasMore,
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return {messages: [], hasMore: false};
    } finally {
      setIsLoading(false);
    }
  };

  // Initial message fetch
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (params?.conversationId) {
      fetchMessages(1).then(({messages: newMessages}) =>
        setMessages(sortChatsByCreatedAt(newMessages, 'asc')),
      );
      setTimeout(() => {
        scrollViewRef?.current?.scrollToEnd({animated: true});
        setTimeout(() => {
          setIsShowFlat(true);
        }, 1000);
      }, 2000);
    }
  }, [params?.conversationId]);

  // Mark messages as seen
  const {mutate: markMessagesAsSeen} = useMutation({
    mutationFn: () => {
      dispatch(loadingFalse());
      return API.post(`/v1/chat/${params?.conversationId}/seen`);
    },
    onSuccess: () => console.log('Messages marked as seen'),
  });

  // Send message
  const {mutateAsync: sendMessageMutation} = useMutation({
    mutationFn: body => {
      const bodyData = {
        receiver_id: id,
        text: body.text || '',
        images: body?.images || [],
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      console.log('bodyDatabodyDatabodyData', body?.images);
      // if (body.text) formData.append('text', body.text);
      return formDataFunc(sendMsgUrl, bodyData, 'images', true);
    },
    onSuccess: response => {
      console.log('Message sent:', response.data);
      if (response?.ok && response.data) {
        const msg = response.data;
        setMessages(prev => [...prev, msg]);
        socketRef.current.emit('chat_message', {
          conversation_id: params?.conversationId,
          message: msg,
        });
        setIsSeenTrue(false);
        // setMessage('');
      }
    },
  });

  // Notify user in/out
  // const {mutateAsync} = useMutation({
  //   mutationFn: () => API.post(WhenUserInAndOutChatUrl, {user_id: id}),
  //   onSuccess: ({ok, data}) => console.log('User in/out updated:', data),
  // });

  // Socket listeners
  useEffect(() => {
    if (params?.conversationId && socketRef.current) {
      console.log(
        'Setting up socket listeners for conversation:',
        params?.conversationId,
      );
      socketRef.current.emit('join', userData?.id); // Join the room based on conversation
      console.log('Socket is connected, setting up event listeners');
      socketRef.current.on('newMessage', data => {
        console.log('New message received:', data);
        if (
          data.conversation_id == params?.conversationId &&
          data.message.sender != myId
        ) {
          setMessages(prev =>
            sortChatsByCreatedAt([...prev, data.message], 'asc'),
          );
          dispatch(loadingFalse());
          markMessagesAsSeen();
          dispatch(loadingFalse());
        }
      });

      socketRef.current.on('userTyping', data => {
        console.log('Typing event received:', data);
        if (data.sender_id === id) {
          setIsTyping(data.isTyping); // Update based on backend payload
        }
      });

      socketRef.current.on('messageSeen', data => {
        console.log('Message seen event:', data);
        setIsSeenTrue(true);
        if (data.conversation_id == params?.conversationId) {
          // Seen state can be updated if backend provides last_read_message_id
        }
      });
      return () => {
        socketRef.current.off('newMessage');
        socketRef.current.off('userTyping');
        socketRef.current.off('messageSeen');
        socketRef.current.emit('leave', userData?.id); // Leave the room on cleanup
      };
    }
  }, [params?.conversationId, myId, id]);

  // Handle typing
  const handleTyping = async text => {
    setMessage(text);
    if (text.trim()) {
      await axios
        .post(`${socketURL}publish`, {
          type: 'typing.start',
          payload: {
            sender_id: parseInt(myId, 10),
            receiver_id: parseInt(id, 10),
          },
          headers: {
            Authorization: `Bearer ${token}`, // your token here
            'Content-Type': 'application/json', // optional but good practice
          },
        })
        .catch(err => console.error('Publish error:', err));
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(async () => {
        await axios
          .post(`${socketURL}publish`, {
            type: 'typing.stop',
            payload: {
              sender_id: parseInt(myId, 10),
              receiver_id: parseInt(id, 10),
            },
            headers: {
              Authorization: `Bearer ${token}`, // your token here
              'Content-Type': 'application/json', // optional but good practice
            },
          })
          .catch(err => console.error('Publish error:', err));
      }, 2000);
    } else if (!text) {
      await axios
        .post(`${socketURL}publish`, {
          type: 'typing.stop',
          payload: {
            sender_id: parseInt(myId, 10),
            receiver_id: parseInt(id, 10),
          },
          headers: {
            Authorization: `Bearer ${token}`, // your token here
            'Content-Type': 'application/json', // optional but good practice
          },
        })
        .catch(err => console.error('Publish error:', err));
    }
  };

  // Send message
  const sendMessage = async msg => {
    if (message.trim() && params?.conversationId) {
      await sendMessageMutation({text: message ?? msg, images});
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  };

  const pickAndSendMediaSocket = async isCamera => {
    const imgData = isCamera
      ? await uploadFromCamera(true, false, 5)
      : await uploadFromGalary(true, false, 5);
    await sendMessageMutation({
      text: '',
      images: imgData?.uri ? [imgData] : imgData,
    });
    scrollViewRef.current.scrollToEnd({animated: true});
  };

  // Handle scroll for pagination
  const scrollViewRef = useRef();
  const handleScroll = e => {
    const {contentOffset} = e.nativeEvent;
    if (contentOffset.y <= 0 && !isLoading) {
      fetchMessages(2).then(({messages: newMessages, hasMore}) => {
        if (hasMore) setMessages(sortChatsByCreatedAt(newMessages, 'asc'));
      });
    }
  };

  const onRefresh = () => {
    fetchMessages(2).then(({messages: newMessages, hasMore}) => {
      if (hasMore) setMessages(sortChatsByCreatedAt(newMessages, 'asc'));
    });
  };

  const handleAutoScroll = useCallback(() => {
    // if (scrollViewRef.current && messages.length > 0 && pagesLoaded == 2) {
    //   scrollViewRef.current.scrollToEnd({animated: true});
    //   // scrollViewRef.current.scrollToEnd({animated: true});
    // }
  }, [pagesLoaded]);

  useEffect(() => {
    if (params?.conversationId) {
      markMessagesAsSeen();
    }
    // mutateAsync();
    // return () => mutateAsync();
  }, [params?.conversationId]);

  return {
    sendMessage,
    setMessage: handleTyping,
    handleAutoScroll,
    handleScroll,
    isLoading,
    scrollViewRef,
    message,
    allMessages: messages, // Return current messages state for FlatList
    userData,
    receiverData,
    pickAndSendMedia: () => {
      Alert.alert(
        'Pick to choose image',
        '',
        [
          {
            text: 'Camera',
            onPress: () => {
              pickAndSendMediaSocket(true);
            },
          },
          {
            text: 'Gallery', // Just a dismissal button
            onPress: async () => {
              pickAndSendMediaSocket();
            },
          },
          {
            text: 'Cancel', // Just a dismissal button
            style: 'destructive',
            onPress: async () => {
              // console.log(
              //   'slkdbvklsdbvklsdbklvbskdlv',
              //   value?.length,
              // );
              // const imgData = await uploadFromGalary(
              //   true,
              //   false,
              //   Math.max(0, 5 - (value?.length ?? 0)),
              // );
              // onChange([...(value ?? []), ...imgData]);
            },
          },
        ],
        {cancelable: true},
      );
    },
    isTyping, // Use local isTyping state updated by socket
    lastSeenMessageId: otherUserData?.data?.last_read_message_id || null,
    lastSeen: formatLastSeen(otherUserData?.data?.last_seen_timestamp),
    isSeenTrue,
    onRefresh,
    isShowFlat,
    setIsShowFlat,
    onImagePress: item => {
      dispatch({
        payload: item?.metadata?.files,
        type: types.openModal,
      });
    },
  };
};

export default useChatScreen;
