import React, {memo, useCallback} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {FlatList, View} from 'react-native';
import UseCalendar from '../../Components/Calendar';
import {hp, wp} from '../../Config/responsive';
import useMyEventScreen from './useMyEventScreen';
import {TextComponent} from '../../Components/TextComponent';
import {keyExtractor} from '../../Utils';
import SmallEventCardsComp from '../../Components/SmallEventCardsComp';
import {styles} from './styles';
import {DataNotFound} from '../../Components/DataNotFound';
import {CircleImage} from '../../Components/CircleImage';
import {addcircle} from '../../Assets';

function MyEventScreen({navigation}) {
  const {eventDate, eventsByDate, activeButton, onSelectVal} =
    useMyEventScreen(navigation);

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

  console.log(
    'datadatadatadatadatadsdvdsdvsvsvsdsdvsatadatadata',
    eventsByDate,
  );

  return (
    <View style={{flex: 1}}>
      <HeaderComponent
        headerTitle={'Events'}
        rightIconImg={addcircle}
        onRightPress={() => navigation.navigate('CreateEventsScreen')}
        isBack
      />
      <View style={styles.innerView}>
        <UseCalendar
          markedDates={eventDate ?? []}
          onSelectVal={e => onSelectVal(e)}
          dotCount={eventsByDate}
          // selectedVal={activeButton}
        />
      </View>
      <TextComponent text={'Events'} styles={styles.heading} />
      {eventDate && (
        <FlatList
          data={eventsByDate}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={{
            alignItems: 'center',
            paddingBottom: hp('10'),
          }}
          onRefresh={() => onSelectVal(eventDate[0])}
          refreshing={false}
          ListEmptyComponent={
            eventsByDate != null && (
              <DataNotFound
                onpress={() => onSelectVal(eventDate[0])}
                btnStyles={{marginTop: hp('-2'), width: wp('50')}}
                noImg={true}
                mainViewStyles={{marginTop: hp('10')}}
                title={'Events not found'}
                subTitle={'No events for the selected date!'}
              />
            )
          }
        />
      )}
    </View>
  );
}

export default memo(MyEventScreen);
