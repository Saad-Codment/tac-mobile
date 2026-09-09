import React, {memo} from 'react';
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {Touchable} from '../../Components/Touchable';
import {editProfileBlack} from '../../Assets';
import ThemeButton from '../../Components/ThemeButton';
import {Colors} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import {imageUrl} from '../../Utils/Urls';
import useVehicleListScreen from './useVehicleListScreen';
import {styles} from './styles';
import {getRigLengthInfo} from '../../Utils/RouteRestrictions';

// Fixed enum per the API doc (§14) — formatted for display without an
// extra network call.
const formatVehicleType = type => {
  if (!type) return null;
  return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

// CHANGED — accepts selectMode to hide the delete button when this
// screen is being used to pick a vehicle for a trip rather than manage
// your saved vehicles.
const VehicleCard = ({vehicle, onEdit, onDelete, selectMode}) => {
  const firstImage = vehicle?.images?.[0];
  const typeLabel = formatVehicleType(vehicle?.vehicle_type);
  const hasPricing =
    vehicle?.base_price_per_horse || vehicle?.base_price_per_seat;

  return (
    <Touchable onPress={() => onEdit(vehicle)} style={styles.card}>
      <View style={styles.cardImgWrapper}>
        {firstImage ? (
          <Image
            source={{uri: imageUrl(firstImage)}}
            style={styles.cardImg}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.cardImg, styles.cardImgPlaceholder]}>
            <Image
              source={editProfileBlack}
              style={styles.cardImgPlaceholderIcon}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <TextComponent
            text={vehicle?.title}
            styles={styles.cardTitle}
            numberOfLines={1}
          />
          {typeLabel && (
            <View style={styles.typeBadge}>
              <TextComponent text={typeLabel} styles={styles.typeBadgeText} />
            </View>
          )}
        </View>
        <TextComponent
          text={`#${vehicle?.vehicle_number}`}
          fade
          styles={styles.cardSubtitle}
        />
        <TextComponent
          text={`🐴 ${vehicle?.horse_stalls} stalls • 👤 ${vehicle?.human_seats} seats • ⚙ ${vehicle?.axle_count} axles`}
          fade
          styles={styles.cardMeta}
        />
        <TextComponent
          text={`H ${vehicle?.height_cm}cm • W ${vehicle?.width_cm}cm • L ${
            vehicle?.length_cm
          }cm${
            getRigLengthInfo(vehicle).hasLength
              ? ` (${getRigLengthInfo(vehicle).lengthLabel})`
              : ''
          } • ${vehicle?.weight_kg}kg`}
          fade
          styles={styles.cardMeta}
        />
        {hasPricing && (
          <TextComponent
            text={`💵 $${vehicle?.base_price_per_horse ?? '0'}/horse • $${
              vehicle?.base_price_per_seat ?? '0'
            }/seat`}
            styles={styles.cardPricing}
          />
        )}
      </View>
      {!selectMode && (
        <Touchable onPress={() => onDelete(vehicle)} style={styles.deleteBtn}>
          <TextComponent text={'🗑'} styles={styles.deleteBtnText} />
        </Touchable>
      )}
    </Touchable>
  );
};

const VehicleListScreen = ({navigation, route}) => {
  const {
    vehicles,
    isLoading,
    refreshing,
    onRefresh,
    onLoadMore,
    isFetchingNextPage,
    confirmDeleteVehicle,
    goToAddVehicle,
    goToEditVehicle,
    selectMode,
  } = useVehicleListScreen(navigation, route);

  return (
    <View style={styles.screenContainer}>
      <HeaderComponent
        headerTitle={selectMode ? 'Select a Vehicle' : 'My Vehicles'}
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
          data={vehicles}
          keyExtractor={item => `vehicle-${item.id}`}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <TextComponent
                text={'No vehicles saved yet.'}
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
            <VehicleCard
              vehicle={item}
              onEdit={goToEditVehicle}
              onDelete={confirmDeleteVehicle}
              selectMode={selectMode}
            />
          )}
        />
      )}

      <View style={styles.bottomBar}>
        <ThemeButton
          title={'+ Add Vehicle'}
          isYellowTheme
          style={styles.addBtn}
          onPress={goToAddVehicle}
        />
      </View>
    </View>
  );
};

export default memo(VehicleListScreen);
