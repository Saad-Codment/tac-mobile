import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import useHomeScreen from './useHomeScreen';
import HomeHeader from '../../Components/homeHeader';
import {TextComponent} from '../../Components/TextComponent';
import {styles} from './styles';
import {
  calender,
  clock,
  editYellow,
  galleryYellow,
  heart,
  location,
  lock,
  searchIcon,
  searchsetting,
} from '../../Assets';
import {Colors} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import ThemeButton from '../../Components/ThemeButton';
import UpcomingEventsComp from '../../Components/UpCommingEventsComp';
import FriendEventsComp from '../../Components/FriendEventsComp';
import AddFriendComp from '../../Components/AddFriendComp';
import {allSuggestedEventsUrl, allUpComingEventsUrl} from '../../Utils/Urls';

const HomeScreen = ({navigation}) => {
  const {
    search,
    setSearch,
    dynamicRoute,
    onRefresh,
    suggestedFriends,
    sendReq,
    userData,
  } = useHomeScreen(navigation);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = event => {
    const position = event.nativeEvent.contentOffset.y;
    setScrollPosition(position);
  };

  const renderItem = useCallback(({item}) => {
    return <UpcomingEventsComp />;
  }, []);

  const friendEvents = useCallback(({item}) => {
    return <FriendEventsComp />;
  }, []);

  const renderItemAddFriend = useCallback(({item}) => {
    return (
      <AddFriendComp
        item={item}
        sendReq={sendReq}
        mainViewStyle={{marginHorizontal: wp('1')}}
      />
    );
  }, []);

  return (
    <View>
      <HomeHeader
        text={`Howdy, ${userData?.first_name}`}
        onNotificarioPress={() => dynamicRoute('NotificationScreen')}
        userDataImg={userData?.profile_image}
        onProfilePress={() =>
          dynamicRoute('FriendProfileScreen', {id: userData?.id})
        }
      />

      <ScrollView
        // onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces={false}
        // refreshControl={}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerView}>
          <TextComponent
            styles={{color: Colors.white, ...styles.upcoming}}
            text={'Upcoming Events'}
          />
          <TextComponent
            styles={{color: Colors.white, ...styles.viewall}}
            text={'View All'}
            onPress={() =>
              dynamicRoute('AllEventsScreen', {
                url: allUpComingEventsUrl,
                key: 'upcomingEvents',
                title: 'Upcoming Events',
              })
            }
          />
        </View>
        <FlatList
          data={[]}
          renderItem={renderItem}
          horizontal // Enable horizontal scrolling
          keyExtractor={item => item.toString()}
          showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
          contentContainerStyle={{paddingHorizontal: 10}} // Padding around the list
        />
        <View style={styles.innerView}>
          <TextComponent
            styles={{
              ...styles.upcoming,
            }}
            text={'Friend’s Events'}
          />
          <TextComponent
            styles={{
              ...styles.viewall,
            }}
            text={'View All'}
            onPress={() => dynamicRoute('FriendsEventsScreen')}
          />
        </View>
        <FlatList
          data={[]}
          renderItem={friendEvents}
          horizontal // Enable horizontal scrolling
          keyExtractor={item => item.toString()}
          showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
          contentContainerStyle={{paddingHorizontal: 10}} // Padding around the list
        />
        <View style={styles.innerView}>
          <TextComponent
            styles={{
              color: scrollPosition > 550 ? Colors.white : Colors.black,
              ...styles.upcoming,
            }}
            text={'Suggested Events'}
          />
          <TextComponent
            styles={{
              color: scrollPosition > 550 ? Colors.white : Colors.black,
              ...styles.viewall,
            }}
            text={'View All'}
            onPress={() => {
              dynamicRoute('AllEventsScreen', {
                url: allSuggestedEventsUrl,
                key: 'suggestedEvents',
                title: 'Suggested Events',
              });
            }}
          />
        </View>
        <FlatList
          data={[]}
          renderItem={renderItem}
          horizontal // Enable horizontal scrolling
          keyExtractor={item => item.toString()}
          showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
          contentContainerStyle={{paddingHorizontal: 10}} // Padding around the list
        />
        <View style={styles.innerView}>
          <TextComponent
            styles={{color: Colors.black, ...styles.upcoming}}
            text={'Add Friends'}
          />
          <TextComponent
            styles={{color: Colors.black, ...styles.viewall}}
            text={'View All'}
            onPress={() => navigation.navigate('AllSuggestedFriendsScreen')}
          />
        </View>
        <FlatList
          data={suggestedFriends}
          renderItem={renderItemAddFriend}
          horizontal // Enable horizontal scrolling
          keyExtractor={item => item.toString()}
          showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
          contentContainerStyle={{paddingHorizontal: wp('1')}} // Padding around the list
        />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
