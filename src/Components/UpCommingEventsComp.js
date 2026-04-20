import {Alert, Image, Pressable, StyleSheet, View} from 'react-native';
import {hp, wp} from '../Config/responsive';
import {CircleImage} from './CircleImage';
import {TextComponent} from './TextComponent';
import {
  calendar,
  commentIcon,
  dollarCircle,
  dotsVertical,
  eventLogo,
  heartFilledLike,
  heartTheme,
  locationGray,
  shareTheme,
  tickSquare,
} from '../Assets';
import {Colors} from '../Theme/Variables';
import {MultiSelectButton} from './MultiSelectButton';
import {
  convertToArray,
  showFirstThreeAndCountRest,
  formatPrice,
  getDateMonthYear,
  getIdsFromArry,
} from '../Services/GlobalFunctions';
import {Touchable} from './Touchable';
import NavigationService from '../Services/NavigationService';
import {
  chatUserListUrl,
  followEventsUrl,
  imageUrl,
  unFollowEventsUrl,
} from '../Utils/Urls';
import useFriendServices from '../Services/FriendServices';
import useReduxStore from '../Hooks/UseReduxStore';
import {types} from '../Redux/types';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {errorMessage, successMessage} from '../Config/NotificationMessage';
import * as Calendar from '@shadahmad7/react-native-calendar';
import BottomViewModal from './BottomViewModal';
import ThemeButton from './ThemeButton';
import CustomModalComp from './CustomModalComp';
import API from '../Utils/helperFunc';

const UpcomingEventsComp = ({
  item,
  index,
  mainViewStyle,
  upperImgStyle,
  refetechKeys,
  functionToUpdateLike,
  openBottomSheet,
  refetch,
  functionToDelete,
  functionToUpdatePostOrEvent,
  functionToUpdateComment,
  setCommentModal,
  functionToUpdateFollow,
  disabled,
}) => {
  const [modal, setModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {mutateAsync} = useMutation({
    mutationFn: data => {
      return API.post(followEventsUrl, {
        event_id: item?.id,
        calendar_id: data?.calendarId,
        record_id: data?.recordId,
      });
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        functionToUpdateFollow(index);
      } else {
        errorMessage(data?.message);
      }
    },
  });

  const unfollowEvent = useMutation({
    mutationFn: data => {
      return API.post(unFollowEventsUrl, {
        event_id: data?.id,
        remove_from_calender: data?.isCalender,
      });
    },
    onSuccess: async ({ok, data}) => {
      if (ok) {
        successMessage(data?.message);
        if (refetch) await refetch();
      } else {
        errorMessage(data?.message);
      }
    },
  });

  // ================== CORRECT CALENDAR FUNCTIONALITY ==================
  const requestCalendarPermissions = async () => {
    const {status} = await Calendar.requestCalendarPermission();
    return status === 'granted';
  };

  const AaddtToMyDeviceCalendar = async () => {
    if (isSaving || !item) return;
    setIsSaving(true);

    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Calendar permission is required to add events.',
      );
      setIsSaving(false);
      return;
    }

    try {
      // Using the exact functions you specified
      let defaultCalendar = await Calendar.getDefaultCalendar();

      if (!defaultCalendar) {
        const calendars = await Calendar.getCalendars();
        defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];
      }

      if (!defaultCalendar) {
        Alert.alert('Error', 'No calendar found on device');
        setIsSaving(false);
        return;
      }

      const startDate = new Date(item.from_date).getTime();
      const endDate = new Date(item.to_date).getTime();

      const eventToSave = {
        title: item.title,
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        location: item.address || '',
        notes: item.description || item.address || '',
        allDay: false,
      };

      const eventId = await Calendar.saveEvent(eventToSave);

      if (eventId) {
        console.log('Event added successfully with ID:', eventId);
        await mutateAsync({
          id: item.id,
          calendarId: defaultCalendar.id,
          recordId: eventId,
        });
        successMessage('Event added to calendar successfully');
      }
    } catch (error) {
      console.log('Error adding to calendar:', error);
      Alert.alert(
        'Failed',
        'Could not add event to calendar. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const removeCalendarEvent = async () => {
    Alert.alert(
      'Remove from Device Calendar',
      'Please open your Calendar app and delete the event manually.',
      [{text: 'OK'}],
    );
  };

  const onClickCalendarOption = async (isChecked, id) => {
    setModalVisible(false);
    if (!item) return;

    if (item.is_followed == 1) {
      await unfollowEvent.mutateAsync({
        id,
        isCalender: isChecked ? 1 : 0,
      });
      if (isChecked) await removeCalendarEvent();
      if (refetch) refetch();
      if (refetechKeys) {
        refetechKeys.map(res => queryClient.invalidateQueries([res]));
      }
    } else {
      await mutateAsync({id});
      if (refetch) refetch();
      if (refetechKeys) {
        refetechKeys.map(res => queryClient.invalidateQueries([res]));
      }
      if (isChecked) {
        await AaddtToMyDeviceCalendar();
      }
    }
  };

  const {likeAndDisLikeEvent, shareEvent, deleteEvent, shareEventInChat} =
    useFriendServices();

  const {queryClient, getState, dispatch} = useReduxStore();
  const {userData} = getState('Auth');

  const onImagePress = () => {
    dispatch({
      payload: item?.user_image ?? item?.profile_image,
      type: types.openModalCircle,
    });
  };

  const onEditPost = () => {
    NavigationService.navigate('CreateEventsScreen', {
      event: item,
      functionToUpdatePostOrEvent: data => functionToUpdatePostOrEvent(data),
    });
  };

  const onDeletePost = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this post?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteEvent.mutateAsync(item?.id);
            if (refetch) refetch();
            functionToDelete(index);
          },
        },
      ],
    );
  };

  return (
    <>
      <Pressable
        style={{
          ...styles.mainView,
          ...mainViewStyle,
          backgroundColor: Boolean(item?.user_image ?? item?.profile_image)
            ? 'white'
            : 'rgba(255, 247, 233, 1)',
        }}
        onPress={() => {
          NavigationService.navigate('EventsDetailScreen', {id: item?.id});
        }}>
        <Pressable
          style={styles.upperImage}
          onPress={() => {
            if (item?.type != 6 && item?.type != 4) {
              if (userData?.id == item?.user_id) {
                NavigationService.navigate('MyProfileScreen', {
                  id: userData?.id,
                });
              } else
                NavigationService.navigate('FriendProfileScreen', {
                  id: item?.user_id,
                });
            } else
              NavigationService.navigate('EventsDetailScreen', {id: item?.id});
          }}>
          <Pressable
            onPress={onImagePress}
            disabled={!Boolean(item?.user_image ?? item?.profile_image)}>
            <CircleImage
              size={0.12}
              image={
                Boolean(item?.user_image ?? item?.profile_image)
                  ? imageUrl(item?.user_image ?? item?.profile_image)
                  : eventLogo
              }
              uri={!Boolean(!item?.user_image ?? !item?.profile_image)}
            />
          </Pressable>
          <View style={styles.nameView}>
            <TextComponent
              text={
                item?.first_name
                  ? item?.first_name +
                    ' ' +
                    (item?.last_name ? item?.last_name : '')
                  : item?.title
              }
              styles={{
                fontWeight: 'bold',
                fontSize: hp('1.5'),
                width: wp('62'),
              }}
              numberOfLines={1}
            />
            <View style={styles.locationView}>
              <Image
                source={locationGray}
                tintColor={'black'}
                resizeMode="contain"
                style={styles.locationIcom}
              />
              <TextComponent
                text={item?.address}
                styles={{fontSize: hp('1.2')}}
                numberOfLines={1}
              />
            </View>
          </View>

          {userData?.id != item?.user_id ? (
            <TextComponent
              text={'Report'}
              fade
              styles={styles.reportText}
              onPress={() => {
                if (userData?.id != item?.user_id) openBottomSheet(item?.id);
              }}
            />
          ) : (
            <Menu>
              <MenuTrigger>
                <Image
                  source={dotsVertical}
                  resizeMode="contain"
                  style={{width: wp('7'), height: hp('5'), marginLeft: wp('8')}}
                />
              </MenuTrigger>
              <MenuOptions customStyles={{optionText: {color: 'black'}}}>
                <MenuOption
                  onSelect={onEditPost}
                  text="Edit"
                  style={{color: 'black'}}
                />
                <MenuOption
                  onSelect={onDeletePost}
                  text="Delete"
                  style={{color: 'black'}}
                />
              </MenuOptions>
            </Menu>
          )}
        </Pressable>

        <View style={styles.priceMainView}>
          <TextComponent
            text={item?.title}
            styles={{
              fontWeight: 'bold',
              fontSize: hp('1.5'),
              opacity: item?.first_name ? 1 : 0,
              width: wp('65'),
            }}
            numberOfLines={1}
          />
          <View style={styles.priceView}>
            <Image
              source={dollarCircle}
              resizeMode="contain"
              tintColor={
                Boolean(item?.user_image ?? item?.profile_image)
                  ? 'white'
                  : 'rgba(255, 247, 233, 1)'
              }
              style={styles.dollarIcon}
            />
            <TextComponent
              text={formatPrice(item?.added_money) ?? 0}
              styles={styles.price}
            />
          </View>
        </View>

        <View style={styles.centerView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextComponent
              text={`Starts at:`}
              styles={{...styles.leftText, width: wp('12')}}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={calendar}
                resizeMode="contain"
                tintColor={'black'}
                style={styles.calenderIcon}
              />
              <TextComponent
                text={`${getDateMonthYear(item?.from_date)?.monthName} ${
                  getDateMonthYear(item?.from_date)?.day
                }, ${getDateMonthYear(item?.from_date)?.year}`}
                styles={{fontSize: hp('1.2')}}
              />
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextComponent
              text={`Ends at:`}
              styles={{...styles.leftText, width: wp('11')}}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={calendar}
                resizeMode="contain"
                tintColor={'black'}
                style={styles.calenderIcon}
              />
              <TextComponent
                text={`${getDateMonthYear(item?.to_date)?.monthName} ${
                  getDateMonthYear(item?.to_date)?.day
                }, ${getDateMonthYear(item?.to_date)?.year}`}
                styles={{fontSize: hp('1.2')}}
              />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <>
          <View style={styles.centerView}>
            <TextComponent text={'Event types:'} styles={styles.leftText} />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {item?.event_types ? (
                <MultiSelectButton
                  items={showFirstThreeAndCountRest(
                    convertToArray(item?.event_types),
                  )}
                  isDisable={true}
                  btnStyle={styles.tagsBtn}
                  textStyle={{fontSize: hp('1.2'), color: '#525252'}}
                />
              ) : (
                <TextComponent text={'Not Selected'} size={hp('1.2')} />
              )}
            </View>
          </View>
          <View style={styles.divider} />
        </>

        <>
          <View style={styles.centerView}>
            <TextComponent text={'Assoc:'} styles={styles.leftText} />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {item?.associations ? (
                <MultiSelectButton
                  items={showFirstThreeAndCountRest(
                    convertToArray(item?.associations),
                  )}
                  isDisable={true}
                  btnStyle={styles.tagsBtn}
                  textStyle={{fontSize: hp('1.2'), color: '#525252'}}
                />
              ) : (
                <TextComponent text={'Not Selected'} size={hp('1.2')} />
              )}
            </View>
          </View>
          <View style={styles.divider} />
        </>

        <View style={styles.bottomView}>
          <Touchable
            style={styles.leftRightView}
            onPress={async () => {
              functionToUpdateLike(index);
              await likeAndDisLikeEvent.mutateAsync(item?.id);
              if (refetch) refetch();
              if (refetechKeys)
                refetechKeys.map(res => queryClient.invalidateQueries([res]));
            }}>
            <Image
              source={item?.is_liked ? heartFilledLike : heartTheme}
              resizeMode="contain"
              tintColor={'rgba(255, 0, 55, 1)'}
              style={{width: wp('4'), marginRight: wp('1'), height: hp('3')}}
            />
            <TextComponent
              text={`${item?.likes_count} ${
                item?.likes_count <= 1 ? 'Like' : 'Likes'
              }`}
              styles={{fontSize: hp('1.2')}}
            />
          </Touchable>

          <Touchable
            style={styles.leftRightView}
            onPress={() => {
              if (setCommentModal) setCommentModal(item?.id, item?.index);
              else
                NavigationService.navigate('CommentScreen', {
                  id: item?.id,
                  refetechKeys,
                  isPost: false,
                  refetch,
                  functionToUpdateComment,
                  index,
                });
            }}>
            <Image
              source={commentIcon}
              resizeMode="contain"
              style={{width: wp('4'), marginRight: wp('1'), height: hp('3')}}
            />
            <TextComponent
              text={`${item?.comments_count} ${
                item?.comments_count <= 1 ? 'Comment' : 'Comments'
              }`}
              styles={{fontSize: hp('1.2')}}
            />
          </Touchable>

          <Touchable
            style={styles.leftRightView}
            onPress={() => setModal(true)}>
            <Image
              source={shareTheme}
              resizeMode="contain"
              style={{width: wp('4'), height: hp('3')}}
              tintColor={'black'}
            />
            <TextComponent
              text={'Share'}
              styles={{marginLeft: wp('1'), fontSize: hp('1.2')}}
            />
          </Touchable>

          <ThemeButton
            title={
              Boolean(item?.is_followed == 1)
                ? 'Added to calender'
                : 'Add to Calendar'
            }
            image={Boolean(item?.is_followed == 1) ? tickSquare : calendar}
            style={{
              height: hp('3'),
              width: wp('32'),
              marginLeft: wp('3'),
              borderRadius: 7,
              backgroundColor: Boolean(item?.is_followed == 1)
                ? '#EEEEEE'
                : Colors.primaryColor,
            }}
            imageStyle={{
              width: wp('4'),
              height: hp('3'),
              tintColor: Boolean(item?.is_followed == 1) ? '#32CE37' : 'white',
            }}
            textStyle={{
              fontSize: hp('1.2'),
              color: Boolean(item?.is_followed == 1) ? 'black' : 'white',
            }}
            isYellowTheme={Boolean(item?.is_followed == 0)}
            isDisable={Boolean(item?.is_followed == 1) || isSaving}
            onPress={() => setModalVisible(true)}
          />
        </View>
      </Pressable>

      {Boolean(modal) && (
        <BottomViewModal
          isModal={modal}
          onBackPress={() => setModal(false)}
          childrenComp={
            <View style={{paddingHorizontal: wp('2')}}>
              <TextComponent
                text={'Share with friends'}
                styles={styles.modalText}
                size={hp('1.5')}
                onPress={() => {
                  setModal(false);
                  NavigationService.navigate('SelectFriendListScreem', {
                    onSelectValue: () => {},
                    selectedValue: [],
                    urlName: chatUserListUrl,
                    isMultiSelect: true,
                    title: 'Select Friends',
                    btnTitle: 'Share',
                    onBtnPress: selectedList => {
                      shareEventInChat.mutateAsync({
                        event_id: item?.id,
                        conversation_ids: getIdsFromArry(
                          selectedList,
                          'conversation_id',
                        ),
                      });
                    },
                  });
                }}
              />
              <TextComponent
                text={'Share on your feed'}
                styles={{...styles.modalText, marginTop: hp('1.5')}}
                size={hp('1.5')}
                onPress={() => {
                  setModal(false);
                  shareEvent.mutateAsync({event_id: item?.id});
                }}
              />
            </View>
          }
        />
      )}

      {modalVisible && (
        <CustomModalComp
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          subtitle={
            item?.is_followed == 1
              ? 'Do you want to remove this event to your TAC calendar?'
              : 'Do you want to add this event to your TAC calendar?'
          }
          checkBoxText={
            item?.is_followed == 1
              ? 'Also remove this event with my device calendar'
              : 'Also sync this event with my device calendar'
          }
          onConfirm={(checked, id) => onClickCalendarOption(checked, item?.id)}
          isAleadyAddedToCalender={Boolean(
            item?.calendar_id && item?.is_followed == 0,
          )}
        />
      )}
    </>
  );
};

export default UpcomingEventsComp;

const styles = StyleSheet.create({
  mainView: {
    width: wp('87'),
    borderRadius: 20,
    overflow: 'hidden',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    backgroundColor: 'white',
    paddingVertical: hp('1'),
    paddingHorizontal: wp('2'),
  },
  upperImage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameView: {
    marginLeft: wp('2'),
    width: wp('61'),
  },
  locationView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('62'),
  },
  locationIcom: {
    width: wp('4'),
    height: hp('3'),
    marginLeft: wp('-0.5'),
    marginRight: wp('1'),
  },
  reportText: {
    fontSize: hp('1.2'),
    top: hp('-2'),
    right: wp('-1'),
  },
  priceMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1'),
    justifyContent: 'space-between',
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dollarIcon: {width: wp('3'), height: hp('2')},
  price: {fontWeight: 'bold', marginLeft: wp('1'), fontSize: hp('1.5')},
  centerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('0.5'),
  },
  leftText: {width: wp('30'), fontSize: hp('1.2')},
  calenderIcon: {
    width: wp('3'),
    height: hp('2'),
    marginRight: wp('1'),
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: hp('0.5'),
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('0.4'),
  },
  leftRightView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('1'),
  },
  modalText: {
    backgroundColor: Colors.bgGray,
    paddingHorizontal: wp('3'),
    paddingVertical: hp('1'),
    width: wp('85'),
    borderRadius: 10,
    overflow: 'hidden',
  },
  tagsBtn: {
    width: 'auto',
    paddingHorizontal: wp('2'),
    backgroundColor: 'transparent',
    height: 'auto',
    paddingVertical: hp('0.1'),
    borderWidth: 0.5,
    borderColor: Colors.primaryColor,
    marginBottom: 0,
  },
});
