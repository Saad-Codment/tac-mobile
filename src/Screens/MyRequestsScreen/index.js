import React, {memo} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {Touchable} from '../../Components/Touchable';
import {Colors} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import useMyRequestsScreen from './useMyRequestsScreen';
import {styles} from './styles';

const STATUS_META = {
  pending: {label: 'Pending', color: '#F59E0B'},
  confirmed: {label: 'Confirmed', color: '#22C55E'},
  rejected: {label: 'Rejected', color: '#EF4444'},
  cancelled: {label: 'Cancelled', color: '#6B7280'},
};

const formatDate = str => {
  if (!str) return '—';
  const d = new Date(str);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
};

const RequestCard = ({request, onPress, onCancel}) => {
  const statusMeta = STATUS_META[request.status] ?? {
    label: request.status,
    color: '#6B7280',
  };
  const canCancel =
    request.status === 'pending' || request.status === 'confirmed';

  return (
    <Touchable onPress={() => onPress(request)} style={styles.card}>
      <View style={styles.cardHeader}>
        <TextComponent
          text={request?.trip?.name ?? 'Trip'}
          styles={styles.cardTitle}
          numberOfLines={1}
        />
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: statusMeta.color + '18'},
          ]}>
          <TextComponent
            text={statusMeta.label}
            styles={[styles.statusBadgeText, {color: statusMeta.color}]}
          />
        </View>
      </View>

      <TextComponent
        text={`📅 ${formatDate(
          request?.trip?.estimated_departure_at,
        )} → ${formatDate(request?.trip?.estimated_arrival_at)}`}
        fade
        styles={styles.cardMeta}
      />
      <TextComponent
        text={`${request?.pickup_stop?.name ?? '—'} → ${
          request?.dropoff_stop?.name ?? '—'
        }`}
        styles={styles.routeText}
        numberOfLines={1}
      />
      <TextComponent
        text={`👤 ${request.human_count} seats • 🐴 ${request.horse_count} horses`}
        fade
        styles={styles.cardMeta}
      />

      {request.status === 'rejected' && request.decline_reason && (
        <View style={styles.declineBox}>
          <TextComponent
            text={`Reason: ${request.decline_reason}`}
            styles={styles.declineText}
          />
        </View>
      )}

      {canCancel && (
        <Touchable onPress={() => onCancel(request)} style={styles.cancelBtn}>
          <TextComponent
            text={'Cancel Request'}
            styles={styles.cancelBtnText}
          />
        </Touchable>
      )}
    </Touchable>
  );
};

const MyRequestsScreen = ({navigation}) => {
  const {
    requests,
    isLoading,
    refreshing,
    onRefresh,
    onLoadMore,
    isFetchingNextPage,
    confirmCancelRequest,
    openTrip,
  } = useMyRequestsScreen(navigation);

  return (
    <View style={styles.screenContainer}>
      <HeaderComponent
        headerTitle={'My Requests'}
        isBack
        goBack={() => navigation.goBack()}
      />

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primaryColor}
          style={{marginTop: hp('6')}}
        />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={item => `request-${item.id}`}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <TextComponent
                text={'No join requests yet.'}
                fade
                styles={styles.emptyText}
              />
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                size="small"
                color={Colors.primaryColor}
                style={{marginVertical: hp('2')}}
              />
            ) : null
          }
          renderItem={({item}) => (
            <RequestCard
              request={item}
              onPress={openTrip}
              onCancel={confirmCancelRequest}
            />
          )}
        />
      )}
    </View>
  );
};

export default memo(MyRequestsScreen);
