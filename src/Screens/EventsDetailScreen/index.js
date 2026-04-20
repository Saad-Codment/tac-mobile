import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import {HeaderComponent} from '../../Components/HeaderComponent';
import BlurImage from '../../Components/BlurImage';
import {hp, wp} from '../../Config/responsive';
import {
  arrRight,
  arrRightPurple,
  calender,
  dollarCircle,
  dollarCircleLight,
  filledCalender,
  filledClock,
  filledLocation,
  locationGray,
  tacLogo,
  tickSquare,
} from '../../Assets';
import {TextComponent} from '../../Components/TextComponent';
import MutualFriends from '../../Components/MutualFriendsComponent';
import {styles} from './styles';
import {Colors} from '../../Theme/Variables';
import {MultiView} from '../SettingScreen/MultiView';
import ThemeButton from '../../Components/ThemeButton';
import useEventDetailScreen from './useEventsDetailScreen';
import {
  convertToLocalTime,
  formatDateToLong,
  formatPrice,
  getDateMonthYear,
} from '../../Services/GlobalFunctions';
import {imageUrl} from '../../Utils/Urls';
import {CircleImage} from '../../Components/CircleImage';
import useReduxStore from '../../Hooks/UseReduxStore';
import {types} from '../../Redux/types';
import {MultiSelectButton} from '../../Components/MultiSelectButton';
import DividerLine from '../../Components/DividerLine';
import CustomModalComp from '../../Components/CustomModalComp';
import {useRef, useState} from 'react';
import {Touchable} from '../../Components/Touchable';

const EventsDetailScreen = ({navigation, route}) => {
  const {
    eventData,
    onRefresh,
    followUnFollowEvent,
    userData,
    modalVisible,
    setModalVisible,
    isAleadyAddedToCalender,
  } = useEventDetailScreen(navigation, route);

  // const {
  //   eventData,
  //   onRefresh,
  //   followUnFollowEvent,
  //   userData,
  //   modalVisible,
  //   setModalVisible,
  //   isAleadyAddedToCalender,
  // } = {
  //   eventData: {},
  //   onRefresh: () => {},
  //   followUnFollowEvent: 1,
  //   userData: {},
  //   modalVisible: false,
  //   setModalVisible: () => {},
  //   isAleadyAddedToCalender: 1,
  // };

  const {dispatch} = useReduxStore();

  const onImagePress = isEvent => {
    dispatch({
      payload: isEvent
        ? eventData?.images
          ? JSON.parse(eventData?.images)
          : ''
        : eventData?.user?.profile_image,
      type: isEvent ? types.openModal : types.openModalCircle,
    });
  };

  const scrollViewRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const windowWidth = Dimensions.get('window').width;

  // const images = [];
  const images = eventData?.images ? JSON.parse(eventData?.images) : [];

  const handleScroll = event => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / windowWidth);
    if (currentIndex !== activeSlide) {
      setActiveSlide(currentIndex);
    }
  };

  const scrollToIndex = index => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({x: index * windowWidth, animated: true});
      setActiveSlide(index);
    }
  };

  console.log(
    'kjsdblkvsdbklvbsdklvblksdbvlksbdlkvsdvksdlvsbdv',
    formatPrice(eventData?.added_money ?? 0).toString(),
  );

  return (
    <View style={styles.mainView}>
      <HeaderComponent
        headerTitle={'Event Detail'}
        goBack={() => navigation.goBack()}
        isBack
      />

      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.systemView}>
          <Pressable
            onPress={() => onImagePress(false)}
            disabled={Boolean(
              !eventData?.user?.profile_image || !eventData?.suggested,
            )}>
            <CircleImage
              image={
                eventData?.user?.profile_image || !eventData?.suggested
                  ? imageUrl(eventData?.user?.profile_image)
                  : tacLogo
              }
              uri={Boolean(
                eventData?.user?.profile_image || !eventData?.suggested,
              )}
              styles={styles.tacImg}
              size={0.1}
            />
          </Pressable>

          <TextComponent
            text={
              eventData?.user?.first_name
                ? `${eventData?.user?.first_name} ${
                    eventData?.user?.last_name ? eventData?.user?.last_name : ''
                  }`
                : 'System suggested'
            }
            styles={styles.systemUserName}
          />

          <Touchable style={styles.followView}>
            <Image
              source={dollarCircleLight}
              resizeMode="contain"
              style={styles.checkImg}
            />
            <TextComponent
              text={formatPrice(eventData?.added_money ?? 0).toString()}
              size={hp('1.6')}
              styles={styles.addedMoneyText}
            />
          </Touchable>
        </View>

        {images.length > 0 && (
          <View style={styles.carouselContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={styles.imgScrollView}>
              {images.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => onImagePress(true)}
                  style={styles.slide}>
                  <BlurImage
                    isURI
                    uri={imageUrl(item)}
                    styles={styles.carouselImage}
                    radius={15}
                  />
                </Pressable>
              ))}
            </ScrollView>

            {images.length > 1 && (
              <View style={styles.pagination}>
                {images.map((_, index) => (
                  <Pressable
                    key={index}
                    onPress={() => scrollToIndex(index)}
                    style={[
                      styles.dot,
                      activeSlide === index && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        <TextComponent text={eventData?.title} styles={styles.titleStyle} />

        {eventData?.likes_count > 0 && (
          <View style={styles.bottomView}>
            <MutualFriends
              uri={'https://picsum.photos/200'}
              friends={Array.from(
                {length: eventData.likes_count},
                (_, i) => i + 1,
              )}
              textAfterCount={'people like this event.'}
            />
          </View>
        )}

        {Boolean(
          eventData?.tour_id == 7 ||
            eventData?.is_confirmed != 0 ||
            eventData?.performances?.length > 0,
        ) && (
          <>
            <View style={styles.statusRow}>
              <View style={styles.statusLeftGroup}>
                {eventData?.tour_id == 7 && (
                  <View style={styles.statusItem}>
                    <Image
                      source={tickSquare}
                      resizeMode="contain"
                      style={styles.statusIcon}
                      tintColor={'#32CE37'}
                    />
                    <TextComponent text={'Tour'} size={hp('1.3')} />
                  </View>
                )}

                {eventData?.is_confirmed != 0 && (
                  <View style={styles.statusItem}>
                    <Image
                      source={tickSquare}
                      resizeMode="contain"
                      style={styles.statusIcon}
                      tintColor={'#32CE37'}
                    />
                    <TextComponent text={'Event confirmed'} size={hp('1.3')} />
                  </View>
                )}
              </View>

              {eventData?.performances?.length > 0 && (
                <View style={styles.viewPerformances}>
                  <TextComponent text={'View Performances'} size={hp('1.3')} />
                  <Image
                    source={arrRight}
                    resizeMode="contain"
                    style={styles.arrRightIcon}
                    tintColor={Colors.primaryColor}
                  />
                </View>
              )}
            </View>

            <DividerLine
              DividerLineStyle={{
                ...styles.dividerFullWidth,
                marginVertical: hp('1'),
              }}
            />
          </>
        )}

        <View style={styles.eventTimeViewGray}>
          <View>
            <TextComponent
              text={'Starts At:'}
              styles={styles.sectionSmallTitle}
              fade
            />
            <View style={styles.timeRow}>
              <Image
                source={filledCalender}
                resizeMode="contain"
                style={styles.eventCallImg}
              />
              <TextComponent
                text={`${getDateMonthYear(eventData?.from_date)?.monthName} ${
                  getDateMonthYear(eventData?.from_date)?.day
                }, ${getDateMonthYear(eventData?.from_date)?.year}`}
                styles={styles.timeText}
              />
              {eventData?.start_time && (
                <>
                  <Image
                    source={filledClock}
                    resizeMode="contain"
                    style={[styles.eventCallImg, styles.timeIconMarginLeft]}
                  />
                  <TextComponent
                    text={
                      eventData?.start_time
                        ? `${convertToLocalTime(eventData?.start_time)?.time} ${
                            convertToLocalTime(eventData?.start_time)?.period ??
                            ''
                          }`
                        : 'Not Confirmed'
                    }
                    styles={styles.timeText}
                  />
                </>
              )}
            </View>
          </View>

          <View>
            <TextComponent
              text={'Ends At:'}
              styles={styles.sectionSmallTitle}
              fade
            />
            <View style={styles.timeRow}>
              <Image
                source={filledCalender}
                resizeMode="contain"
                style={styles.eventCallImg}
              />
              <TextComponent
                text={`${getDateMonthYear(eventData?.to_date)?.monthName} ${
                  getDateMonthYear(eventData?.to_date)?.day
                }, ${getDateMonthYear(eventData?.to_date)?.year}`}
                styles={styles.timeText}
              />
              {eventData?.end_time && (
                <>
                  <Image
                    source={filledClock}
                    resizeMode="contain"
                    style={[styles.eventCallImg, styles.timeIconMarginLeft]}
                  />
                  <TextComponent
                    text={
                      eventData?.end_time
                        ? `${convertToLocalTime(eventData?.end_time)?.time} ${
                            convertToLocalTime(eventData?.end_time)?.period ??
                            ''
                          }`
                        : 'Not Confirmed'
                    }
                    styles={styles.timeText}
                  />
                </>
              )}
            </View>
          </View>
        </View>

        <DividerLine DividerLineStyle={styles.dividerFullWidth} />

        <TextComponent
          text={'Event Location:'}
          styles={styles.locationTitle}
          fade
        />

        <View style={styles.locationView}>
          <View style={styles.locationLeft}>
            <Image
              source={locationGray}
              tintColor={Colors.primaryColor}
              style={styles.locationImg}
            />
            <TextComponent
              text={eventData?.address}
              numberOfLines={3}
              styles={styles.addressText}
            />
          </View>

          {eventData?.latitude && (
            <TextComponent
              text={'View Location'}
              styles={styles.viewLocationLink}
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=${eventData?.latitude}%2C${eventData?.longitude}`,
                )
              }
            />
          )}
        </View>

        <DividerLine DividerLineStyle={styles.dividerFullWidth} />

        <View style={styles.arryMainView}>
          <TextComponent text={'Event Type'} styles={styles.sectionTitle} />

          <View style={styles.multiMainView}>
            {eventData?.event_types?.length > 0 ? (
              <MultiSelectButton
                isDisable={true}
                items={eventData?.event_types ?? []}
                btnStyle={styles.selectedValStyle}
                textStyle={styles.multiSelectText}
              />
            ) : (
              <TextComponent
                text={'Event types are not selected.'}
                fade
                styles={styles.notSelectedText}
              />
            )}
          </View>

          <DividerLine DividerLineStyle={styles.dividerSection} />

          <TextComponent text={'Associations'} styles={styles.sectionTitle} />

          <View style={styles.multiMainView}>
            {eventData?.associations?.length > 0 ? (
              <MultiSelectButton
                isDisable={true}
                items={eventData?.associations ?? []}
                btnStyle={styles.selectedValStyle}
                textStyle={styles.multiSelectText}
              />
            ) : (
              <TextComponent
                text={'Associations are not selected.'}
                fade
                styles={styles.notSelectedText}
              />
            )}
          </View>

          <DividerLine DividerLineStyle={styles.dividerSection} />

          <TextComponent text={'Circuits'} styles={styles.sectionTitle} />

          <View style={styles.multiMainView}>
            {eventData?.circuits?.length > 0 ? (
              <MultiSelectButton
                isDisable={true}
                items={eventData?.circuits ?? []}
                btnStyle={styles.selectedValStyle}
                textStyle={styles.multiSelectText}
              />
            ) : (
              <TextComponent
                text={'Circuits are not selected.'}
                fade
                styles={styles.notSelectedText}
              />
            )}
          </View>
        </View>

        <CustomModalComp
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          subtitle={
            eventData?.is_followed
              ? 'Do you want to remove this event to your TAC calendar?'
              : 'Do you want to add this event to your TAC calendar?'
          }
          checkBoxText={
            eventData?.is_followed
              ? 'Also remove this event with my device calendar'
              : 'Also sync this event with my device calendar'
          }
          onConfirm={(checked, id) => {
            console.log('User confirmed:', checked);
            followUnFollowEvent(checked, eventData?.id);
          }}
          isAleadyAddedToCalender={isAleadyAddedToCalender}
        />

        {userData?.id != eventData?.user?.id && (
          <ThemeButton
            title={
              eventData?.is_followed
                ? 'Remove from my calender'
                : 'Add to my calender'
            }
            style={styles.btnStyle}
            textStyle={styles.btnText}
            onPress={() => setModalVisible(true)}
            image={calender}
            isYellowTheme
            imageStyle={styles.btnCalendarIcon}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default EventsDetailScreen;
