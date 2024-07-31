import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';
import React, {useCallback} from 'react';
import useHomeScreen from './useHomeScreen';
import HomeHeader from '../../Components/homeHeader';
import {TextComponent} from '../../Components/TextComponent';
import {styles} from './styles';
import {
  calender,
  clock,
  heart,
  location,
  lock,
  searchIcon,
  searchsetting,
} from '../../Assets';
import {Colors} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import ThemeButton from '../../Components/ThemeButton';
import MutualFriends from '../../Components/MutualFriendsComponent';

const HomeScreen = ({navigation}) => {
  const {search, setSearch} = useHomeScreen(navigation);

  const renderItem = useCallback(({item}) => {
    return (
      <>
        <View
          style={{
            backgroundColor: item?.friendEvent
              ? 'rgba(255, 238, 207, 1)'
              : 'white',
            ...styles.card,
          }}>
          <View style={styles.cardHeader}>
            <Image source={{uri: item.userImage}} style={styles.userImage} />
            <View>
              <Text numberOfLines={2} style={styles.userName}>
                {item.userName}
              </Text>
              <Text style={styles.eventTitle}>
                {item.eventTitle + ' '}
                <Text style={styles.eventCategory}>{item.eventCategory}</Text>
              </Text>
            </View>
          </View>
          <View style={styles.eventDetails}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <Image source={calender} style={styles.icon} />
              <Text style={styles.eventDate}>{item.eventDate}</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <Image source={clock} style={styles.icon} />

              <Text style={styles.eventTime}>{item.eventTime}</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <Image source={location} style={styles.icon} />

              <Text style={styles.eventLocation}>{item.eventLocation}</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <View
              style={{
                flexDirection: 'row',
                width: wp('25'),
                alignItems: 'center',
              }}>
              <Image
                tintColor={Colors.primaryColor}
                source={heart}
                style={styles.icon}
              />
              <Text style={styles.association}>123 likes</Text>
            </View>

            <Text style={styles.association}>{item.association}</Text>
            <View style={styles.dot} />
            <Text style={styles.circuits}>{item.circuits}</Text>
          </View>
          {item?.lock && (
            <Image
              tintColor={Colors.textGray}
              source={lock}
              style={styles.lock}
            />
          )}
        </View>
      </>
    );
  }, []);
  const renderItemAddFriend = useCallback(({item}) => {
    return (
      <>
        <View style={styles.friendCard}>
          <Image
            source={{uri: item.userImage}}
            style={styles.friendUserImage}
          />
          <Text style={styles.friendUserName}>{item.userName}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MutualFriends />
            {/* <TextComponent styles={styles.mutual} text={'32 Mutual friends'} /> */}
          </View>
          <View style={styles.friendCardFooter}>
            <ThemeButton
              style={{
                borderRadius: 15,
                height: hp('5'),
                backgroundColor: Colors.backgroundTheme,
              }}
              title={'Add Friend'}
            />
            <ThemeButton
              style={{
                borderRadius: 10,
                height: hp('5'),
                backgroundColor: 'transparent',
              }}
              textStyle={{color: Colors.textGray}}
              title={'Remove'}
            />
          </View>
        </View>
      </>
    );
  }, []);
  return (
    <View>
      <HomeHeader text={'Hello Sheila'} />
      <View
        style={{
          top: hp(Platform.OS === 'android' ? '23' : '26'),
        }}>
        <View style={styles.searchComponent}>
          <Image
            tintColor={Colors.textGray}
            resizeMode="contain"
            source={searchIcon}
            style={styles.searchStyle}
          />
          <View style={styles.textInputContainer}>
            <TextInput
              onSubmitEditing={() => searchPropertyFunction(search)}
              // onSubmitEditing={() => mutateAsync({keyword: text})}
              selectionColor={Colors.textGray}
              style={styles.searchTextStyle}
              onChangeText={setSearch}
              value={search}
              placeholderTextColor={Colors.textGray}
              placeholder={'Search available jobs here...'}
            />
          </View>

          <Image
            tintColor={Colors.primaryColor}
            resizeMode="contain"
            source={searchsetting}
            style={styles.searchsetting}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            marginTop: hp('2'),
            paddingBottom: hp('30'),
          }}>
          {/* The paddingTop ensures content is visible below the fixed search bar */}
          {/* {Array(50)
            .fill(null)
            .map((_, index) => (
              <Image
                key={index}
                tintColor={Colors.primaryColor}
                resizeMode="contain"
                source={searchsetting}
                style={styles.searchsetting}
              />
            ))} */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 15,
              alignItems: 'center',
            }}>
            <TextComponent
              styles={{color: Colors.white, ...styles.upcoming}}
              text={'Upcoming Events'}
            />
            <TextComponent
              styles={{color: Colors.white, ...styles.viewall}}
              text={'View All'}
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 15,
              alignItems: 'center',
            }}>
            <TextComponent
              styles={{color: Colors.black, ...styles.upcoming}}
              text={'Friend’s Events'}
            />
            <TextComponent
              styles={{color: Colors.black, ...styles.viewall}}
              text={'View All'}
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
            renderItem={renderItem}
            horizontal // Enable horizontal scrolling
            keyExtractor={item => item.toString()}
            showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
            contentContainerStyle={{paddingHorizontal: 10}} // Padding around the list
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 15,
              alignItems: 'center',
            }}>
            <TextComponent
              styles={{color: Colors.black, ...styles.upcoming}}
              text={'Suggested Events'}
            />
            <TextComponent
              styles={{color: Colors.black, ...styles.viewall}}
              text={'View All'}
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 15,
              alignItems: 'center',
            }}>
            <TextComponent
              styles={{color: Colors.black, ...styles.upcoming}}
              text={'Add Friends'}
            />
            <TextComponent
              styles={{color: Colors.black, ...styles.viewall}}
              text={'View All'}
            />
          </View>
          <FlatList
            data={[
              {
                id: '1',
                userImage: 'https://picsum.photos/200',
                userName: 'Ricky Jonathan',
                eventTitle: 'Unity league.',
                eventCategory: 'Bull Riding',
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
                userName: 'Ricky Jonathan',
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
