import {View, Text} from 'react-native';
import React from 'react';
import {AniFlatOneByOne} from '../../AnimatedComp/AniFlatOneByOne';
import {DataNotFound} from '../../Components/DataNotFound';
import {wp} from '../../Config/responsive';
import {styles} from './styles';
import {CircleImage} from '../../Components/CircleImage';
import {TextComponent} from '../../Components/TextComponent';
import ThemeButton from '../../Components/ThemeButton';
import MyFriendComp from '../../Components/MyFriendComp';

export default function TacUserScreen({tacContacts}) {
  const renderData = (item, index) => {
    return <MyFriendComp item={item} />;
  };

  return (
    <AniFlatOneByOne
      data={tacContacts ?? []}
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
}
