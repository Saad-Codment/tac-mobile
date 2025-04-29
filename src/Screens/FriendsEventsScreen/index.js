import {View, Text, ActivityIndicator} from 'react-native';
import React, {memo} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {AniFlatOneByOne} from '../../AnimatedComp/AniFlatOneByOne';
import {DataNotFound} from '../../Components/DataNotFound';
import {hp, wp} from '../../Config/responsive';
import useFriendsEventsScreen from './useFriendsEventsScreen';
import {styles} from './styles';
import FriendEventsComp from '../../Components/FriendEventsComp';
import ThemeButton from '../../Components/ThemeButton';
import BottomModalComponent from '../../Components/BottomModalComponent';

const FriendsEventsScreen = ({navigation, route}) => {
  const {
    eventsList,
    loadMoreData,
    onRefresh,
    isFetching,
    likePost,
    refetechKeys,
    modal,
    setModal,
  } = useFriendsEventsScreen(navigation, route);
  console.log('isbdvlbsdbsdlkklsdksdv', eventsList);
  return (
    <>
      <HeaderComponent
        headerTitle={'Friend Events'}
        goBack={() => navigation.goBack()}
        isBack
      />
      <AniFlatOneByOne
        data={eventsList}
        flatViewStyle={styles.upComingFlatlistView}
        onRefresh={onRefresh}
        flatListProps={{
          ListEmptyComponent: (
            <DataNotFound onpress={onRefresh} btnStyles={{width: wp('80')}} />
          ),
          ListFooterComponent:
            eventsList.length == 9 &&
            (isFetching ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <ThemeButton
                title={'Load More'}
                style={{marginTop: hp('2'), width: wp('40')}}
                onPress={() => loadMoreData()}
              />
            )), // Show loading spinner at the bottom
        }}
        InnerCompnonet={(item, index) => (
          <View style={{marginTop: hp('2')}}>
            <FriendEventsComp
              item={item}
              index={index}
              mainViewStyles={{width: wp('95')}}
              refetechKeys={['allFriendsEvents']}
              openBottomSheet={id => setModal(id)}
            />
          </View>
        )}
      />
      {Boolean(modal != null) && (
        <BottomModalComponent
          isVisible={Boolean(modal != null)}
          isReport
          event_id={modal}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
};

export default memo(FriendsEventsScreen);
