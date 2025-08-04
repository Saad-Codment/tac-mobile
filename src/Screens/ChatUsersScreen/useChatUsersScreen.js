import {useQuery} from '@tanstack/react-query';
import API, {fetchGetWithToken} from '../../Utils/helperFunc';
import {GetChatListUrl} from '../../Utils/Urls';
import {useCallback, useEffect, useRef, useState} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  writeBatch,
} from 'firebase/firestore';
import {db} from '../../Services/FirebaseServicsConfig';
import {mergeIds} from '../../Services/GlobalFunctions';
import {store} from '../../Redux/Reducer';
import {types} from '../../Redux/types';

const useChatUserScreen = ({navigate, addListener}) => {
  const {data} = useQuery({
    queryKey: ['chatList'],
    queryFn: () => API.get(GetChatListUrl),
  });

  const [users, setUsers] = useState([]);

  const {getState, dispatch, queryClient} = useReduxStore();
  const {userData} = getState('Auth');
  const [unreadCount, setUnreadCount] = useState(0);

  const deleteEntireChat = async chatroomId => {
    try {
      if (!chatroomId) return false;

      // Recursive function to delete all messages in batches
      const deleteMessages = async nextQuery => {
        const snapshot = await getDocs(nextQuery);

        if (snapshot.empty) return;

        const batch = writeBatch(db);
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();

        // Recurse if there are more messages
        if (snapshot.docs.length === 300) {
          // Firebase limit per batch
          const lastDoc = snapshot.docs[snapshot.docs.length - 1];
          const newQuery = query(
            collection(db, 'messages', chatroomId, 'messages'),
            orderBy('__name__'),
            startAfter(lastDoc.id),
            limit(300),
          );
          await deleteMessages(newQuery);
        }
      };

      // Start with initial query
      const messagesQuery = query(
        collection(db, 'messages', chatroomId, 'messages'),
        limit(300),
      );
      await deleteMessages(messagesQuery);

      // Delete the main document
      await deleteDoc(doc(db, 'messages', chatroomId));
      await initializeChat();
      // updateState({ messages: [] });
      return true;
    } catch (error) {
      console.error('Error deleting chat:', error);
      return false;
    }
  };

  const fetchUsersAndMessages = async () => {
    try {
      const fetchedUsers = await fetchGetWithToken(GetChatListUrl);

      const unsubscribeFunctions = fetchedUsers.map(
        async (appointments, index) => {
          const chatroomDocRef = doc(
            db,
            'messages',
            mergeIds(appointments?.id?.toString(), userData?.id?.toString()),
          );
          const chatroomDocSnap = await getDoc(chatroomDocRef);

          if (chatroomDocSnap.exists()) {
            return listenForLastMessage(appointments, index);
          }
        },
      );
      setUsers(fetchedUsers);
      return () => {
        unsubscribeFunctions.forEach(unsub => unsub());
      };
    } catch (error) {
      console.error('Error fetching users or messages:', error);
    }
  };

  const listenForLastMessage = (appointment, index) => {
    const appId = appointment.id;
    const channelId = mergeIds(appId.toString(), userData?.id.toString());

    const messageRef = query(
      collection(db, 'messages', channelId, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(1),
    );

    const unsubscribe = onSnapshot(messageRef, querySnapshot => {
      if (querySnapshot.empty) return;

      const lastMessage = querySnapshot.docs[0]?.data();
      if (!lastMessage) return;

      // Update ONLY the user at the given index
      setUsers(prevUsers => {
        const updatedUsers = [...prevUsers];
        if (lastMessage.msgChannelId === channelId) {
          updatedUsers[index] = {
            ...updatedUsers[index],
            lastMessage,
          };
        }
        return updatedUsers;
      });

      // Unread logic (if needed)
      const isUnread =
        userData?.id === lastMessage?.receiver && lastMessage?.seen === 0;
      if (isUnread) {
        setUnreadCount(prev => prev + 1);
      }
    });

    return unsubscribe;
  };

  const clearNotification = () => {
    store.dispatch({type: types.isChatNotifyFalse});
  };

  useEffect(clearNotification, []);

  useEffect(() => {
    // Update unread count in Redux whenever unreadCount changes
    // dispatch(updateUnreadCount(unreadCount));
  }, [unreadCount]);

  const initializeChat = async () => {
    try {
      // Reset the unread count  when the Chat screen is focused
      //   dispatch(resetUnreadCount());
      queryClient.fetchQuery({
        queryKey: ['chatList'],
        staleTime: 1000,
      });
      await fetchUsersAndMessages();
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };
  useEffect(() => {
    const unsubscribe = addListener('focus', () => {
      initializeChat();
    });
    return unsubscribe;
  }, []);

  const onRefresh = useCallback(() => {
    initializeChat();
  }, []);

  const dynamicNav = (screenName, screenData) =>
    navigate(screenName, screenData);

  return {
    messageList: data?.data ?? [],
    dynamicNav,
    users,
    userData,
    onRefresh,
    deleteEntireChat,
    initializeChat,
  };
};

export default useChatUserScreen;
