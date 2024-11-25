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

function MyEventScreen({navigation}) {
  const {eventDate, eventsByDate, activeButton, onSelectVal} =
    useMyEventScreen(navigation);

  const renderItem = useCallback(({item, index}) => {
    return (
      <SmallEventCardsComp
        item={item}
        onPress={() =>
          navigation.navigate('EventsDetailScreen', {id: item?.id})
        }
      />
    );
  }, []);

  return (
    <View style={{flex: 1}}>
      <HeaderComponent
        headerTitle={'Events'}
        goBack={() => navigation.goBack()}
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
      <FlatList
        keyExtractor={keyExtractor}
        data={eventsByDate}
        renderItem={renderItem}
        contentContainerStyle={{alignItems: 'center'}}
        onRefresh={() => onSelectVal(eventDate[0])}
        refreshing={false}
        ListEmptyComponent={
          <DataNotFound
            onpress={() => onSelectVal(eventDate[0])}
            btnStyles={{marginTop: hp('-2'), width: wp('50')}}
            noImg={true}
            mainViewStyles={{marginTop: hp('10')}}
            title={'Events not found'}
            subTitle={'No events for the selected date!'}
          />
        }
      />
    </View>
  );
}

export default memo(MyEventScreen);
