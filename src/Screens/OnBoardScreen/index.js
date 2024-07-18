import React, {memo, useCallback} from 'react';
import {
  View,
  FlatList,
  Dimensions,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native';
import useOnboardScreen from './useOnboardScreen';
import {styles} from './styles';
import {keyExtractor} from '../../Utils';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import ThemeButton from '../../Components/ThemeButton';
import {Touchable} from '../../Components/Touchable';
import {arrow} from '../../Assets';

const OnboardScreen = ({navigation}) => {
  const {onBoardingData, currentIndex, onSnapToItem, goNext, flatListRef} =
    useOnboardScreen(navigation);
  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <ImageBackground style={styles.bannerImg} source={item?.image}>
          <View style={styles.centerMainView}>
            <TextComponent text={item?.heading} styles={styles.hdStyle} />
            <TextComponent text={item?.description} styles={styles.descStyle} />
          </View>
        </ImageBackground>
      );
      // );
    },
    [currentIndex],
  );
  const renderItemDots = useCallback(
    ({item, index}) => {
      return <View style={styles.dot(currentIndex, index)} />;
    },
    [currentIndex],
  );
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flex: 1,
        position: 'relative',
      }}>
      <FlatList
        refreshing={false}
        ref={flatListRef}
        data={onBoardingData}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        horizontal
        scrollEnabled={true}
        onMomentumScrollEnd={onSnapToItem}
        keyExtractor={keyExtractor}
        pagingEnabled={true}
        contentContainerStyle={{
          flexDirection: 'row',
          paddingBottom: 0,
        }}
        style={{paddingBottom: 0}}
      />
      <View style={styles.bottomContainer}>
        <FlatList
          data={onBoardingData} // Use the same data for the dots
          renderItem={renderItemDots}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dotList}
        />

        <Touchable style={styles.btnArrow} onPress={goNext}>
          <TextComponent text={'Next'} styles={styles.arrowText} />
          <Image source={arrow} resizeMode="contain" style={{width: wp('5')}} />
        </Touchable>
      </View>
    </ScrollView>
  );
};

export default memo(OnboardScreen);
