import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {db} from '../../Services/FirebaseServicsConfig';
import {useMutation, useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {
  getUserProfileUrl,
  GetUserUrl,
  SendChatNotificationUrl,
  SendNotiONChatUrl,
  UpdateChatNotiUrl,
  WhenUserInAndOutChatUrl,
} from '../../Utils/Urls';
import {mergeIds} from '../../Services/GlobalFunctions';
import {updateChatState} from './ChatReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const STATE = {
//   messages: [],
//   message: '',
//   chatroomId: 10,
//   isLoading: false,
// };

// const actionMap = {
//   updateReducer: (state, act) => {
//     return {
//       ...state,
//       [act.payload.key]: act.payload.data,
//     };
//   },
//   emptyState: () => STATE,
// };

// const reducer = (state, action) => {
//   const handler = actionMap[action.type];
//   return handler ? handler(state, action) : state;
// };

const useChatScreen = ({navigate}, {params}) => {
  const [asynUserData, setAsynUserData] = useState(null);

  const getUserData = async () => {
    const UserData = await AsyncStorage.getItem('userData');
    setAsynUserData(UserData);
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Memoize initialState to prevent recreation
  // const initialState = useMemo(
  //   () => ({
  //     messages: [],
  //     message: '',
  //     chatroomId: '',
  //     isLoading: false,
  //   }),
  //   [],
  // );

  const [chatState, setChatState] = useState({
    messages: [],
    message: '',
    chatroomId: '',
    isLoading: false,
  });

  const {chatroomId, message, messages, isLoading} = chatState;

  const updateState = data => setChatState(prev => ({...prev, ...data}));

  // Memoize reducer to prevent recreation
  // const reducer = useCallback((state, action) => {
  //   const handler = actionMap[action.type];
  //   return handler ? handler(state, action) : state;
  // }, []);

  // const [state, dispatch] = useReducer(reducer, initialState);

  let regexp = /^(?![\s\b]+$).+/gm;

  const {getState} = useReduxStore();

  // const [state, dispatch] = useReducer(reducer, STATE);

  // const {messages, message, chatroomId} = getState('Chat'); // Replace 'Chat' with your slice name

  const userData = getState('Auth');
  const isMounted = useRef(true);
  console.log('userIduserIduserIduserIduserIduserIduserIduserIduserId', params);

  const {id, userId} = params;
  var mergeId = undefined;
  setTimeout(() => {
    mergeId = mergeIds(
      id,
      userData?.userData?.id ?? userId ?? asynUserData?.id,
    );
  }, 1000);

  const {data} = useQuery({
    queryKey: ['userData'],
    queryFn: () => API.get(getUserProfileUrl + id),
  });

  useEffect(() => {
    if (id && (userData?.userData?.id ?? userId ?? asynUserData?.id)) {
      const mergeId = mergeIds(
        id,
        userData?.userData?.id ?? userId ?? asynUserData?.id,
      );
      selectUser(mergeId.toString());
      // dispatch(updateChatState({key: 'chatroomId', data: mergeId.toString()}));
      updateState({chatroomId: mergeId.toString()});
      // dispatch({
      //   type: 'updateReducer',
      //   payload: {key: 'chatroomId', data: mergeId.toString()},
      // });
      // dispatch({
      //   type: 'updateReducer',
      //   payload: {
      //     key: 'chatroomId',
      //     data: mergeId.toString(),
      //   },
      // });
    }
  }, [mergeId, id, userData?.userData?.id ?? userId]);

  const selectUser = async jodId => {
    try {
      // Reference to the main chatroom document
      const chatroomDocRef = doc(db, 'messages', jodId);

      // Check if the chatroom document exists
      const chatroomDocSnap = await getDoc(chatroomDocRef);

      // If it doesn't exist, create it with an empty messages array
      if (!chatroomDocSnap.exists()) {
        await setDoc(chatroomDocRef, {messages: []});
      }

      // Query to get the last message sent by the user
      const lastMessageQuery = query(
        collection(db, 'messages', jodId, 'messages'), // corrected path
        where(
          'sender',
          '==',
          userData?.userData?.id ?? userId ?? asynUserData?.id,
        ),
        orderBy('createdAt', 'desc'),
        limit(1),
      );

      const querySnapshot = await getDocs(lastMessageQuery);

      // If a message exists, mark it as seen
      if (!querySnapshot.empty) {
        const lastMessageDoc = querySnapshot.docs[0];

        const messageRef = doc(
          db,
          'messages',
          jodId, // corrected path
          'messages',
          lastMessageDoc.id,
        );

        await updateDoc(messageRef, {seen: '1'});
      }

      // Query to listen for all messages ordered by creation time
      const messagesQuery = query(
        collection(chatroomDocRef, 'messages'),
        orderBy('createdAt'),
      );

      const unsubscribe = onSnapshot(messagesQuery, snapshot => {
        const messagesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        // dispatch(updateChatState({key: 'message', data: messagesList}));
        updateState({messages: messagesList});
        // dispatch({
        //   type: 'updateReducer',
        //   payload: {
        //     key: 'messages',
        //     data: messagesList,
        //   },
        // });
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error in selectUser:', error.message);

      // Optional: Log the full error for more context
      console.log(error);

      // Firebase will usually include a URL to create the index
      // in error.message if it's related to indexing
    }
  };

  const {mutate} = useMutation({
    mutationFn: body => {
      return API.post(SendChatNotificationUrl, {
        id,
        message: body?.msg,
        user_id: id,
      });
    },
    onSuccess: ({ok, data}) => {
      console.log('jksdbvjksdkbvdjksbvjkldsjklvbdsklvbdlvks', data);
    },
  });
  const {mutateAsync} = useMutation({
    mutationFn: body => {
      return API.post(WhenUserInAndOutChatUrl, {
        user_id: id,
      });
    },
    onSuccess: ({ok, data}) => {
      console.log('jksdbvjksdkbvdjksbvjkldsjklvbdsklvbdlvks', data);
    },
  });

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        const fullName =
          userData?.userData?.first_name && userData?.userData?.last_name
            ? `${userData?.userData.first_name} ${userData?.userData.last_name}`
            : userData?.userData?.first_name || 'Unknown';

        // if (!userData?.id || !chatroomId || !id) {
        //   console.log('Missing required fields', {
        //     userData: userData?.userData?.id ?? userId ?? asynUserData?.id,
        //     chatroomId,
        //     receiverId: id,
        //   });
        //   return;
        // }

        const messagePayload = {
          text: message,
          sender: userData?.userData?.id ?? userId ?? asynUserData?.id,
          receiver: id,
          user: fullName,
          seen: 0,
          createdAt: serverTimestamp(),
          msgChannelId: mergeIds(
            id,
            userData?.userData?.id ?? userId ?? asynUserData?.id,
          ),
        };

        console.log('Final payload to Firestore:', messagePayload);

        await setDoc(
          doc(collection(db, 'messages', chatroomId, 'messages')),
          messagePayload,
        );
        // dispatch(updateChatState({key: 'message', data: ''}));
        updateState({message: ''});
        // dispatch({
        //   type: 'updateReducer',
        //   payload: {
        //     key: 'message',
        //     data: '',
        //   },
        // });
        mutate({
          msg: message,
        });
      } catch (error) {
        console.error('Error adding message: ', error);
      }
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
  }, []);

  useEffect(() => {
    mutateAsync();
    return () => {
      mutateAsync();
    };
  }, []);

  return {
    sendMessage,
    message,
    allMessages: messages ?? [],
    userData: userData?.userData,
    receiverData: data?.data,
    handleAutoScroll,
    regexp,
    isLoading,
    id,
    scrollViewRef,
    setMessage: e => {
      // dispatch(updateChatState({key: 'message', data: e}));
      updateState({message: e});
      // dispatch({
      //   type: 'updateReducer',
      //   payload: {
      //     key: 'message',
      //     data: e,
      //   },
      // });
    },
  };
};

export default useChatScreen;
