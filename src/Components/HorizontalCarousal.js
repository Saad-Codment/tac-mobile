import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {hp, wp} from '../Config/responsive';
import {Colors} from '../Theme/Variables';
import {imageUrl} from '../Utils/Urls';

const SCREEN_WIDTH = Dimensions.get('window').width;

const HorizontalCarousal = ({data, isUri}) => {
  const flatListRef = React.useRef(null);
  const [prevDisabled, setPrevDisabled] = React.useState(false);
  const [nextDisabled, setNextDisabled] = React.useState(false);

  const [activeIndex, setActiveIndex] = React.useState(0);

  const onPrevious = () => {
    if (activeIndex === 0) return;
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: activeIndex - 1,
      });
    }
  };
  const onNext = () => {
    if (activeIndex === data.length - 1) return;
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: activeIndex + 1,
      });
    }
  };
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <FlatList
        ref={flatListRef}
        // snapToInterval={SCREEN_WIDTH}
        // snapToAlignment="center"
        // decelerationRate={"fast"}
        pagingEnabled={true}
        horizontal
        onScroll={event => {
          const pageIndex = Math.round(
            event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
          );
          console.log({pageIndex});
          setActiveIndex(pageIndex);
        }}
        //can i set 0 -16 scrollEventThrottle={0}
        scrollEventThrottle={0}
        showsHorizontalScrollIndicator={false}
        data={data}
        // keyExtractor={item => item.id.toString()}
        renderItem={({item}) => {
          if (!item) return <View style={{width: 0}} />;
          return (
            <View
              style={{
                // width: wp('100'),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {/* {/ <Image source={{ uri: item.image }} style={styles.image} /> /} */}
              <Image
                source={isUri ? {uri: imageUrl(item)} : item}
                style={styles.image}
              />
              <Text style={styles.imageText}>{item.title}</Text>
            </View>
          );
        }}
      />
      <View style={styles.footer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={{
              padding: 2,
              paddingHorizontal: 5,
              width: index === activeIndex ? wp('6') : wp('0.5'),
              borderRadius: 5,
              height: hp('0.2'),
              backgroundColor:
                index === activeIndex ? Colors.primaryColor : 'transparent',
              borderWidth: 0.5,
              borderColor:
                index === activeIndex ? Colors.primaryColor : 'black',
              marginHorizontal: wp('.5'),
              marginVertical: hp('.6'),
            }}
            onPress={() => handlePageChange(index)}
          />
        ))}
      </View>
    </View>
  );
};

export default HorizontalCarousal;

const styles = StyleSheet.create({
  image: {
    width: wp('94'),
    height: hp('19'),
    resizeMode: 'contain',
    borderRadius: 10,
    alignSelf: 'center',
  },
  imageText: {
    position: 'absolute',
    top: 15,
    right: 15,
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: '90%',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 30,
  },
  paginationStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '-8%',
    backgroundColor: 'rgba(255,255,255,0.35)',
    height: '8%',
    borderRadius: 10,
    paddingHorizontal: '9%',
  },
});
