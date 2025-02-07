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
    return <AddFriendComp item={item} sendReq={sendReq} />;
  }, []);

  return (
    <View>
      <HomeHeader
        text={`Hello ${userData?.first_name}`}
        onNotificarioPress={() => dynamicRoute('NotificationScreen')}
        userDataImg={userData?.profile_image}
      />
      <View
        style={{
          top: hp(Platform.OS === 'android' ? '23' : '26'),
        }}>
        <View style={styles.searchComponent}>
          <ThemeButton
            title={'Write something'}
            style={{
              ...styles.upperBtn,
              justifyContent: 'flex-start',
              paddingLeft: wp('5'),
            }}
            imageStyle={{width: wp('7')}}
            image={editYellow}
            onPress={() => dynamicRoute('CreatePostScreen')}
          />
          <ThemeButton
            image={galleryYellow}
            style={{...styles.upperBtn, width: wp('13')}}
            imageStyle={styles.imgStyle}
            textStyle={{marginLeft: wp('0.2')}}
          />
        </View>
        <ScrollView
          onScroll={handleScroll}
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
            data={[
              {
                id: '1',
                userImage: 'https://picsum.photos/200',
                userName: 'Me',
                eventTitle: 'Unity league.',
                eventCategory: 'Bull Riding',
                eventDate: 'Mon. Nov 27 - 2023',
                eventTime: '18:00 - 23:00 P.M.',
                eventLocation: 'Catherine St French Prairie Gardens.',
                likes: '123',
                association: 'Association',
                circuits: 'Circuits',
                lock: true,
              },

              // Add more items here
            ]}
            renderItem={renderItem}
            horizontal // Enable horizontal scrolling
            keyExtractor={item => item.toString()}
            showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
            contentContainerStyle={{paddingHorizontal: 10}} // Padding around the list
          />
          <View style={styles.innerView}>
            <TextComponent
              styles={{
                color: scrollPosition > 220 ? Colors.white : Colors.black,
                ...styles.upcoming,
              }}
              text={'Friend’s Events'}
            />
            <TextComponent
              styles={{
                color: scrollPosition > 220 ? Colors.white : Colors.black,
                ...styles.viewall,
              }}
              text={'View All'}
              onPress={() => dynamicRoute('FriendsEventsScreen')}
            />
          </View>
          <FlatList
            data={[
              {
                id: '1',
                userImage: 'https://picsum.photos/200',
                userName: 'James Dean',
                eventTitle: 'Berbury Hawks',
                eventCategory: 'Team Roping',
                eventDate: 'Mon. Nov 27 - 2023',
                eventTime: '18:00 - 23:00 P.M.',
                eventLocation: 'Catherine St French Prairie Gardens.',
                likes: '123',
                association: 'Association',
                circuits: 'Circuits',
                friendEvent: true,
              },
              {
                id: '2',
                userImage: 'https://picsum.photos/200',
                userName: 'James Dean',
                eventTitle: 'Berbury Hawks',
                eventCategory: 'Team Roping',
                eventDate: 'Mon. Nov 27 - 2023',
                eventTime: '18:00 - 23:00 P.M.',
                eventLocation: 'Catherine St French Prairie Gardens.',
                likes: '123',
                association: 'Association',
                circuits: 'Circuits',
                friendEvent: true,
              },
              // Add more items here
            ]}
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
            data={[
              {
                id: '1',
                userImage: 'https://picsum.photos/200',
                userName: 'System suggested',
                eventTitle: 'Empire Batteries, Incorporation.',
                eventCategory: 'Barrel Racing',
                eventDate: 'Mon. Nov 27 - 2023',
                eventTime: '18:00 - 23:00 P.M.',
                eventLocation: 'Catherine St French Prairie Gardens.',
                likes: '123',
                association: 'Association',
                circuits: 'Circuits',
              },
              {
                id: '2',
                userImage: 'https://picsum.photos/200',
                userName: 'Me',
                eventTitle: 'Unity league',
                eventCategory: 'Bull Riding',
                eventDate: 'Mon. Nov 27 - 2023',
                eventTime: '18:00 - 23:00 P.M.',
                eventLocation: 'Catherine St French Prairie Gardens.',
                likes: '123',
                association: 'Association',
                circuits: 'Circuits',
              },
              // Add more items here
            ]}
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
            contentContainerStyle={{paddingHorizontal: 10}} // Padding around the list
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;
