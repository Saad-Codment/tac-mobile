import {View, FlatList, Image, Alert, ActivityIndicator} from 'react-native';
import React, {memo} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';
import {Touchable} from '../../Components/Touchable';
import {arrRight, editProfileBlack} from '../../Assets';
import ThemeButton from '../../Components/ThemeButton';
import useTruckListScreen from './useTruckListScreen';
import {imageUrl} from '../../Utils/Urls';
import {styles} from './styles';
import {AniFlatOneByOne} from '../../AnimatedComp/AniFlatOneByOne';
import {DataNotFound} from '../../Components/DataNotFound';

// ── Truck Card ───────────────────────────────────────────────────────────────
const TruckCard = ({item, onPress, onEdit, onDelete}) => {
  const specs = [
    {label: 'Horse Stalls', value: item?.horse_stalls},
    {label: 'Human Seats', value: item?.human_seats},
    {label: 'Height', value: item?.height_cm ? `${item.height_cm} cm` : '-'},
    {label: 'Weight', value: item?.weight_kg ? `${item.weight_kg} kg` : '-'},
    {label: 'Length', value: item?.length_cm ? `${item.length_cm} cm` : '-'},
    {label: 'Width', value: item?.width_cm ? `${item.width_cm} cm` : '-'},
    {label: 'Axles', value: item?.axle_count},
  ];

  return (
    <Touchable onPress={onPress} style={styles.card}>
      {/* ── Truck Image ── */}
      {item?.image_url ? (
        <Image
          source={{
            uri: imageUrl(
              typeof item.image_url === 'string'
                ? item.image_url
                : item.image_url[0],
            ),
          }}
          resizeMode="cover"
          style={styles.cardImage}
        />
      ) : (
        /* ── Placeholder when no image ── */
        <View style={styles.imagePlaceholder}>
          <Image
            source={editProfileBlack}
            resizeMode="contain"
            style={styles.imagePlaceholderIcon}
          />
          <TextComponent
            text={'No Image'}
            fade
            styles={styles.imagePlaceholderText}
          />
        </View>
      )}

      {/* ── Card Body ── */}
      <View style={styles.cardBody}>
        {/* ── Title & Name Row ── */}
        <View style={styles.titleRow}>
          <View style={styles.titleTextWrapper}>
            <TextComponent
              text={item?.vehicle_number || '—'}
              styles={styles.truckTitle}
              numberOfLines={1}
            />
            {item?.name ? (
              <TextComponent
                text={item.name}
                fade
                styles={styles.truckName}
                numberOfLines={1}
              />
            ) : null}
          </View>
          {/* ── Navigate arrow ── */}
          <Image
            source={arrRight}
            resizeMode="contain"
            style={styles.arrowIcon}
          />
        </View>

        {/* ── Divider after title ── */}
        <View style={styles.divider} />

        {/* ── Specs Grid ── */}
        <View style={styles.specsGrid}>
          {specs.map((spec, i) => (
            <View key={i} style={styles.specItem}>
              <TextComponent text={spec.label} fade styles={styles.specLabel} />
              <TextComponent
                text={
                  spec.value !== undefined && spec.value !== null
                    ? String(spec.value)
                    : '-'
                }
                styles={styles.specValue}
              />
            </View>
          ))}
        </View>

        {/* ── Divider before actions ── */}
        <View style={styles.divider} />

        {/* ── Edit / Delete Actions ── */}
        <View style={styles.actionsRow}>
          {/* Edit button */}
          <Touchable onPress={onEdit} style={styles.editBtn}>
            <TextComponent text={'Edit'} styles={styles.editBtnText} />
          </Touchable>
          {/* Delete button */}
          <Touchable onPress={onDelete} style={styles.deleteBtn}>
            <TextComponent text={'Delete'} styles={styles.deleteBtnText} />
          </Touchable>
        </View>
      </View>
    </Touchable>
  );
};

// ── Screen ───────────────────────────────────────────────────────────────────
const TruckListScreen = ({navigation, route}) => {
  const {
    trucks,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    deleteTruck,
  } = useTruckListScreen(navigation, route);

  const handleDelete = item => {
    Alert.alert(
      'Delete Truck',
      `Are you sure you want to delete "${item?.vehicle_number}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTruck(item?.id),
        },
      ],
    );
  };

  const renderItem = (item, index) => (
    <TruckCard
      item={item}
      onPress={() => navigation.navigate('TruckDetailScreen', {truck: item})}
      onEdit={() => navigation.navigate('TruckAddScreen', {truck: item})}
      onDelete={() => handleDelete(item)}
    />
  );

  return (
    <View style={styles.screenContainer}>
      <HeaderComponent
        headerTitle={'My Trucks'}
        isBack
        goBack={() => navigation.goBack()}
      />

      {/* ── Animated Paginated FlatList ── */}
      {!isLoading && (
        <AniFlatOneByOne
          data={trucks}
          flatViewStyle={styles.listContent}
          onRefresh={refetch}
          flatListProps={{
            extraData: trucks,
            numColumns: 1,

            // ── Empty State ──
            ListEmptyComponent: (
              <DataNotFound
                btnStyles={{width: wp('80')}}
                title={'No trucks added yet!'}
                subTitle={'Tap "Add Truck" to get started'}
              />
            ),

            // ── Pagination Footer ──
            ListFooterComponent:
              trucks?.length >= 9 &&
              (isFetchingNextPage ? (
                <ActivityIndicator
                  size="small"
                  color="gray"
                  style={styles.footerLoader}
                />
              ) : (
                hasNextPage && (
                  <ThemeButton
                    title={'Load More'}
                    style={styles.loadMoreBtn}
                    textStyle={styles.loadMoreBtnText}
                    onPress={() => fetchNextPage()}
                  />
                )
              )),
          }}
          InnerCompnonet={(item, index) => renderItem(item, index)}
        />
      )}

      {/* ── Sticky Add Truck Button ── */}
      <View style={styles.addBtnWrapper}>
        <ThemeButton
          title={'+ Add Truck'}
          isYellowTheme
          style={styles.addBtn}
          onPress={() => navigation.navigate('TruckAddScreen', {})}
          textStyle={styles.addBtnText}
        />
      </View>
    </View>
  );
};

export default memo(TruckListScreen);
