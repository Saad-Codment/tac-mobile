import {
  Button,
  Image,
  Pressable,
  StyleSheet,
  View,
  Animated,
  Dimensions,
  ScrollView,
  Text,
  FlatList,
} from 'react-native';
import {hp, wp} from '../Config/responsive';
import {Colors} from '../Theme/Variables';
import React, {useEffect, useRef, useState} from 'react';
import * as Animatable from 'react-native-animatable';
import {keyExtractor} from '../Utils';

const url =
  'https://images.pexels.com/photos/19321447/pexels-photo-19321447/free-photo-of-needle-branch-with-christmas-ornament.jpeg';

export const AniFlatOneByOne = ({
  data,
  InnerCompnonet,
  flatViewStyle,
  flatListProps,
  onRefresh,
}) => {
  const {width, height} = Dimensions.get('screen');

  const handlePress = () => {
    height.value = withSpring(Number(height.value) + 50);
  };

  const renderItem = ({item, index}) => {
    return (
      <Animatable.View
        animation={'fadeIn'}
        delay={Number(index.toString() + '0')}>
        {InnerCompnonet(item, index)}
      </Animatable.View>
    );
  };

  return (
    <FlatList
      {...{
        data: data ?? [],
        renderItem: renderItem,
        contentContainerStyle: {...flatViewStyle},
        scrollEnabled: true,
        showsVerticalScrollIndicator: false,
        showsHorizontalScrollIndicator: false,
        onRefresh,
        refreshing: false,
        keyExtractor,
        ...flatListProps,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222',
    flex: 1,
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewbtn: {
    height: 40,
    width: 150,
    backgroundColor: '#e3224f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingView: {
    width: wp('90'),
    borderRadius: 6,
    borderWidth: 0.2,
    borderColor: Colors.grayFaded,
    // marginLeft: hp('1.5'),
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 5,
    backgroundColor: Colors.themeBlack,
    elevation: 50,
    height: hp('22'),
    marginBottom: hp('2'),
    paddingBottom: hp('2'),
    // backgroundColor: 'white',
  },
  upperView: {flexDirection: 'row', alignItems: 'center'},
  locationView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1.5'),
    marginLeft: wp('1.5'),
  },
  locationIcon: {width: wp('75'), fontSize: hp('1.7'), marginLeft: wp('1')},
  divider: {width: wp('70'), marginTop: hp('1'), marginLeft: wp('1')},
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: wp('2'),
    // marginTop: hp('1'),
    width: wp('90'),
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: hp('5'),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: wp('0'),
    // borderRadius: 10,
  },
  dateText: {
    fontSize: hp('1.8'),
    marginLeft: wp('2'),
    marginRight: wp('5'),
    color: 'white',
  },
  timeText: {
    fontSize: hp('1.8'),
    marginLeft: wp('2'),
    color: 'white',
  },
  userView: {
    flexDirection: 'row',
    width: wp('90'),
    paddingHorizontal: wp('2'),
    marginTop: hp('1'),
  },
  infIcon: {
    width: wp('6'),
    height: hp('5'),
    marginLeft: wp('1'),
  },
  viewBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('4'),
    alignItems: 'center',
    width: wp('85'),
    // backgroundColor: 'yellow',
    alignSelf: 'center',
  },
  viewAppBtn: {
    backgroundColor: Colors.lightBlack,
    width: wp('40'),
    height: hp('5'),
  },
  chatAppBtn: {
    width: wp('40'),
    height: hp('5'),
  },
  nameView: {marginLeft: wp('2'), justifyContent: 'space-between'},
  iconStyle: {
    width: wp('3'),
    height: hp('3'),
    marginLeft: hp('1'),
  },
});
