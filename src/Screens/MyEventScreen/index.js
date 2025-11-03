import React, {memo, useCallback} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {FlatList, Image, Pressable, TextInput, View} from 'react-native';
import UseCalendar from '../../Components/Calendar';
import {hp, wp} from '../../Config/responsive';
import useMyEventScreen from './useMyEventScreen';
import {TextComponent} from '../../Components/TextComponent';
import {keyExtractor} from '../../Utils';
import SmallEventCardsComp from '../../Components/SmallEventCardsComp';
import {styles} from './styles';
import {DataNotFound} from '../../Components/DataNotFound';
import {CircleImage} from '../../Components/CircleImage';
import {addcircle, searchIcon} from '../../Assets';
import {Colors} from '../../Theme/Variables';

function MyEventScreen({navigation, route}) {
  const {
    eventDate,
    eventsByDate,
    activeButton,
    onSelectVal,
    onMonthChange,
    refetch,
  } = useMyEventScreen(navigation, route);

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <SmallEventCardsComp
          item={item}
          onPress={() =>
            navigation.navigate('EventsDetailScreen', {id: item?.id})
          }
        />
      );
    },
    [eventDate, eventsByDate],
  );

  return (
    <View style={{flex: 1}}>
      <HeaderComponent
        headerTitle={'Events'}
        rightIconImg={route?.params ? null : addcircle}
        onRightPress={() => navigation.navigate('CreateEventsScreen')}
        isBack
      />

      <Pressable
        style={styles.searchContainer}
        onPress={() =>
          navigation.navigate('GlobalEventsScreen', {isParams: false})
        }>
        <View style={styles.searchInputWrapper}>
          <Image
            source={searchIcon}
            resizeMode="contain"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={Colors.textGray}
            editable={false}
          />
        </View>
      </Pressable>

      <View style={styles.innerView}>
        <UseCalendar
          customMarkedDates={eventDate ?? []}
          onSelectVal={e => onSelectVal(e)}
          dotCount={eventsByDate?.length == 0 ? 1 : eventsByDate?.length}
          onMonthChange={e => onMonthChange(e)}
          // selectedVal={activeButton}
        />
      </View>
      <TextComponent text={'Events'} styles={styles.heading} />
      {eventDate != null && eventDate.length > 0 ? (
        <FlatList
          data={eventsByDate}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={{
            alignItems: 'center',
            paddingBottom: hp('10'),
          }}
          onRefresh={refetch}
          refreshing={false}
          ListEmptyComponent={
            eventsByDate != null && (
              <DataNotFound
                onpress={() => refetch()}
                btnStyles={{marginTop: hp('-2'), width: wp('50')}}
                noImg={true}
                mainViewStyles={{marginTop: hp('10')}}
                title={'Events not found'}
                subTitle={'No events for the selected date!'}
              />
            )
          }
        />
      ) : (
        eventsByDate != null && (
          <DataNotFound
            onpress={() => refetch()}
            btnStyles={{marginTop: hp('-2'), width: wp('50')}}
            noImg={true}
            mainViewStyles={{marginTop: hp('-5')}}
            title={'Events not found'}
            subTitle={'No events for the selected date!'}
          />
        )
      )}
    </View>
  );
}

export default memo(MyEventScreen);
