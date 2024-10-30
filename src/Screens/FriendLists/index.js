import {View, Text, FlatList, Image} from 'react-native';
import React, {useCallback} from 'react';
import useFriendLists from './useFriendLists';
import {styles} from './styles';
import {TextComponent} from '../../Components/TextComponent';
import {Touchable} from '../../Components/Touchable';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {chat, rightIos} from '../../Assets';
import BlurImage from '../../Components/BlurImage';
import {hp, wp} from '../../Config/responsive';
import MutualFriends from '../../Components/MutualFriendsComponent';

const FriendLists = ({navigation}) => {
  const {} = useFriendLists(navigation);
  const renderItem = useCallback(() => {
    return (
      <View style={styles.view}>
        <BlurImage
          radius={10}
          uri={
            'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          }
          isURI={true}
          blurStyle={styles.blurImage}
          styles={styles.circle}
        />
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'flex-start',
            flex: 1,
            marginLeft: wp('2'),
          }}>
          <TextComponent text={'James Dean'} styles={styles.title} />
          <View style={{flexDirection: 'row'}}>
            {/* <MutualFriends
              text={'32 Mutual Friends'}
              size={20}
              uri={'https://picsum.photos/200'}
            /> */}
          </View>
        </View>
        <Touchable style={styles.r8}>
          <View style={styles.chatView}>
            <Image source={chat} style={styles.chat} />
            <TextComponent text={'Chat'} styles={styles.chatTxt} />
          </View>
        </Touchable>
      </View>
    );
  }, []);
  return (
    <View style={styles.container}>
      <HeaderComponent
        goBack={() => navigation.goBack()}
        isBack
        style={styles.header}
        headerTitle={'Friends List'}
      />
      <FlatList
        data={[1, 2, 3, 4, 5]}
        renderItem={renderItem}
        contentContainerStyle={{marginTop: hp('1')}}
      />
    </View>
  );
};

export default FriendLists;
