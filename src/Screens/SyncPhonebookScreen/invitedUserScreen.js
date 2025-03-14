import {View, Text} from 'react-native';
import React from 'react';
import MyFriendComp from '../../Components/MyFriendComp';
import {AniFlatOneByOne} from '../../AnimatedComp/AniFlatOneByOne';
import {DataNotFound} from '../../Components/DataNotFound';
import {wp} from '../../Config/responsive';
import {styles} from './styles';

const InvitedUserScreen = ({invitedContacts}) => {
  const renderData = (item, index) => {
    return (
      <MyFriendComp
        item={{first_name: item?.name, last_name: '', isInvited: true, ...item}}
        isDisable={true}
      />
    );
  };

  return (
    <AniFlatOneByOne
      data={invitedContacts ?? []}
      flatViewStyle={styles.upComingFlatlistView}
      flatListProps={{
        numColumns: 1,
        ListEmptyComponent: <DataNotFound btnStyles={{width: wp('80')}} />,
      }}
      InnerCompnonet={(item, index) => {
        return renderData(item, index);
      }}
    />
  );
};

export default InvitedUserScreen;
