import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {State, PanGestureHandler} from 'react-native-gesture-handler';
import {hp, wp} from '../Config/responsive';
import {imageUrl} from '../Utils/Urls';

const MessageShowComp = ({
  visible,
  onDismiss,
  onTap,
  senderAvatar,
  senderName,
  messagePreview,
  timestamp,
  unreadCount = 0,
  payload,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide out
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onDismiss());
    }
  }, [visible, translateY, onDismiss]);

  const handleGesture = ({nativeEvent}) => {
    if (nativeEvent.state === State.END && nativeEvent.translationY < -50) {
      onDismiss();
    }
  };

  if (!visible) return null;

  return (
    <PanGestureHandler onHandlerStateChange={handleGesture}>
      <Animated.View
        style={[styles.notificationBanner, {transform: [{translateY}]}]}>
        <TouchableOpacity
          style={styles.innerContainer}
          onPress={onTap}
          activeOpacity={0.8}>
          <View style={styles.avatarContainer}>
            {payload?.message?.sender?.profile_image && (
              <Image
                source={{
                  uri: imageUrl(payload?.message?.sender?.profile_image),
                }}
                style={styles.avatar}
                accessibilityLabel={`${payload?.message?.sender?.first_name}'s avatar`}
              />
            )}
          </View>
          <View style={styles.content}>
            <View style={styles.senderInfo}>
              <Text style={styles.senderName}>
                {payload?.message?.sender?.first_name}
              </Text>
            </View>
            <Text style={styles.messagePreview} numberOfLines={1}>
              {payload?.message?.type == 'text'
                ? payload?.message?.text
                : 'Shared Photos'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={onDismiss}
            accessibilityLabel="Dismiss notification">
            <Text style={styles.dismissText}>×</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  notificationBanner: {
    position: 'absolute',
    top: hp('6'),
    // left: '5%',
    width: wp('95'),
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 1000,
    marginHorizontal: wp('3'),
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e1e8ed',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff385c', // Instagram-like red
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  senderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
  },
  timestamp: {
    fontSize: 12,
    color: '#8e8e8e',
  },
  messagePreview: {
    fontSize: 14,
    color: '#262626',
    overflow: 'hidden',
  },
  dismissButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 8,
  },
  dismissText: {
    fontSize: 20,
    color: '#8e8e8e',
    fontWeight: '500',
  },
});

export default MessageShowComp;
