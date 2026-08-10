import React, {memo, useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  StyleSheet,
} from 'react-native';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {Touchable} from '../../Components/Touchable';
import ThemeButton from '../../Components/ThemeButton';
import {Colors} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import {imageUrl} from '../../Utils/Urls';
import useManageRequestsScreen from './useManageRequestsScreen';
import {styles} from './styles';

const STATUS_META = {
  pending: {label: 'Pending', color: '#F59E0B'},
  confirmed: {label: 'Confirmed', color: '#22C55E'},
  rejected: {label: 'Rejected', color: '#EF4444'},
  cancelled: {label: 'Cancelled', color: '#6B7280'},
};

const FILTER_LABELS = {
  all: 'All',
  pending: 'Pending',
  confirmed: 'Confirmed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

const RequestRow = ({request, onAccept, onReject, isDeciding}) => {
  const statusMeta = STATUS_META[request.status] ?? {
    label: request.status,
    color: '#6B7280',
  };
  const isPending = request.status === 'pending';
  const userName =
    `${request?.user?.first_name ?? ''} ${
      request?.user?.last_name ?? ''
    }`.trim() || 'User';

  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <View style={styles.avatarWrapper}>
          {request?.user?.profile_image ? (
            <Image
              source={{uri: imageUrl(request.user.profile_image)}}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]} />
          )}
        </View>
        <View style={{flex: 1}}>
          <TextComponent
            text={userName}
            styles={styles.userName}
            numberOfLines={1}
          />
          <TextComponent
            text={`${request?.pickup_stop?.name ?? '—'} → ${
              request?.dropoff_stop?.name ?? '—'
            }`}
            fade
            styles={styles.routeText}
            numberOfLines={1}
          />
        </View>
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
        text={`👤 ${request.human_count} seats • 🐴 ${request.horse_count} horses`}
        fade
        styles={styles.countsText}
      />

      {request.status === 'rejected' && request.decline_reason && (
        <TextComponent
          text={`Reason: ${request.decline_reason}`}
          fade
          styles={styles.declineText}
        />
      )}

      {isPending && (
        <View style={styles.actionsRow}>
          <Touchable
            onPress={() => onReject(request)}
            disabled={isDeciding}
            style={styles.rejectBtn}>
            <TextComponent text={'Reject'} styles={styles.rejectBtnText} />
          </Touchable>
          <Touchable
            onPress={() => onAccept(request.id)}
            disabled={isDeciding}
            style={styles.acceptBtn}>
            <TextComponent text={'Accept'} styles={styles.acceptBtnText} />
          </Touchable>
        </View>
      )}
    </View>
  );
};

// Small self-contained reason modal — RN's Alert doesn't support a text
// input cross-platform (Alert.prompt is iOS-only), so this is a plain
// overlay + TextInput, same pattern as the other custom modals.
const RejectReasonModal = ({request, onSubmit, onClose}) => {
  const [reason, setReason] = useState('');
  if (!request) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalCard}>
        <TextComponent text={'Reject Request'} styles={styles.modalTitle} />
        <TextComponent
          text={'Optionally let them know why (visible to the joiner):'}
          fade
          styles={styles.modalSubtitle}
        />
        <TextInput
          style={styles.reasonInput}
          value={reason}
          onChangeText={setReason}
          placeholder="e.g. No stalls left"
          placeholderTextColor="#9CA3AF"
          multiline
        />
        <View style={styles.modalActions}>
          <ThemeButton
            title="Cancel"
            style={styles.modalCancelBtn}
            textStyle={styles.modalCancelBtnText}
            onPress={onClose}
          />
          <ThemeButton
            title="Reject"
            style={styles.modalRejectBtn}
            onPress={() => onSubmit(reason)}
          />
        </View>
      </View>
    </View>
  );
};

const ManageRequestsScreen = ({navigation, route}) => {
  const {
    requests,
    isLoading,
    statusFilter,
    setStatusFilter,
    STATUS_FILTERS,
    acceptRequest,
    rejectingRequest,
    openRejectModal,
    closeRejectModal,
    submitReject,
    isDeciding,
  } = useManageRequestsScreen(navigation, route);

  return (
    <View style={styles.screenContainer}>
      <HeaderComponent
        headerTitle={'Manage Requests'}
        isBack
        goBack={() => navigation.goBack()}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterRowContent}>
        {STATUS_FILTERS.map(f => (
          <Touchable
            key={f}
            onPress={() => setStatusFilter(f)}
            style={[
              styles.filterChip,
              statusFilter === f && styles.filterChipActive,
            ]}>
            <TextComponent
              text={FILTER_LABELS[f]}
              styles={[
                styles.filterChipText,
                statusFilter === f && styles.filterChipTextActive,
              ]}
            />
          </Touchable>
        ))}
      </ScrollView>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primaryColor}
          style={{marginTop: hp('6')}}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}>
          {requests.length === 0 ? (
            <View style={styles.emptyState}>
              <TextComponent
                text={'No requests here.'}
                fade
                styles={styles.emptyText}
              />
            </View>
          ) : (
            requests.map(req => (
              <RequestRow
                key={req.id}
                request={req}
                onAccept={acceptRequest}
                onReject={openRejectModal}
                isDeciding={isDeciding}
              />
            ))
          )}
        </ScrollView>
      )}

      <RejectReasonModal
        request={rejectingRequest}
        onSubmit={submitReject}
        onClose={closeRejectModal}
      />
    </View>
  );
};

export default memo(ManageRequestsScreen);
