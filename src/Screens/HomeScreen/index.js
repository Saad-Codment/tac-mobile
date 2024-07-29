import {View, Text, ScrollView, Image, TextInput} from 'react-native';
import React from 'react';
import useHomeScreen from './useHomeScreen';
import HomeHeader from '../../Components/homeHeader';
import {TextComponent} from '../../Components/TextComponent';
import {styles} from './styles';
import {searchIcon} from '../../Assets';
import {Colors} from '../../Theme/Variables';

const HomeScreen = ({navigation}) => {
  const {} = useHomeScreen(navigation);
  return (
    <View>
      <HomeHeader style={{flex: 1, zIndex: 0}} text={'Hello Sheila'} />
      <View
        style={{
          // flex: 1,
          position: 'absolute',
          zIndex: 99999,
          top: 170,
          left: 50,
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
              onSubmitEditing={() => searchPropertyFunction(text)}
              // onSubmitEditing={() => mutateAsync({keyword: text})}
              selectionColor={Colors.textGray}
              style={styles.searchTextStyle}
              // onChangeText={onChangeText}
              // value={text}
              placeholderTextColor={Colors.textGray}
              placeholder={'Search available jobs here...'}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
