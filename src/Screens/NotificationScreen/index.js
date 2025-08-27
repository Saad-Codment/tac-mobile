import {View, Text, Image, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import useNotificationScreen from './useNotificationScreen';
import {AniFlatOneByOne} from '../../AnimatedComp/AniFlatOneByOne';
import {DataNotFound} from '../../Components/DataNotFound';
import NotificationComp from '../../Components/NotificationComp';
import {hp, wp} from '../../Config/responsive';
import {styles} from './styles';
import {boldDivider, divider} from '../../Assets';
import {Colors} from '../../Theme/Variables';

const NotificationScreen = ({navigation}) => {
  const {notificationsList, onRefresh, acceptReq, declineReq} =
    useNotificationScreen(navigation);
  console.log('notificationsListnotificationsList', notificationsList[0]);
  return (
    <>
      <HeaderComponent
        headerTitle={'Notifications'}
        goBack={() => navigation.goBack()}
        isBack
      />
      {notificationsList != null && (
        <AniFlatOneByOne
          data={notificationsList}
          flatViewStyle={styles.upComingFlatlistView}
          onRefresh={onRefresh}
          flatListProps={{
            ListEmptyComponent: (
              <DataNotFound onpress={onRefresh} btnStyles={{width: wp('80')}} />
            ),
            ItemSeparatorComponent: (
              <View
                style={{
                  borderBottomColor: Colors.textGray,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  marginVertical: hp('1'),
                }}
              />
            ),
          }}
          InnerCompnonet={(item, index) => (
            <NotificationComp
              item={item}
              index={index}
              acceptReq={() => acceptReq(item?.data)}
              declineReq={() => declineReq(item?.data)}
            />
          )}
        />
      )}
    </>
  );
};

export default memo(NotificationScreen);
