import {View, Text, FlatList, Image} from 'react-native';
import React, {useCallback} from 'react';
import useHistoryScreen from './useHistoryScreen';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {styles} from './styles';
import {TextComponent} from '../../Components/TextComponent';
import {Touchable} from '../../Components/Touchable';
import {rightIos} from '../../Assets';
import {hp} from '../../Config/responsive';

const HistoryScreen = ({navigation}) => {
  const {} = useHistoryScreen(navigation);
  const renderItem = useCallback(() => {
    return (
      <View style={styles.view}>
        <View style={styles.dateView}>
          <TextComponent text={'Jul'} styles={styles.month} />
          <TextComponent text={'15'} styles={styles.day} />
        </View>
        <View
          style={{alignSelf: 'center', justifyContent: 'flex-start', flex: 1}}>
          <TextComponent text={'Barrel Racing'} styles={styles.title} />
          <TextComponent text={'18:00 - 23:00 P.M.'} styles={styles.des} />
        </View>
        <Touchable style={styles.r8}>
          <TextComponent text={'Details'} styles={styles.detbtn} />
          <Image
            source={rightIos}
            style={styles.introImage}
            resizeMode="contain"
          />
        </Touchable>
      </View>
    );
  }, []);
  return (
    <View>
      <HeaderComponent
        goBack={() => navigation.goBack()}
        isBack
        style={styles.header}
        headerTitle={'History'}
      />
      <FlatList
        data={[1, 2, 3, 4, 5]}
        renderItem={renderItem}
        contentContainerStyle={{marginTop: hp('1')}}
      />
    </View>
  );
};

export default HistoryScreen;
